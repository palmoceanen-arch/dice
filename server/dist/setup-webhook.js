import 'dotenv/config';
import { createHash } from 'crypto';
const BOT_TOKEN = process.env.BOT_TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL; // e.g., https://your-domain.com/telegram/webhook
// Generate secret token from bot token (deterministic)
function generateSecretToken(botToken) {
    return createHash('sha256').update(botToken + '_webhook_secret').digest('hex').substring(0, 32);
}
async function setupWebhook() {
    if (!BOT_TOKEN) {
        console.error('BOT_TOKEN not set in environment');
        process.exit(1);
    }
    if (!WEBHOOK_URL) {
        console.error('WEBHOOK_URL not set in environment');
        console.log('Usage: WEBHOOK_URL=https://your-domain.com/telegram/webhook npm run setup-webhook');
        process.exit(1);
    }
    const secretToken = generateSecretToken(BOT_TOKEN);
    console.log(`Setting webhook to: ${WEBHOOK_URL}`);
    console.log(`Secret token: ${secretToken.substring(0, 8)}...`);
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            url: WEBHOOK_URL,
            allowed_updates: ['message', 'pre_checkout_query'],
            secret_token: secretToken
        })
    });
    const result = await response.json();
    console.log('Result:', result);
    if (result.ok) {
        console.log('✓ Webhook set successfully!');
    }
    else {
        console.error('✗ Failed to set webhook:', result.description);
    }
}
setupWebhook();
//# sourceMappingURL=setup-webhook.js.map