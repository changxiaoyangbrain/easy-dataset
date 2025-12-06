#!/bin/bash

# 定义颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}>>> NuCorpus 生产模式启动 (全量编译) <<<${NC}"
echo -e "${BLUE}注意：此模式下，所有页面会在启动前一次性编译完成。${NC}"
echo -e "${BLUE}      启动时间较长，但启动后页面访问速度极快。${NC}"
echo -e "${RED}警告：不支持热更新 (Hot Reload)。修改代码后需要重启脚本才能生效。${NC}"
echo ""

# 1. 执行构建 (这一步会花费较长时间)
echo -e "${GREEN}[1/2] 正在全量编译项目 (Build)... 这可能需要几分钟${NC}"
# 使用 package.json 中的 build 命令
pnpm build

if [ $? -ne 0 ]; then
    echo -e "${RED}编译失败，请检查错误日志。${NC}"
    exit 1
fi

echo -e "${GREEN}[2/2] 编译完成，正在启动高性能服务...${NC}"
echo ""
echo -e "${CYAN}访问地址: http://localhost:1717${NC}"
echo ""

# 2. 启动生产服务
pnpm start
