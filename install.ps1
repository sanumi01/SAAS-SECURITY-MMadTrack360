Write-Host '================================================' -ForegroundColor Cyan
Write-Host '📦 Installing Dependencies' -ForegroundColor Cyan
Write-Host '================================================' -ForegroundColor Cyan
Write-Host ''

# Backend
if (Test-Path 'backend\package.json') {
    Write-Host '1/2 Installing Backend dependencies...' -ForegroundColor Yellow
    Set-Location backend
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host '  ✅ Backend dependencies installed' -ForegroundColor Green
    } else {
        Write-Host '  ❌ Backend installation failed' -ForegroundColor Red
    }
    Set-Location ..
} else {
    Write-Host '⚠️ Backend package.json not found' -ForegroundColor Yellow
}

Write-Host ''

# Frontend
if (Test-Path 'frontend\package.json') {
    Write-Host '2/2 Installing Frontend dependencies...' -ForegroundColor Yellow
    Set-Location frontend
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host '  ✅ Frontend dependencies installed' -ForegroundColor Green
    } else {
        Write-Host '  ❌ Frontend installation failed' -ForegroundColor Red
    }
    Set-Location ..
} else {
    Write-Host '⚠️ Frontend package.json not found' -ForegroundColor Yellow
}

Write-Host ''
Write-Host '✅ Installation complete!' -ForegroundColor Green
Write-Host ''
Write-Host 'Next step: .\start.ps1' -ForegroundColor Cyan
Write-Host ''
