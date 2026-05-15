// Minimal multiplayer lobby UI for the Yandex Games build.
//
// Telegram's MultiplayerUI uses a friends list, Telegram share-links and
// "invite by Telegram ID" flows that are unavailable inside Yandex Games.
// In the Yandex environment every player joins by typing (or pasting) the
// 8-character lobby code that the host shares however they like (the game's
// own clipboard "copy" button, Yandex's share feature, a chat outside the
// portal, etc.).
//
// State machine of the modal:
//
//   HOME    -> CREATE | JOIN
//   CREATE  -> waits for `lobby_created` -> IN_LOBBY
//   JOIN    -> waits for `lobby_joined`  -> IN_LOBBY
//   IN_LOBBY -> host can press Start; everyone gets `game_started` and the
//               modal closes (gameplay continues in Game.ts).
//
// The class is intentionally a flat "render the whole modal on every state
// change" affair. It is a few hundred lines and easy to audit; we explicitly
// did not try to share rendering code with the 2900-line Telegram
// MultiplayerUI.

import { wsClient } from './stubs/WebSocketClient';
import { haptic } from './platform';
import { t } from '../../shared/i18n';

type GameMode = 'street_craps' | 'mexico' | 'greedy_pig' | 'poker_dice';

interface LobbyPlayer {
  oderId?: number;
  nickname?: string;
  avatarUrl?: string | null;
  user?: { nickname?: string; avatarUrl?: string | null };
}

interface LobbyShape {
  id: string;
  hostId: number;
  gameMode: GameMode | 'free_roll';
  status: 'voting' | 'waiting' | 'playing' | 'finished';
  selectedTableId: number | null;
  maxPlayers: number;
  players: LobbyPlayer[];
}

type Stage = 'home' | 'create' | 'join' | 'in_lobby' | 'busy';

const STYLE_ID = 'yandex-mp-lobby-style';

