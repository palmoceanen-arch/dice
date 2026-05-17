// Guards against the host being left alone in a multiplayer lobby after a
// match ends.
//
// Problem: in the post-game state (result modal with "New Game" / "Exit"
// buttons), the server keeps the lobby alive until everyone explicitly
// calls `leave_lobby`. If every opponent presses Exit and the host stays,
// the host can press "New Game" and the server happily restarts the
// match with a single player — effectively letting them play with
// themselves. The Telegram build doesn't have this loophole because the
// canonical `MultiplayerUI` already listens to `player_left` while
// `isInGame === true` and auto-leaves on the first opponent drop (see
// src/ui/MultiplayerUI.ts line 833). The Yandex build's
// `MultiplayerLobbyUI` is lazy-mounted and doesn't subscribe to
// `player_left` at all.
//
// This module is the Yandex-side equivalent of that Telegram listener.
// It mounts eagerly from `main.yandex.ts`, watches for `player_left`
// while `gameSync.isMultiplayerActive()` is true, and on the first
// opponent drop:
//   1. Calls `wsClient.leaveLobby()` so the server tears down the lobby
//      cleanly.
//   2. Emits `game_ended_by_disconnect` so GameSync resets the in-game
//      HUD and returns the player to the idle / lobby home screen.
//   3. Surfaces a non-blocking toast so the host understands why they
//      were kicked.
//
// The server-side `handleRestartGame` is also patched to reject restarts
// when fewer than 2 players are present, in case the client check is
// bypassed (e.g. raw `restart_game` message from devtools).

import { wsClient } from './stubs/WebSocketClient';
import { t, getCurrentLanguage } from '../../shared/i18n';

function l(en: string, ru: string): string {
  return getCurrentLanguage() === 'ru' ? ru : en;
}

const TOAST_ID = 'yandex-mp-lobby-guard-toast';

export class MultiplayerLobbyGuard {
  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  private readonly onPlayerLeft = (_data: any) => {
    if (!this.isInActiveMatch()) return;
    // Mirror the Telegram MultiplayerUI behaviour: the moment any
    // opponent leaves a live multiplayer game, drop the host too so the
    // lobby can't be reused for solo play.
    const c = wsClient as any;
    try {
      if (typeof c.leaveLobby === 'function') c.leaveLobby();
    } catch (e) {
      console.warn('[yandex-lobby-guard] leaveLobby failed', e);
    }
    try {
      if (typeof c.emit === 'function') c.emit('game_ended_by_disconnect', {});
    } catch (e) {
      console.warn('[yandex-lobby-guard] emit failed', e);
    }
    this.toast(
      t('notifications.playerLeft') ||
        l('Opponent left the match.', 'Соперник покинул матч.'),
    );
  };

  mount(): void {
    const c = wsClient as any;
    if (typeof c.on !== 'function') return;
    c.on('player_left', this.onPlayerLeft);
  }

  private isInActiveMatch(): boolean {
    const game = (window as any).game;
    const gameSync = game && typeof game.getGameSync === 'function'
      ? game.getGameSync()
      : null;
    return !!(gameSync && typeof gameSync.isMultiplayerActive === 'function'
      && gameSync.isMultiplayerActive());
  }

  private toast(message: string): void {
    if (this.toastTimer !== null) {
      clearTimeout(this.toastTimer);
      this.toastTimer = null;
    }
    let el = document.getElementById(TOAST_ID) as HTMLDivElement | null;
    if (!el) {
      el = document.createElement('div');
      el.id = TOAST_ID;
      el.style.cssText = `
        position: fixed; left: 50%; bottom: 96px; transform: translateX(-50%);
        background: rgba(20, 20, 22, 0.95); color: #fff;
        padding: 10px 16px; border-radius: 10px;
        font-family: 'Montserrat', system-ui, sans-serif; font-size: 13px;
        font-weight: 600; box-shadow: 0 6px 18px rgba(0, 0, 0, 0.5);
        z-index: 2100; pointer-events: none;
        transition: opacity 0.25s;
      `;
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.style.opacity = '1';
    this.toastTimer = setTimeout(() => {
      if (el) el.style.opacity = '0';
    }, 2800);
  }
}
