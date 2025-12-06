# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在此代码库中工作时提供指导。

## 项目概述

NuCorpus（核应急数据集构建工具）是一个用于创建大模型微调数据集的工具。它可以处理文档、智能分割文本、通过 LLM API 生成问题，并以多种格式（Alpaca、ShareGPT、multilingual-thinking）导出训练数据。

## 常用命令

```bash
# 安装依赖（使用 pnpm）
pnpm install

# 初始化数据库
pnpm db:push

# 开发服务器（端口 1717）
pnpm dev              # 标准开发模式
pnpm dev:turbo        # Turbo 模式

# 生产构建和启动
pnpm build
pnpm start

# 数据库工具
pnpm db:studio        # 打开 Prisma Studio 查看数据库

# Electron 桌面应用
pnpm electron-dev           # Electron 开发模式
pnpm electron-build-mac     # 构建 macOS 应用
pnpm electron-build-win     # 构建 Windows 应用
pnpm electron-build-linux   # 构建 Linux 应用

# Docker
pnpm docker           # 构建 Docker 镜像

# 代码检查/格式化
pnpm lint             # 运行 ESLint
pnpm prettier         # 使用 Prettier 格式化代码
```

## 架构设计

### 技术栈
- **前端**: Next.js 14 (App Router)、React 18、Material-UI v5
- **后端**: Node.js API 路由、Prisma ORM + SQLite
- **AI 集成**: OpenAI 兼容 API、Ollama、智谱 AI、OpenRouter
- **桌面应用**: Electron
- **国际化**: i18next（支持英文、中文、土耳其语）

### 数据流
```
文档上传 -> 文本分割 -> 问题生成 -> 答案生成 -> 数据集导出
```

### 核心目录结构

```
app/
├── api/                    # Next.js API 路由
│   ├── projects/[projectId]/  # 项目相关 API
│   │   ├── chunks/         # 文本块管理
│   │   ├── datasets/       # 数据集增删改查及导出
│   │   ├── questions/      # 问题生成
│   │   ├── images/         # 图像数据集处理
│   │   └── tasks/          # 后台任务管理
│   └── llm/                # LLM 提供商 API
├── projects/[projectId]/   # 项目页面
│   ├── datasets/           # 数据集管理界面
│   ├── distill/            # 知识蒸馏
│   ├── image-datasets/     # 图像标注界面
│   └── text-split/         # 文档处理界面

lib/
├── api/                    # API 客户端工具
├── db/                     # 数据库访问层（Prisma 封装）
├── file/                   # 文件处理（PDF、DOCX、MD、EPUB）
├── llm/                    # LLM 集成
│   ├── core/               # 提供商实现
│   └── prompts/            # 提示词模板（多语言）
├── services/               # 业务逻辑层
│   └── tasks/              # 后台任务处理
└── util/                   # 工具函数

components/
├── datasets/               # 数据集 UI 组件
├── distill/                # 蒸馏组件
├── text-split/             # 文本分割组件
├── Navbar/                 # 导航组件
└── export/                 # 导出对话框

electron/                   # Electron 主进程
prisma/                     # 数据库 Schema 和迁移
locales/                    # 国际化翻译文件
```

### 数据库模型（SQLite + Prisma）

核心模型：`Projects`（项目）、`Chunks`（文本块）、`Questions`（问题）、`Datasets`（数据集）、`Tags`（标签）、`Task`（任务）、`Images`（图片）、`ImageDatasets`（图像数据集）、`ModelConfig`（模型配置）

数据库文件存储在 `prisma/db.sqlite`，项目文件存储在 `local-db/` 目录。

### LLM 提供商集成

支持的提供商配置在 `lib/llm/core/` 目录。所有提供商实现统一接口，支持：
- 标准生成
- 流式输出
- 多语言提示词

## 开发指南

### 代码规范
- 使用 ES6+ JavaScript（本项目不使用 TypeScript）
- 异步操作使用 async/await
- 使用 JSDoc 格式编写注释
- 使用 Conventional Commits 规范提交代码

### 功能扩展

**添加新的 LLM 提供商：**
1. 在 `lib/llm/core/providers/` 创建提供商文件
2. 在 `lib/llm/core/index.js` 中注册
3. 更新设置界面

**添加新的文件格式：**
1. 在 `lib/file/file-process/` 添加处理器
2. 更新文件类型检测逻辑

**添加新的导出格式：**
1. 在 `components/export/` 添加导出逻辑
2. 更新导出对话框选项

### 分支策略
- `main`: 稳定发布版本
- `dev`: 开发集成分支（PR 提交到此分支）
- `feature/*`: 功能分支
- `fix/*`: 修复分支

## 环境配置

`.env` 文件中的关键环境变量：
- `DATABASE_URL`: SQLite 数据库路径（默认：`file:./db.sqlite`）

## 端口配置

应用默认运行在 **1717** 端口。
