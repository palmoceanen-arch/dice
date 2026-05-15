// Entry point for the Yandex Games build of Street Dice.
//
// This file deliberately does NOT import anything Telegram-specific
// (multiplayer/, ui/MultiplayerUI, BoostsModal, BettingModal, ReactionWheel,
// ConnectionIndicator). When VITE_PLATFORM=yandex, vite.config.ts aliases
// the three multiplayer modules used inside game/Game.ts to local stubs in
// src/yandex/stubs/, so the resulting bundle contains no networking code.

import { Game } from './game/Game';
import { initI18n, setLanguage } from '../shared/i18n';
import type { Language } from '../shared/i18n';
import {
  initYandexPlatform,
  signalLoadingReady,
  signalGameplayStart,
  signalGameplayStop,
} from './yandex/platform';
import { cloudSave } from './yandex/cloudSave';
import { SoloUI } from './yandex/SoloUI';
import { loadYandexAuth } from './yandex/yandexAuth';
// Bring the multiplayer stub onto window — Game.ts and a few other modules
// look up `(window as any).wsClient` directly, so the stub must be reachable
// the same way the real client is in the Telegram build.
import { wsClient } from './yandex/stubs/WebSocketClient';

(window as any).wsClient = wsClient;

console.log(
  '%c🎲 Dice Game — Yandex Games build',
  'color: #ffd84d; font-size: 16px; font-weight: bold',
);

initI18n();

const canvas = document.getElementById('canvas') as HTMLCanvasElement | null;
if (!canvas) {
  throw new Error('Canvas element not found');
}

const game = new Game(canvas);
game.start();

// Expose for debugging and for the SoloUI to read.
(window as any).game = game;

const soloUI = new SoloUI(game);
soloUI.mount();
(window as any).soloUI = soloUI;

// Block native pull-to-refresh on mobile, same as the Telegram build.
document.body.addEventListener(
  'touchmove',
  (e) => {
    let target = e.target as HTMLElement | null;
    while (target && target !== document.body) {
      const style = window.getComputedStyle(target);
      if (style.overflowY === 'auto' || style.overflowY === 'scroll') return;
      target = target.parentElement;
    }
    e.preventDefault();
  },
  { passive: false },
);

const WS_URL: string =
  (import.meta as any).env?.VITE_WS_URL ??
  (typeof process !== 'undefined' ? process.env?.VITE_WS_URL : '') ??
  '';

(async () => {
  const { player } = await initYandexPlatform();
  await cloudSave.loadAll();

  // Capture the Yandex signed-player snapshot so the multiplayer WS client
  // can ship it to the server on every (re)connect. Cheap no-op in offline
  // / solo mode (returns a stable per-device guest uuid).
  await loadYandexAuth();

  // Kick off the live WebSocket connection if multiplayer is enabled for
  // this build (VITE_WS_URL set, e.g. wss://street-dice.online/ws).
  if (WS_URL && typeof (wsClient as any).connect === 'function') {
    (wsClient as any).connect().catch((e: unknown) => {
      console.warn('[main.yandex] initial WS connect failed (will auto-retry)', e);
    });
  }

  // Apply persisted settings.
  const settings = cloudSave.getSettings();
  if (settings.language) {
    setLanguage(settings.language as Language);
  }
  if (typeof (game as any).setGraphicsQuality === 'function') {
    try {
      (game as any).setGraphicsQuality(settings.graphics);
    } catch (e) {
      console.warn('[main.yandex] setGraphicsQuality failed', e);
    }
  }
  if (typeof (game as any).setSoundVolume === 'function') {
    try {
      (game as any).setSoundVolume(settings.soundVolume);
    } catch {
      // optional
    }
  }

  // Apply persisted pips and inventory.
  if (typeof (game as any).setPips === 'function') {
    (game as any).setPips(cloudSave.getPips());
  }
  soloUI.applyInventoryToGame();
  soloUI.refreshBalance();

  signalLoadingReady();
  signalGameplayStart();

  console.log(
    '[main.yandex] platform ready',
    player ? `player=${player.getUniqueID()}` : 'guest',
  );
})().catch((e) => {
  console.error('[main.yandex] init failed', e);
  signalLoadingReady();
});

// Track foregrounding so we can pause/resume gameplay analytics.
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    signalGameplayStop();
  } else {
    signalGameplayStart();
  }
});
