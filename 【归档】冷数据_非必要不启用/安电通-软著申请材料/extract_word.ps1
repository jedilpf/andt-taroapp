# Read Word Documents using Word COM Object
$ErrorActionPreference = "Continue"

Write-Host "Starting Word application..." -ForegroundColor Yellow

try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    $word.DisplayAlerts = 0
    
    $sourcePath = "c:\Users\21389\Downloads\andt1\12259\安电通-软著申请材料"
    $destPath = "c:\Users\21389\Downloads\andt1\12259\extracted"
    
    if (-not (Test-Path $destPath)) {
        New-Item -ItemType Directory -Path $destPath -Force | Out-Null
    }
    
    # Get all doc and docx files
    $docFiles = Get-ChildItem -Path $sourcePath -Include "*.doc", "*.docx" -Recurse | Where-Object {
        $_.Name -match "模板|说明|源代码|交底书"
    }
    
    Write-Host "Found $($docFiles.Count) files to process" -ForegroundColor Cyan
    
    foreach ($docFile in $docFiles) {
        Write-Host "`nProcessing: $($docFile.Name)" -ForegroundColor Green
        
        try {
            $doc = $word.Documents.Open($docFile.FullName, $false, $true)
            
            # Get document text
            $text = $doc.Content.Text
            
            # Create safe filename
            $safeName = $docFile.BaseName -replace '[^\w\u4e00-\u9fa5]', '_'
            $outputFile = Join-Path $destPath "$safeName.txt"
            
            # Save as UTF-8
            [System.IO.File]::WriteAllText($outputFile, $text, [System.Text.UTF8Encoding]::new($false))
            
            Write-Host "  Saved: $outputFile" -ForegroundColor Cyan
            Write-Host "  Length: $($text.Length) characters" -ForegroundColor Gray
            
            $doc.Close($false)
        }
        catch {
            Write-Host "  Error processing file: $_" -ForegroundColor Red
        }
    }
    
    $word.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
    [GC]::Collect()
    [GC]::WaitForPendingFinalizers()
    
    Write-Host "`nExtraction complete!" -ForegroundColor Green
    Write-Host "Files saved to: $destPath" -ForegroundColor Yellow
    
    # List created files
    Get-ChildItem $destPath -Filter "*.txt" | ForEach-Object {
        Write-Host "  - $($_.Name) ($($_.Length) bytes)" -ForegroundColor White
    }
}
catch {
    Write-Host "Error: $_" -ForegroundColor Red
    if ($word) {
        $word.Quit()
    }
}
