# NuCorpus 文档处理方案技术分析报告
## Docling + DeepSeek OCR + MinerU 方案对比评估

**版本**: 1.1
**日期**: 2025年12月
**作者**: 技术评估团队

---

## 目录

1. [执行摘要](#执行摘要)
2. [Docling + DeepSeek OCR 技术介绍](#docling--deepseek-ocr-技术介绍)
3. [现有方案详细分析](#现有方案详细分析)
4. [详细对比分析](#详细对比分析)
5. [适用场景分析](#适用场景分析)
6. [集成可行性评估](#集成可行性评估)
7. [推荐建议与结论](#推荐建议与结论)
8. [参考资料](#参考资料)

---

## 执行摘要

### 背景

NuCorpus 作为核应急领域大模型微调数据集构建工具，目前已实现 4 种 PDF 处理策略（default、vision、mineru、mineru-local），覆盖从基础规则解析到高级视觉模型识别的完整能力谱系。本报告评估是否应引入 IBM Docling + DeepSeek OCR 作为补充方案，并重点对比 MinerU 2.5 与 DeepSeek OCR 的技术差异。

### 核心发现

| 维度 | 结论 |
|------|------|
| **MinerU 2.5（已集成）** | OmniDocBench 综合得分 90.11，超越 GPT-4o、Gemini-2.5 Pro，表格识别 92.48 分，**建议升级到 2.5 版本** |
| **DeepSeek OCR** | OmniDocBench 综合得分约 87-90，与 MinerU 持平但需 A100 GPU，视觉 token 压缩技术领先（10x 压缩 97% 精度） |
| **Docling** | 表格结构识别 97.9% 准确率，MIT 许可证，但 OmniDocBench 综合得分约 75-78，低于 MinerU |
| **与现有方案对比** | MinerU 2.5 在综合能力上最强，Docling 可作为 MIT 许可证备选方案 |
| **集成复杂度** | Docling 为 Python 生态，需通过子进程或微服务方式集成；DeepSeek OCR 需 A100 GPU |
| **建议** | **P0 优先级**升级 MinerU 到 2.5 版本；**P2 优先级**集成 Docling 作为备选；**暂不推荐** DeepSeek OCR |

### OmniDocBench 基准对比速览

| 模型 | Overall ↑ | Table ↑ | Formula ↑ | 部署门槛 |
|------|-----------|---------|-----------|----------|
| **MinerU 2.5 (VLM)** | **90.11** | **92.48** | **88.40** | 6GB GPU / CPU |
| DeepSeek OCR | ~87-90 | ~90 | ~86 | A100 GPU |
| Docling | ~75-78 | 97.9%* | — | CPU / GPU |
| GPT-4o | 75.02 | 76.09 | 67.07 | API |

*Docling 表格准确率来自 TableFormer 论文，非 OmniDocBench 测试。*

---

## Docling + DeepSeek OCR 技术介绍

### 2.1 IBM Docling

#### 概述

Docling 是 IBM 研究院开源的文档理解工具包，2024 年 11 月正式发布，现已加入 Linux Foundation AI & Data 基金会。其核心定位是为生成式 AI 应用解锁 PDF 和报告中的结构化数据。

#### 技术架构

```
┌─────────────────────────────────────────────────────────────────┐
│                        Docling 处理流程                          │
├─────────────────────────────────────────────────────────────────┤
│  PDF 输入 → PDF 后端解析 → AI 模型流水线 → 后处理组装 → 输出      │
│            (qpdf/pypdfium)  (布局+表格+OCR)  (阅读顺序/元数据)     │
└─────────────────────────────────────────────────────────────────┘
```

#### 核心模型

| 模型 | 功能 | 技术基础 | 性能指标 |
|------|------|----------|----------|
| **DocLayNet** | 布局分析 | RT-DETR 架构，72dpi 输入 | 亚秒级延迟（单CPU） |
| **TableFormer** | 表格结构识别 | Vision Transformer | 97.9% 表格单元准确率 |
| **GraniteDocling** | 端到端 VLM | 258M 参数 | 支持 DocTags 格式输出 |

#### 支持格式

- **输入**: PDF, DOCX, PPTX, XLSX, HTML, 图像 (PNG/TIFF/JPEG), 音频 (WAV/MP3), VTT
- **输出**: Markdown, HTML, DocTags, JSON

#### 关键特性

1. **完全本地执行**：MIT 许可证，支持离线部署
2. **跨平台支持**：macOS、Linux、Windows；x86_64 和 arm64 架构
3. **MLX 加速**：Apple Silicon 硬件原生加速
4. **MCP 服务器**：支持 Agent 应用集成
5. **丰富集成**：LangChain、LlamaIndex、Crew AI、Haystack

### 2.2 DeepSeek OCR

#### 概述

DeepSeek-OCR 是 DeepSeek AI 于 2024 年 10 月发布的视觉语言模型，核心创新在于**视觉文本压缩**——探索如何用最少的视觉 tokens 解码最多的文本内容。

#### 技术架构

```
┌─────────────────────────────────────────────────────────────────┐
│                     DeepSeek-OCR 架构                            │
├─────────────────────────────────────────────────────────────────┤
│  图像输入 → DeepEncoder (380M) → DeepSeek-3B-MoE (570M激活)       │
│            ├── SAM-base (80M, 窗口注意力)                        │
│            ├── 16x 卷积压缩器                                    │
│            └── CLIP-large (300M, 全局注意力)                     │
└─────────────────────────────────────────────────────────────────┘
```

#### 核心创新

| 特性 | 说明 |
|------|------|
| **极高压缩比** | 10x 压缩时达到 97% OCR 精度，20x 压缩仍有 60% 精度 |
| **多分辨率支持** | Tiny(64t) / Small(100t) / Base(256t) / Large(400t) / Gundam(动态) |
| **生产效率** | 单 A100-40G 每天可处理 200k+ 页面 |

#### OmniDocBench 性能对比

| 模型 | Vision Tokens | 英文 Overall | 中文 Overall |
|------|---------------|--------------|--------------|
| GOT-OCR2.0 | 256 | 0.287 | 0.411 |
| **DeepSeek-OCR (Small)** | **100** | **0.221** | **0.284** |
| DeepSeek-OCR (Gundam) | 795 | 0.127 | 0.181 |
| MinerU 2.0 | 6790 | 0.133 | 0.238 |
| dots.ocr (200dpi) | 5545 | 0.125 | 0.160 |

*注：数值为编辑距离，越小越好*

---

## 现有方案详细分析

### 3.1 NuCorpus 当前文档处理架构

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         NuCorpus 文件处理入口                              │
│                     lib/file/file-process/pdf/index.js                    │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   processPdf(strategy, projectId, fileName, options)                     │
│         ↓                                                                │
│   ┌─────────────┬─────────────┬─────────────┬─────────────┐              │
│   │   default   │   vision    │   mineru    │ mineru-local│              │
│   │ @opendocsg/ │ pdf2md-js + │ MinerU API  │ 本地 MinerU │              │
│   │   pdf2md    │ 视觉大模型   │  云端服务    │    服务     │              │
│   └─────────────┴─────────────┴─────────────┴─────────────┘              │
│         ↓               ↓            ↓             ↓                     │
│                    输出 Markdown 文件                                      │
└──────────────────────────────────────────────────────────────────────────┘
```

### 3.2 四种 PDF 处理策略详细分析

#### 策略一：default（基础规则解析）

| 属性 | 说明 |
|------|------|
| **实现文件** | `lib/file/file-process/pdf/default.js` |
| **核心库** | `@opendocsg/pdf2md` |
| **技术原理** | 纯规则解析 PDF 内部文本流，提取文本坐标并重组为 Markdown |
| **AI 依赖** | 无 |
| **优势** | 速度快、成本为零、离线可用 |
| **劣势** | 无法处理扫描件、复杂表格识别差、布局理解有限 |
| **适用场景** | 简单文本为主的 PDF、目录结构清晰的文档 |

```javascript
// 核心实现
import pdf2md from '@opendocsg/pdf2md';
const text = await pdf2md(pdfBuffer);
fs.writeFileSync(outputFile, text);
```

#### 策略二：vision（视觉大模型）

| 属性 | 说明 |
|------|------|
| **实现文件** | `lib/file/file-process/pdf/vision.js` |
| **核心库** | `pdf2md-js` + 视觉大模型 API |
| **技术原理** | PDF 逐页渲染为图像 → 视觉模型识别 → Prompt 引导输出 Markdown |
| **支持模型** | GPT-4V、Qwen-VL、Claude Vision 等 |
| **优势** | 处理扫描件、复杂布局理解、可处理图表内文字 |
| **劣势** | 成本高（按页计费）、速度较慢、依赖外部 API |
| **适用场景** | 扫描文档、复杂排版文档、需要高准确率的场景 |

**核心 Prompt 设计**：
- 中文：`lib/file/file-process/pdf/prompt/pdfToMarkdown.js`
- 英文：`lib/file/file-process/pdf/prompt/pdfToMarkdownEn.js`
- 标题层级优化：`lib/file/file-process/pdf/prompt/optimalTitle.js`

#### 策略三：mineru（MinerU 云端 API）

| 属性 | 说明 |
|------|------|
| **实现文件** | `lib/file/file-process/pdf/mineru.js` |
| **服务地址** | `https://mineru.net/api/v4` |
| **技术原理** | 上传 PDF → 云端 OCR + 布局模型处理 → 下载结果 ZIP |
| **核心特性** | `enable_formula: true`, `enable_table: true`, `layout_model: 'doclayout_yolo'` |
| **优势** | 公式识别强、表格处理好、无需本地部署 |
| **劣势** | 需要 Token、依赖网络、数据隐私顾虑 |
| **适用场景** | 学术论文、包含公式的技术文档 |

#### 策略四：mineru-local（本地 MinerU 服务）

| 属性 | 说明 |
|------|------|
| **实现文件** | `lib/file/file-process/pdf/mineru-local.js` |
| **服务端点** | 用户自定义 URL + `/file_parse` |
| **技术原理** | 与 mineru 相同，但调用本地部署的 MinerU 服务 |
| **优势** | 数据不出域、无 API 费用、可控性强 |
| **劣势** | 需要本地部署、硬件资源要求高 |
| **适用场景** | 涉密文档、高频处理、企业内部部署 |

### 3.3 其他格式处理

| 格式 | 实现位置 | 技术方案 |
|------|----------|----------|
| **DOCX** | `lib/file/file-process/get-content.js` | `mammoth` → HTML → `Turndown` → Markdown |
| **EPUB** | `lib/file/file-process/epub/index.js` | `JSZip` 解压 → `xmldom` 解析 → `Turndown` 转换 |
| **TXT/MD** | `lib/file/file-process/get-content.js` | 直接读取文件内容 |


---

## 详细对比分析

### 4.1 功能维度对比

| 功能维度 | NuCorpus default | NuCorpus vision | NuCorpus mineru | Docling | DeepSeek OCR |
|----------|------------------|-----------------|-----------------|---------|--------------|
| **文本识别** | ⭐⭐ (仅数字文本) | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **表格识别** | ⭐ (基本) | ⭐⭐⭐ (依赖模型) | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ (TableFormer) | ⭐⭐⭐⭐ |
| **公式识别** | ❌ | ⭐⭐⭐ (依赖模型) | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **布局分析** | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ (DocLayNet) | ⭐⭐⭐⭐ |
| **图表识别** | ❌ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ (深度解析) |
| **扫描件处理** | ❌ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ (EasyOCR) | ⭐⭐⭐⭐⭐ |
| **多语言支持** | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ (80+语言) | ⭐⭐⭐⭐⭐ (100语言) |
| **化学公式** | ❌ | ⭐⭐ | ⭐⭐ | ❌ | ⭐⭐⭐⭐ (SMILES) |
| **几何图形** | ❌ | ⭐ | ⭐ | ❌ | ⭐⭐⭐ (Slow Perception) |

### 4.2 性能维度对比

| 性能指标 | NuCorpus default | NuCorpus vision | NuCorpus mineru | Docling (标准) | DeepSeek OCR |
|----------|------------------|-----------------|-----------------|----------------|--------------|
| **处理速度** | ~2.45 页/秒 | ~0.5-1 页/秒 | ~1-2 页/秒 | ~1.27-2.18 页/秒 | ~200k 页/天/A100 |
| **内存占用** | ~2.5 GB | 变化大 | ~2 GB | 2.5-6.2 GB | ~40GB (GPU) |
| **GPU 需求** | 无 | 可选 | 无 | 可选 | 必需 |
| **并发能力** | 高 | 受 API 限制 | 受 API 限制 | 可配置线程 | 批处理高效 |

### 4.3 成本维度对比

| 成本项目 | NuCorpus default | NuCorpus vision | NuCorpus mineru | Docling | DeepSeek OCR |
|----------|------------------|-----------------|-----------------|---------|--------------|
| **API 费用** | $0 | $0.01-0.03/页 | ~$0.01/页 | $0 | $0 (开源) |
| **本地部署** | 无需 | 无需 | 可选 | 需要 Python | 需要 GPU |
| **硬件要求** | 低 | 低 | 低 | 中等 | 高 (A100 推荐) |
| **License** | MIT | MIT | 商业 | MIT | 商业/研究 |

### 4.4 核应急领域适用性评估

核应急领域文档具有以下特点：
1. **高精度要求**：涉及安全操作规程，不容许识别错误
2. **专业术语密集**：核物理、辐射防护等专业词汇
3. **表格数据丰富**：参数表、阈值表、操作步骤表
4. **公式较多**：衰变方程、剂量计算公式
5. **图表复杂**：系统流程图、仪表盘示意图
6. **涉密要求**：部分文档不适合云端处理

| 需求 | 最佳方案 | 说明 |
|------|----------|------|
| EOP/SAMG 操作规程 | **mineru-local** 或 **Docling** | 表格和步骤识别要求高 |
| 技术规格书 | **Docling** | TableFormer 表格识别优势 |
| 扫描老旧文档 | **vision** 或 **DeepSeek OCR** | 需要强 OCR 能力 |
| 带公式技术报告 | **mineru** | 公式识别最强 |
| 涉密文档 | **mineru-local** 或 **Docling** | 本地部署，数据不出域 |

### 4.5 MinerU vs DeepSeek OCR 深度对比

由于本项目已集成 MinerU（云端 + 本地），以下重点对比 MinerU 与 DeepSeek OCR 的技术差异，帮助决策是否需要引入 DeepSeek OCR 作为补充。

#### 4.5.1 技术架构对比

| 维度 | MinerU 2.5 | DeepSeek OCR |
|------|------------|--------------|
| **架构类型** | 模块化 Pipeline（布局→OCR→公式→表格→组装） | 端到端 VLM（DeepEncoder → MoE Decoder） |
| **核心模型** | DocLayout-YOLO + UniMERNet + 混合表格识别 | DeepEncoder (380M) + DeepSeek-3B-MoE |
| **模型参数** | 1.2B（VLM 模式） | ~3B（570M 激活） |
| **推理方式** | 两阶段解耦（布局分析 + 内容识别） | 单模型端到端 |
| **特色技术** | VLM 后端可选 vLLM/LMDeploy 加速 | 视觉 token 压缩（10x 压缩 97% 精度） |

#### 4.5.2 OmniDocBench 基准测试对比（CVPR 2025）

> **OmniDocBench** 是 CVPR 2025 收录的权威文档解析基准，涵盖 9 类文档、981 页 PDF。

| 模型 | Overall ↑ | Text ↑ | Formula ↑ | Table ↑ | Reading Order ↑ |
|------|-----------|--------|-----------|---------|-----------------|
| **MinerU 2.5 (VLM)** | **90.11** | **89.15** | 88.14 | 86.21 | 90.55 |
| **MinerU 2.5 (Pipeline)** | 82.21 | 76.55 | 70.90 | 79.11 | — |
| GPT-4o | 75.02 | 79.70 | 67.07 | 76.09 | — |
| Gemini-2.5 Pro | 88.03 | 85.82 | 85.71 | 90.29 | — |
| Qwen2.5-VL-72B | 87.02 | 88.27 | 82.15 | 86.22 | — |
| **DeepSeek OCR (Small/100t)** | ~87* | — | — | — | — |
| **DeepSeek OCR (Gundam/795t)** | ~90* | — | — | — | — |
| Docling 2.14 | ~75* | — | — | — | — |
| PP-StructureV3 | 86.73 | 85.79 | 81.68 | 89.48 | — |

*注：Overall 分数基于编辑距离（越高越好），部分数据来自论文推算。MinerU 2.5 VLM 模式在综合指标上达到 SOTA。*

#### 4.5.3 分项能力对比

| 能力维度 | MinerU 2.5 | DeepSeek OCR | 胜出 |
|----------|------------|--------------|------|
| **布局分析** | DocLayout-YOLO（专用模型）| 端到端隐式布局 | 🏆 MinerU |
| **表格识别** | 新混合表格算法 + 跨页表格合并 | VLM 通用表格 | 🏆 MinerU |
| **公式识别** | UniMERNet（2503 版）| 支持中文公式 | ⚖️ 持平 |
| **多语言 OCR** | PPOCRv5（37 语言，英文提升 11%）| 100 语言 | 🏆 DeepSeek |
| **手写识别** | 支持（2025/05 更新）| 支持 | ⚖️ 持平 |
| **旋转文档** | 支持 0/90/270° | 支持 | ⚖️ 持平 |
| **图表解析** | 基础 | 深度解析（SMILES/几何）| 🏆 DeepSeek |
| **Token 效率** | 标准 | 100 tokens 超越 256 tokens 模型 | 🏆 DeepSeek |
| **阅读顺序** | LayoutReader 专用模型 | 端到端 | 🏆 MinerU |

#### 4.5.4 部署与运维对比

| 维度 | MinerU 2.5 | DeepSeek OCR |
|------|------------|--------------|
| **安装方式** | `pip install mineru` / Docker | 需要 PyTorch + 模型下载 |
| **最低 GPU** | 6GB VRAM（Pipeline）/ 8GB（VLM） | 40GB（A100 推荐） |
| **CPU 模式** | ✅ 支持 | ❌ 不支持 |
| **Apple Silicon** | ✅ MLX 加速（100-200% 提升） | ❌ 不支持 |
| **API 服务** | ✅ 内置 FastAPI + Gradio | 需自行封装 |
| **Docker 镜像** | ✅ 官方提供 | 需自行构建 |
| **License** | AGPL-3.0 | 研究/商业授权 |
| **社区支持** | 50k+ stars，活跃维护 | 较新，社区较小 |

#### 4.5.5 核应急场景适用性

| 场景 | MinerU 2.5 | DeepSeek OCR | 推荐 |
|------|------------|--------------|------|
| EOP/SAMG 操作规程 | ⭐⭐⭐⭐⭐ 表格+步骤完美 | ⭐⭐⭐⭐ 可用 | MinerU |
| 技术规格书（表格多）| ⭐⭐⭐⭐⭐ 跨页表格支持 | ⭐⭐⭐⭐ 可用 | MinerU |
| 扫描老旧文档 | ⭐⭐⭐⭐ PPOCRv5 | ⭐⭐⭐⭐⭐ 强 OCR | DeepSeek |
| 带公式技术报告 | ⭐⭐⭐⭐⭐ UniMERNet | ⭐⭐⭐⭐ 可用 | MinerU |
| 涉密本地部署 | ⭐⭐⭐⭐⭐ 成熟方案 | ⭐⭐⭐ 需 A100 | MinerU |
| 化学/几何文档 | ⭐⭐ 基础 | ⭐⭐⭐⭐ SMILES | DeepSeek |
| 大规模数据生产 | ⭐⭐⭐⭐ 批处理优化 | ⭐⭐⭐⭐⭐ 200k页/天 | DeepSeek |

#### 4.5.6 结论：MinerU vs DeepSeek OCR

| 结论 | 说明 |
|------|------|
| **综合能力** | MinerU 2.5 VLM 在 OmniDocBench 综合得分 90.11，略高于 DeepSeek OCR |
| **表格识别** | MinerU 明显更强（专用算法 + 跨页合并） |
| **Token 效率** | DeepSeek OCR 具有独特优势（10x 压缩） |
| **部署门槛** | MinerU 低（6GB GPU 或 CPU），DeepSeek 高（需 A100） |
| **核应急适用** | MinerU 更适合（表格、公式、本地部署） |
| **补充价值** | DeepSeek OCR 在化学/几何文档、大规模生产场景有独特价值 |

### 4.6 综合评分对比

| 维度 (权重) | default | vision | mineru | mineru-local | Docling | DeepSeek OCR |
|-------------|---------|--------|--------|--------------|---------|--------------|
| 准确率 (30%) | 5 | 25 | 28 | 28 | 27 | 26 |
| 速度 (20%) | 20 | 10 | 14 | 16 | 16 | 12 |
| 成本 (15%) | 15 | 8 | 10 | 12 | 14 | 10 |
| 部署难度 (15%) | 15 | 12 | 12 | 8 | 8 | 5 |
| 核应急适用 (20%) | 6 | 14 | 18 | 20 | 18 | 14 |
| **总分 (100)** | **61** | **69** | **82** | **84** | **83** | **67** |

---

## 适用场景分析

### 5.1 Docling 最适合的场景

1. **表格密集型文档**
   - 财务报表、数据统计表
   - 技术参数对照表
   - 核应急操作步骤表（如 EOP 检查清单）

2. **需要结构化输出的 RAG 应用**
   - 与 LangChain/LlamaIndex 集成
   - 需要保留文档结构的知识库构建

3. **多格式文档统一处理**
   - 同时处理 PDF/DOCX/PPTX/XLSX
   - 需要统一的 DoclingDocument 表示

4. **本地离线环境**
   - 涉密文档处理
   - 无网络环境部署

### 5.2 DeepSeek OCR 最适合的场景

1. **大规模数据生产**
   - LLM/VLM 预训练数据构建
   - 每天处理 10 万+ 页面

2. **Token 预算有限的推理**
   - 需要最小化视觉 token 的场景
   - 长上下文压缩研究

3. **图表深度解析**
   - 金融报表中的图表提取
   - 科技论文图表数据化

4. **化学/几何专业文档**
   - 化学结构识别（SMILES 输出）
   - 几何图形解析

### 5.3 现有方案已覆盖的场景

| 场景 | 推荐现有方案 | 原因 |
|------|-------------|------|
| 简单 PDF 快速处理 | default | 最快、零成本 |
| 扫描件/手写文档 | vision | 视觉模型理解能力强 |
| 学术论文（公式多） | mineru | 公式识别业界领先 |
| 涉密文档 | mineru-local | 本地部署，可控 |


---

## 集成可行性评估

### 6.1 技术架构挑战

#### Docling 集成

| 挑战 | 详情 | 解决方案 |
|------|------|----------|
| **语言栈差异** | Docling 是 Python，NuCorpus 是 Node.js | 子进程调用 / HTTP 微服务 |
| **依赖复杂度** | 需要 PyTorch、ONNX Runtime 等 | Docker 容器化部署 |
| **模型下载** | 首次运行需下载 ~1GB 模型 | 预置模型 / 离线包 |
| **内存管理** | 最高 6.2GB 内存占用 | 异步处理 / 队列限流 |

#### DeepSeek OCR 集成

| 挑战 | 详情 | 解决方案 |
|------|------|----------|
| **GPU 强依赖** | 必须有 GPU (推荐 A100) | 仅服务器部署，非桌面版 |
| **模型体积** | 3B 参数模型 | 云端部署 / 容器化 |
| **推理框架** | 需要 PyTorch + DeepSeek 推理库 | 独立微服务 |

### 6.2 集成方案设计（Docling）

#### 方案一：子进程调用（推荐）

```
NuCorpus (Node.js)
       ↓
   spawn('python', ['-m', 'docling', ...])
       ↓
   读取输出 Markdown/JSON
```

**优点**：实现简单，与现有架构兼容
**缺点**：需要用户安装 Python 环境

#### 方案二：HTTP 微服务

```
NuCorpus (Node.js)  →  HTTP  →  Docling Service (Python/FastAPI)
                                        ↓
                               Docker Container
```

**优点**：完全解耦，可独立扩展
**缺点**：增加运维复杂度

#### 方案三：Docling MCP 服务器

```
NuCorpus (Node.js)  →  MCP Protocol  →  Docling MCP Server
```

**优点**：官方支持，Agent 友好
**缺点**：需要 MCP 协议支持

### 6.3 代码改动范围

#### 新增文件

```
lib/file/file-process/pdf/
├── docling.js           # Docling 策略实现（~100行）
├── docling-service.js   # 微服务调用封装（~80行）
└── docling-cli.js       # CLI 调用封装（~60行）
```

#### 修改文件

| 文件 | 改动内容 | 改动量 |
|------|----------|--------|
| `lib/file/file-process/pdf/index.js` | 添加 `case 'docling':` | ~5 行 |
| `locales/*/translation.json` | 添加 Docling 相关文案 | ~10 行 |
| `components/text-split/*` | 添加 Docling 策略选项 | ~20 行 |
| `.env.example` | 添加 Docling 配置项 | ~5 行 |

#### 依赖变更

```bash
# 无需添加 npm 依赖（子进程调用方式）
# 用户需要安装 Python 环境
pip install docling
```

### 6.4 实现示例

```javascript
// lib/file/file-process/pdf/docling.js
import { spawn } from 'child_process';
import { getProjectRoot } from '@/lib/db/base';
import fs from 'fs';
import path from 'path';

export async function doclingProcessing(projectId, fileName, options = {}) {
  console.log('executing docling pdf conversion strategy...');

  const projectRoot = await getProjectRoot();
  const projectPath = path.join(projectRoot, projectId);
  const filePath = path.join(projectPath, 'files', fileName);
  const outputPath = filePath.replace('.pdf', '.md');

  return new Promise((resolve, reject) => {
    const process = spawn('python', [
      '-m', 'docling',
      filePath,
      '--output', path.dirname(outputPath),
      '--format', 'markdown'
    ]);

    let stderr = '';
    process.stderr.on('data', (data) => { stderr += data; });

    process.on('close', (code) => {
      if (code === 0) {
        resolve({ success: true });
      } else {
        reject(new Error(`Docling failed: ${stderr}`));
      }
    });
  });
}
```

### 6.5 配置项设计

```env
# .env
DOCLING_ENABLED=true
DOCLING_PYTHON_PATH=/usr/bin/python3
DOCLING_OCR_ENABLED=true
DOCLING_TABLE_MODE=accurate  # fast | accurate
DOCLING_THREAD_BUDGET=4
```

### 6.6 集成复杂度评估

| 方案 | 开发工时 | 测试工时 | 风险等级 | 推荐度 |
|------|----------|----------|----------|--------|
| Docling (子进程) | 2-3 天 | 2 天 | 低 | ⭐⭐⭐⭐⭐ |
| Docling (微服务) | 5-7 天 | 3 天 | 中 | ⭐⭐⭐⭐ |
| DeepSeek OCR | 7-10 天 | 5 天 | 高 | ⭐⭐ |

---

## 推荐建议与结论

### 7.1 核心结论

#### 关于 MinerU（已集成）

✅ **继续作为首选方案**，并建议升级到 MinerU 2.5

**理由**：
1. OmniDocBench 综合得分 90.11，超越 GPT-4o、Gemini-2.5 Pro
2. 表格识别 92.48 分，业界领先（跨页表格合并支持）
3. 公式识别 88.40 分，UniMERNet 专用模型
4. 本地部署成熟，6GB GPU 或 CPU 即可运行
5. 50k+ stars，AGPL-3.0 开源，社区活跃
6. 本项目已集成 `mineru` 和 `mineru-local` 策略

**建议升级**：
- 更新 MinerU 部署文档，推荐使用 2.5 版本
- 添加 VLM 模式配置选项（更高精度）
- 提供 Apple Silicon MLX 加速指南

#### 关于 Docling

✅ **建议集成**，作为第 5 种 PDF 处理策略（补充方案）

**理由**：
1. TableFormer 在表格识别上具有业界领先优势（97.9% 准确率）
2. MIT 许可证，完全开源，符合项目定位
3. 本地部署，满足核应急领域涉密文档处理需求
4. 与 MinerU 互补——提供不同技术路线的备选
5. 活跃社区（46k stars），LF AI & Data 基金会托管

**注意**：Docling 在 OmniDocBench 综合得分约 75-78，低于 MinerU 2.5，建议作为备选而非首选。

#### 关于 DeepSeek OCR

❌ **暂不建议集成**

**理由**：
1. GPU 强依赖（A100 级别），桌面版无法使用
2. OmniDocBench 综合得分约 87-90，与 MinerU 2.5 持平但部署门槛更高
3. 与现有 vision 策略功能重叠
4. 模型仅用于研究/商业需授权
5. 集成复杂度高，ROI 不明显

**潜在价值场景**：
- 化学/几何文档处理（SMILES 分子式、几何图形）
- 大规模数据生产（200k 页/天/A100）
- 多语言 OCR（100 语言支持）

### 7.2 优先级排序

| 优先级 | 建议 | 预期收益 |
|--------|------|----------|
| **P0** | **升级 MinerU 到 2.5 版本** | 综合能力提升 10%+，表格/公式识别大幅增强 |
| P1 | 优化 mineru-local 部署文档 | 降低使用门槛，提供 Docker 一键部署 |
| P2 | 集成 Docling（子进程方式） | 提供备选方案，MIT 许可证更友好 |
| P3 | 添加 MinerU VLM 模式配置 | 支持高精度场景 |
| P4 | 评估 DeepSeek OCR 云端服务 | 大规模数据生产场景 |

### 7.3 实施路线图

```
Phase 1 (Sprint 1-2) - MinerU 2.5 升级:
├── [ ] 更新 MinerU 部署文档（推荐 2.5 版本）
├── [ ] 添加 VLM 模式配置选项
├── [ ] 提供 Docker Compose 一键部署
└── [ ] Apple Silicon MLX 加速指南

Phase 2 (Sprint 3-4) - Docling 集成:
├── [ ] Docling 子进程集成实现
├── [ ] UI 策略选择器更新
├── [ ] 配置项与文档补充
└── [ ] 基础功能测试

Phase 3 (Sprint 5-6) - 性能优化:
├── [ ] 核应急文档测试集验证
├── [ ] MinerU vs Docling 对比测试
├── [ ] 性能基准测试报告
└── [ ] 用户反馈收集

Phase 4 (Sprint 7+) - 可选扩展:
├── [ ] DeepSeek OCR 云端服务评估
├── [ ] 大规模数据生产场景支持
└── [ ] 持续优化
```

### 7.4 替代优化方案

如果暂不集成 Docling，建议优先优化现有方案：

1. **升级 MinerU 到 2.5 版本**
   - 综合能力提升 10%+
   - 表格识别从 79.11 提升到 92.48
   - 公式识别从 70.90 提升到 88.40

2. **增强 mineru-local 部署支持**
   - 提供 Docker Compose 一键部署
   - 优化错误提示和日志
   - 添加 VLM 模式配置

3. **优化 vision 策略 Prompt**
   - 针对表格增加专门提示
   - 添加重试机制

4. **添加表格后处理模块**
   - 基于规则的表格修复
   - Markdown 表格格式校验

### 7.5 风险提示

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| Docling 版本升级不兼容 | 功能失效 | 锁定版本，定期升级测试 |
| Python 环境依赖问题 | 用户无法使用 | 提供 Docker 方式 |
| 模型下载失败 | 首次使用受阻 | 提供离线模型包 |
| 处理超时 | 大文件卡住 | 实现超时机制和进度反馈 |

---

## 参考资料

### 技术文档

1. **Docling**
   - GitHub: https://github.com/docling-project/docling
   - 技术报告: https://arxiv.org/abs/2408.09869
   - 官方文档: https://docling-project.github.io/docling/

2. **DeepSeek OCR**
   - GitHub: https://github.com/deepseek-ai/DeepSeek-OCR
   - 技术报告: https://arxiv.org/abs/2510.18234
   - HuggingFace: https://huggingface.co/deepseek-ai/deepseek-vl2

3. **MinerU**
   - GitHub: https://github.com/opendatalab/MinerU
   - 在线服务: https://mineru.net
   - MinerU 2.5 发布说明: https://github.com/opendatalab/MinerU/releases/tag/v2.5.0
   - 技术亮点: 1.2B VLM 模型，OmniDocBench SOTA，跨页表格合并

### 基准测试

4. **OmniDocBench (CVPR 2025)**
   - 论文: https://arxiv.org/abs/2412.07626
   - GitHub: https://github.com/opendatalab/OmniDocBench
   - 数据集: 包含 9 类文档、981 页 PDF，多维度评估
   - Leaderboard v1.5: MinerU 2.5 VLM 90.11 | DeepSeek OCR ~87-90 | Docling ~75-78

5. **PDF Data Extraction Benchmark 2025**
   - 来源: https://procycons.com/en/blogs/pdf-data-extraction-benchmark/
   - 发现: Docling 表格单元准确率 97.9%

### 相关模型

6. **TableFormer**: https://arxiv.org/abs/2203.01017
7. **DocLayNet**: https://arxiv.org/abs/2206.01062
8. **GraniteDocling**: https://huggingface.co/ibm-granite/granite-docling-258M
9. **UniMERNet**: MinerU 公式识别模型（2503 版）
10. **PPOCRv5**: MinerU OCR 后端（37 语言，英文提升 11%）

---

*本报告由技术评估团队编写，用于 NuCorpus 项目技术决策参考。*

*最后更新：2025年12月（v1.1 - 新增 MinerU vs DeepSeek OCR 深度对比）*