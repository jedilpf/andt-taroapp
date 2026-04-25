# 安电通商业计划书 - 阿里云OSS自动部署脚本 (PowerShell版)
# 使用方法: .\deploy-to-oss.ps1 -AccessKeyId "your-key" -AccessKeySecret "your-secret" -BucketName "andiantong-bp"

param(
    [Parameter(Mandatory=$true)]
    [string]$AccessKeyId,
    
    [Parameter(Mandatory=$true)]
    [string]$AccessKeySecret,
    
    [string]$BucketName = "andiantong-bp",
    [string]$Endpoint = "oss-cn-hangzhou.aliyuncs.com",
    [string]$SourceDir = ".\汇报材料",
    [switch]$ConfigureStaticWebsite
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  安电通商业计划书 - OSS自动部署工具" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查 ossutil 是否安装
function Check-Ossutil {
    $ossutilPath = "ossutil64.exe"
    if (-not (Test-Path $ossutilPath)) {
        Write-Host "[1/5] 正在下载 ossutil..." -ForegroundColor Yellow
        try {
            Invoke-WebRequest -Uri "http://gosspublic.alicdn.com/ossutil/1.7.15/ossutil64.zip" -OutFile "ossutil64.zip"
            Expand-Archive -Path "ossutil64.zip" -DestinationPath "." -Force
            Remove-Item "ossutil64.zip"
            Write-Host "      ✓ ossutil 下载完成" -ForegroundColor Green
        } catch {
            Write-Host "      ✗ 下载失败，请手动下载: http://gosspublic.alicdn.com/ossutil/1.7.15/ossutil64.exe" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "[1/5] ossutil 已安装" -ForegroundColor Green
    }
}

# 配置 ossutil
function Configure-Ossutil {
    Write-Host "[2/5] 正在配置 ossutil..." -ForegroundColor Yellow
    
    $configContent = @"
[Credentials]
language=CH
accessKeyID=$AccessKeyId
accessKeySecret=$AccessKeySecret
endpoint=$Endpoint
"@
    
    $configPath = "$env:USERPROFILE\.ossutilconfig"
    $configContent | Out-File -FilePath $configPath -Encoding UTF8
    
    Write-Host "      ✓ 配置完成" -ForegroundColor Green
}

# 检查Bucket是否存在，不存在则创建
function Ensure-Bucket {
    Write-Host "[3/5] 检查 Bucket: $BucketName..." -ForegroundColor Yellow
    
    $result = & .\ossutil64.exe ls oss://$BucketName 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "      Bucket 不存在，正在创建..." -ForegroundColor Yellow
        & .\ossutil64.exe mb oss://$BucketName --acl public-read
        if ($LASTEXITCODE -eq 0) {
            Write-Host "      ✓ Bucket 创建成功" -ForegroundColor Green
        } else {
            Write-Host "      ✗ Bucket 创建失败" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "      ✓ Bucket 已存在" -ForegroundColor Green
    }
}

# 上传文件
function Upload-Files {
    Write-Host "[4/5] 正在上传文件到 OSS..." -ForegroundColor Yellow
    Write-Host "      源目录: $SourceDir" -ForegroundColor Gray
    Write-Host "      目标: oss://$BucketName/" -ForegroundColor Gray
    
    if (-not (Test-Path $SourceDir)) {
        Write-Host "      ✗ 源目录不存在: $SourceDir" -ForegroundColor Red
        exit 1
    }
    
    # 上传文件
    & .\ossutil64.exe cp -r $SourceDir oss://$BucketName/ --force
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "      ✓ 文件上传完成" -ForegroundColor Green
    } else {
        Write-Host "      ✗ 上传失败" -ForegroundColor Red
        exit 1
    }
}

# 设置静态网站托管
function Set-StaticWebsite {
    if (-not $ConfigureStaticWebsite) {
        return
    }
    
    Write-Host "[5/5] 正在配置静态网站托管..." -ForegroundColor Yellow
    
    # 使用阿里云CLI或API配置静态网站托管
    # 注意：ossutil 不直接支持设置静态网站托管，需要通过控制台或API设置
    
    Write-Host "      ⚠ 请手动在OSS控制台完成以下配置:" -ForegroundColor Yellow
    Write-Host "        1. 进入 Bucket -> 基础设置 -> 静态页面" -ForegroundColor White
    Write-Host "        2. 默认首页: 安电通商业计划书-完整版.html" -ForegroundColor White
    Write-Host "        3. 点击保存" -ForegroundColor White
}

# 显示访问链接
function Show-AccessUrls {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  部署完成！访问地址:" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  完整版:"
    Write-Host "  http://$BucketName.$Endpoint/安电通商业计划书-完整版.html" -ForegroundColor Green
    Write-Host ""
    Write-Host "  简约版:"
    Write-Host "  http://$BucketName.$Endpoint/安电通商业计划书-简约版.html" -ForegroundColor Green
    Write-Host ""
    Write-Host "  演示版:"
    Write-Host "  http://$BucketName.$Endpoint/安电通项目提案-演示版.html" -ForegroundColor Green
    Write-Host ""
    Write-Host "  投资人版:"
    Write-Host "  http://$BucketName.$Endpoint/安电通-投资人汇报版.html" -ForegroundColor Green
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "💡 提示:" -ForegroundColor Yellow
    Write-Host "   - 建议绑定自定义域名并开启HTTPS" -ForegroundColor White
    Write-Host "   - 可在OSS控制台设置Referer防盗链" -ForegroundColor White
    Write-Host "   - 如需CDN加速，请在CDN控制台配置" -ForegroundColor White
}

# 主函数
function Main {
    Check-Ossutil
    Configure-Ossutil
    Ensure-Bucket
    Upload-Files
    Set-StaticWebsite
    Show-AccessUrls
}

# 执行
Main
