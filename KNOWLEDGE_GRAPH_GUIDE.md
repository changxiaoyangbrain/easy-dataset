# 知识图谱 (Knowledge Graph) 构建功能支持说明

## 1. 现状评估 (Current Status)

经过对项目的代码审查，当前项目 **`easy-dataset`** 默认架构基于关系型数据库 (SQLite/Prisma)，主要侧重于：
- 文档解析 (PDF/Markdown)
- 文本切片 (Chunking)
- 问答对生成 (QA Generation)

目前**不包含**原生的 Neo4j 知识图谱自动构建功能。

## 2. 可行性验证 (Feasibility)

**结论：完全可行。**

虽然原生不支持，但在核应急数据领域，构建知识图谱对于处理复杂的设备关系、法规引用和事故演变非常重要。
我们已经为你生成了必要的扩展代码模块，你只需要进行简单的配置即可启用。

## 3. 实现方案 (Implementation Plan)

我已在代码库中添加了以下核心模块作为功能验证 (PoC)：

### 3.1 新增模块

1.  **提示词模版**: `lib/llm/prompts/graph.js`
    - 包含专门用于提取“实体-关系-实体”三元组的 Prompt，针对核应急领域进行了优化（识别法规、设备、操作等）。

2.  **图数据库客户端**: `lib/graph/neo4j.js`
    - 封装了 Neo4j Driver，负责连接数据库并执行 Cypher 查询。
    - 包含 `ingestTriplesDynamic` 方法，可自动合并实体并创建动态关系。

3.  **图构建服务**: `lib/services/graphService.js`
    - 负责串联流程：`输入文本 -> LLM 提取 -> 解析 JSON -> 写入 Neo4j`。

### 3.2 启用步骤

若要正式运行此功能，请执行以下步骤：

1.  **安装依赖**
    ```bash
    npm install neo4j-driver
    ```

2.  **准备环境**
    需要一个运行中的 Neo4j 实例。如果没有，可以使用 Docker 快速启动：
    ```bash
    docker run --name neo4j -p 7474:7474 -p 7687:7687 -e NEO4J_AUTH=neo4j/password neo4j:latest
    ```

3.  **配置环境变量 (.env)**
    ```env
    NEO4J_URI=bolt://localhost:7687
    NEO4J_USER=neo4j
    NEO4J_PASSWORD=password
    ```

4.  **调用服务**
    虽然我已创建了底层服务，你还需要在业务流程中调用它。
    例如，在 `lib/services/dataset.js` 或类似处理文档上传/切片的地方，添加以下逻辑：
    
    ```javascript
    import { GraphService } from '@/lib/services/graphService';
    
    // 在切片处理完成后
    const graphService = new GraphService();
    await graphService.processChunk(chunkContent, chunkId);
    ```

## 4. 预期效果

配置完成后，系统自动扫描核应急文档，并在 Neo4j 中生成如下结构：

- **(HAF001)-[包含]->(核电厂安全准则)**
- **(稳压器水位)-[过低 triggers]->(安全注入系统)**
- **(严重事故)-[导致]->(堆芯熔化)**

这将极大地增强 RAG (检索增强生成) 的能力，允许进行多跳推理和关系检索。
