#Requires -Version 5.1

Write-Host ''
Write-Host '================================================' -ForegroundColor Cyan
Write-Host '🚀 MMA Track 360 Security - Starting Servers' -ForegroundColor Cyan
Write-Host '================================================' -ForegroundColor Cyan
Write-Host ''

$ProjectRoot = 'C:\Users\pryan\OneDrive\Desktop\SAAS PROJECTS\SAAS For MMadTrack360-Security3'

# Kill existing Node processes
Write-Host '🧹 Cleaning up existing processes...' -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | ForEach-Object {
    Write-Host "  Stopping PID $($_.Id)" -ForegroundColor Gray
    Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
}
Start-Sleep -Seconds 1

# Start Backend
Write-Host ''
Write-Host '🔌 Starting Backend Server...' -ForegroundColor Yellow
$backendPath = Join-Path $ProjectRoot 'backend'
Start-Process powershell -ArgumentList @(
    '-NoExit',
    '-Command',
    "Set-Location '$backendPath'; Write-Host '================================================' -ForegroundColor Green; Write-Host '🔌 BACKEND SERVER' -ForegroundColor Green; Write-Host '================================================' -ForegroundColor Green; Write-Host ''; npm run dev"
)

Start-Sleep -Seconds 3

# Start Frontend
Write-Host '🎨 Starting Frontend Server...' -ForegroundColor Yellow
$frontendPath = Join-Path $ProjectRoot 'frontend'
Start-Process powershell -ArgumentList @(
    '-NoExit',
    '-Command',
    "Set-Location '$frontendPath'; Write-Host '================================================' -ForegroundColor Blue; Write-Host '🎨 FRONTEND SERVER' -ForegroundColor Blue; Write-Host '================================================' -ForegroundColor Blue; Write-Host ''; npm run dev"
)

Start-Sleep -Seconds 2

# Display info
Write-Host ''
Write-Host '================================================' -ForegroundColor Green
Write-Host '✅ SERVERS STARTED!' -ForegroundColor Green
Write-Host '================================================' -ForegroundColor Green
Write-Host ''
Write-Host '🌐 Access your platform:' -ForegroundColor Cyan
Write-Host '   📊 Frontend:    http://localhost:3000' -ForegroundColor White
Write-Host '   🔌 Backend:     http://localhost:3001' -ForegroundColor White
Write-Host '   🏥 API Health:  http://localhost:3001/api/health' -ForegroundColor White
Write-Host '   📈 Dashboard:   http://localhost:3001/api/dashboard/stats' -ForegroundColor White
Write-Host ''
Write-Host '💡 Two new PowerShell windows opened:' -ForegroundColor Yellow
Write-Host '   - Backend (Green) - Port 3001' -ForegroundColor White
Write-Host '   - Frontend (Blue) - Port 3000' -ForegroundColor White
Write-Host ''
Write-Host '⚠️  To stop: Run .\stop.ps1 or press Ctrl+C in each window' -ForegroundColor Yellow
Write-Host ''
