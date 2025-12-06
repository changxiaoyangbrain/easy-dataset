# Easy-Dataset 集成 Neo4j 知识图谱功能分析与实施方案

## 1. 背景与目标

当前 `easy-dataset` 项目主要定位为核应急领域的大模型数据集构建工具，核心功能围绕文档解析、智能切片和问答对（QA）生成。
为了进一步提升数据利用率，支持更复杂的推理和关系检索（RAG），计划引入图形数据库 Neo4j，实现从非结构化文档到知识图谱（Knowledge Graph）的自动化构建。

## 2. 可行性分析

经过对项目架构的深度分析，集成 Neo4j 具备高度可行性：

*   **技术栈兼容**：项目基于 Node.js/Next.js，Neo4j 官方提供了成熟的 JavaScript Driver (`neo4j-driver`)，可无缝集成。
*   **流程契合**：现有的 LLM 处理流程（Chunking -> Prompting -> Completion）完全可以直接复用于知识抽取。只需将“生成问答”的 Prompt 替换为“提取实体关系”的 Prompt 即可。
*   **领域适配**：核应急领域存在大量固定的层级结构（法规体系）、设备连接关系（系统流程图）和因果逻辑（事故演变），非常适合用图谱表达。

## 3. 已完成的核心扩展 (PoC)

为了验证这一方案，已在代码库中新增了以下核心模块，实现了从文本到图谱的完整链路：

### 3.1 提示词工程 (Prompt Engineering)
*   **文件**: `lib/llm/prompts/graph.js`
*   **功能**: 定义了 `GRAPH_EXTRACTION_PROMPT`。
*   **描述**: 这是一个专门针对核应急领域的 Prompt，指导 LLM 从文本中识别：
    *   **实体 (Entities)**: 设备、法规、数值、概念。
    *   **关系 (Relations)**: 属于、包含、触发、导致、执行。
    *   **输出格式**: 强制模型输出严格的 JSON 格式 `[{ "head": "", "relation": "", "tail": "", "type": "" }]`。

### 3.2 数据库连接层
*   **文件**: `lib/graph/neo4j.js`
*   **功能**: 封装 Neo4j Driver。
*   **特点**:
    *   实现了单例模式的数据库连接池。
    *   提供 `ingestTriplesDynamic` 方法，自动处理节点的 `MERGE` 操作，防止重复创建，并支持动态创建关系类型。

### 3.3 业务服务层
*   **文件**: `lib/services/graphService.js`
*   **功能**: 图谱构建服务类。
*   **流程**:
    1.  接收文本切片 (Chunk)。
    2.  调用 LLM (通过 `LLMClient`) 执行图谱提取 Prompt。
    3.  利用 `extractJsonFromLLMOutput` 工具清洗并解析模型返回的 JSON。
    4.  调用底层 Driver 将三元组批量写入 Neo4j。

## 4. 实施指南

### 4.1 环境准备
在本地或服务器上启动 Neo4j 实例（推荐 Docker）：

```bash
docker run -d --name neo4j \
    -p 7474:7474 -p 7687:7687 \
    -e NEO4J_AUTH=neo4j/password \
    neo4j:5.15.0
```

### 4.2 依赖安装
在项目根目录安装驱动：

```bash
npm install neo4j-driver
```

### 4.3 配置环境变量
在 `.env` 文件中添加：

```env
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password
```

### 4.4 业务集成
在文档处理流程中（如 `lib/services/dataset.js` 的 `createQuestions` 附近）加入图谱提取步骤：

```javascript
import { GraphService } from '@/lib/services/graphService';

// ... 在切片处理循环中 ...
if (process.env.ENABLE_GRAPH === 'true') {
  const graphService = new GraphService(projectId);
  await graphService.processChunk(chunk.content, chunk.id);
}
```

## 5. 预期成果

集成完成后，系统将具备以下能力：

1.  **自动图谱构建**：上传 PDF 预案，后台自动解析并生成“设备-操作-后果”的知识图谱。
2.  **可视化分析**：通过 Neo4j Browser 可直观展示核应急体系中的复杂关系。
3.  **增强问答 (GraphRAG)**：LLM 在回答问题时，可先从图谱中检索多跳关系（例如：查找某征兆背后的所有可能根因），大幅提升回答的深度和准确性。

## 6. 结论

本项目已完成集成 Neo4j 的底层架构铺设，代码结构清晰，扩展性强。只需完成最后的环境配置和业务入口调用，即可上线知识图谱功能。
