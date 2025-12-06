# MinerU Local 配置指南

本指南介绍如何在 macOS (Apple Silicon) 上部署 MinerU 本地服务，并配置 NuCorpus 使用 `mineru-local` 策略处理 PDF 文件。

## 系统要求

| 项目 | 要求 |
|------|------|
| **操作系统** | macOS (Apple Silicon M1/M2/M3/M4) |
| **Python** | 3.10 - 3.13 |
| **内存** | 建议 16GB+ |
| **磁盘** | 约 5GB（模型文件） |

## 一、安装 MinerU

### 1.1 下载 MinerU 源码

```bash
cd /Volumes/acasis
git clone https://github.com/opendatalab/MinerU.git
cd MinerU
```

### 1.2 创建 Conda 环境

```bash
# 创建 Python 3.11 环境
conda create -n mineru python=3.11 -y

# 激活环境
conda activate mineru
```

### 1.3 安装 MinerU + MLX 加速

```bash
# 安装 uv（更快的包管理器）
pip install uv

# 安装 MinerU 及 MLX 加速支持
cd /Volumes/acasis/MinerU
uv pip install -e ".[core,mlx]"
```

> **说明**：`mlx` 是 Apple 专为 Apple Silicon 优化的机器学习框架，可显著提升推理速度。

## 二、启动 MinerU API 服务

### 2.1 前台启动（调试用）

```bash
conda activate mineru
mineru-api --host 0.0.0.0 --port 8022
```

### 2.2 后台启动（生产用）

```bash
conda activate mineru
cd /Volumes/acasis/MinerU
nohup mineru-api --host 0.0.0.0 --port 8022 > mineru.log 2>&1 &
```

### 2.3 验证服务

```bash
# 检查服务状态
curl -s http://localhost:8022/docs | head -5

# 查看 API 端点
curl -s http://localhost:8022/openapi.json | python3 -c "import sys,json; d=json.load(sys.stdin); print(list(d.get('paths',{}).keys()))"
```

预期输出：`['/file_parse']`

## 三、配置 NuCorpus

### 3.1 项目设置

1. 打开 NuCorpus 项目
2. 进入「项目设置」页面
3. 找到「PDF 文件转换配置」区域
4. 设置 **MinerU Local URL**: `http://localhost:8022`
5. 选择策略：**mineru-local**

### 3.2 配置文件位置

配置保存在项目目录的 `task-config.json` 中：

```json
{
  "minerULocalUrl": "http://localhost:8022"
}
```

## 四、服务管理

### 4.1 自动启动（推荐）

NuCorpus 的启动脚本已集成 MinerU 自动启动功能：

```bash
# 开发模式（自动启动 MinerU）
./start-dev.sh

# 生产模式（自动启动 MinerU）
./start-prod.sh
```

启动脚本会自动：
1. 检测 MinerU 是否已在运行
2. 如果未运行，自动启动 MinerU API（端口 8022）
3. 启动 NuCorpus 服务（端口 1717）

### 4.2 手动管理命令

```bash
# 手动启动服务
conda activate mineru && mineru-api --host 0.0.0.0 --port 8022

# 查看日志
tail -f /Volumes/acasis/MinerU/mineru.log

# 停止服务
pkill -f "mineru-api"

# 查看服务进程
ps aux | grep mineru-api
```

### 4.3 开机自启（可选）

创建 `~/Library/LaunchAgents/com.mineru.api.plist`：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.mineru.api</string>
    <key>ProgramArguments</key>
    <array>
        <string>/bin/bash</string>
        <string>-c</string>
        <string>source /Volumes/acasis/miniconda3/miniconda3/bin/activate mineru && mineru-api --host 0.0.0.0 --port 8022</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/Volumes/acasis/MinerU/mineru.log</string>
    <key>StandardErrorPath</key>
    <string>/Volumes/acasis/MinerU/mineru.log</string>
</dict>
</plist>
```

加载服务：

```bash
launchctl load ~/Library/LaunchAgents/com.mineru.api.plist
```

## 五、常见问题

### Q1: 首次运行下载模型很慢？

MinerU 首次运行会从 HuggingFace 下载模型（约 2-3GB）。可设置镜像：

```bash
export HF_ENDPOINT=https://hf-mirror.com
```

### Q2: 端口被占用？

```bash
# 查看端口占用
lsof -i :8022

# 换用其他端口
mineru-api --host 0.0.0.0 --port 8023
```

### Q3: 内存不足？

MinerU 默认使用 `pipeline` 后端，内存占用约 4-6GB。如使用 `vlm` 后端，需要 8GB+ 显存/统一内存。

## 六、API 参考

### 端点：POST /file_parse

NuCorpus 调用此端点解析 PDF 文件。

**请求**：
- Content-Type: `multipart/form-data`
- 参数：`files` (PDF 文件)

**响应**：
```json
{
  "results": {
    "filename.pdf": {
      "md_content": "# 文档标题\n\n正文内容...",
      "content_list": [...]
    }
  }
}
```

## 七、版本信息

| 组件 | 版本 |
|------|------|
| MinerU | 2.6.6 |
| Python | 3.11.14 |
| MLX | 0.30.0 |
| Torch | 2.9.1 |

---

**文档更新日期**：2025-12-06

