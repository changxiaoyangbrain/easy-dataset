# NuCorpus Agent 手册

面向核应急/行业知识数据集构建的全局速记，帮助新接手的代理快速落地。

## 1) 项目快照
- 目标：从文件上传 → 智能切分 → 问题/答案生成 → 数据集导出/发布，服务核应急等垂直领域。
- 技术栈：Next.js 14 (App Router) + React 18 + MUI v5 + Tailwind(部分样式)；后端 Node.js + Prisma + SQLite；Electron 桌面；i18next 国际化。
- 运行端口：`1717`。默认使用 `pnpm`（scripts 中多处依赖 pnpm）。
- 数据库：本地 SQLite（`prisma/db.sqlite`），`prisma/db.push` 会自动初始化模板。

## 2) 常用命令
- 安装依赖：`pnpm install` （国内可用 `.npmrc` 指定的 npmmirror）。
- 开发：`pnpm dev` 或 `./start-dev.sh`（含端口占用清理与 Banner）。
- 生产预览：`./start-prod.sh`（先 build 再 start，无热更）。
- 构建：`pnpm build`；启动：`pnpm start`。
- Prisma：`pnpm db:push` 初始化 / 同步；`pnpm db:studio` 可视化。
- Electron：`pnpm electron-dev`（联动前端 dev）；`pnpm electron-build-*` 生成安装包。
- Docker：`docker-compose up -d`（见 `docker-compose.yml`，挂载 `local-db/prisma`）。

## 3) 目录指北（核心触点）
- `app/`：Next.js 路由与 API；`app/projects/[projectId]` 负责项目、切分、数据集页面。
  - API 例：`app/api/projects/[projectId]/huggingface/upload/route.js`（HF 数据集上传），`.../split/route.js`（切分），`.../llamaFactory/generate/route.js`（生成）。
- `components/`：UI 组件，导航、首页、切分流程等；新增 `components/Footer.js`。
- `lib/file/`：文件处理与校验，PDF 视觉解析在 `file-process/pdf/vision.js`。
- `lib/llm/`：LLM 核心与提示词。
  - 核心：`lib/llm/core`（统一调用/流式/重试），通用工具 `lib/llm/common/util`。
  - 提示词：`lib/llm/prompts/*.js`；新增核应急专用 `nuclear.js`、知识图谱抽取 `graph.js`，旧提示已按核域优化（见 `.agent/prompt_optimization_summary.md`）。
- `lib/services/`：业务服务；问答 `services/questions`；新增 `graphService.js` 负责知识图谱抽取→Neo4j 入库。
- `lib/graph/neo4j.js`：Neo4j 客户端封装（可选）。
- `locales/`：多语言文案（en / zh-CN / tr）。
- 文档：`KNOWLEDGE_GRAPH_GUIDE.md`（图谱 PoC 启用指南），`ARCHITECTURE.md`，`README.*`.

## 4) 现状与新增能力
- **核应急场景提示词**：`lib/llm/prompts/nuclear.js` 提供 EOP/SAMG 场景化问答、判别题模板；生成时可按 `type` 选择 EOP/JUDGEMENT。
- **知识图谱 PoC（可选）**：
  - 代码：`lib/llm/prompts/graph.js`（三元组抽取）、`lib/services/graphService.js`（LLM → JSON → Neo4j）、`lib/graph/neo4j.js`（驱动）。
  - 启用：`pnpm add neo4j-driver`；.env 配置 `NEO4J_URI/USER/PASSWORD`；在切分/生成流程中调用 `GraphService.processChunk(text, sourceId)`。
  - 说明：详见 `KNOWLEDGE_GRAPH_GUIDE.md`。
- **HuggingFace 数据集发布**：API `.../huggingface/upload` 支持创建/检测仓库并上传 README+数据文件（json/jsonl/csv），需传入用户 token。
- **UI/样式**：MUI + 自定义 Tailwind（`tailwind.config.js` / `postcss.config.js`），部分旧图片已清理，仅保留 `public/imgs/logo.svg` 等。

## 5) 开发要点 / 常见改动
- **添加模型提供商**：在 `lib/llm/core/providers/` 新建实现，注册到 `lib/llm/core/index.js`，补充 UI 配置与 i18n 文案。
- **新增文件格式**：`lib/file/file-process/` 添加解析器，更新类型检测与上传校验，前端上传/切分组件对应调整。
- **自定义提示词**：在 `lib/llm/prompts/` 新建，使用 `processPrompt` 支持多语言/项目级覆盖；文案放入 `locales/*`.
- **导出/上传扩展**：前端组件 `components/export/`；后端格式转换在 dataset 相关服务；HuggingFace 上传逻辑可复用 `formatDataset` 与 `convertToCSV`。
- **桌面端**：主进程入口 `electron/main.js`，菜单/窗口在 `electron/modules/`；打包配置位于 `package.json#build`。

## 6) 配置与环境
- `.env`：`DATABASE_URL`、`LOCAL_DB_PATH` 默认即可；LLM API Key（如 `OPENAI_API_KEY`）在运行环境传入；启用图谱需新增 Neo4j 变量。
- `.npmrc`：默认使用 npmmirror，可按需切换。
- 端口占用：`start-dev.sh` 会自动释放 `1717`。

## 7) 调试速查
- 数据库：`pnpm db:studio` 或 `sqlite3 prisma/db.sqlite`。
- LLM 调用：在 `lib/llm/core`/服务层增加日志（请求/响应），注意不要泄露密钥。
- 文件处理：在 `lib/file` 相关模块打印分块/页数；大文件建议逐块处理。
- Electron：若打包异常，检查 `package.json#build.files/extraResources` 与本地依赖版本。

## 8) 提交流程
- commit 风格：conventional commits；提交前可运行 `pnpm lint`/`pnpm prettier`（配置在 lint-staged）。
- 分支：`main` 稳定版，`dev` 集成，`feature/*` / `fix/*` 按需。

提示：品牌已更名 NuCorpus，但部分文件仍沿用 `easy-dataset` 名称（package name / 旧文档），更新时注意保持兼容路径与现有脚本。
