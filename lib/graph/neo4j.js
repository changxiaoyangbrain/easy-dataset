/**
 * Neo4j Graph Database Client Wrapper
 * 
 * Pre-requisites:
 * 1. npm install neo4j-driver
 * 2. Set NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD in .env
 */

let driver;

try {
  const neo4j = require('neo4j-driver');
  
  const URI = process.env.NEO4J_URI || 'bolt://localhost:7687';
  const USER = process.env.NEO4J_USER || 'neo4j';
  const PASSWORD = process.env.NEO4J_PASSWORD || 'password';

  if (process.env.NEO4J_URI) {
      driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
  }
} catch (e) {
  console.warn('Neo4j driver not found or failed to initialize. Knowledge Graph features will be disabled.');
  console.warn('Install with: npm install neo4j-driver');
}

/**
 * Close the driver connection
 */
export const closeDriver = async () => {
  if (driver) {
    await driver.close();
  }
};

/**
 * Execute a write query (creation/update)
 * @param {string} cypher The Cypher query
 * @param {Object} params Parameters for the query
 */
export const writeQuery = async (cypher, params = {}) => {
  if (!driver) throw new Error("Neo4j driver not initialized.");
  
  const session = driver.session();
  try {
    const result = await session.writeTransaction(tx => tx.run(cypher, params));
    return result;
  } finally {
    await session.close();
  }
};

/**
 * Batch insert triples into Neo4j
 * @param {Array} triples Array of {head, relation, tail, type}
 * @param {string} sourceId Optional ID of the source document
 */
export const ingestTriples = async (triples, sourceId = null) => {
  if (!triples || triples.length === 0) return;

  const cypher = `
    UNWIND $triples AS triple
    MERGE (h:Entity {name: triple.head})
    ON CREATE SET h.type = triple.type
    MERGE (t:Entity {name: triple.tail})
    // Dynamic relationship creation requires APOC or string interpolation (less safe)
    // Here we use a generic RELATIONSHIP type with a property, or specific if sanitized
    // For simplicity/safety in this demo, we use a generic 'RELATED_TO' with a type property
    // Or we can try to sanitize the relationship name.
    
    WITH h, t, triple
    // Sanitize relationship type (basic alphanumeric only)
    // Note: Cypher doesn't allow dynamic relationship types in pure Cypher easily without APOC
    // We will use APOC if available, or fallback to a hardcoded logic if complex.
    // For this POC, we will assume standard relationships or map them.
    
    // Simpler approach: Create a relationship with the 'type' property being the relation name
    MERGE (h)-[r:RELATED_TO {type: triple.relation}]->(t)
    SET r.sourceId = $sourceId
  `;

  // Note: Optimizing relationship types (e.g. [:FOLLOWS]) instead of properties is better for performance
  // but requires dynamic Cypher execution. 
  
  await writeQuery(cypher, { triples, sourceId });
};

/**
 * Advanced Ingest: Uses dynamic relationship types (Warning: Ensure relation names are safe/sanitized)
 * This version constructs the query string dynamically.
 */
export const ingestTriplesDynamic = async (triples, sourceId = null) => {
    if (!driver) return;
    const session = driver.session();
    
    try {
        for (const triple of triples) {
            const relType = triple.relation.replace(/[^A-Za-z0-9_]/g, '_').toUpperCase();
            if (!relType) continue;

            const query = `
                MERGE (h:Entity {name: $head})
                ON CREATE SET h.type = $type
                MERGE (t:Entity {name: $tail})
                MERGE (h)-[r:${relType}]->(t)
                SET r.source = $sourceId
            `;
            
            await session.run(query, {
                head: triple.head,
                tail: triple.tail,
                type: triple.type || 'Thing',
                sourceId: sourceId
            });
        }
    } finally {
        await session.close();
    }
}
