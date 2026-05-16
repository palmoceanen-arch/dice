// Multiplayer lobby UI for the Yandex Games build.
//
// Telegram's MultiplayerUI uses a friends list, Telegram share-links and
// "invite by Telegram ID" flows that are unavailable inside Yandex Games.
// The Yandex build has its own minimal UI that supports three flows:
//
//   1. Quick play — server-side matchmaking. Pick a queue mode (1×1 duel
//      or "Any" 3–5 player group) and a bet, the server pairs you with
//      compatible opponents and we land directly in an in-lobby view.
//   2. Create lobby — pick a game mode, then a bet, get an 8-character
//      lobby code to share. Other players join by typing the code.
//   3. Join by code — paste the 8-character code from a friend.
//
// Bets are real pips on the Yandex build (the user explicitly asked for
// betting parity with Telegram). Bet amounts come from the
// `ALLOWED_BETS` allow-list, mirrored on the server in
// `services/matchmaking.ts`. The "0" chip is the no-bet flavour (winner
// gets a fixed pip prize, no in-round BettingManager flow).
//
// State machine of the modal:
//
//   HOME      -> QUICK_PLAY | CREATE | JOIN
//   QUICK_PLAY -> SEARCHING  -> IN_LOBBY (via `mm_match_found`)
//   CREATE    -> CREATE_BET  -> IN_LOBBY (via `lobby_created`)
//   JOIN      -> IN_LOBBY                (via `lobby_joined`)
//   IN_LOBBY  -> host can press Start; everyone gets `game_started` and
//               the modal closes (gameplay continues in Game.ts).
//
// The class is intentionally a flat "render the whole modal on every
// state change" affair. It is a few hundred lines and easy to audit; we
// explicitly did not try to share rendering code with the 2900-line
// Telegram MultiplayerUI.

import { wsClient } from './stubs/WebSocketClient';
import { haptic } from './platform';
import { t, getCurrentLanguage } from '../../shared/i18n';

// Tiny localization fallback. The Yandex lobby reaches keys (e.g.
// `multiplayer.title`) defined in `shared/i18n/locales/*.ts`. If a key
// is ever missing `t()` returns the raw key, so this helper picks a
// language-specific literal for anything we want to render even with a
// stale catalog.
function l(en: string, ru: string): string {
  return getCurrentLanguage() === 'ru' ? ru : en;
}

// Mirrors server validators (services/users.ts setNickname,
// utils/validator.ts NicknameSchema): 3-32 chars, Unicode letters / digits /
// underscore only. Client-side check is purely UX — the server is the
// source of truth.
const NICKNAME_RE = /^[\p{L}\p{N}_]+$/u;
const NICKNAME_MIN = 3;
const NICKNAME_MAX = 32;

type GameMode = 'street_craps' | 'mexico' | 'greedy_pig' | 'poker_dice';
type QueueMode = 'duel' | 'any';

// Mirrors `ALLOWED_BETS` in `server/src/services/matchmaking.ts`. Anything
// outside this list is rejected by the queue / create-lobby handlers, so
// keep both ends in lockstep when adding a chip.
const ALLOWED_BETS: ReadonlyArray<number> = [0, 10, 50, 100, 500];

interface LobbyPlayer {
  oderId?: number;
  userId?: number;
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
  noBet?: boolean;
  betAmount?: number;
  players: LobbyPlayer[];
}

interface PlayerStatsShape {
  xp: number;
  level: number;
  gamesPlayed: number;
  wins: number;
  losses: number;
  pips: number;
}

type Stage =
  | 'home'
  | 'quick_play'
  | 'searching'
  | 'create'
  | 'create_bet'
  | 'join'
  | 'in_lobby'
  | 'busy';

type InfoKind = 'err' | 'ok';

const STYLE_ID = 'yandex-mp-lobby-style';

