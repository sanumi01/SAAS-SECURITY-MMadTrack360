Write-Host '🛑 Stopping all servers...' -ForegroundColor Yellow
Write-Host ''

$nodeProcesses = Get-Process -Name node -ErrorAction SilentlyContinue

if ($nodeProcesses) {
    $count = ($nodeProcesses | Measure-Object).Count
    Write-Host "Found $count Node.js process(es)" -ForegroundColor Gray
    
    $nodeProcesses | ForEach-Object {
        Write-Host "  Stopping PID $($_.Id): $($_.ProcessName)" -ForegroundColor Gray
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
    }
    
    Write-Host ''
    Write-Host '✅ All servers stopped!' -ForegroundColor Green
} else {
    Write-Host '  No Node.js processes found' -ForegroundColor Gray
}

Write-Host ''
