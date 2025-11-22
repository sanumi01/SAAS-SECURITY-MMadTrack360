Write-Host " Starting MMadTrack360 Platform..." -ForegroundColor Cyan
Write-Host ""

# Navigate to html-platform folder
$scriptPath = $PSScriptRoot
Set-Location $scriptPath

# Start server
http-server -p 4173 -o

Write-Host ""
Write-Host " Server running on http://localhost:4173" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
