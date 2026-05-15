import 'dotenv/config';
const BOT_TOKEN = process.env.BOT_TOKEN;
async function deleteWebhook() {
    if (!BOT_TOKEN) {
        console.error('BOT_TOKEN not set in environment');
        process.exit(1);
    }
    console.log('Deleting webhook...');
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/deleteWebhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            drop_pending_updates: true
        })
    });
    const result = await response.json();
    console.log('Result:', result);
    if (result.ok) {
        console.log('✓ Webhook deleted successfully!');
    }
    else {
        console.error('✗ Failed to delete webhook:', result.description);
    }
}
deleteWebhook();
//# sourceMappingURL=delete-webhook.js.map