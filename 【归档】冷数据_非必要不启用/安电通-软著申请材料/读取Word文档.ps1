# 安电通软著申请材料 - Word文档读取脚本
# 用途：读取Word文档内容并保存为文本文件

$wordApp = New-Object -ComObject Word.Application
$wordApp.Visible = $false

$files = @(
    "（新）系统升级软件著作权新系统信息采集表模板.doc",
    "编码器与称重模块擦窗机监测软件说明.doc",
    "【修改】编码器与称重模块擦窗机监测控制软件-源代码.docx",
    "专利技术交底书(样板-结构） 上海云沪.doc"
)

$folderPath = "c:\Users\21389\Downloads\andt1\12259\安电通-软著申请材料"
$outputFolder = Join-Path $folderPath "提取内容"

if (-not (Test-Path $outputFolder)) {
    New-Item -ItemType Directory -Path $outputFolder | Out-Null
}

foreach ($file in $files) {
    $filePath = Join-Path $folderPath $file
    
    if (Test-Path $filePath) {
        Write-Host "正在读取: $file" -ForegroundColor Green
        
        try {
            $doc = $wordApp.Documents.Open($filePath)
            $content = $doc.Content.Text
            
            $outputFile = Join-Path $outputFolder ($file -replace '\.(doc|docx)$', '.txt')
            $content | Out-File -FilePath $outputFile -Encoding UTF8
            
            Write-Host "  ✓ 已保存到: $outputFile" -ForegroundColor Cyan
            
            $doc.Close($false)
        }
        catch {
            Write-Host "  ✗ 读取失败: $_" -ForegroundColor Red
        }
    }
    else {
        Write-Host "文件不存在: $file" -ForegroundColor Yellow
    }
}

$wordApp.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($wordApp) | Out-Null

Write-Host "`n完成！所有文件已提取到: $outputFolder" -ForegroundColor Green
Write-Host "请查看提取内容文件夹中的 .txt 文件" -ForegroundColor Yellow
