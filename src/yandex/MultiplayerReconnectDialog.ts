// Reconnect-to-active-game dialog for the Yandex Games build.
//
// When a player closes the page during an active multiplayer match the
// server keeps their slot warm for a short window. On the next successful
// `auth_success` the server pushes a `canReconnect: { lobbyId, timeLeft }`
// payload alongside the user record. The canonical Telegram client stores
// it on `wsClient.pendingReconnect` and the Telegram `MultiplayerUI` is
// responsible for surfacing a "Reconnect?" dialog (see
// src/ui/MultiplayerUI.ts:427 + `showReconnectDialog` at line 2681).
//
// The Yandex `MultiplayerLobbyUI` is mounted lazily — it doesn't exist
// until the player taps the Multiplayer menu item, so it can't catch
// `auth_success` at startup. This module is mounted eagerly from
// `main.yandex.ts` (only when `VITE_WS_URL` is set, i.e. live multiplayer
// mode), subscribes to the relevant wsClient events on construction, and
// pops the dialog when the server tells us a game is waiting.
//
// On "Reconnect" we call `wsClient.reconnectGame(lobbyId)`. The server
// responds with `game_reconnected`, which `GameSync` already knows how to
// consume — it restores the in-game HUD, dice state, turn order, etc.
// The dialog itself just gates that handoff with a user confirmation +
// countdown timer.

import { wsClient } from './stubs/WebSocketClient';
import { t, getCurrentLanguage } from '../../shared/i18n';

const STYLE_ID = 'yandex-mp-reconnect-style';
const OVERLAY_ID = 'yandex-mp-reconnect-overlay';

function l(en: string, ru: string): string {
  return getCurrentLanguage() === 'ru' ? ru : en;
}

