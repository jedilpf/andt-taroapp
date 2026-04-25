# 安电通后端服务启动脚本
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "安电通后端服务启动脚本" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

$baseDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# 启动用户服务
Write-Host ""
Write-Host "[1/3] 正在启动用户服务 (端口: 8081)..." -ForegroundColor Green
$proc1 = Start-Process -FilePath "java" -ArgumentList "-jar", "$baseDir\backend\andt-user\target\andt-user-1.0.0.jar", "--server.port=8081" -WindowStyle Normal -PassThru

# 等待一下再启动下一个服务
Start-Sleep -Seconds 5

# 启动订单服务
Write-Host "[2/3] 正在启动订单服务 (端口: 8082)..." -ForegroundColor Green
$proc2 = Start-Process -FilePath "java" -ArgumentList "-jar", "$baseDir\backend\andt-order\target\andt-order-1.0.0.jar", "--server.port=8082" -WindowStyle Normal -PassThru

Start-Sleep -Seconds 5

# 启动检测服务
Write-Host "[3/3] 正在启动检测服务 (端口: 8083)..." -ForegroundColor Green
$proc3 = Start-Process -FilePath "java" -ArgumentList "-jar", "$baseDir\backend\andt-inspection\target\andt-inspection-1.0.0.jar", "--server.port=8083" -WindowStyle Normal -PassThru

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "所有后端服务启动完成！" -ForegroundColor Green
Write-Host "用户服务: http://localhost:8081" -ForegroundColor Yellow
Write-Host "订单服务: http://localhost:8082" -ForegroundColor Yellow
Write-Host "检测服务: http://localhost:8083" -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "按任意键停止所有服务..." -ForegroundColor Magenta
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# 停止所有Java进程
Write-Host "正在停止所有服务..." -ForegroundColor Red
Stop-Process -Id $proc1.Id -Force -ErrorAction SilentlyContinue
Stop-Process -Id $proc2.Id -Force -ErrorAction SilentlyContinue
Stop-Process -Id $proc3.Id -Force -ErrorAction SilentlyContinue
Write-Host "所有服务已停止。" -ForegroundColor Green
