@echo off
chcp 65001 >nul
echo ============================================
echo 安电通后端服务启动脚本
echo ============================================

:: 启动用户服务
echo.
echo [1/3] 正在启动用户服务 (端口: 8081)...
start "安电通-用户服务" cmd /c "cd /d %~dp0backend\andt-user\target && java -jar andt-user-1.0.0.jar --server.port=8081"

:: 等待一下再启动下一个服务
timeout /t 5 /nobreak >nul

:: 启动订单服务
echo [2/3] 正在启动订单服务 (端口: 8082)...
start "安电通-订单服务" cmd /c "cd /d %~dp0backend\andt-order\target && java -jar andt-order-1.0.0.jar --server.port=8082"

timeout /t 5 /nobreak >nul

:: 启动检测服务
echo [3/3] 正在启动检测服务 (端口: 8083)...
start "安电通-检测服务" cmd /c "cd /d %~dp0backend\andt-inspection\target && java -jar andt-inspection-1.0.0.jar --server.port=8083"

echo.
echo ============================================
echo 所有后端服务启动完成！
echo 用户服务: http://localhost:8081
echo 订单服务: http://localhost:8082
echo 检测服务: http://localhost:8083
echo ============================================
echo.
echo 按任意键关闭所有服务窗口...
pause >nul

:: 关闭所有Java进程
taskkill /F /IM java.exe 2>nul
echo 所有服务已停止。
