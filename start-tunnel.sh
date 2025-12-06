#!/bin/bash
# NuCorpus Cloudflare Tunnel 启动脚本
# 用于稳定运行 cloudflared 隧道

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="$SCRIPT_DIR/cloudflared-config.yml"
LOG_FILE="$SCRIPT_DIR/logs/cloudflared.log"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║           NuCorpus Cloudflare Tunnel 启动器               ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"

# 创建日志目录
mkdir -p "$SCRIPT_DIR/logs"

# 检查 cloudflared 是否安装
if ! command -v cloudflared &> /dev/null; then
    echo -e "${RED}错误: cloudflared 未安装${NC}"
    echo "请运行以下命令安装:"
    echo "  brew install cloudflare/cloudflare/cloudflared"
    exit 1
fi

# 检查配置文件
if [ ! -f "$CONFIG_FILE" ]; then
    echo -e "${YELLOW}警告: 配置文件不存在: $CONFIG_FILE${NC}"
    echo "将使用默认 token 方式运行"
fi

# Token（从环境变量或硬编码）
# 建议使用环境变量: export CLOUDFLARED_TOKEN="your-token"
# 连接器 ID: a5f99b4c-35eb-4507-9c7a-ae1d1330595e
TUNNEL_TOKEN="${CLOUDFLARED_TOKEN:-eyJhIjoiMjRlMmNhOTU3ODgwNGU0OGNiNjI0NTczNGJhMDQ0ZDUiLCJ0IjoiNmUxMzE5MmItNTAwNi00NWQ3LTllNWEtM2UyNDI3ZmJhYTE5IiwicyI6Ik1XRmlOekEzWmpJdE1qUm1OQzAwWkRJeUxXRm1aR1F0WVRkalpXTmtaV015T1RRdyJ9}"

echo -e "\n${YELLOW}隧道配置:${NC}"
echo "  配置文件: $CONFIG_FILE"
echo "  日志文件: $LOG_FILE"
echo "  协议: http2 (更稳定)"
echo ""

# 优雅关闭处理
cleanup() {
    echo -e "\n${YELLOW}正在关闭隧道...${NC}"
    kill $TUNNEL_PID 2>/dev/null || true
    echo -e "${GREEN}隧道已关闭${NC}"
    exit 0
}
trap cleanup SIGINT SIGTERM

# 启动隧道
echo -e "${GREEN}启动 Cloudflare Tunnel...${NC}"
echo "-----------------------------------------------------"

# 使用 token 方式运行（推荐用于远程配置的隧道）
# 添加 --protocol http2 强制使用更稳定的 HTTP/2 协议
cloudflared tunnel run \
    --protocol http2 \
    --token "$TUNNEL_TOKEN" \
    2>&1 | tee -a "$LOG_FILE" &

TUNNEL_PID=$!

echo -e "\n${GREEN}隧道已启动 (PID: $TUNNEL_PID)${NC}"
echo -e "按 Ctrl+C 停止隧道"

# 等待隧道进程
wait $TUNNEL_PID