function ensureStyles(): void {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .ymp-overlay {
      position: fixed; inset: 0; z-index: 150;
      background: rgba(0, 0, 0, 0.78);
      display: none; align-items: center; justify-content: center;
      font-family: 'Montserrat', system-ui, sans-serif; color: #fff;
    }
    .ymp-overlay.open { display: flex; }
    .ymp-panel {
      width: min(440px, 94%); max-height: 92vh;
      padding: 20px 22px; box-sizing: border-box;
      border-radius: 16px;
      background: linear-gradient(180deg, #1f1f24 0%, #0d0d10 100%);
      box-shadow: 0 10px 40px rgba(0,0,0,0.6);
      display: flex; flex-direction: column; gap: 14px;
      overflow-y: auto;
    }
    .ymp-header { display: flex; align-items: center; justify-content: space-between; }
    .ymp-header h2 { margin: 0; font-size: 18px; }
    .ymp-close {
      width: 32px; height: 32px; border-radius: 50%; border: 0;
      background: rgba(255,255,255,0.08); color: #fff;
      cursor: pointer; font-size: 18px; line-height: 1; font-family: inherit;
    }
    .ymp-row { display: flex; gap: 10px; }
    .ymp-row.col { flex-direction: column; }
    .ymp-btn {
      padding: 12px 14px; border-radius: 10px; border: 0;
      cursor: pointer; font-weight: 700; font-size: 14px; font-family: inherit;
    }
    .ymp-btn.primary  { background: #ffd84d; color: #1a1a1a; flex: 1; }
    .ymp-btn.ghost    { background: rgba(255,255,255,0.08); color: #fff; flex: 1; }
    .ymp-btn.danger   { background: #c84a4a; color: #fff; }
    .ymp-btn.icon     { padding: 10px 12px; }
    .ymp-btn:disabled { opacity: 0.5; cursor: default; }

    .ymp-mode-card {
      display: flex; align-items: center; gap: 10px;
      padding: 12px 14px; border-radius: 12px;
      background: rgba(255,255,255,0.06); cursor: pointer;
      transition: background 0.15s;
    }
    .ymp-mode-card:hover { background: rgba(255,255,255,0.12); }
    .ymp-mode-card .name { font-weight: 700; font-size: 14px; }
    .ymp-mode-card .sub  { font-size: 12px; opacity: 0.7; margin-top: 2px; }

    .ymp-code-input {
      flex: 1; padding: 12px 14px; border-radius: 10px; border: 0;
      background: rgba(255,255,255,0.08); color: #fff;
      font-family: 'JetBrains Mono', 'SF Mono', monospace;
      font-size: 18px; letter-spacing: 4px; text-align: center;
      text-transform: uppercase;
    }
    .ymp-code-input::placeholder { color: rgba(255,255,255,0.4); letter-spacing: 4px; }

    .ymp-code-display {
      display: flex; align-items: center; gap: 8px;
      padding: 12px; border-radius: 10px;
      background: rgba(255,216,77,0.10);
      border: 1px solid rgba(255,216,77,0.30);
      font-family: 'JetBrains Mono', 'SF Mono', monospace;
      font-size: 22px; font-weight: 700; letter-spacing: 5px;
      color: #ffd84d; justify-content: center;
    }

    .ymp-player {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 12px; border-radius: 10px;
      background: rgba(255,255,255,0.04);
    }
    .ymp-player .avatar {
      width: 32px; height: 32px; border-radius: 50%;
      background: rgba(255,255,255,0.1);
      background-size: cover; background-position: center;
      flex-shrink: 0;
    }
    .ymp-player .name { flex: 1; font-size: 14px; font-weight: 600; }
    .ymp-player .badge {
      font-size: 11px; padding: 2px 8px; border-radius: 99px;
      background: rgba(255,216,77,0.2); color: #ffd84d; font-weight: 700;
    }

    .ymp-status {
      font-size: 13px; opacity: 0.7;
      padding: 8px 10px; border-radius: 8px;
      background: rgba(255,255,255,0.04);
      text-align: center;
    }
    .ymp-status.err { color: #ff8a8a; opacity: 1; background: rgba(255,80,80,0.10); }
  `;
  document.head.appendChild(style);
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (ch) => {
    switch (ch) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#39;';
      default:  return ch;
    }
  });
}

const MODE_LABELS: Record<GameMode, { name: string; sub: string }> = {
  street_craps: {
    name: "Palmo's Dice",
    sub: '2–4 players · fixed pips to winner',
  },
  mexico: {
    name: 'Mexico',
    sub: '2–4 players · classic Mexico rules',
  },
  greedy_pig: {
    name: 'Greedy Pig',
    sub: '2–4 players · push-your-luck',
  },
  poker_dice: {
    name: 'Poker Dice',
    sub: '2–4 players · best 5-dice hand wins',
  },
};

export class MultiplayerLobbyUI {
  private panel!: HTMLDivElement;
  private overlay!: HTMLDivElement;
  private stage: Stage = 'home';
  private currentLobby: LobbyShape | null = null;
  private errorText: string | null = null;
  private mounted = false;

  // Bound handler refs so we can `off()` them on close (we re-attach on open).
  private readonly onLobbyCreated = (m: any) => this.handleLobbyEvent(m, 'created');
  private readonly onLobbyJoined  = (m: any) => this.handleLobbyEvent(m, 'joined');
  private readonly onLobbyState   = (m: any) => this.handleLobbyEvent(m, 'state');
  private readonly onLobbyLeft    = ()       => this.handleLobbyLeft();
  private readonly onLobbyError   = (m: any) => this.handleLobbyError(m);
  private readonly onError        = (m: any) => this.handleLobbyError(m);
  private readonly onGameStarted  = ()       => this.handleGameStarted();

  mount(): void {
    if (this.mounted) return;
    ensureStyles();
    this.overlay = document.createElement('div');
    this.overlay.className = 'ymp-overlay';
    this.panel = document.createElement('div');
    this.panel.className = 'ymp-panel';
    this.overlay.appendChild(this.panel);
    document.body.appendChild(this.overlay);

    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });

    this.mounted = true;
  }

  open(): void {
    if (!this.mounted) this.mount();
    this.attachWsHandlers();
    this.stage = this.currentLobby ? 'in_lobby' : 'home';
    this.errorText = null;
    this.overlay.classList.add('open');
    this.render();
  }

  close(): void {
    this.overlay.classList.remove('open');
    this.detachWsHandlers();
  }

  private attachWsHandlers(): void {
    const c = wsClient as any;
    if (typeof c.on !== 'function') return;
    c.on('lobby_created', this.onLobbyCreated);
    c.on('lobby_joined',  this.onLobbyJoined);
    c.on('lobby_state',   this.onLobbyState);
    c.on('lobby_left',    this.onLobbyLeft);
    c.on('lobby_error',   this.onLobbyError);
    c.on('error',         this.onError);
    c.on('game_started',  this.onGameStarted);
  }

  private detachWsHandlers(): void {
    const c = wsClient as any;
    if (typeof c.off !== 'function') return;
    c.off('lobby_created', this.onLobbyCreated);
    c.off('lobby_joined',  this.onLobbyJoined);
    c.off('lobby_state',   this.onLobbyState);
    c.off('lobby_left',    this.onLobbyLeft);
    c.off('lobby_error',   this.onLobbyError);
    c.off('error',         this.onError);
    c.off('game_started',  this.onGameStarted);
  }

  private handleLobbyEvent(message: any, _kind: 'created' | 'joined' | 'state'): void {
    if (message?.lobby) {
      this.currentLobby = message.lobby as LobbyShape;
      this.stage = 'in_lobby';
      this.errorText = null;
      this.render();
    }
  }

  private handleLobbyLeft(): void {
    this.currentLobby = null;
    this.stage = 'home';
    this.render();
  }

  private handleLobbyError(message: any): void {
    const text = (message && (message.message || message.reason)) || 'Unknown error';
    this.errorText = String(text);
    if (this.stage === 'busy') this.stage = this.currentLobby ? 'in_lobby' : 'home';
    this.render();
  }

  private handleGameStarted(): void {
    // Game.ts takes over rendering for the active match.
    this.currentLobby = null;
    this.stage = 'home';
    this.close();
  }

  // -- actions --

  private startCreate(mode: GameMode): void {
    if (!this.isConnected()) return;
    this.stage = 'busy';
    this.errorText = null;
    this.render();
    haptic.light();
    try {
      const c = wsClient as any;
      if (typeof c.createLobby === 'function') {
        c.createLobby(mode);
      } else {
        this.errorText = 'Multiplayer not available on this build';
        this.stage = 'home';
        this.render();
      }
    } catch (e) {
      this.errorText = e instanceof Error ? e.message : String(e);
      this.stage = 'home';
      this.render();
    }
  }

  private startJoin(rawCode: string): void {
    const code = rawCode.trim().toUpperCase();
    if (!/^[A-Z0-9]{8}$/.test(code)) {
      this.errorText = 'Code must be 8 characters (A–Z, 0–9)';
      this.render();
      return;
    }
    if (!this.isConnected()) return;
    this.stage = 'busy';
    this.errorText = null;
    this.render();
    haptic.light();
    try {
      const c = wsClient as any;
      if (typeof c.joinLobby === 'function') {
        c.joinLobby(code);
      } else {
        this.errorText = 'Multiplayer not available on this build';
        this.stage = 'home';
        this.render();
      }
    } catch (e) {
      this.errorText = e instanceof Error ? e.message : String(e);
      this.stage = 'home';
      this.render();
    }
  }

  private leaveCurrent(): void {
    const c = wsClient as any;
    if (typeof c.leaveLobby === 'function') {
      c.leaveLobby();
    }
    this.currentLobby = null;
    this.stage = 'home';
    this.errorText = null;
    this.render();
  }

  private startMatch(): void {
    const c = wsClient as any;
    if (typeof c.startGame === 'function') {
      c.startGame();
    }
  }

  private async copyCode(code: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(code);
      haptic.success();
    } catch {
      // Fallback for environments that don't expose the async clipboard API.
      try {
        const ta = document.createElement('textarea');
        ta.value = code;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        haptic.success();
      } catch {
        haptic.warning();
      }
    }
  }

  private isConnected(): boolean {
    const c = wsClient as any;
    const ok = !!c.isConnected;
    if (!ok) {
      this.errorText = 'Not connected to server. Try again in a moment.';
    }
    return ok;
  }

  // -- rendering --

  private render(): void {
    if (!this.mounted) return;
    switch (this.stage) {
      case 'home':     this.renderHome();    break;
      case 'create':   this.renderCreate();  break;
      case 'join':     this.renderJoin();    break;
      case 'in_lobby': this.renderInLobby(); break;
      case 'busy':     this.renderBusy();    break;
    }
  }

  private headerHtml(title: string, showBack: boolean): string {
    const back = showBack
      ? `<button class="ymp-close" data-act="back" aria-label="Back">‹</button>`
      : `<span style="width:32px"></span>`;
    return `
      <div class="ymp-header">
        ${back}
        <h2>${escapeHtml(title)}</h2>
        <button class="ymp-close" data-act="close" aria-label="Close">×</button>
      </div>
    `;
  }

  private statusHtml(): string {
    if (!this.errorText) return '';
    return `<div class="ymp-status err">${escapeHtml(this.errorText)}</div>`;
  }

  private renderHome(): void {
    this.panel.innerHTML = `
      ${this.headerHtml(t('multiplayer.title') || 'Multiplayer', false)}
      ${this.statusHtml()}
      <div class="ymp-row col">
        <button class="ymp-btn primary" data-act="go-create">
          ${escapeHtml(t('multiplayer.createLobby') || 'Create lobby')}
        </button>
        <button class="ymp-btn ghost" data-act="go-join">
          ${escapeHtml(t('multiplayer.joinByCode') || 'Join by code')}
        </button>
      </div>
      <div class="ymp-status" style="font-size:12px">
        ${escapeHtml(
          t('multiplayer.help') ||
          "Invite friends by sharing the 8-character lobby code. Winner gets pips — no real-money bets.",
        )}
      </div>
    `;
    this.bindActionButtons();
  }

  private renderCreate(): void {
    const modes: GameMode[] = ['street_craps', 'poker_dice', 'mexico', 'greedy_pig'];
    const cards = modes
      .map(
        (m) => `
          <div class="ymp-mode-card" data-mode="${m}" role="button" tabindex="0">
            <div>
              <div class="name">${escapeHtml(MODE_LABELS[m].name)}</div>
              <div class="sub">${escapeHtml(MODE_LABELS[m].sub)}</div>
            </div>
          </div>
        `,
      )
      .join('');
    this.panel.innerHTML = `
      ${this.headerHtml(t('multiplayer.createLobby') || 'Create lobby', true)}
      ${this.statusHtml()}
      <div class="ymp-row col">${cards}</div>
    `;
    this.bindActionButtons();
    this.panel.querySelectorAll<HTMLElement>('.ymp-mode-card').forEach((el) => {
      el.addEventListener('click', () => {
        const m = el.dataset.mode as GameMode | undefined;
        if (m) this.startCreate(m);
      });
    });
  }

  private renderJoin(): void {
    this.panel.innerHTML = `
      ${this.headerHtml(t('multiplayer.joinByCode') || 'Join by code', true)}
      ${this.statusHtml()}
      <div class="ymp-row">
        <input class="ymp-code-input" id="ymp-code-in"
               maxlength="8" autocomplete="off" spellcheck="false"
               placeholder="ABCD1234" />
      </div>
      <div class="ymp-row">
        <button class="ymp-btn primary" data-act="submit-join">
          ${escapeHtml(t('multiplayer.join') || 'Join')}
        </button>
      </div>
    `;
    this.bindActionButtons();
    const input = this.panel.querySelector<HTMLInputElement>('#ymp-code-in');
    input?.focus();
    input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.startJoin(input.value);
      }
    });
  }

  private renderBusy(): void {
    this.panel.innerHTML = `
      ${this.headerHtml(t('multiplayer.title') || 'Multiplayer', false)}
      <div class="ymp-status">
        ${escapeHtml(t('multiplayer.connecting') || 'Connecting…')}
      </div>
    `;
    this.bindActionButtons();
  }

  private renderInLobby(): void {
    const lobby = this.currentLobby;
    if (!lobby) {
      this.renderHome();
      return;
    }
    const c = wsClient as any;
    const myUserId: number | undefined = c.user?.id;
    const isHost = !!myUserId && lobby.hostId === myUserId;
    const modeLabel =
      (MODE_LABELS as Record<string, { name: string }>)[lobby.gameMode]?.name ??
      lobby.gameMode;
    const playersHtml = (lobby.players || [])
      .map((p) => {
        const nick =
          p.nickname || p.user?.nickname || `Player ${p.oderId ?? '?'}`;
        const avatar = p.avatarUrl || p.user?.avatarUrl || '';
        const isYou =
          myUserId && (p as any).userId
            ? (p as any).userId === myUserId
            : false;
        const isHostPlayer = (p as any).userId === lobby.hostId;
        const badge = isHostPlayer
          ? `<span class="badge">${escapeHtml(t('multiplayer.host') || 'host')}</span>`
          : isYou
            ? `<span class="badge">${escapeHtml(t('multiplayer.you') || 'you')}</span>`
            : '';
        return `
          <div class="ymp-player">
            <div class="avatar" style="${avatar ? `background-image:url('${escapeHtml(avatar)}')` : ''}"></div>
            <div class="name">${escapeHtml(nick)}</div>
            ${badge}
          </div>
        `;
      })
      .join('');

    const startBtn = isHost
      ? `<button class="ymp-btn primary" data-act="start-match" ${
          lobby.players.length < 2 ? 'disabled' : ''
        }>
          ${escapeHtml(t('multiplayer.start') || 'Start match')}
        </button>`
      : `<div class="ymp-status">${escapeHtml(
          t('multiplayer.waitingHost') || 'Waiting for host to start…',
        )}</div>`;

    this.panel.innerHTML = `
      ${this.headerHtml(modeLabel, false)}
      ${this.statusHtml()}
      <div class="ymp-code-display" title="Lobby code">
        ${escapeHtml(lobby.id)}
      </div>
      <div class="ymp-row">
        <button class="ymp-btn ghost" data-act="copy-code">
          ${escapeHtml(t('multiplayer.copy') || 'Copy code')}
        </button>
        <button class="ymp-btn danger" data-act="leave">
          ${escapeHtml(t('multiplayer.leave') || 'Leave')}
        </button>
      </div>
      <div class="ymp-row col">${playersHtml}</div>
      <div class="ymp-row col">${startBtn}</div>
    `;
    this.bindActionButtons();
  }

  private bindActionButtons(): void {
    this.panel.querySelectorAll<HTMLElement>('[data-act]').forEach((el) => {
      const act = el.dataset.act!;
      el.addEventListener('click', () => this.dispatchAction(act));
    });
  }

  private dispatchAction(act: string): void {
    switch (act) {
      case 'close':       this.close(); break;
      case 'back':
        this.errorText = null;
        this.stage = this.currentLobby ? 'in_lobby' : 'home';
        this.render();
        break;
      case 'go-create':
        this.errorText = null;
        this.stage = 'create';
        this.render();
        break;
      case 'go-join':
        this.errorText = null;
        this.stage = 'join';
        this.render();
        break;
      case 'submit-join': {
        const input = this.panel.querySelector<HTMLInputElement>('#ymp-code-in');
        this.startJoin(input?.value ?? '');
        break;
      }
      case 'copy-code':
        if (this.currentLobby) this.copyCode(this.currentLobby.id);
        break;
      case 'leave':
        this.leaveCurrent();
        break;
      case 'start-match':
        this.startMatch();
        break;
    }
  }
}
