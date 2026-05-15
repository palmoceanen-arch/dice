// Captures the Yandex Games player identity / signature once at boot so the
// WebSocket client can ship it to the server every time it (re)connects.
//
// The Yandex SDK returns `player.signature` only when `getPlayer({signed:true})`
// is called and the player is authorized. We resolve the snapshot eagerly at
// startup and cache it; the WS client reads the cache via `getYandexAuth()`
// every time it authenticates (including after a reconnect).

import { getYsdk } from './platform';

export interface YandexAuthSnapshot {
  /** `payload.sig` string returned by `player.signature`, or `null` for unauthorized / offline players. */
  signedData: string | null;
  /** Unsigned player info; safe to send for nickname / avatar bootstrapping. */
  playerInfo: {
    uuid: string;
    publicName?: string;
    avatarUrlSmall?: string;
    avatarUrlMedium?: string;
    avatarUrlLarge?: string;
    lang?: string;
  };
}

let cached: YandexAuthSnapshot | null = null;

function makeGuestSnapshot(lang?: string): YandexAuthSnapshot {
  // Stable per-device guest uuid so reconnects map to the same server row.
  const LS_KEY = 'yandex_guest_uuid';
  let uuid = '';
  try {
    uuid = localStorage.getItem(LS_KEY) || '';
  } catch {
    // localStorage unavailable (SSR / sandboxed iframe)
  }
  if (!uuid) {
    uuid = 'guest-' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
    try {
      localStorage.setItem(LS_KEY, uuid);
    } catch {
      // ignore
    }
  }
  return {
    signedData: null,
    playerInfo: {
      uuid,
      publicName: 'Guest',
      lang,
    },
  };
}

/**
 * Load and cache the Yandex auth snapshot. Safe to call repeatedly — the
 * cached value is returned after the first successful call.
 */
export async function loadYandexAuth(): Promise<YandexAuthSnapshot> {
  if (cached) return cached;

  const ysdk = getYsdk();
  const lang = ysdk?.environment?.i18n?.lang;

  if (!ysdk) {
    cached = makeGuestSnapshot(lang);
    return cached;
  }

  try {
    const signedPlayer = await ysdk.getPlayer({ signed: true });
    const isAuthorized = signedPlayer.isAuthorized();
    cached = {
      signedData: signedPlayer.signature ?? null,
      playerInfo: {
        uuid: signedPlayer.getUniqueID(),
        publicName: isAuthorized ? signedPlayer.getName() : undefined,
        avatarUrlSmall: isAuthorized ? signedPlayer.getPhoto('small') : undefined,
        avatarUrlMedium: isAuthorized ? signedPlayer.getPhoto('medium') : undefined,
        avatarUrlLarge: isAuthorized ? signedPlayer.getPhoto('large') : undefined,
        lang,
      },
    };
    return cached;
  } catch (e) {
    console.warn('[yandexAuth] getPlayer({signed:true}) failed — falling back to guest', e);
    cached = makeGuestSnapshot(lang);
    return cached;
  }
}

/**
 * Synchronous accessor for the cached snapshot. Returns `null` if
 * `loadYandexAuth` has not been awaited yet.
 */
export function getYandexAuth(): YandexAuthSnapshot | null {
  return cached;
}
