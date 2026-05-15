// Thin wrapper around the Yandex Games SDK so the rest of the Yandex-only
// code paths don't have to deal with the global `YaGames` object directly.

import { setLanguage } from '../../shared/i18n';
import type { Language } from '../../shared/i18n';

interface PlatformState {
  ysdk: YSDK | null;
  player: YPlayer | null;
  ready: boolean;
}

const state: PlatformState = {
  ysdk: null,
  player: null,
  ready: false,
};

const HAPTIC_THROTTLE_MS = 60;
let lastHapticAt = 0;

function vibrate(pattern: number | number[]): void {
  if (typeof navigator === 'undefined') return;
  const now = Date.now();
  if (now - lastHapticAt < HAPTIC_THROTTLE_MS) return;
  lastHapticAt = now;
  try {
    if (typeof navigator.vibrate === 'function') {
      navigator.vibrate(pattern);
    }
  } catch {
    // ignore
  }
}

/**
 * Initialize the SDK and the authorized player. Falls back to an offline
 * mode if YaGames is not present (local dev without the proxy).
 */
export async function initYandexPlatform(): Promise<{
  ysdk: YSDK | null;
  player: YPlayer | null;
}> {
  if (state.ready) {
    return { ysdk: state.ysdk, player: state.player };
  }

  const YaGames = window.YaGames;
  if (!YaGames) {
    console.warn(
      '[yandex] YaGames SDK not found on window — running in offline mode',
    );
    state.ready = true;
    return { ysdk: null, player: null };
  }

  try {
    const ysdk = await YaGames.init();
    state.ysdk = ysdk;

    // Sync UI language with the player's Yandex locale on first launch.
    try {
      const lang = ysdk.environment?.i18n?.lang;
      if (lang === 'ru' || lang === 'en') {
        const saved = localStorage.getItem('language');
        if (!saved) {
          setLanguage(lang as Language);
        }
      }
    } catch (e) {
      console.warn('[yandex] failed to read environment.i18n.lang', e);
    }

    try {
      const player = await ysdk.getPlayer({ signed: false });
      state.player = player;
    } catch (e) {
      console.warn('[yandex] getPlayer failed — guest mode', e);
    }

    state.ready = true;
    return { ysdk: state.ysdk, player: state.player };
  } catch (e) {
    console.error('[yandex] YaGames.init failed', e);
    state.ready = true;
    return { ysdk: null, player: null };
  }
}

export function getYsdk(): YSDK | null {
  return state.ysdk;
}

export function getPlayer(): YPlayer | null {
  return state.player;
}

export function isPlayerAuthorized(): boolean {
  return !!state.player && state.player.isAuthorized();
}

/**
 * Open the authorization dialog so the player can sign in with their Yandex
 * account. Without authorization cloud saves only persist for the device.
 */
export async function openAuthDialog(): Promise<boolean> {
  const ysdk = state.ysdk;
  if (!ysdk) return false;
  try {
    await ysdk.auth.openAuthDialog();
    const player = await ysdk.getPlayer({ signed: false });
    state.player = player;
    return player.isAuthorized();
  } catch (e) {
    console.warn('[yandex] openAuthDialog rejected', e);
    return false;
  }
}

/**
 * Tell the SDK we have finished loading. Yandex uses this for splash screen
 * sequencing in the games portal.
 */
export function signalLoadingReady(): void {
  try {
    state.ysdk?.features?.LoadingAPI?.ready();
  } catch (e) {
    console.warn('[yandex] LoadingAPI.ready failed', e);
  }
}

/**
 * Signal that an interactive gameplay session has started. The portal uses
 * this to pause auto-ads etc.
 */
export function signalGameplayStart(): void {
  try {
    state.ysdk?.features?.GameplayAPI?.start();
  } catch {
    // not fatal
  }
}

export function signalGameplayStop(): void {
  try {
    state.ysdk?.features?.GameplayAPI?.stop();
  } catch {
    // not fatal
  }
}

export const haptic = {
  light: () => vibrate(10),
  medium: () => vibrate(20),
  heavy: () => vibrate(30),
  success: () => vibrate([10, 30, 10]),
  warning: () => vibrate([20, 30, 20]),
  error: () => vibrate([30, 60, 30]),
};
