# NuCorpus

**核应急领域大模型微调数据集构建工具**

[简体中文](./README.zh-CN.md) | [English](./README.md)

## 概述

NuCorpus 是一个专为创建大型语言模型（LLM）微调数据集而设计的应用程序，特别面向核应急等垂直领域。它提供了完整的工作流程：从文档上传、智能切分、问题/答案生成，到数据集导出，使微调过程变得简单高效。

## 功能特点

- **智能文档处理**：支持 PDF、Markdown、DOCX、EPUB、TXT 等多种格式
- **智能文本分割**：多种分割算法 + 自定义可视化分段
- **智能问题生成**：从文本片段中提取相关问题，支持核应急场景化问答
- **领域标签**：智能构建全局领域标签树
- **答案生成**：使用 LLM API 生成答案及思维链（COT）
- **灵活编辑**：在任意阶段编辑问题、答案和数据集
- **多种导出格式**：Alpaca、ShareGPT、multilingual-thinking（JSON/JSONL）
- **广泛的模型支持**：兼容 OpenAI 格式的 LLM API、Ollama、智谱 AI、OpenRouter
- **知识图谱（可选）**：支持三元组抽取与 Neo4j 入库

## 本地运行

### 使用 pnpm 安装

```bash
# 安装依赖
pnpm install

# 初始化数据库
pnpm db:push

# 启动开发服务器
pnpm dev
```

打开浏览器访问 `http://localhost:1717`

### 使用 Docker

```bash
docker-compose up -d
```

打开浏览器访问 `http://localhost:1717`

## 使用方法

### 1. 创建项目

在首页点击"创建项目"，输入项目名称和描述，配置 LLM API 设置。

### 2. 处理文档

在"文本分割"页面上传文件（PDF、Markdown、DOCX、TXT），查看和调整自动分割的文本片段。

### 3. 生成问题

基于文本块批量构造问题，使用标签树组织问题。

### 4. 创建数据集

基于问题批量生成答案，查看、编辑并优化生成的答案。

### 5. 导出数据集

选择导出格式（Alpaca/ShareGPT/multilingual-thinking）和文件格式（JSON/JSONL），添加自定义系统提示后导出。

## 技术栈

- **前端**: Next.js 14 (App Router)、React 18、Material-UI v5
- **后端**: Node.js、Prisma ORM、SQLite
- **桌面应用**: Electron
- **国际化**: i18next（中文、英文、土耳其语）

## 许可证

本项目采用 AGPL 3.0 许可证。
