import LLMClient from '@/lib/llm/core';
import { GRAPH_EXTRACTION_PROMPT } from '@/lib/llm/prompts/graph';
import { ingestTriplesDynamic } from '@/lib/graph/neo4j';
import { extractJsonFromLLMOutput } from '@/lib/llm/common/util';

/**
 * Service to extract Knowledge Graph from text and sync to Neo4j
 */
export class GraphService {
  constructor(projectId) {
      this.llmClient = new LLMClient({
          // You might need to fetch project config here if not passed context
          // For now, we assume default or passed config
      });
  }

  /**
   * Process a text chunk and ingest into Neo4j
   * @param {string} text The content to process
   * @param {string} sourceId ID of the source chunk/file
   * @returns {Promise<Array>} The extracted triples
   */
  async processChunk(text, sourceId) {
    if (!text) return [];

    // 1. Prepare Prompt
    const prompt = GRAPH_EXTRACTION_PROMPT.replace('{{context}}', text);

    // 2. Call LLM
    try {
        const responseText = await this.llmClient.getResponse(prompt);
        
        // 3. Parse JSON
        const triples = extractJsonFromLLMOutput(responseText) || [];

        if (triples.length === 0) {
            console.warn("No triples extracted or failed to parse JSON", responseText);
            return [];
        }

        // 4. Ingest to Neo4j
        await ingestTriplesDynamic(triples, sourceId);

        return triples;

    } catch (error) {
        console.error("Error in Graph Processing:", error);
        throw error;
    }
  }
}
