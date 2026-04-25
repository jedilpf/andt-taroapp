#!/bin/bash

echo "=========================================="
echo "安电通开发环境启动脚本"
echo "=========================================="
echo ""

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# 检查MySQL是否运行
echo "[1/4] 检查MySQL服务..."
if ! pgrep -x "mysqld" > /dev/null; then
    echo "[警告] MySQL服务未运行，请先启动MySQL"
    exit 1
fi
echo "[OK] MySQL服务正在运行"
echo ""

# 初始化数据库
echo "[2/4] 初始化数据库..."
cd "$SCRIPT_DIR/backend"
mysql -u root -proot < database/init.sql 2>/dev/null || echo "[警告] 数据库初始化可能需要手动执行"
echo "[OK] 数据库初始化完成"
echo ""

# 启动后端服务
echo "[3/4] 启动后端服务..."
cd "$SCRIPT_DIR/backend"

# 用户服务
cd andt-user
mvn spring-boot:run &
USER_PID=$!
echo "用户服务PID: $USER_PID"

sleep 5

# 检测服务
cd ../andt-inspection
mvn spring-boot:run &
INSPECTION_PID=$!
echo "检测服务PID: $INSPECTION_PID"

echo "[OK] 后端服务启动中..."
echo ""

# 启动前端
echo "[4/4] 启动前端开发服务器..."
cd "$SCRIPT_DIR/taro-app"
npm run dev:h5 &
FRONTEND_PID=$!
echo "前端服务PID: $FRONTEND_PID"

echo "[OK] 前端服务启动中..."
echo ""

echo "=========================================="
echo "所有服务启动中..."
echo "- 用户服务: http://localhost:8081"
echo "- 检测服务: http://localhost:8082"
echo "- 前端H5:  http://localhost:10086"
echo "=========================================="
echo ""
echo "按Ctrl+C停止所有服务"

# 等待用户中断
trap "kill $USER_PID $INSPECTION_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait
