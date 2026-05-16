import crypto from 'crypto';
import { config } from '../config.js';
import type { TelegramUser, YandexPlayer } from '../types/index.js';

export function validateInitData(initData: string): TelegramUser | null {
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
    
    return JSON.parse(userParam) as TelegramUser;
  } catch (err) {
    console.error('Failed to validate initData:', err);
    return null;
  }
}

// For development - skip validation
export function parseInitDataUnsafe(initData: string): TelegramUser | null {
  try {
    const params = new URLSearchParams(initData);
    const userParam = params.get('user');
    if (!userParam) return null;
    return JSON.parse(userParam) as TelegramUser;
  } catch {
    return null;
  }
}

// === Yandex Games signature validation ===
//
// `ysdk.getPlayer({ signed: true })` returns `player.signature` as a string
// of the form `<base64-encoded payload>.<base64-encoded HMAC-SHA256 sig>`.
// The HMAC is computed using the application secret key from the Yandex Games
// console (`YANDEX_APP_SECRET`).
//
// We accept the secret either as raw text or as a base64-encoded string —
// some console fields hand it out base64-encoded. If the provided secret
// decodes cleanly from base64 to non-empty bytes we use those bytes,
// otherwise we use the raw UTF-8 bytes as the HMAC key.

export interface YandexSignedPayload {
  uuid: string;
  [key: string]: unknown;
}

function resolveYandexHmacKey(secret: string): Buffer {
  // Try base64 first — Yandex console secrets are typically base64.
  try {
    const decoded = Buffer.from(secret, 'base64');
    if (decoded.length > 0 && decoded.toString('base64').replace(/=+$/, '') === secret.replace(/=+$/, '')) {
      return decoded;
    }
  } catch {
    // ignore and fall through
  }
  return Buffer.from(secret, 'utf-8');
}

function base64UrlToBuffer(input: string): Buffer {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  return Buffer.from(padded, 'base64');
}

export function validateYandexSignature(signedData: string): YandexSignedPayload | null {
  if (!config.yandex.appSecret) {
    console.error('YANDEX_APP_SECRET not configured');
    return null;
  }

  if (!signedData || typeof signedData !== 'string') {
    return null;
  }

  // Yandex emits `<payload>.<sig>` where both halves are base64 (url-safe in some SDK versions).
  const parts = signedData.split('.');
  if (parts.length !== 2) {
    console.error('Invalid Yandex signature format (expected payload.sig)');
    return null;
  }

  const [payloadB64, sigB64] = parts;

  try {
    const hmacKey = resolveYandexHmacKey(config.yandex.appSecret);
    const expectedSig = crypto.createHmac('sha256', hmacKey).update(payloadB64).digest();
    const providedSig = base64UrlToBuffer(sigB64);

    if (expectedSig.length !== providedSig.length || !crypto.timingSafeEqual(expectedSig, providedSig)) {
      console.error('Yandex signature mismatch');
      return null;
    }

    const payloadJson = base64UrlToBuffer(payloadB64).toString('utf-8');
    const payload = JSON.parse(payloadJson) as YandexSignedPayload;

    if (!payload.uuid || typeof payload.uuid !== 'string') {
      console.error('Yandex payload missing uuid');
      return null;
    }

    return payload;
  } catch (err) {
    console.error('Failed to validate Yandex signature:', err);
    return null;
  }
}

// For development / unsigned-auth path - extract uuid from the payload without
// verifying the HMAC. The Yandex SDK can return an unsigned player object
// where `id` is the player uuid; we accept either shape so the local
// `npm run dev` flow works without YANDEX_APP_SECRET configured.
export function parseYandexPlayerUnsafe(
  signedData: string | null,
  playerInfo: Partial<YandexPlayer> | null,
): YandexPlayer | null {
  try {
    if (signedData && signedData.includes('.')) {
      const [payloadB64] = signedData.split('.');
      const payload = JSON.parse(base64UrlToBuffer(payloadB64).toString('utf-8')) as YandexSignedPayload;
      if (payload.uuid) {
        return {
          uuid: payload.uuid,
          publicName: playerInfo?.publicName,
          avatarUrlSmall: playerInfo?.avatarUrlSmall,
          avatarUrlMedium: playerInfo?.avatarUrlMedium,
          avatarUrlLarge: playerInfo?.avatarUrlLarge,
          lang: playerInfo?.lang,
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
  } catch {
    return null;
  }
}

// Extract start_param (referral code) from initData
// Supports both 'start_param' (for regular bots) and 'start_param' from Web App
export function extractStartParam(initData: string): string | null {
  try {
    const params = new URLSearchParams(initData);
    // Try start_param first (this is what Telegram sends in initData for Web Apps)
    let startParam = params.get('start_param');
    
    // If not found, this might be from a direct bot command (rare case)
    if (!startParam) {
      startParam = params.get('start');
    }
    
    return startParam || null;
  } catch {
    return null;
  }
}
