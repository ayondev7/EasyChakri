Write-Host "Starting EasyChakri Microservices..." -ForegroundColor Green
Write-Host ""

$services = @(
    @{Name="API Gateway"; Command="npm run start:gateway"},
    @{Name="Job Service"; Command="npm run start:job-service"},
    @{Name="Application Service"; Command="npm run start:application-service"},
    @{Name="Interview Service"; Command="npm run start:interview-service"}
)

foreach ($service in $services) {
    Write-Host "Starting $($service.Name)..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; $($service.Command)"
    Start-Sleep -Seconds 2
}

Write-Host ""
Write-Host "All services started!" -ForegroundColor Green
Write-Host "Each service is running in its own window." -ForegroundColor Yellow
Write-Host ""
Write-Host "Services:" -ForegroundColor White
Write-Host "  - API Gateway: http://localhost:5000" -ForegroundColor White
Write-Host "  - Job Service: Running on RabbitMQ" -ForegroundColor White
Write-Host "  - Application Service: Running on RabbitMQ" -ForegroundColor White
Write-Host "  - Interview Service: Running on RabbitMQ" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit this window (services will continue running)..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
