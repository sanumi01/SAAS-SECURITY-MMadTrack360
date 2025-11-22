Write-Host '================================================' -ForegroundColor Cyan
Write-Host '📊 MMA Track 360 Security - Status Check' -ForegroundColor Cyan
Write-Host '================================================' -ForegroundColor Cyan
Write-Host ''

# Check Frontend
Write-Host '🎨 Frontend (Port 3000):' -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri 'http://localhost:3000' -TimeoutSec 2 -UseBasicParsing -ErrorAction Stop
    Write-Host '   ✅ RUNNING' -ForegroundColor Green
    Write-Host '   Status Code: ' -NoNewline; Write-Host $response.StatusCode -ForegroundColor White
    Write-Host '   URL: http://localhost:3000' -ForegroundColor White
} catch {
    Write-Host '   ❌ NOT RUNNING' -ForegroundColor Red
    Write-Host '   Error: ' -NoNewline; Write-Host $_.Exception.Message -ForegroundColor Gray
}

Write-Host ''

# Check Backend
Write-Host '🔌 Backend (Port 3001):' -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri 'http://localhost:3001/api/health' -TimeoutSec 2 -ErrorAction Stop
    Write-Host '   ✅ RUNNING' -ForegroundColor Green
    Write-Host "   Status: $($response.status)" -ForegroundColor White
    Write-Host "   Uptime: $([math]::Round($response.uptime, 2)) seconds" -ForegroundColor White
    Write-Host '   URL: http://localhost:3001' -ForegroundColor White
} catch {
    Write-Host '   ❌ NOT RUNNING' -ForegroundColor Red
    Write-Host '   Error: ' -NoNewline; Write-Host $_.Exception.Message -ForegroundColor Gray
}

Write-Host ''

# Check Processes
Write-Host '💻 Node.js Processes:' -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    $nodeProcesses | ForEach-Object {
        $runtime = (Get-Date) - $_.StartTime
        Write-Host "   • PID $($_.Id): Running for $([math]::Round($runtime.TotalMinutes, 1)) minutes" -ForegroundColor White
    }
} else {
    Write-Host '   No Node.js processes running' -ForegroundColor Gray
}

Write-Host ''

# Check Ports
Write-Host '🔌 Port Status:' -ForegroundColor Yellow
$ports = @(3000, 3001)
foreach ($port in $ports) {
    $connection = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connection) {
        Write-Host "   • Port $port: IN USE (PID: $($connection.OwningProcess))" -ForegroundColor Green
    } else {
        Write-Host "   • Port $port: Available" -ForegroundColor Gray
    }
}

Write-Host ''
Write-Host '================================================' -ForegroundColor Cyan
Write-Host ''

# Quick Actions
Write-Host '⚡ Quick Actions:' -ForegroundColor Yellow
Write-Host '   .\start.ps1  - Start servers' -ForegroundColor White
Write-Host '   .\stop.ps1   - Stop servers' -ForegroundColor White
Write-Host ''
