#!/bin/bash
# Check Telegram webhook status
# Usage: ./check-webhook.sh

# Load .env file
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

if [ -z "$BOT_TOKEN" ]; then
    echo "Error: BOT_TOKEN not found in .env"
    exit 1
fi

echo ""
echo "Checking webhook status..."
echo ""

curl -s "https://api.telegram.org/bot$BOT_TOKEN/getWebhookInfo" | jq '
{
  "url": .result.url,
  "has_custom_certificate": .result.has_custom_certificate,
  "pending_update_count": .result.pending_update_count,
  "max_connections": .result.max_connections,
  "last_error_date": (if .result.last_error_date then (.result.last_error_date | strftime("%Y-%m-%d %H:%M:%S")) else "none" end),
  "last_error_message": (.result.last_error_message // "none")
}'

echo ""