function ensureStyles(): void {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .ymp-reconnect-overlay {
      position: fixed; inset: 0; z-index: 2000;
      background: rgba(0, 0, 0, 0.82);
      display: flex; align-items: center; justify-content: center;
      font-family: 'Montserrat', system-ui, sans-serif; color: #fff;
    }
    .ymp-reconnect-dialog {
      width: min(340px, 92%); padding: 22px 24px; box-sizing: border-box;
      border-radius: 16px;
      background: linear-gradient(180deg, #1f1f24 0%, #0d0d10 100%);
      box-shadow: 0 12px 36px rgba(0, 0, 0, 0.6);
      text-align: center;
      display: flex; flex-direction: column; gap: 12px;
    }
    .ymp-reconnect-dialog h3 {
      margin: 0; font-size: 18px; font-weight: 700;
    }
    .ymp-reconnect-dialog p {
      margin: 0; font-size: 14px; line-height: 1.4;
      opacity: 0.85;
    }
    .ymp-reconnect-timer {
      font-size: 14px; font-weight: 700; color: #ffd84d;
      margin-top: 4px;
    }
    .ymp-reconnect-actions {
      display: flex; gap: 10px; margin-top: 6px;
    }
    .ymp-reconnect-btn {
      flex: 1; padding: 11px 12px; border-radius: 10px; border: 0;
      cursor: pointer; font-weight: 700; font-size: 14px;
      font-family: inherit;
    }
    .ymp-reconnect-btn.primary { background: #4CAF50; color: #fff; }
    .ymp-reconnect-btn.ghost   { background: rgba(255, 255, 255, 0.10); color: #fff; }
    .ymp-reconnect-btn.primary:hover { filter: brightness(1.08); }
    .ymp-reconnect-btn.ghost:hover   { background: rgba(255, 255, 255, 0.18); }
  `;
  document.head.appendChild(style);
}

interface CanReconnect {
  lobbyId: string;
  timeLeft: number; // milliseconds
}

export class MultiplayerReconnectDialog {
  private overlay: HTMLDivElement | null = null;
  private timerId: ReturnType<typeof setInterval> | null = null;
  private deadlineAt = 0;
  private currentLobbyId = '';
  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  // Bound handler refs so we can `off()` if we ever destroy the dialog
  // (currently we keep it alive for the whole page lifetime).
  private readonly onAuthSuccess = (data: any) => {
    const cr = data?.canReconnect as CanReconnect | undefined;
    if (cr && typeof cr.lobbyId === 'string' && typeof cr.timeLeft === 'number') {
      this.show(cr.lobbyId, cr.timeLeft);
    }
  };
  private readonly onGameReconnected = () => {
    // Server confirmed the rejoin. GameSync takes over from here, so the
    // dialog can dismiss and any modals stacked on top can close.
    this.close();
    this.closeStackedMultiplayerModal();
    this.toast(
      t('notifications.reconnected') ||
        l('Reconnected to game!', 'Переподключение к игре!'),
    );
  };
  private readonly onReconnectFailed = (data: any) => {
    this.close();
    const fallback = l('Failed to reconnect', 'Не удалось переподключиться');
    const text = (typeof data?.message === 'string' && data.message) ||
      t('notifications.reconnectFailed') || fallback;
    this.toast(text, true);
    if (typeof (wsClient as any).clearPendingReconnect === 'function') {
      try { (wsClient as any).clearPendingReconnect(); } catch { /* swallow */ }
    }
  };

  mount(): void {
    ensureStyles();
    const c = wsClient as any;
    if (typeof c.on !== 'function') return;
    c.on('auth_success', this.onAuthSuccess);
    c.on('game_reconnected', this.onGameReconnected);
    c.on('reconnect_failed', this.onReconnectFailed);
    // If wsClient already received auth_success before we attached (race
    // with the boot flow), `pendingReconnect` will already be populated.
    // Surface the dialog from that fallback path too.
    const pending = c.pendingReconnect as CanReconnect | null | undefined;
    if (pending && pending.lobbyId) {
      this.show(pending.lobbyId, pending.timeLeft);
    }
  }

  private show(lobbyId: string, timeLeftMs: number): void {
    // Avoid stacking duplicate dialogs if the server retries auth.
    if (this.overlay && this.currentLobbyId === lobbyId) return;
    this.close();

    this.currentLobbyId = lobbyId;
    this.deadlineAt = Date.now() + Math.max(1000, timeLeftMs);

    const overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    overlay.className = 'ymp-reconnect-overlay';
    overlay.innerHTML = `
      <div class="ymp-reconnect-dialog" role="dialog" aria-modal="true">
        <h3>${l('Game in progress', 'Игра в процессе')}</h3>
        <p>${l(
          'You were disconnected from an active match.',
          'Вы были отключены от активного матча.',
        )}</p>
        <div class="ymp-reconnect-timer" data-role="timer"></div>
        <div class="ymp-reconnect-actions">
          <button class="ymp-reconnect-btn primary" data-act="reconnect">
            ${l('Reconnect', 'Переподключиться')}
          </button>
          <button class="ymp-reconnect-btn ghost" data-act="leave">
            ${l('Leave game', 'Выйти')}
          </button>
        </div>
      </div>
    `;
    overlay.addEventListener('click', (e) => {
      const target = e.target as HTMLElement | null;
      if (target?.dataset.act === 'reconnect') {
        this.acceptReconnect();
      } else if (target?.dataset.act === 'leave') {
        this.declineReconnect();
      }
    });
    document.body.appendChild(overlay);
    this.overlay = overlay;
    this.renderTimer();
    this.timerId = setInterval(() => this.renderTimer(), 1000);
  }

  private renderTimer(): void {
    if (!this.overlay) return;
    const el = this.overlay.querySelector<HTMLDivElement>('[data-role="timer"]');
    if (!el) return;
    const remaining = Math.max(0, Math.ceil((this.deadlineAt - Date.now()) / 1000));
    el.textContent = `${l('Time to reconnect:', 'Времени осталось:')} ${remaining}s`;
    if (remaining <= 0) {
      this.declineReconnect(true);
    }
  }

  private acceptReconnect(): void {
    const lobbyId = this.currentLobbyId;
    this.close();
    const c = wsClient as any;
    if (typeof c.reconnectGame === 'function') {
      try { c.reconnectGame(lobbyId); } catch (e) {
        console.warn('[yandex-reconnect] reconnectGame threw', e);
      }
    }
  }

  private declineReconnect(expired = false): void {
    this.close();
    const c = wsClient as any;
    if (typeof c.clearPendingReconnect === 'function') {
      try { c.clearPendingReconnect(); } catch { /* swallow */ }
    }
    if (expired) {
      this.toast(l('Reconnect time expired', 'Время на переподключение истекло'), true);
    }
  }

  private close(): void {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
    }
    this.currentLobbyId = '';
    this.deadlineAt = 0;
  }

  // When the player accepted the reconnect, the Yandex MultiplayerLobbyUI
  // may have been left open from before they closed the page. Force it
  // shut so it doesn't ghost over the in-game HUD that GameSync is about
  // to mount.
  private closeStackedMultiplayerModal(): void {
    const lobby = (window as any).multiplayerLobbyUI;
    if (lobby && typeof lobby.close === 'function') {
      try { lobby.close(); } catch { /* swallow */ }
    }
  }

  private toast(message: string, isError = false): void {
    if (this.toastTimer !== null) {
      clearTimeout(this.toastTimer);
      this.toastTimer = null;
    }
    let el = document.getElementById('ymp-reconnect-toast') as HTMLDivElement | null;
    if (!el) {
      el = document.createElement('div');
      el.id = 'ymp-reconnect-toast';
      el.style.cssText = `
        position: fixed; left: 50%; bottom: 80px; transform: translateX(-50%);
        background: rgba(20, 20, 22, 0.95); color: #fff;
        padding: 10px 16px; border-radius: 10px;
        font-family: 'Montserrat', system-ui, sans-serif; font-size: 13px;
        font-weight: 600; box-shadow: 0 6px 18px rgba(0, 0, 0, 0.5);
        z-index: 2100; pointer-events: none;
      `;
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.style.color = isError ? '#ff8a8a' : '#fff';
    el.style.opacity = '1';
    this.toastTimer = setTimeout(() => {
      if (el) el.style.opacity = '0';
    }, 2400);
  }
}
