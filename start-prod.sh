#!/bin/bash

# 定义颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# 端口配置
PORT=1717
MINERU_PORT=8022
MINERU_PATH="/Volumes/acasis/MinerU"
CONDA_PATH="/Volumes/acasis/miniconda3/miniconda3"

# 日志函数
log() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} $1"
}

warn() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} ${YELLOW}WARN:${NC} $1"
}

success() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} ${GREEN}SUCCESS:${NC} $1"
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

echo -e "${CYAN}>>> NuCorpus 生产模式启动 (全量编译) <<<${NC}"
echo -e "${BLUE}注意：此模式下，所有页面会在启动前一次性编译完成。${NC}"
echo -e "${BLUE}      启动时间较长，但启动后页面访问速度极快。${NC}"
echo -e "${RED}警告：不支持热更新 (Hot Reload)。修改代码后需要重启脚本才能生效。${NC}"
echo ""

# 1. 启动 MinerU API 服务
start_mineru

# 2. 执行构建 (这一步会花费较长时间)
echo -e "${GREEN}[1/2] 正在全量编译项目 (Build)... 这可能需要几分钟${NC}"
# 使用 package.json 中的 build 命令
pnpm build

if [ $? -ne 0 ]; then
    echo -e "${RED}编译失败，请检查错误日志。${NC}"
    exit 1
fi

echo -e "${GREEN}[2/2] 编译完成，正在启动高性能服务...${NC}"
echo ""
echo -e "${GREEN}-----------------------------------------------------${NC}"
echo -e "${CYAN}NuCorpus:   http://localhost:$PORT${NC}"
echo -e "${CYAN}MinerU API: http://localhost:$MINERU_PORT${NC}"
echo -e "${GREEN}-----------------------------------------------------${NC}"
echo ""

# 3. 启动生产服务
pnpm start
