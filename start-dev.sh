#!/bin/bash

# 定义颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 打印带时间戳的日志
log() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} $1"
}

# 错误日志
error() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} ${RED}ERROR:${NC} $1"
}

# 警告日志
warn() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} ${YELLOW}WARN:${NC} $1"
}

# 成功日志
success() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} ${GREEN}SUCCESS:${NC} $1"
}

# 端口号
PORT=1717
MINERU_PORT=8022
MINERU_PATH="/Volumes/acasis/MinerU"
CONDA_PATH="/Volumes/acasis/miniconda3/miniconda3"

# 清理端口函数
cleanup_port() {
    local TARGET_PORT=$1
    local PID=$(lsof -ti:$TARGET_PORT)

    if [ -n "$PID" ]; then
        warn "端口 $TARGET_PORT 被占用 (PID: $PID)，正在清理..."
        kill -9 $PID > /dev/null 2>&1
        success "端口 $TARGET_PORT 已释放"
    else
        log "端口 $TARGET_PORT 空闲，准备启动..."
    fi
}

# 启动 MinerU API 服务
start_mineru() {
    local MINERU_PID=$(lsof -ti:$MINERU_PORT)

    if [ -n "$MINERU_PID" ]; then
        success "MinerU API 已在运行 (PID: $MINERU_PID, 端口: $MINERU_PORT)"
    else
        log "正在启动 MinerU API 服务..."

        # 检查 MinerU 目录是否存在
        if [ ! -d "$MINERU_PATH" ]; then
            warn "MinerU 目录不存在: $MINERU_PATH，跳过 MinerU 启动"
            return
        fi

        # 检查 conda 环境是否存在
        if [ ! -d "$CONDA_PATH/envs/mineru" ]; then
            warn "Conda mineru 环境不存在，跳过 MinerU 启动"
            return
        fi

        # 后台启动 MinerU API
        (
            source "$CONDA_PATH/bin/activate" mineru
            cd "$MINERU_PATH"
            nohup mineru-api --host 0.0.0.0 --port $MINERU_PORT > "$MINERU_PATH/mineru.log" 2>&1 &
        )

        # 等待服务启动
        sleep 3

        local NEW_PID=$(lsof -ti:$MINERU_PORT)
        if [ -n "$NEW_PID" ]; then
            success "MinerU API 启动成功 (PID: $NEW_PID, 端口: $MINERU_PORT)"
        else
            warn "MinerU API 启动可能需要更长时间，请稍后检查"
        fi
    fi
}

# 退出处理
cleanup() {
    echo ""
    log "收到停止信号，正在优雅关闭..."
    
    # 杀掉所有子进程
    if [ -n "$SERVER_PID" ]; then
        kill $SERVER_PID > /dev/null 2>&1
    fi
    
    # 再次确保端口释放
    cleanup_port $PORT
    
    success "NuCorpus 开发服务已完全停止，再见！👋"
    exit 0
}

# 注册中断信号捕获 (Ctrl+C)
trap cleanup INT TERM

# 清屏
clear

# 打印 Banner
echo -e "${CYAN}"
echo "  _   _        _____                                "
echo " | \ | |      / ____|                               "
echo " |  \| |_   _| |     ___  _ __ _ __  _   _ ___      "
echo " | . \` | | | | |    / _ \| '__| '_ \| | | / __|     "
echo " | |\  | |_| | |___| (_) | |  | |_) | |_| \__ \     "
echo " |_| \_|\__,_|\_____\___/|_|  | .__/ \__,_|___/     "
echo "                              | |                   "
echo "                              |_|                   "
echo -e "${NC}"
echo -e "${YELLOW}>>> 面向核应急领域的大模型数据集构造工具 <<<${NC}"
echo ""

# 1. 检查环境
log "正在检查运行环境..."

# 2. 启动 MinerU API 服务
start_mineru

# 3. 清理端口
cleanup_port $PORT

# 4. 启动开发服务器
echo ""
success "系统检查完毕，正在启动引擎..."
echo -e "${GREEN}-----------------------------------------------------${NC}"
echo -e "${CYAN}NuCorpus:  http://localhost:$PORT${NC}"
echo -e "${CYAN}MinerU API: http://localhost:$MINERU_PORT${NC}"
echo -e "${GREEN}-----------------------------------------------------${NC}"

# 启动 pnpm dev 放入后台，并记录 PID
pnpm dev &
SERVER_PID=$!

# 等待子进程结束
wait $SERVER_PID
