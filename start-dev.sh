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

# 2. 清理端口
cleanup_port $PORT

# 3. 启动开发服务器
echo ""
success "系统检查完毕，正在启动引擎..."
echo -e "${GREEN}-----------------------------------------------------${NC}"
echo -e "${CYAN}访问地址: http://localhost:$PORT${NC}"
echo -e "${GREEN}-----------------------------------------------------${NC}"

# 启动 pnpm dev 放入后台，并记录 PID
pnpm dev &
SERVER_PID=$!

# 等待子进程结束
wait $SERVER_PID
