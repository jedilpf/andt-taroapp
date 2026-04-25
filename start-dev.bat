@echo off
chcp 65001 >nul
echo ==========================================
echo 安电通开发环境启动脚本
echo ==========================================
echo.

REM 检查MySQL是否运行
echo [1/4] 检查MySQL服务...
tasklist | findstr "mysqld" >nul
if %errorlevel% neq 0 (
    echo [警告] MySQL服务未运行，请先启动MySQL
    pause
    exit /b 1
)
echo [OK] MySQL服务正在运行
echo.

REM 初始化数据库
echo [2/4] 初始化数据库...
cd /d "%~dp0backend"
mysql -u root -proot < database/init.sql 2>nul
if %errorlevel% neq 0 (
    echo [警告] 数据库初始化可能需要手动执行
    echo 请运行: mysql -u root -p < backend/database/init.sql
)
echo [OK] 数据库初始化完成
echo.

REM 启动后端服务
echo [3/4] 启动后端服务...
start "后端-用户服务" cmd /k "cd andt-user && mvn spring-boot:run"
timeout /t 5 /nobreak >nul
start "后端-检测服务" cmd /k "cd andt-inspection && mvn spring-boot:run"
echo [OK] 后端服务启动中...
echo.

REM 启动前端
echo [4/4] 启动前端开发服务器...
cd /d "%~dp0taro-app"
start "前端-H5" cmd /k "npm run dev:h5"
echo [OK] 前端服务启动中...
echo.

echo ==========================================
echo 所有服务启动中...
echo - 用户服务: http://localhost:8081
echo - 检测服务: http://localhost:8082
echo - 前端H5:  http://localhost:10086
echo ==========================================
pause