// Cumulative XP required to reach `level`. Matches
// `server/src/services/stats.ts:xpForLevel` so the progress bar lines
// up with what the server uses to compute the level.
function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  return 50 * level * (level - 1);
}

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
    .ymp-mode-card.active { background: rgba(255,216,77,0.18); outline: 1px solid rgba(255,216,77,0.4); }
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
    .ymp-status.ok  { color: #7be58a; opacity: 1; background: rgba(70,200,90,0.12); }

    .ymp-section {
      display: flex; flex-direction: column; gap: 6px;
      padding: 10px 12px; border-radius: 10px;
      background: rgba(255,255,255,0.04);
    }
    .ymp-section-title {
      font-size: 11px; opacity: 0.55; text-transform: uppercase;
      letter-spacing: 0.6px;
    }
    .ymp-input {
      flex: 1; padding: 10px 12px; border-radius: 8px; border: 0;
      background: rgba(255,255,255,0.10); color: #fff;
      font-family: inherit; font-size: 14px; min-width: 0;
    }
    .ymp-input::placeholder { color: rgba(255,255,255,0.4); }

    /* --- Profile widget --- */
    .ymp-profile {
      display: flex; flex-direction: column; gap: 8px;
      padding: 12px 14px; border-radius: 12px;
      background: rgba(255,255,255,0.05);
    }
    .ymp-profile .row1 {
      display: flex; align-items: center; justify-content: space-between;
      gap: 12px;
    }
    .ymp-profile .level-pill {
      font-size: 11px; font-weight: 700;
      padding: 4px 10px; border-radius: 99px;
      background: rgba(255,216,77,0.2); color: #ffd84d;
      letter-spacing: 0.3px;
    }
    .ymp-profile .pips {
      font-weight: 700; font-size: 14px; color: #ffd84d;
      display: inline-flex; align-items: center; gap: 4px;
    }
    .ymp-profile .pips::before { content: '◈'; }
    .ymp-profile .xpbar {
      position: relative; height: 6px; border-radius: 99px;
      background: rgba(255,255,255,0.08); overflow: hidden;
    }
    .ymp-profile .xpbar > span {
      position: absolute; inset: 0 auto 0 0;
      background: linear-gradient(90deg, #ffd84d 0%, #ffb340 100%);
      border-radius: 99px;
    }
    .ymp-profile .xp-text {
      display: flex; justify-content: space-between;
      font-size: 11px; opacity: 0.65;
    }
    .ymp-profile .stats {
      display: flex; gap: 12px; font-size: 12px;
      opacity: 0.8; flex-wrap: wrap;
    }
    .ymp-profile .stats b { color: #fff; font-weight: 700; }

    /* --- Bet chip selector --- */
    .ymp-bet-row {
      display: flex; flex-wrap: wrap; gap: 8px;
    }
    .ymp-chip {
      flex: 1 0 calc(33% - 8px);
      padding: 12px 8px; border-radius: 10px; border: 0;
      cursor: pointer;
      background: rgba(255,255,255,0.08); color: #fff;
      font-family: inherit; font-weight: 700; font-size: 14px;
      display: flex; flex-direction: column; align-items: center; gap: 2px;
      transition: background 0.15s, outline 0.15s;
    }
    .ymp-chip:hover { background: rgba(255,255,255,0.14); }
    .ymp-chip.active {
      background: rgba(255,216,77,0.22);
      outline: 1px solid rgba(255,216,77,0.6);
      color: #ffd84d;
    }
    .ymp-chip[disabled] { opacity: 0.4; cursor: default; }
    .ymp-chip .amount { font-size: 16px; }
    .ymp-chip .amount.zero { color: #7be58a; }
    .ymp-chip .label { font-size: 10px; opacity: 0.7; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }

    .ymp-help {
      font-size: 12px; opacity: 0.7; line-height: 1.4;
    }
    .ymp-help b { opacity: 0.95; color: #ffd84d; }

    /* --- Searching spinner --- */
    .ymp-spinner {
      width: 28px; height: 28px;
      border: 3px solid rgba(255,255,255,0.15);
      border-top-color: #ffd84d;
      border-radius: 50%;
      animation: ymp-spin 0.9s linear infinite;
      margin: 0 auto;
    }
    @keyframes ymp-spin { to { transform: rotate(360deg); } }
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

// Display labels match the codebase's shared i18n catalog
// (shared/i18n/locales/*.ts). `poker_dice` is rendered as "Palmo's Dice"
// because the server's `poker_dice` registration points at the Palmo's
// Dice mode handler (palmosDice.ts → name: 'poker_dice').
const MODE_LABELS: Record<GameMode, { name: string; sub: string }> = {
  poker_dice: {
    name: "Palmo's Dice",
    sub: '2–4 players · poker-style dice',
  },
  street_craps: {
    name: 'Street Craps',
    sub: '2–4 players · classic street craps',
  },
  mexico: {
    name: 'Mexico',
    sub: '2–4 players · bluff & roll',
  },
  greedy_pig: {
    name: 'Greedy Pig',
    sub: '2–4 players · press your luck',
  },
};

// Format a bet amount for the chip button. `0` is rendered as "Free" /
// "Без ставки" because pips are positive integers and "0 pips" reads as
// awkward.
function formatBet(amount: number): { amount: string; label: string; isFree: boolean } {
  if (amount === 0) {
    return {
      amount: '✦',
      label: l('Free', 'Без ставки'),
      isFree: true,
    };
  }
  return {
    amount: String(amount),
    label: l('pips', 'очк.'),
    isFree: false,
  };
}

export class MultiplayerLobbyUI {
  private panel!: HTMLDivElement;
  private overlay!: HTMLDivElement;
  private stage: Stage = 'home';
  private currentLobby: LobbyShape | null = null;
  private errorText: string | null = null;
  private infoText: string | null = null;
  private infoKind: InfoKind = 'err';
  private mounted = false;

  // Selected values held across the multi-step Quick Play / Create
  // flows. Reset on `open()`.
  private selectedQueueMode: QueueMode = 'duel';
  private selectedBet: number = 0;
  private pendingCreateMode: GameMode | null = null;

  // Latest player stats snapshot, fetched on open and refreshed on
  // every `stats_updated` push. `null` means "haven't loaded yet".
  private stats: PlayerStatsShape | null = null;

  // Bound handler refs so we can `off()` them on close (we re-attach on open).
  private readonly onLobbyCreated = (m: any) => this.handleLobbyEvent(m, 'created');
  private readonly onLobbyJoined  = (m: any) => this.handleLobbyEvent(m, 'joined');
  private readonly onLobbyState   = (m: any) => this.handleLobbyEvent(m, 'state');
  private readonly onLobbyLeft    = ()       => this.handleLobbyLeft();
  private readonly onLobbyError   = (m: any) => this.handleLobbyError(m);
  private readonly onError        = (m: any) => this.handleLobbyError(m);
  private readonly onGameStarted  = ()       => this.handleGameStarted();
  private readonly onNicknameChanged = (m: any) => this.handleNicknameChanged(m);
  private readonly onMmQueued     = (m: any) => this.handleMmQueued(m);
  private readonly onMmLeft       = ()       => this.handleMmLeft();
  private readonly onMmMatchFound = (m: any) => this.handleMmMatchFound(m);
  private readonly onMmError      = (m: any) => this.handleMmError(m);
  private readonly onPlayerStats  = (m: any) => this.handlePlayerStats(m);
  private readonly onStatsUpdated = (m: any) => this.handlePlayerStats(m);

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
    this.infoText = null;
    this.pendingCreateMode = null;
    this.overlay.classList.add('open');
    this.render();
    // Refresh the profile widget every time the modal opens. The
    // initial `null` keeps the existing render path simple — we just
    // hide the widget until we have data.
    this.requestPlayerStats();
  }

  close(): void {
    if (this.stage === 'searching') {
      this.cancelQuickPlay();
    }
    this.overlay.classList.remove('open');
    this.detachWsHandlers();
  }

  private attachWsHandlers(): void {
    const c = wsClient as any;
    if (typeof c.on !== 'function') return;
    c.on('lobby_created',     this.onLobbyCreated);
    c.on('lobby_joined',      this.onLobbyJoined);
    c.on('lobby_state',       this.onLobbyState);
    c.on('lobby_left',        this.onLobbyLeft);
    c.on('lobby_error',       this.onLobbyError);
    c.on('error',             this.onError);
    c.on('game_started',      this.onGameStarted);
    c.on('nickname_changed',  this.onNicknameChanged);
    c.on('mm_queued',         this.onMmQueued);
    c.on('mm_left',           this.onMmLeft);
    c.on('mm_match_found',    this.onMmMatchFound);
    c.on('mm_error',          this.onMmError);
    c.on('player_stats',      this.onPlayerStats);
    c.on('stats_updated',     this.onStatsUpdated);
  }

  private detachWsHandlers(): void {
    const c = wsClient as any;
    if (typeof c.off !== 'function') return;
    c.off('lobby_created',     this.onLobbyCreated);
    c.off('lobby_joined',      this.onLobbyJoined);
    c.off('lobby_state',       this.onLobbyState);
    c.off('lobby_left',        this.onLobbyLeft);
    c.off('lobby_error',       this.onLobbyError);
    c.off('error',             this.onError);
    c.off('game_started',      this.onGameStarted);
    c.off('nickname_changed',  this.onNicknameChanged);
    c.off('mm_queued',         this.onMmQueued);
    c.off('mm_left',           this.onMmLeft);
    c.off('mm_match_found',    this.onMmMatchFound);
    c.off('mm_error',          this.onMmError);
    c.off('player_stats',      this.onPlayerStats);
    c.off('stats_updated',     this.onStatsUpdated);
  }

  private requestPlayerStats(): void {
    const c = wsClient as any;
    if (!c.isConnected) return;
    if (typeof c.getPlayerStats === 'function') {
      try { c.getPlayerStats(); } catch { /* swallow — best-effort */ }
    }
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
    this.infoText = null;
    if (this.stage === 'busy' || this.stage === 'searching') {
      this.stage = this.currentLobby ? 'in_lobby' : 'home';
    }
    this.render();
  }

  private handleNicknameChanged(message: any): void {
    // Server confirmed the rename. Mirror the change on the local user
    // snapshot so subsequent renders (lobby player list, etc.) pick up
    // the new value without waiting for a reconnect.
    const c = wsClient as any;
    if (c.user && typeof message?.nickname === 'string') {
      c.user.nickname = message.nickname;
    }
    this.errorText = null;
    this.infoText = l('Nickname saved', 'Никнейм сохранён');
    this.infoKind = 'ok';
    this.render();
  }

  private handleGameStarted(): void {
    // Game.ts takes over rendering for the active match.
    this.currentLobby = null;
    this.stage = 'home';
    this.close();
  }

  private handleMmQueued(_message: any): void {
    // Server confirmed we're in the queue. Switch to the spinner
    // screen. The actual transition to in-lobby happens via
    // `mm_match_found`.
    this.stage = 'searching';
    this.errorText = null;
    this.render();
  }

  private handleMmLeft(): void {
    if (this.stage === 'searching') {
      this.stage = 'home';
      this.render();
    }
  }

  private handleMmMatchFound(message: any): void {
    // The server also pushes `lobby_created` / `lobby_joined` shortly
    // after, but we don't want to leave the user staring at "searching"
    // in the meantime. Render the lobby straight away.
    if (message?.lobby) {
      this.currentLobby = message.lobby as LobbyShape;
    }
    this.stage = 'in_lobby';
    this.errorText = null;
    this.infoText = t('multiplayer.matchFound') || l('Match found!', 'Соперник найден!');
    this.infoKind = 'ok';
    this.render();
    // Clear the "match found!" toast after a beat so it doesn't linger
    // through the actual game start.
    setTimeout(() => {
      if (this.infoKind === 'ok' && this.stage === 'in_lobby') {
        this.infoText = null;
        this.render();
      }
    }, 1500);
  }

  private handleMmError(message: any): void {
    const code = typeof message?.code === 'string' ? message.code : '';
    const text = code === 'timeout'
      ? t('multiplayer.searchTimedOut') || l('Search timed out. Try another bet or mode.', 'Поиск истёк. Попробуйте другую ставку или режим.')
      : (message && (message.message || message.code)) || 'Match failed';
    this.errorText = String(text);
    this.infoText = null;
    if (this.stage === 'searching') {
      this.stage = 'quick_play';
    }
    this.render();
  }

  private handlePlayerStats(message: any): void {
    const raw = message?.stats;
    if (!raw || typeof raw !== 'object') return;
    this.stats = {
      xp: Number(raw.xp) || 0,
      level: Math.max(1, Number(raw.level) || 1),
      gamesPlayed: Number(raw.gamesPlayed) || 0,
      wins: Number(raw.wins) || 0,
      losses: Number(raw.losses) || 0,
      pips: Number(raw.pips) || 0,
    };
    // Mirror the pip balance onto wsClient.user so the bet picker can
    // disable chips the player can't afford without an extra request.
    const c = wsClient as any;
    if (c.user) c.user.pips = this.stats.pips;
    if (this.stage === 'home' || this.stage === 'quick_play' || this.stage === 'create_bet') {
      this.render();
    }
  }

  // -- actions --

  private startQuickPlay(mode: QueueMode, bet: number): void {
    if (!this.isConnected()) return;
    if (bet > 0 && this.stats && this.stats.pips < bet) {
      this.errorText = t('multiplayer.notEnoughPips') ||
        l('Not enough pips for this bet', 'Недостаточно очков для этой ставки');
      this.render();
      return;
    }
    this.stage = 'searching';
    this.errorText = null;
    this.render();
    haptic.light();
    try {
      const c = wsClient as any;
      if (typeof c.joinQueue === 'function') {
        c.joinQueue(mode, bet);
      } else {
        this.errorText = 'Matchmaking not available on this build';
        this.stage = 'quick_play';
        this.render();
      }
    } catch (e) {
      this.errorText = e instanceof Error ? e.message : String(e);
      this.stage = 'quick_play';
      this.render();
    }
  }

  private cancelQuickPlay(): void {
    const c = wsClient as any;
    if (typeof c.leaveQueue === 'function') {
      try { c.leaveQueue(); } catch { /* swallow */ }
    }
    this.stage = 'quick_play';
    this.errorText = null;
    this.render();
  }

  private startCreate(mode: GameMode, bet: number): void {
    if (!this.isConnected()) return;
    if (bet > 0 && this.stats && this.stats.pips < bet) {
      this.errorText = t('multiplayer.notEnoughPips') ||
        l('Not enough pips for this bet', 'Недостаточно очков для этой ставки');
      this.render();
      return;
    }
    this.stage = 'busy';
    this.errorText = null;
    this.render();
    haptic.light();
    try {
      const c = wsClient as any;
      if (typeof c.createLobby === 'function') {
        c.createLobby(mode, bet);
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
      this.errorText = l(
        'Code must be 8 characters (A–Z, 0–9)',
        'Код должен состоять из 8 символов (A–Z, 0–9)',
      );
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

  private submitNickname(rawValue: string): void {
    const value = rawValue.trim();
    if (value.length < NICKNAME_MIN || value.length > NICKNAME_MAX) {
      this.errorText = l(
        `Nickname must be ${NICKNAME_MIN}-${NICKNAME_MAX} characters`,
        `Ник должен быть ${NICKNAME_MIN}-${NICKNAME_MAX} символов`,
      );
      this.infoText = null;
      this.render();
      return;
    }
    if (!NICKNAME_RE.test(value)) {
      this.errorText = l(
        'Nickname can only contain letters, numbers, and underscores',
        'Ник может содержать только буквы, цифры и подчёркивание',
      );
      this.infoText = null;
      this.render();
      return;
    }
    const c = wsClient as any;
    if (!c.isConnected) {
      this.errorText = l(
        'Not connected to server. Try again in a moment.',
        'Нет связи с сервером. Попробуйте ещё раз.',
      );
      this.render();
      return;
    }
    if (typeof c.setNickname !== 'function') {
      this.errorText = 'Multiplayer not available on this build';
      this.render();
      return;
    }
    // Optimistic "saving…" hint; the real confirmation arrives via the
    // server's `nickname_changed` (handled in handleNicknameChanged) or
    // `error` (handled in handleLobbyError).
    haptic.light();
    this.errorText = null;
    this.infoText = l('Saving…', 'Сохраняем…');
    this.infoKind = 'ok';
    c.setNickname(value);
    this.render();
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
      this.errorText = l(
        'Not connected to server. Try again in a moment.',
        'Нет связи с сервером. Попробуйте ещё раз.',
      );
    }
    return ok;
  }

  // -- rendering --

  private render(): void {
    if (!this.mounted) return;
    switch (this.stage) {
      case 'home':       this.renderHome();       break;
      case 'quick_play': this.renderQuickPlay();  break;
      case 'searching':  this.renderSearching();  break;
      case 'create':     this.renderCreate();     break;
      case 'create_bet': this.renderCreateBet();  break;
      case 'join':       this.renderJoin();       break;
      case 'in_lobby':   this.renderInLobby();    break;
      case 'busy':       this.renderBusy();       break;
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
    if (this.errorText) {
      return `<div class="ymp-status err">${escapeHtml(this.errorText)}</div>`;
    }
    if (this.infoText) {
      const kind = this.infoKind === 'ok' ? 'ok' : '';
      return `<div class="ymp-status ${kind}">${escapeHtml(this.infoText)}</div>`;
    }
    return '';
  }

  private nicknameSectionHtml(): string {
    const c = wsClient as any;
    const current = (c.user?.nickname as string | undefined) ?? '';
    return `
      <div class="ymp-section">
        <div class="ymp-section-title">${escapeHtml(l('Your nickname', 'Ваш ник'))}</div>
        <div class="ymp-row">
          <input class="ymp-input" id="ymp-nick-in"
                 maxlength="${NICKNAME_MAX}"
                 autocomplete="off" spellcheck="false"
                 value="${escapeHtml(current)}"
                 placeholder="${escapeHtml(l('Nickname', 'Никнейм'))}" />
          <button class="ymp-btn primary" data-act="submit-nick" style="flex:0 0 auto">
            ${escapeHtml(l('Save', 'Сохранить'))}
          </button>
        </div>
      </div>
    `;
  }

  private profileHtml(): string {
    const s = this.stats;
    if (!s) return '';
    const xpFloor = xpForLevel(s.level);
    const xpCeil = xpForLevel(s.level + 1);
    const span = Math.max(1, xpCeil - xpFloor);
    const into = Math.max(0, Math.min(span, s.xp - xpFloor));
    const pct = Math.round((into / span) * 100);
    const levelStr = `${escapeHtml(t('profile.level') || l('Level', 'Уровень'))} ${s.level}`;
    const winsLabel = t('profile.wins') || l('Wins', 'Побед');
    const lossesLabel = t('profile.losses') || l('Losses', 'Поражений');
    const gamesLabel = t('profile.gamesPlayed') || l('Games played', 'Игр сыграно');
    return `
      <div class="ymp-profile">
        <div class="row1">
          <span class="level-pill">${levelStr}</span>
          <span class="pips">${s.pips}</span>
        </div>
        <div class="xpbar"><span style="width:${pct}%"></span></div>
        <div class="xp-text">
          <span>${escapeHtml(t('profile.xp') || 'XP')}</span>
          <span>${s.xp - xpFloor} / ${span}</span>
        </div>
        <div class="stats">
          <span>${escapeHtml(gamesLabel)}: <b>${s.gamesPlayed}</b></span>
          <span>${escapeHtml(winsLabel)}: <b>${s.wins}</b></span>
          <span>${escapeHtml(lossesLabel)}: <b>${s.losses}</b></span>
        </div>
      </div>
    `;
  }

  // Renders the bet chip row. `selected` is the currently chosen
  // amount; the active chip is highlighted. Chips above the player's
  // pip balance are disabled.
  private betChipsHtml(selected: number): string {
    const balance = this.stats?.pips ?? 0;
    return ALLOWED_BETS.map((amount) => {
      const fmt = formatBet(amount);
      const tooExpensive = amount > 0 && amount > balance;
      const isActive = amount === selected;
      const classes = ['ymp-chip'];
      if (isActive) classes.push('active');
      const amountClass = fmt.isFree ? 'amount zero' : 'amount';
      return `
        <button class="${classes.join(' ')}"
                data-act="pick-bet" data-bet="${amount}"
                ${tooExpensive ? 'disabled' : ''}
                aria-pressed="${isActive ? 'true' : 'false'}">
          <span class="${amountClass}">${escapeHtml(fmt.amount)}</span>
          <span class="label">${escapeHtml(fmt.label)}</span>
        </button>
      `;
    }).join('');
  }

  private renderHome(): void {
    this.panel.innerHTML = `
      ${this.headerHtml(t('multiplayer.title') || 'Multiplayer', false)}
      ${this.statusHtml()}
      ${this.profileHtml()}
      ${this.nicknameSectionHtml()}
      <div class="ymp-row col">
        <button class="ymp-btn primary" data-act="go-quick">
          ${escapeHtml(t('multiplayer.quickPlay') || 'Quick play')}
        </button>
        <button class="ymp-btn ghost" data-act="go-create">
          ${escapeHtml(t('multiplayer.createLobby') || 'Create lobby')}
        </button>
        <button class="ymp-btn ghost" data-act="go-join">
          ${escapeHtml(t('multiplayer.joinByCode') || 'Join by code')}
        </button>
      </div>
      <div class="ymp-help">
        ${escapeHtml(
          t('multiplayer.help') ||
          'Invite friends by sharing the 8-character lobby code, or use Quick play to match with random opponents.',
        )}
      </div>
    `;
    this.bindActionButtons();
    const nickIn = this.panel.querySelector<HTMLInputElement>('#ymp-nick-in');
    nickIn?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.submitNickname(nickIn.value);
      }
    });
  }

  private renderQuickPlay(): void {
    const balance = this.stats?.pips ?? 0;
    const modes: { id: QueueMode; name: string; sub: string }[] = [
      {
        id: 'duel',
        name: t('multiplayer.modeDuel') || '1×1',
        sub: t('multiplayer.modeDuelSub') || 'Duel · two players',
      },
      {
        id: 'any',
        name: t('multiplayer.modeAny') || 'Any',
        sub: t('multiplayer.modeAnySub') || 'Group · 3 to 5 players',
      },
    ];
    const modeCards = modes
      .map(
        (m) => `
          <div class="ymp-mode-card ${this.selectedQueueMode === m.id ? 'active' : ''}"
               data-act="pick-mode" data-mode="${m.id}"
               role="button" tabindex="0" aria-pressed="${this.selectedQueueMode === m.id}">
            <div>
              <div class="name">${escapeHtml(m.name)}</div>
              <div class="sub">${escapeHtml(m.sub)}</div>
            </div>
          </div>
        `,
      )
      .join('');
    const canPlay =
      this.selectedBet === 0 || this.selectedBet <= balance;
    const balanceLabel = (t('multiplayer.currentBalance') || 'Your pips: {pips}').replace(
      '{pips}',
      String(balance),
    );
    this.panel.innerHTML = `
      ${this.headerHtml(t('multiplayer.quickPlay') || 'Quick play', true)}
      ${this.statusHtml()}
      <div class="ymp-section">
        <div class="ymp-section-title">${escapeHtml(t('multiplayer.selectMode') || 'Pick a mode')}</div>
        <div class="ymp-row col">${modeCards}</div>
      </div>
      <div class="ymp-section">
        <div class="ymp-section-title">${escapeHtml(t('multiplayer.selectBet') || 'Pick a bet')}</div>
        <div class="ymp-bet-row">${this.betChipsHtml(this.selectedBet)}</div>
        <div class="ymp-help">
          ${this.selectedBet === 0
            ? escapeHtml(t('multiplayer.noBetSub') || 'Free play · winner gets fixed pips')
            : `<b>${escapeHtml(t('multiplayer.winnerTakesBank') || 'Winner takes the pot')}</b>`}
          · ${escapeHtml(balanceLabel)}
        </div>
      </div>
      <div class="ymp-row col">
        <button class="ymp-btn primary" data-act="find-match" ${canPlay ? '' : 'disabled'}>
          ${escapeHtml(t('multiplayer.findMatch') || 'Find match')}
        </button>
      </div>
    `;
    this.bindActionButtons();
  }

  private renderSearching(): void {
    const fmt = formatBet(this.selectedBet);
    const modeLabel =
      this.selectedQueueMode === 'duel'
        ? t('multiplayer.modeDuel') || '1×1'
        : t('multiplayer.modeAny') || 'Any';
    const searchingText =
      this.selectedQueueMode === 'any'
        ? (t('multiplayer.searchingAny') || 'Searching for {min}–{max} players…')
            .replace('{min}', '3')
            .replace('{max}', '5')
        : t('multiplayer.searching') || 'Searching for an opponent…';
    const betLine = this.selectedBet === 0
      ? escapeHtml(t('multiplayer.noBet') || 'No bet')
      : `${escapeHtml(t('multiplayer.betAmount') || 'Bet')}: <b>${escapeHtml(fmt.amount)}</b>`;
    this.panel.innerHTML = `
      ${this.headerHtml(t('multiplayer.quickPlay') || 'Quick play', false)}
      ${this.statusHtml()}
      <div class="ymp-spinner"></div>
      <div class="ymp-status ok">${escapeHtml(searchingText)}</div>
      <div class="ymp-help" style="text-align:center">
        ${escapeHtml(modeLabel)} · ${betLine}
      </div>
      <div class="ymp-row col">
        <button class="ymp-btn danger" data-act="cancel-search">
          ${escapeHtml(t('multiplayer.cancelSearch') || 'Cancel search')}
        </button>
      </div>
    `;
    this.bindActionButtons();
  }

  private renderCreate(): void {
    // Palmo's Dice first — it's the flagship mode the user asked for in
    // the Yandex Games build (and the one with a clear winner concept
    // wired through `getWinners`, so the fixed-pip payout always fires).
    const modes: GameMode[] = ['poker_dice', 'mexico', 'greedy_pig', 'street_craps'];
    const cards = modes
      .map(
        (m) => `
          <div class="ymp-mode-card" data-act="pick-create-mode" data-mode="${m}"
               role="button" tabindex="0">
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
  }

  private renderCreateBet(): void {
    const mode = this.pendingCreateMode;
    if (!mode) {
      this.stage = 'create';
      this.render();
      return;
    }
    const balance = this.stats?.pips ?? 0;
    const canPlay = this.selectedBet === 0 || this.selectedBet <= balance;
    const balanceLabel = (t('multiplayer.currentBalance') || 'Your pips: {pips}').replace(
      '{pips}',
      String(balance),
    );
    this.panel.innerHTML = `
      ${this.headerHtml(MODE_LABELS[mode].name, true)}
      ${this.statusHtml()}
      <div class="ymp-help" style="text-align:center; opacity:0.85">
        ${escapeHtml(MODE_LABELS[mode].sub)}
      </div>
      <div class="ymp-section">
        <div class="ymp-section-title">${escapeHtml(t('multiplayer.selectBet') || 'Pick a bet')}</div>
        <div class="ymp-bet-row">${this.betChipsHtml(this.selectedBet)}</div>
        <div class="ymp-help">
          ${this.selectedBet === 0
            ? escapeHtml(t('multiplayer.noBetSub') || 'Free play · winner gets fixed pips')
            : `<b>${escapeHtml(t('multiplayer.winnerTakesBank') || 'Winner takes the pot')}</b>`}
          · ${escapeHtml(balanceLabel)}
        </div>
      </div>
      <div class="ymp-row col">
        <button class="ymp-btn primary" data-act="confirm-create" ${canPlay ? '' : 'disabled'}>
          ${escapeHtml(t('multiplayer.createLobby') || 'Create lobby')}
        </button>
      </div>
    `;
    this.bindActionButtons();
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
      <div class="ymp-spinner"></div>
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
    const c = wsClient as { user?: { id?: number } };
    const myUserId = c.user?.id;
    const isHost = !!myUserId && lobby.hostId === myUserId;
    const betAmount = typeof lobby.betAmount === 'number' ? lobby.betAmount : lobby.noBet ? 0 : 10;
    const betInfo = formatBet(betAmount);
    const betLabel = betAmount === 0
      ? escapeHtml(t('multiplayer.noBet') || 'No bet')
      : `${escapeHtml(t('multiplayer.betAmount') || 'Bet')}: <b>${escapeHtml(betInfo.amount)}</b>`;
    const modeLabel =
      (MODE_LABELS as Record<string, { name: string }>)[lobby.gameMode]?.name ??
      lobby.gameMode;
    const playersHtml = (lobby.players || [])
      .map((p) => {
        const nick =
          p.nickname || p.user?.nickname || `Player ${p.oderId ?? '?'}`;
        const avatar = p.avatarUrl || p.user?.avatarUrl || '';
        const playerId = p.userId ?? p.oderId;
        const isYou = playerId === myUserId;
        const isHostPlayer = playerId === lobby.hostId;
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
      <div class="ymp-help" style="text-align:center">${betLabel}</div>
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
      el.addEventListener('click', () => this.dispatchAction(act, el));
    });
  }

  private dispatchAction(act: string, el?: HTMLElement): void {
    switch (act) {
      case 'close':       this.close(); break;
      case 'back':
        this.errorText = null;
        if (this.stage === 'create_bet') {
          this.stage = 'create';
        } else if (this.stage === 'quick_play' || this.stage === 'create' || this.stage === 'join') {
          this.stage = 'home';
        } else {
          this.stage = this.currentLobby ? 'in_lobby' : 'home';
        }
        this.render();
        break;
      case 'go-quick':
        this.errorText = null;
        this.stage = 'quick_play';
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
      case 'pick-mode': {
        const m = el?.dataset.mode as QueueMode | undefined;
        if (m === 'duel' || m === 'any') {
          this.selectedQueueMode = m;
          this.errorText = null;
          this.render();
        }
        break;
      }
      case 'pick-bet': {
        const raw = el?.dataset.bet;
        const amount = raw != null ? Number(raw) : NaN;
        if (Number.isFinite(amount) && ALLOWED_BETS.includes(amount)) {
          this.selectedBet = amount;
          this.errorText = null;
          this.render();
        }
        break;
      }
      case 'find-match':
        this.startQuickPlay(this.selectedQueueMode, this.selectedBet);
        break;
      case 'cancel-search':
        this.cancelQuickPlay();
        break;
      case 'pick-create-mode': {
        const m = el?.dataset.mode as GameMode | undefined;
        if (m) {
          this.pendingCreateMode = m;
          this.errorText = null;
          this.stage = 'create_bet';
          this.render();
        }
        break;
      }
      case 'confirm-create':
        if (this.pendingCreateMode) {
          this.startCreate(this.pendingCreateMode, this.selectedBet);
        }
        break;
      case 'submit-join': {
        const input = this.panel.querySelector<HTMLInputElement>('#ymp-code-in');
        this.startJoin(input?.value ?? '');
        break;
      }
      case 'submit-nick': {
        const input = this.panel.querySelector<HTMLInputElement>('#ymp-nick-in');
        this.submitNickname(input?.value ?? '');
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
