# Opens each CV DOCX in Word and exports a tagged PDF next to it (fonts embedded in the PDF).
# Prints the page count. The DOCX stays lean (no embedded fonts) for ATS upload limits.
# Usage: powershell -File export-pdf.ps1 <file.docx> [...]
param([Parameter(ValueFromRemainingArguments = $true)][string[]]$Files)

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0
try {
  foreach ($f in $Files) {
    $full = (Resolve-Path $f).Path
    $doc = $word.Documents.Open($full, $false, $false, $false)
    $pages = $doc.ComputeStatistics(2)
    $pdf = [IO.Path]::ChangeExtension($full, '.pdf')
    # PDF, no auto-open, optimise for print, whole document, content only, document
    # properties on, heading bookmarks, structure tags (accessible, extractable text order).
    $doc.ExportAsFixedFormat($pdf, 17, $false, 0, 0, 1, 1, 0, $true, $true, 1, $true, $true, $false)
    $doc.Close($false)
    Write-Output "$(Split-Path $pdf -Leaf): $pages pages"
  }
}
finally {
  $word.Quit()
  [void][Runtime.InteropServices.Marshal]::ReleaseComObject($word)
}
