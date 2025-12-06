# NuCorpus 项目上下文

## 项目概述

NuCorpus 是一个专为创建大语言模型微调数据集而设计的强大应用程序。该应用允许用户上传领域特定文件，智能分割内容，生成问题，并生成高质量的训练数据，适用于所有遵循 OpenAI 格式的 LLM API。

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **UI 框架**: Material-UI (MUI) v5.16.14
- **状态管理**: Jotai
- **数据存储**: Prisma + SQLite
- **开发语言**: JavaScript
- **国际化**: i18next + react-i18next
- **主题**: next-themes
- **构建工具**: Electron Builder (桌面应用)

## 项目结构

```
NuCorpus/
├── app/                      # Next.js 应用目录
│   ├── api/                 # API 路由
│   │   ├── check-update/    # 更新检查 API
│   │   ├── llm/             # LLM 相关 API
│   │   ├── projects/        # 项目管理 API
│   │   └── update/          # 更新 API
│   ├── dataset-square/      # 数据集广场页面
│   ├── projects/[projectId]/ # 项目详情页面
│   ├── globals.css          # 全局样式
│   ├── layout.js            # 根布局
│   └── page.js              # 主页
├── components/              # React 组件
│   ├── common/              # 通用组件
│   ├── conversations/       # 对话相关组件
│   ├── dataset-square/      # 数据集广场组件
│   ├── datasets/            # 数据集相关组件
│   ├── distill/             # 数据蒸馏组件
│   ├── export/              # 导出功能组件
│   ├── home/                # 主页组件
│   ├── mga/                 # 多生成受众组件
│   ├── Navbar/              # 导航栏组件
│   ├── playground/          # 模型游乐场组件
│   ├── questions/           # 问题相关组件
│   ├── settings/            # 设置组件
│   ├── tasks/               # 任务管理组件
│   └── text-split/          # 文本分割组件
├── constant/                # 常量定义
├── electron/                # Electron 相关文件
├── hooks/                   # 自定义 React Hooks
├── lib/                     # 工具库
│   ├── api/                 # API 客户端
│   ├── db/                  # 数据库操作
│   ├── file/                # 文件处理
│   ├── graph/               # 图谱相关
│   ├── llm/                 # LLM 集成
│   ├── services/            # 服务层
│   └── util/                # 通用工具
├── locales/                 # 国际化资源
├── prisma/                  # Prisma 配置
├── public/                  # 静态资源
└── styles/                  # 样式文件
```

## 核心功能模块

### 1. 项目管理
- 创建和管理多个项目
- 项目配置管理（模型配置、提示词等）
- 项目统计和展示

### 2. 文档处理
- 支持多种格式：PDF、Markdown、DOCX、TXT
- 智能文本分割算法
- 可视化文本片段编辑
- 文件上传和管理

### 3. 问题生成
- 从文本片段智能生成问题
- 支持多生成受众 (GA) 功能
- 问题编辑和组织
- 标签树管理

### 4. 数据集生成
- 基于问题生成答案
- 支持多种答案类型（文本、标签、自定义格式）
- 对话式数据集生成
- 数据集质量评估

### 5. 数据集导出
- 多种导出格式：Alpaca、ShareGPT、多语言思维
- 支持本地导出和 Hugging Face 导出
- LlamaFactory 格式支持
- 自定义系统提示词

### 6. 模型集成
- 支持多种 LLM 提供商：
  - OpenAI
  - Ollama
  - OpenRouter
  - 智谱AI
  - 硅基流动
  - 深度求索
- 模型配置管理
- 模型游乐场测试

## 关键命令

### 开发命令
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建项目
npm run build

# 启动生产服务器
npm run start

# 数据库相关
npm run db:push      # 推送数据库模式
npm run db:studio    # 打开 Prisma Studio
npm run db:template  # 生成数据库模板
```

### 桌面应用命令
```bash
# 开发模式
npm run electron-dev

# 构建桌面应用
npm run electron-build          # 构建所有平台
npm run electron-build-mac      # 构建 macOS
npm run electron-build-win      # 构建 Windows
npm run electron-build-linux    # 构建 Linux
```

### 代码质量
```bash
# 代码检查
npm run lint

# 代码格式化
npm run prettier
```

### Docker 部署
```bash
# 构建 Docker 镜像
npm run docker

# 使用 docker-compose
docker-compose up -d
```

## 数据库模式

项目使用 Prisma + SQLite 作为数据存储方案，主要数据模型包括：

- **Projects**: 项目信息
- **UploadFiles**: 上传文件管理
- **Chunks**: 文本片段
- **Questions**: 问题管理
- **Datasets**: 数据集记录
- **DatasetConversations**: 对话式数据集
- **ModelConfig**: 模型配置
- **Task**: 任务管理
- **CustomPrompts**: 自定义提示词
- **GaPairs**: 多生成受众配置
- **Images**: 图片管理
- **ImageDatasets**: 图片数据集
- **QuestionTemplates**: 问题模板

## 开发约定

### 代码风格
- 使用 ESLint 和 Prettier 进行代码格式化
- 遵循 JavaScript/ES6+ 最佳实践
- 组件命名使用 PascalCase
- 文件命名使用 camelCase

### 提交规范
项目使用 Commitlint 进行提交信息规范：
- feat: 新功能
- fix: 修复
- docs: 文档
- style: 格式
- refactor: 重构
- test: 测试
- chore: 构建过程或辅助工具的变动

### 组件开发
- 使用 Material-UI 组件库
- 遵循组件化开发原则
- 使用 Jotai 进行状态管理
- 支持主题切换（亮/暗）

### API 开发
- 使用 Next.js App Router API 路由
- 统一的错误处理
- 请求参数验证
- 响应格式标准化

## 国际化

项目支持多语言，当前支持：
- 简体中文 (zh-CN)
- 英文 (en)
- 土耳其语 (tr)

国际化资源位于 `locales/` 目录，使用 i18next 进行管理。

## 部署方式

### 本地部署
1. 克隆项目
2. 安装依赖
3. 配置环境变量
4. 运行 `npm run dev` 或 `npm run build && npm run start`

### Docker 部署
1. 使用提供的 `docker-compose.yml`
2. 挂载 `local-db` 和 `prisma` 目录
3. 运行 `docker-compose up -d`

### 桌面应用
提供 Windows、macOS 和 Linux 的桌面应用程序，可通过 GitHub Releases 下载。

## 特殊配置

### 环境变量
- `DATABASE_URL`: SQLite 数据库路径
- 其他 LLM API 相关的环境变量

### Next.js 配置
- 优化了包导入
- 配置了 PDF 处理相关的外部依赖
- 支持服务器组件外部包

### Prisma 配置
- 支持多平台的二进制目标
- 使用 SQLite 作为数据提供者

## 项目特色

1. **智能化处理**: 支持多种文档格式的智能解析和分割
2. **多模型支持**: 兼容各种主流 LLM API
3. **可视化编辑**: 提供直观的文本分割和数据编辑界面
4. **多语言支持**: 完整的国际化支持
5. **灵活导出**: 支持多种数据集导出格式
6. **桌面应用**: 提供跨平台桌面应用
7. **开源协议**: 使用 AGPL 3.0 开源协议

## 相关资源

- 项目文档: https://docs.easy-dataset.com/ed/en
- 论文: https://arxiv.org/abs/2507.04009v1
- GitHub: https://github.com/ConardLi/easy-dataset
- 演示视频: https://www.bilibili.com/video/BV1y8QpYGE57/