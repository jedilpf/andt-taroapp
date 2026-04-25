# Extract Word Documents Script
$ErrorActionPreference = "Continue"

Write-Host "Starting Word application..."

try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    $word.DisplayAlerts = 0
    
    $sourcePath = "c:\Users\21389\Downloads\andt1\12259\安电通-软著申请材料"
    $destPath = "c:\Users\21389\Downloads\andt1\12259\extracted"
    
    if (-not (Test-Path $destPath)) {
        New-Item -ItemType Directory -Path $destPath -Force | Out-Null
    }
    
    $docFiles = Get-ChildItem -Path $sourcePath -Include "*.doc","*.docx" -Recurse | Where-Object {
        $_.Name -match "模板|说明|源代码|交底书"
    }
    
    $count = ($docFiles | Measure-Object).Count
    Write-Host "Found $count files to process"
    
    foreach ($docFile in $docFiles) {
        Write-Host ""
        Write-Host "Processing: $($docFile.Name)"
        
        try {
            $doc = $word.Documents.Open($docFile.FullName, $false, $true)
            $text = $doc.Content.Text
            
            $safeName = $docFile.BaseName -replace "[^\w]", "_"
            $outputFile = Join-Path $destPath "$safeName.txt"
            
            [System.IO.File]::WriteAllText($outputFile, $text, [System.Text.UTF8Encoding]::new($false))
            
            $len = $text.Length
            Write-Host "Saved: $outputFile"
            Write-Host "Length: $len characters"
            
            $doc.Close($false)
        }
        catch {
            Write-Host "Error processing file"
        }
    }
    
    $word.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
    [GC]::Collect()
    [GC]::WaitForPendingFinalizers()
    
    Write-Host ""
    Write-Host "Extraction complete!"
    Write-Host "Files saved to: $destPath"
    
    Get-ChildItem $destPath -Filter "*.txt" | ForEach-Object {
        $f = $_.Name
        $s = $_.Length
        Write-Host "  - $f ($s bytes)"
    }
}
catch {
    Write-Host "Error occurred"
    if ($word) {
        $word.Quit()
    }
}
