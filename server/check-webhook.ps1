# Check Telegram webhook status
# Usage: .\check-webhook.ps1

$BOT_TOKEN = $env:BOT_TOKEN

if (-not $BOT_TOKEN) {
    Write-Host "Error: BOT_TOKEN not found in environment" -ForegroundColor Red
    Write-Host "Set it with: `$env:BOT_TOKEN='your_token_here'" -ForegroundColor Yellow
    exit 1
}

Write-Host "`nChecking webhook status..." -ForegroundColor Cyan

$response = Invoke-RestMethod -Uri "https://api.telegram.org/bot$BOT_TOKEN/getWebhookInfo" -Method Get

Write-Host "`nWebhook Info:" -ForegroundColor Green
Write-Host "URL: $($response.result.url)"
Write-Host "Has custom certificate: $($response.result.has_custom_certificate)"
Write-Host "Pending update count: $($response.result.pending_update_count)"
Write-Host "Max connections: $($response.result.max_connections)"

if ($response.result.last_error_date) {
    $errorDate = [DateTimeOffset]::FromUnixTimeSeconds($response.result.last_error_date).LocalDateTime
    Write-Host "`nLast Error:" -ForegroundColor Red
    Write-Host "Date: $errorDate"
    Write-Host "Message: $($response.result.last_error_message)"
} else {
    Write-Host "`nNo errors!" -ForegroundColor Green
}

if ($response.result.last_synchronization_error_date) {
    $syncErrorDate = [DateTimeOffset]::FromUnixTimeSeconds($response.result.last_synchronization_error_date).LocalDateTime
    Write-Host "`nLast Sync Error:" -ForegroundColor Yellow
    Write-Host "Date: $syncErrorDate"
}
