Write-Host "Stopping EasyChakri Microservices..." -ForegroundColor Red

$processNames = @("node")
$ports = @(5000)

Write-Host "Stopping Node.js processes..." -ForegroundColor Yellow
Get-Process -Name $processNames -ErrorAction SilentlyContinue | Where-Object {
    $_.MainWindowTitle -match "gateway|job-service|application-service|interview-service"
} | Stop-Process -Force

foreach ($port in $ports) {
    Write-Host "Freeing port $port..." -ForegroundColor Yellow
    $process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
    if ($process) {
        Stop-Process -Id $process -Force -ErrorAction SilentlyContinue
    }
}

Write-Host ""
Write-Host "All services stopped!" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
