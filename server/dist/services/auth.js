import crypto from 'crypto';
import { config } from '../config.js';
export function validateInitData(initData) {
    if (!config.bot.token) {
        console.error('BOT_TOKEN not configured');
        return null;
    }
    try {
        const params = new URLSearchParams(initData);
        const hash = params.get('hash');
        if (!hash) {
            console.error('No hash in initData');
            return null;
        }
        params.delete('hash');
        // Sort and create data check string
        const dataCheckString = Array.from(params.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, value]) => `${key}=${value}`)
            .join('\n');
        // Calculate secret key
        const secretKey = crypto
            .createHmac('sha256', 'WebAppData')
            .update(config.bot.token)
            .digest();
        // Calculate hash
        const calculatedHash = crypto
            .createHmac('sha256', secretKey)
            .update(dataCheckString)
            .digest('hex');
        if (calculatedHash !== hash) {
            console.error('Hash mismatch');
            return null;
        }
        // Parse user data
        const userParam = params.get('user');
        if (!userParam) {
            console.error('No user in initData');
            return null;
        }
        return JSON.parse(userParam);
    }
    catch (err) {
        console.error('Failed to validate initData:', err);
        return null;
    }
}
// For development - skip validation
export function parseInitDataUnsafe(initData) {
    try {
        const params = new URLSearchParams(initData);
        const userParam = params.get('user');
        if (!userParam)
            return null;
        return JSON.parse(userParam);
    }
    catch {
        return null;
    }
}
function base64UrlToBuffer(input) {
    const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
    return Buffer.from(padded, 'base64');
}
export function validateYandexSignature(signedData) {
    if (!config.yandex.appSecret) {
        console.error('YANDEX_APP_SECRET not configured');
        return null;
    }
    if (!signedData || typeof signedData !== 'string') {
        return null;
    }
    const parts = signedData.split('.');
    if (parts.length !== 2) {
        console.error('Invalid Yandex signature format (expected sig.payload)');
        return null;
    }
    const [sigB64, payloadB64] = parts;
    try {
        const hmacKey = Buffer.from(config.yandex.appSecret, 'utf-8');
        const payloadRaw = base64UrlToBuffer(payloadB64);
        const expectedSig = crypto.createHmac('sha256', hmacKey).update(payloadRaw).digest();
        const providedSig = base64UrlToBuffer(sigB64);
        if (expectedSig.length !== providedSig.length || !crypto.timingSafeEqual(expectedSig, providedSig)) {
            console.error('Yandex signature mismatch');
            return null;
        }
        const payload = JSON.parse(payloadRaw.toString('utf-8'));
        const uuid = payload?.data?.id || payload?.data?.uniqueID;
        if (!uuid || typeof uuid !== 'string') {
            console.error('Yandex payload missing data.id');
            return null;
        }
        return {
            uuid,
            issuedAt: payload.issuedAt,
            publicName: payload.data?.publicName,
            avatarIdHash: payload.data?.avatarIdHash,
            lang: payload.data?.lang,
        };
    }
    catch (err) {
        console.error('Failed to validate Yandex signature:', err);
        return null;
    }
}
// For development / unsigned-auth path - extract uuid from the payload without
// verifying the HMAC. The Yandex SDK can return an unsigned player object
// where `id` is the player uuid; we accept either shape so the local
// `npm run dev` flow works without YANDEX_APP_SECRET configured.
export function parseYandexPlayerUnsafe(signedData, playerInfo) {
    try {
        if (signedData && signedData.includes('.')) {
            // Yandex format is `<sig>.<payload>` so the JSON payload is the SECOND half.
            const parts = signedData.split('.');
            const payloadB64 = parts.length === 2 ? parts[1] : parts[0];
            const payload = JSON.parse(base64UrlToBuffer(payloadB64).toString('utf-8'));
            const uuid = payload?.data?.id || payload?.data?.uniqueID;
            if (uuid) {
                return {
                    uuid,
                    publicName: playerInfo?.publicName || payload.data?.publicName,
                    avatarUrlSmall: playerInfo?.avatarUrlSmall,
                    avatarUrlMedium: playerInfo?.avatarUrlMedium,
                    avatarUrlLarge: playerInfo?.avatarUrlLarge,
                    lang: playerInfo?.lang || payload.data?.lang,
                };
            }
        }
        if (playerInfo?.uuid) {
            return {
                uuid: playerInfo.uuid,
                publicName: playerInfo.publicName,
                avatarUrlSmall: playerInfo.avatarUrlSmall,
                avatarUrlMedium: playerInfo.avatarUrlMedium,
                avatarUrlLarge: playerInfo.avatarUrlLarge,
                lang: playerInfo.lang,
            };
        }
        return null;
    }
    catch {
        return null;
    }
}
// Extract start_param (referral code) from initData
// Supports both 'start_param' (for regular bots) and 'start_param' from Web App
export function extractStartParam(initData) {
    try {
        const params = new URLSearchParams(initData);
        // Try start_param first (this is what Telegram sends in initData for Web Apps)
        let startParam = params.get('start_param');
        // If not found, this might be from a direct bot command (rare case)
        if (!startParam) {
            startParam = params.get('start');
        }
        return startParam || null;
    }
    catch {
        return null;
    }
}
//# sourceMappingURL=auth.js.map