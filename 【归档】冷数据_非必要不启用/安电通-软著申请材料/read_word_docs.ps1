# Read Word Documents Script
# Purpose: Extract content from Word documents

$wordApp = New-Object -ComObject Word.Application
$wordApp.Visible = $false

$folderPath = "c:\Users\21389\Downloads\andt1\12259\安电通-软著申请材料"
$outputFolder = "c:\Users\21389\Downloads\andt1\12259\extracted_content"

if (-not (Test-Path $outputFolder)) {
    New-Item -ItemType Directory -Path $outputFolder | Out-Null
}

$files = Get-ChildItem -Path $folderPath -Filter "*.doc*" | Where-Object { $_.Name -like "*模板*" -or $_.Name -like "*说明*" -or $_.Name -like "*源代码*" -or $_.Name -like "*交底书*" }

foreach ($file in $files) {
    Write-Host "Reading: $($file.Name)" -ForegroundColor Green
    
    try {
        $doc = $wordApp.Documents.Open($file.FullName)
        $content = $doc.Content.Text
        
        $outputName = [System.IO.Path]::ChangeExtension($file.Name, ".txt")
        $outputFile = Join-Path $outputFolder $outputName
        
        # Remove invalid characters from filename
        $outputFile = $outputFile -replace '[\[\]]', ''
        
        [System.IO.File]::WriteAllText($outputFile, $content, [System.Text.Encoding]::UTF8)
        
        Write-Host "  Saved to: $outputFile" -ForegroundColor Cyan
        
        $doc.Close($false)
    }
    catch {
        Write-Host "  Error: $_" -ForegroundColor Red
    }
}

$wordApp.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($wordApp) | Out-Null

Write-Host "`nDone! Files saved to: $outputFolder" -ForegroundColor Green

# List extracted files
Get-ChildItem -Path $outputFolder -Filter "*.txt" | ForEach-Object {
    Write-Host "  - $($_.Name)" -ForegroundColor Yellow
}
