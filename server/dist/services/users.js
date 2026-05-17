import { query } from '../db/client.js';
import { nanoid } from 'nanoid';
import { generateReferralCode, processReferral } from './referrals.js';
import { logger } from '../utils/logger.js';
// Generate unique nickname
async function generateNickname(baseName) {
    // Keep letters (incl. Cyrillic and other Unicode scripts) and digits.
    // The previous /[^a-zA-Z0-9]/g pattern stripped every Cyrillic character, so
    // Yandex players named e.g. "Павел Слонов" ended up with the generic
    // fallback "Player". `\p{L}` keeps any Unicode letter, `\p{N}` any digit.
    const clean = baseName.replace(/[^\p{L}\p{N}]/gu, '').substring(0, 20);
    const base = clean || 'Player';
    // Try base name first
    const existing = await query('SELECT nickname FROM users WHERE nickname = $1', [base]);
    if (existing.rows.length === 0) {
        return base;
    }
    // Add random suffix
    for (let i = 0; i < 10; i++) {
        const nickname = `${base}${Math.floor(Math.random() * 9999)}`;
        const check = await query('SELECT nickname FROM users WHERE nickname = $1', [nickname]);
        if (check.rows.length === 0) {
            return nickname;
        }
    }
    // Fallback to nanoid
    return `${base}_${nanoid(6)}`;
}
export async function findOrCreateUser(telegramUser, referralCode) {
    // Check if user exists
    const existingUser = await query('SELECT * FROM users WHERE telegram_id = $1', [telegramUser.id]);
    const isNewUser = existingUser.rows.length === 0;
    // Try to update existing user and return it in one query (UPSERT pattern)
    // This reduces 2 queries (SELECT + UPDATE) to 1 query
    const result = await query(`INSERT INTO users (telegram_id, nickname, telegram_username, first_name, avatar_url, referral_code, last_online)
     VALUES ($1, $2, $3, $4, $5, $6, NOW())
     ON CONFLICT (telegram_id) DO UPDATE SET
       last_online = NOW(),
       telegram_username = EXCLUDED.telegram_username,
       first_name = EXCLUDED.first_name,
       avatar_url = EXCLUDED.avatar_url
     RETURNING *`, [
        telegramUser.id,
        await generateNickname(telegramUser.first_name), // Will be ignored if user exists
        telegramUser.username || null,
        telegramUser.first_name,
        telegramUser.photo_url || null,
        isNewUser ? await generateReferralCode() : null, // Only generate for new users
    ]);
    const user = mapUser(result.rows[0]);
    // Grant default items only for new users (check if they have any items)
    const hasItems = await query('SELECT COUNT(*) as count FROM user_items WHERE user_id = $1', [user.id]);
    if (parseInt(hasItems.rows[0].count) === 0) {
        await grantDefaultItems(user.id);
    }
    // Process referral if this is a new user and referral code provided
    if (isNewUser && referralCode) {
        console.log(`[Users] New user ${user.id} registered with referral code: ${referralCode}`);
        const referralSuccess = await processReferral(user.id, referralCode);
        console.log(`[Users] Referral processing result: ${referralSuccess ? 'SUCCESS' : 'FAILED'}`);
    }
    return user;
}
// findOrCreate for Yandex Games players. Mirrors findOrCreateUser, but keyed
// on yandex_id (string UUID) and stores `platform='yandex'`. Yandex users
// have no Telegram username or referrals (the multiplayer Yandex MVP
// intentionally skips the referral system), but they still receive default
// items so their first lobby is playable.
export async function findOrCreateYandexUser(player) {
    // Yandex player display name can be empty (`""`) — fall back to a generic
    // "Player" base so the nickname generator does not blow up.
    const displayName = (player.publicName && player.publicName.trim().length > 0)
        ? player.publicName.trim()
        : 'Player';
    const avatarUrl = player.avatarUrlMedium
        || player.avatarUrlLarge
        || player.avatarUrlSmall
        || null;
    const existingUser = await query('SELECT * FROM users WHERE yandex_id = $1', [player.uuid]);
    const isNewUser = existingUser.rows.length === 0;
    // `users.yandex_id` is guarded by a *partial* unique index
    // (`WHERE yandex_id IS NOT NULL`), so `ON CONFLICT (yandex_id)` alone
    // doesn't match a constraint. We need to either specify the predicate
    // in the ON CONFLICT clause or split the upsert. We split it because
    // it's simpler and avoids relying on the partial-index conflict syntax.
    let result;
    if (isNewUser) {
        result = await query(`INSERT INTO users (yandex_id, platform, nickname, first_name, avatar_url, last_online)
       VALUES ($1, 'yandex', $2, $3, $4, NOW())
       RETURNING *`, [
            player.uuid,
            await generateNickname(displayName),
            displayName,
            avatarUrl,
        ]);
    }
    else {
        result = await query(`UPDATE users
         SET last_online = NOW(),
             first_name = $2,
             avatar_url = $3
       WHERE yandex_id = $1
       RETURNING *`, [player.uuid, displayName, avatarUrl]);
    }
    const user = mapUser(result.rows[0]);
    // Grant default items on first sign-in so the user lands in a usable state.
    const hasItems = await query('SELECT COUNT(*) as count FROM user_items WHERE user_id = $1', [user.id]);
    if (parseInt(hasItems.rows[0].count) === 0) {
        await grantDefaultItems(user.id);
    }
    return user;
}
export async function getUserByYandexId(yandexId) {
    const result = await query('SELECT * FROM users WHERE yandex_id = $1', [yandexId]);
    return result.rows.length > 0 ? mapUser(result.rows[0]) : null;
}
async function grantDefaultItems(userId) {
    // Grant specific default items by code (not all free items)
    const defaultCodes = ['classic_white', 'classic_black', 'classic_red', 'green_felt', 'none'];
    const defaults = await query('SELECT id FROM item_catalog WHERE code = ANY($1)', [defaultCodes]);
    for (const item of defaults.rows) {
        await query(`INSERT INTO user_items (user_id, item_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [userId, item.id]);
    }
    // Equip default items
    const defaultDice = await query("SELECT id FROM item_catalog WHERE code = 'classic_white'");
    const defaultTable = await query("SELECT id FROM item_catalog WHERE code = 'green_felt'");
    const defaultEffect = await query("SELECT id FROM item_catalog WHERE code = 'none'");
    await query(`UPDATE users SET 
      equipped_dice_id = $2,
      equipped_table_id = $3,
      equipped_effect_id = $4
     WHERE id = $1`, [
        userId,
        defaultDice.rows[0]?.id || null,
        defaultTable.rows[0]?.id || null,
        defaultEffect.rows[0]?.id || null
    ]);
}
export async function getUserById(id) {
    const result = await query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows.length > 0 ? mapUser(result.rows[0]) : null;
}
export async function getUserByTelegramId(telegramId) {
    const result = await query('SELECT * FROM users WHERE telegram_id = $1', [telegramId]);
    return result.rows.length > 0 ? mapUser(result.rows[0]) : null;
}
export async function getUserByUsername(username) {
    // Remove @ if present
    const clean = username.startsWith('@') ? username.substring(1) : username;
    // First try telegram username
    let result = await query('SELECT * FROM users WHERE LOWER(telegram_username) = LOWER($1)', [clean]);
    // If not found, try nickname
    if (result.rows.length === 0) {
        result = await query('SELECT * FROM users WHERE LOWER(nickname) = LOWER($1)', [clean]);
    }
    return result.rows.length > 0 ? mapUser(result.rows[0]) : null;
}
export async function setNickname(userId, nickname) {
    // Validate nickname. Unicode letters/digits + underscore so Cyrillic / CJK /
    // accented names round-trip through the editor (matches generateNickname()).
    if (nickname.length < 3 || nickname.length > 32) {
        return false;
    }
    if (!/^[\p{L}\p{N}_]+$/u.test(nickname)) {
        return false;
    }
    try {
        await query('UPDATE users SET nickname = $2 WHERE id = $1', [userId, nickname]);
        return true;
    }
    catch {
        // Unique constraint violation
        return false;
    }
}
export async function getUserInventory(userId) {
    const result = await query(`SELECT ic.* FROM item_catalog ic
     JOIN user_items ui ON ui.item_id = ic.id
     WHERE ui.user_id = $1`, [userId]);
    return result.rows.map(mapItem);
}
export async function getShopItems() {
    const result = await query(`SELECT * FROM item_catalog 
     WHERE is_available = true 
     AND (price_stars > 0 OR type = 'key')
     ORDER BY 
       CASE type 
         WHEN 'key' THEN 1 
         WHEN 'table' THEN 2 
         WHEN 'dice' THEN 3 
         WHEN 'effect' THEN 4 
       END,
       price_stars`);
    return result.rows.map(mapItem);
}
export async function equipItem(userId, itemId, slot) {
    // Check ownership
    const owned = await query('SELECT 1 FROM user_items WHERE user_id = $1 AND item_id = $2', [userId, itemId]);
    if (owned.rows.length === 0) {
        return false;
    }
    // Check item type matches slot
    const item = await query('SELECT type FROM item_catalog WHERE id = $1', [itemId]);
    if (item.rows.length === 0 || item.rows[0].type !== slot) {
        return false;
    }
    const column = `equipped_${slot}_id`;
    await query(`UPDATE users SET ${column} = $2 WHERE id = $1`, [userId, itemId]);
    return true;
}
export async function updateLastOnline(userId) {
    await query('UPDATE users SET last_online = NOW() WHERE id = $1', [userId]);
}
/**
 * Update user's pips (points earned from dice rolls)
 * Uses optimistic update - doesn't wait for DB response
 */
export async function updatePips(userId, pipsToAdd) {
    // Non-blocking update - fire and forget for performance
    query('UPDATE users SET pips = pips + $2 WHERE id = $1', [userId, pipsToAdd]).catch(err => {
        logger.error('Failed to update pips', err, { userId, pipsToAdd });
    });
}
/**
 * Get user's current pips count
 */
export async function getUserPips(userId) {
    const result = await query('SELECT pips FROM users WHERE id = $1', [userId]);
    return result.rows[0] ? parseInt(result.rows[0].pips, 10) : 0;
}
// Map database row to User type (snake_case to camelCase)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapUser(row) {
    const platform = row.platform === 'yandex' ? 'yandex' : 'telegram';
    return {
        id: row.id,
        telegramId: row.telegram_id === null || row.telegram_id === undefined
            ? null
            : row.telegram_id,
        yandexId: row.yandex_id ?? null,
        platform,
        nickname: row.nickname,
        telegramUsername: row.telegram_username,
        firstName: row.first_name,
        avatarUrl: row.avatar_url,
        equippedDiceId: row.equipped_dice_id,
        equippedTableId: row.equipped_table_id,
        equippedEffectId: row.equipped_effect_id,
        referralCode: row.referral_code,
        pips: row.pips ? parseInt(row.pips, 10) : 0,
        xp: row.xp == null ? 0 : parseInt(row.xp, 10),
        level: row.level == null ? 1 : parseInt(row.level, 10),
        gamesPlayed: row.games_played == null ? 0 : parseInt(row.games_played, 10),
        wins: row.wins == null ? 0 : parseInt(row.wins, 10),
        losses: row.losses == null ? 0 : parseInt(row.losses, 10),
        lastOnline: new Date(row.last_online),
        createdAt: new Date(row.created_at),
    };
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapItem(row) {
    return {
        id: row.id,
        type: row.type,
        code: row.code,
        name: row.name,
        description: row.description,
        priceStars: row.price_stars,
        rarity: row.rarity,
        textureUrl: row.texture_url,
        config: row.config,
        isAvailable: row.is_available,
    };
}
//# sourceMappingURL=users.js.map