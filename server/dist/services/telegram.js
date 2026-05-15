import { config } from '../config.js';
import { query } from '../db/client.js';
const BOT_TOKEN = config.bot.token;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;
// Mini App URL - update this to your actual mini app URL
const MINI_APP_URL = process.env.MINI_APP_URL || 'https://t.me/StreetDiceBot/play';
// Store pending purchases (payload -> { userId, itemId })
const pendingPurchases = new Map();
// Create invoice link for Telegram Stars payment
export async function createStarsInvoice(userId, itemId, itemName, itemDescription, priceStars) {
    if (!BOT_TOKEN) {
        console.log('[Telegram] No bot token configured');
        return { success: false, error: 'Bot not configured' };
    }
    try {
        // Create unique payload for this purchase
        const payload = `purchase_${userId}_${itemId}_${Date.now()}`;
        // Store pending purchase
        pendingPurchases.set(payload, { oderId: userId, itemId, priceStars });
        // Clean up old pending purchases after 1 hour
        setTimeout(() => {
            pendingPurchases.delete(payload);
        }, 3600000);
        const response = await fetch(`${TELEGRAM_API}/createInvoiceLink`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: itemName,
                description: itemDescription || `Purchase ${itemName} in Street Dice`,
                payload,
                currency: 'XTR', // Telegram Stars
                prices: [{ label: itemName, amount: priceStars }],
                // provider_token is empty for digital goods with Stars
            })
        });
        const result = await response.json();
        if (result.ok && result.result) {
            console.log(`[Telegram] Created invoice for user ${userId}, item ${itemId}: ${result.result}`);
            return { success: true, invoiceUrl: result.result };
        }
        else {
            console.error('[Telegram] Failed to create invoice:', result.description);
            return { success: false, error: result.description || 'Failed to create invoice' };
        }
    }
    catch (error) {
        console.error('[Telegram] Error creating invoice:', error);
        return { success: false, error: 'Network error' };
    }
}
// Handle pre_checkout_query from Telegram
export async function handlePreCheckoutQuery(preCheckoutQuery) {
    const { id, invoice_payload } = preCheckoutQuery;
    // Verify the purchase is still valid
    const purchase = pendingPurchases.get(invoice_payload);
    if (!purchase) {
        // Purchase expired or invalid
        await answerPreCheckoutQuery(id, false, 'Purchase expired. Please try again.');
        return false;
    }
    // Verify item still exists and price matches
    const itemResult = await query('SELECT id, price_stars FROM item_catalog WHERE id = $1', [purchase.itemId]);
    if (itemResult.rows.length === 0) {
        await answerPreCheckoutQuery(id, false, 'Item no longer available.');
        return false;
    }
    const item = itemResult.rows[0];
    if (item.price_stars !== purchase.priceStars) {
        await answerPreCheckoutQuery(id, false, 'Price has changed. Please try again.');
        return false;
    }
    // Check if user already owns this item
    const ownershipResult = await query('SELECT 1 FROM user_items WHERE user_id = $1 AND item_id = $2', [purchase.oderId, purchase.itemId]);
    if (ownershipResult.rows.length > 0) {
        await answerPreCheckoutQuery(id, false, 'You already own this item.');
        return false;
    }
    // All good - approve the checkout
    await answerPreCheckoutQuery(id, true);
    return true;
}
// Answer pre_checkout_query
async function answerPreCheckoutQuery(queryId, ok, errorMessage) {
    try {
        await fetch(`${TELEGRAM_API}/answerPreCheckoutQuery`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                pre_checkout_query_id: queryId,
                ok,
                error_message: errorMessage
            })
        });
    }
    catch (error) {
        console.error('[Telegram] Error answering pre_checkout_query:', error);
    }
}
// Handle successful payment
export async function handleSuccessfulPayment(telegramUserId, payment) {
    const { invoice_payload, telegram_payment_charge_id } = payment;
    // Check for duplicate payment (idempotency)
    const existingPayment = await query('SELECT id FROM purchases WHERE telegram_payment_id = $1', [telegram_payment_charge_id]);
    if (existingPayment.rows.length > 0) {
        console.log(`[Telegram] Duplicate payment ignored: ${telegram_payment_charge_id}`);
        return { success: false };
    }
    const purchase = pendingPurchases.get(invoice_payload);
    if (!purchase) {
        console.error('[Telegram] Payment received but no pending purchase found:', invoice_payload);
        return { success: false };
    }
    const userId = purchase.oderId;
    // Remove from pending
    pendingPurchases.delete(invoice_payload);
    try {
        // Log the transaction FIRST (with unique constraint on telegram_payment_id)
        // This ensures idempotency even if webhook is called twice simultaneously
        const insertResult = await query(`INSERT INTO purchases (user_id, item_id, telegram_payment_id, stars_amount, status, created_at) 
       VALUES ($1, $2, $3, $4, 'completed', NOW())
       ON CONFLICT (telegram_payment_id) DO NOTHING
       RETURNING id`, [purchase.oderId, purchase.itemId, telegram_payment_charge_id, purchase.priceStars]);
        // If no row was inserted, this is a duplicate
        if (insertResult.rows.length === 0) {
            console.log(`[Telegram] Duplicate payment (race condition): ${telegram_payment_charge_id}`);
            return { success: false };
        }
        // Add item to user's inventory
        await query('INSERT INTO user_items (user_id, item_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [purchase.oderId, purchase.itemId]);
        console.log(`[Telegram] Payment successful: user ${purchase.oderId} purchased item ${purchase.itemId}`);
        return { success: true, itemId: purchase.itemId, oderId: userId };
    }
    catch (error) {
        console.error('[Telegram] Error processing payment:', error);
        return { success: false };
    }
}
// Get pending purchase by payload
export function getPendingPurchase(payload) {
    return pendingPurchases.get(payload);
}
export async function sendGameInvite(telegramId, fromNickname, lobbyId, gameMode) {
    if (!BOT_TOKEN) {
        console.log('[Telegram] No bot token configured, skipping message');
        return false;
    }
    try {
        const gameModeNames = {
            'free_roll': 'Free Roll',
            'street_craps': 'Street Craps',
            'mexico': 'Mexico',
            'greedy_pig': 'Greedy Pig'
        };
        const gameModeName = gameModeNames[gameMode] || gameMode;
        // Create inline keyboard with link to mini app
        const keyboard = {
            inline_keyboard: [[
                    {
                        text: '🎲 Join Game',
                        url: `${MINI_APP_URL}?startapp=lobby_${lobbyId}`
                    }
                ]]
        };
        const message = `🎲 *${fromNickname}* invites you to play *${gameModeName}*!\n\nTap the button below to join the game.`;
        const response = await fetch(`${TELEGRAM_API}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: telegramId,
                text: message,
                parse_mode: 'Markdown',
                reply_markup: keyboard
            })
        });
        const result = await response.json();
        if (result.ok) {
            console.log(`[Telegram] Sent invite to ${telegramId} from ${fromNickname}`);
            return true;
        }
        else {
            // User might have blocked the bot or never started it
            console.log(`[Telegram] Failed to send invite to ${telegramId}:`, result.description);
            return false;
        }
    }
    catch (error) {
        console.error('[Telegram] Error sending invite:', error);
        return false;
    }
}
//# sourceMappingURL=telegram.js.map