# MinerU 本地部署指南

本指南帮助您在本地部署 MinerU 服务，以便在 NuCorpus 中使用 `mineru-local` PDF 处理策略。

## 目录

1. [概述](#概述)
2. [系统要求](#系统要求)
3. [部署方式](#部署方式)
4. [Docker 部署（推荐）](#docker-部署推荐)
5. [pip 安装部署](#pip-安装部署)
6. [启动 API 服务](#启动-api-服务)
7. [NuCorpus 配置](#nucorpus-配置)
8. [验证测试](#验证测试)
9. [常见问题](#常见问题)

---

## 概述

MinerU 是 OpenDataLab 开源的文档解析工具，可将 PDF 转换为 Markdown/JSON 格式。

| 版本 | OmniDocBench 得分 | 特点 |
|------|-------------------|------|
| MinerU 2.5 (VLM) | 90.11 | 最高精度，需要 8GB+ GPU |
| MinerU 2.5 (Pipeline) | 82+ | 快速，6GB GPU 或 CPU 可运行 |

**GitHub**: https://github.com/opendatalab/MinerU

---

## 系统要求

### 硬件要求

| 后端模式 | GPU 要求 | 内存要求 | 磁盘空间 |
|----------|----------|----------|----------|
| **Pipeline** | 6GB VRAM 或 CPU | 16GB（推荐 32GB） | 20GB+ |
| **VLM** | 8GB+ VRAM | 8GB | 2GB |

### 软件要求

- **操作系统**: Linux（2019年后发行版）/ Windows / macOS
- **Python**: 3.10 - 3.13
- **Docker**: 20.10+（如使用 Docker 部署）
- **CUDA**: 11.8 / 12.4 / 12.6 / 12.8（如使用 GPU）

---

## 部署方式

| 方式 | 难度 | 适用场景 |
|------|------|----------|
| **Docker 部署** | ⭐ 简单 | 推荐，环境隔离，快速上手 |
| **pip 安装** | ⭐⭐ 中等 | 需要自定义配置 |
| **源码安装** | ⭐⭐⭐ 复杂 | 开发调试 |

---

## Docker 部署（推荐）

### 方式一：使用官方 Docker Compose

```bash
# 1. 克隆仓库
git clone https://github.com/opendatalab/MinerU.git
cd MinerU

# 2. 使用 Docker Compose 启动（包含 API 服务）
docker compose up -d
```

### 方式二：自定义 Docker Compose

创建 `docker-compose.mineru.yml`：

```yaml
version: '3.8'

services:
  mineru-api:
    image: opendatalab/mineru:latest
    container_name: mineru-api
    ports:
      - "8000:8000"
    volumes:
      - ./mineru-data:/data
      - ./mineru-models:/root/.cache/huggingface
    environment:
      - CUDA_VISIBLE_DEVICES=0
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
    command: ["mineru-api", "--host", "0.0.0.0", "--port", "8000"]
    restart: unless-stopped

  # 可选：Gradio WebUI
  mineru-gradio:
    image: opendatalab/mineru:latest
    container_name: mineru-gradio
    ports:
      - "7860:7860"
    volumes:
      - ./mineru-data:/data
      - ./mineru-models:/root/.cache/huggingface
    environment:
      - CUDA_VISIBLE_DEVICES=0
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
    command: ["mineru-gradio", "--host", "0.0.0.0", "--port", "7860"]
    restart: unless-stopped
```

启动服务：

```bash
docker compose -f docker-compose.mineru.yml up -d
```

### 方式三：CPU 模式 Docker

如果没有 GPU，可以使用 CPU 模式：

```yaml
version: '3.8'

services:
  mineru-api:
    image: opendatalab/mineru:latest
    container_name: mineru-api
    ports:
      - "8000:8000"
    volumes:
      - ./mineru-data:/data
      - ./mineru-models:/root/.cache/huggingface
    environment:
      - MINERU_DEVICE=cpu
    command: ["mineru-api", "--host", "0.0.0.0", "--port", "8000"]
    restart: unless-stopped
```


---

## 启动 API 服务

### 命令行启动

```bash
# 启动 API 服务（默认端口 8000）
mineru-api --host 0.0.0.0 --port 8000

# 或使用 Gradio WebUI（端口 7860）
mineru-gradio --host 0.0.0.0 --port 7860
```

### 后台运行

```bash
# 使用 nohup
nohup mineru-api --host 0.0.0.0 --port 8000 > mineru.log 2>&1 &

# 或使用 screen
screen -S mineru
mineru-api --host 0.0.0.0 --port 8000
# Ctrl+A, D 退出 screen
```

### 验证服务

```bash
# 检查服务状态
curl http://localhost:8000/

# 应该返回 API 信息
```

---

## NuCorpus 配置

### 步骤 1：确认 MinerU 服务运行

```bash
# 确认服务可访问
curl http://localhost:8000/file_parse
```

### 步骤 2：在 NuCorpus 中配置

1. 打开 NuCorpus 项目
2. 进入 **项目设置** → **PDF 文件转换配置**
3. 填写 **MinerU Local URL**：
   - 本地部署：`http://localhost:8000`
   - Docker 部署：`http://localhost:8000`
   - 远程服务器：`http://your-server-ip:8000`

### 步骤 3：选择处理策略

上传 PDF 时，选择 `mineru-local` 作为 PDF 处理策略。

---

## 验证测试

### 测试 API 接口

```bash
# 上传 PDF 测试
curl -X POST http://localhost:8000/file_parse \
  -F "files=@test.pdf" \
  -o result.json

# 查看结果
cat result.json | jq '.results | keys'
```

### 预期响应格式

```json
{
  "results": {
    "test.pdf": {
      "md_content": "# 文档标题\n\n这是解析后的 Markdown 内容...",
      "content_list": [...],
      "middle_json": {...}
    }
  }
}
```

---

## 常见问题

### Q1: 模型下载失败

```bash
# 使用国内镜像
export HF_ENDPOINT=https://hf-mirror.com
mineru-api --host 0.0.0.0 --port 8000
```

### Q2: GPU 内存不足

```bash
# 使用 CPU 模式
export MINERU_DEVICE=cpu
mineru-api --host 0.0.0.0 --port 8000

# 或使用 Pipeline 模式（VLM 模式更耗内存）
mineru -p input.pdf -o output/ --backend pipeline
```

### Q3: Docker 无法使用 GPU

```bash
# 安装 NVIDIA Container Toolkit
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add -
curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list
sudo apt-get update && sudo apt-get install -y nvidia-container-toolkit
sudo systemctl restart docker
```

### Q4: 连接被拒绝

```bash
# 检查服务是否运行
docker ps | grep mineru
# 或
ps aux | grep mineru

# 检查端口
netstat -tlnp | grep 8000
```

### Q5: macOS Apple Silicon 加速

```bash
# MinerU 2.5 支持 MLX 加速
uv pip install -U "mineru[core,mlx]"
mineru-api --host 0.0.0.0 --port 8000 --backend vlm-mlx-engine
```

---

## 参考链接

- **MinerU GitHub**: https://github.com/opendatalab/MinerU
- **官方文档**: https://opendatalab.github.io/MinerU/
- **在线体验**: https://mineru.net
- **HuggingFace Demo**: https://huggingface.co/spaces/opendatalab/MinerU
- **ModelScope Demo**: https://modelscope.cn/studios/OpenDataLab/MinerU

---

*最后更新：2025年12月*
