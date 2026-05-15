// Connection-error banner for the Yandex Games build.
//
// Yandex Games moderation requires that if the game tries to reach a
// custom host (e.g. our multiplayer server) and the connection fails,
// the player must see an informative message and at least one
// actionable button — either retry, refresh, or an alternative
// experience. The portal will not whitelist our host in CSP until this
// is in place.
//
// This banner subscribes to the canonical
// `connection_health_changed` event the WebSocketClient emits whenever
// the live socket transitions to / from `offline`, and renders a
// centered, non-blocking dialog with "Retry" and "Play offline"
// actions. It auto-hides as soon as the connection becomes healthy
// again.
//
// The banner does NOT prevent the player from interacting with the
// solo game — the dialog backdrop is dark but non-modal, and "Play
// offline" simply dismisses it, leaving the solo experience intact.

import { getCurrentLanguage, onLanguageChange } from '../../shared/i18n';

interface BannerStrings {
  title: string;
  body: string;
  retry: string;
  playSolo: string;
  retrying: string;
}

const STRINGS: Record<'ru' | 'en', BannerStrings> = {
  ru: {
    title: 'Сервер мультиплеера недоступен',
    body:
      'Не удалось подключиться к серверу мультиплеера. Проверьте интернет-соединение и попробуйте ещё раз — или продолжайте играть в одиночном режиме.',
    retry: 'Повторить подключение',
    playSolo: 'Играть одному',
    retrying: 'Подключение...',
  },
  en: {
    title: 'Multiplayer server unavailable',
    body:
      "Couldn't reach the multiplayer server. Check your internet connection and try again — or keep playing in solo mode.",
    retry: 'Retry connection',
    playSolo: 'Play offline',
    retrying: 'Connecting...',
  },
};

const STYLE_ID = 'yandex-conn-banner-style';

function ensureStyles(): void {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .ycb-overlay {
      position: fixed; left: 0; right: 0; bottom: 0;
      padding: 0 16px 16px 16px; z-index: 1000;
      display: flex; justify-content: center;
      pointer-events: none;
      font-family: 'Montserrat', system-ui, sans-serif;
    }
    .ycb-card {
      pointer-events: auto;
      width: min(420px, 100%);
      background: linear-gradient(180deg, #2a1f1f 0%, #1a0d0d 100%);
      color: #fff;
      border-radius: 14px;
      border: 1px solid rgba(255, 110, 110, 0.4);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
      padding: 16px 18px;
      transform: translateY(120%);
      opacity: 0;
      transition: transform 240ms ease, opacity 240ms ease;
    }
    .ycb-card.visible {
      transform: translateY(0);
      opacity: 1;
    }
    .ycb-title {
      font-weight: 700;
      font-size: 15px;
      margin: 0 0 6px 0;
      color: #ffb4b4;
      display: flex; align-items: center; gap: 8px;
    }
    .ycb-title::before {
      content: ''; display: inline-block;
      width: 8px; height: 8px; border-radius: 50%;
      background: #ff5a5a;
      box-shadow: 0 0 8px #ff5a5a;
    }
    .ycb-body {
      font-size: 13px;
      line-height: 1.45;
      color: rgba(255,255,255,0.85);
      margin: 0 0 12px 0;
    }
    .ycb-actions {
      display: flex; gap: 8px; flex-wrap: wrap;
    }
    .ycb-btn {
      flex: 1 1 0;
      min-width: 120px;
      padding: 10px 12px;
      border: 0;
      border-radius: 8px;
      font-family: inherit;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
    }
    .ycb-btn.primary {
      background: #ffd84d;
      color: #1a1a1a;
    }
    .ycb-btn.primary:disabled {
      background: #6b6b6b;
      color: #ccc;
      cursor: progress;
    }
    .ycb-btn.ghost {
      background: rgba(255,255,255,0.1);
      color: #fff;
    }
    .ycb-btn:active { transform: translateY(1px); }
  `;
  document.head.appendChild(style);
}

export interface ConnectionErrorBannerOptions {
  onRetry: () => Promise<unknown> | unknown;
  onPlaySolo?: () => void;
}

export class ConnectionErrorBanner {
  private overlay: HTMLElement | null = null;
  private card: HTMLElement | null = null;
  private titleEl: HTMLElement | null = null;
  private bodyEl: HTMLElement | null = null;
  private retryBtn: HTMLButtonElement | null = null;
  private soloBtn: HTMLButtonElement | null = null;
  private mounted = false;
  private retryInFlight = false;
  // The player can dismiss the banner with "Play offline" — in that
  // case we don't want to re-pop the banner on every retry failure that
  // happens silently in the background. Only re-show on a *fresh*
  // online → offline transition.
  private dismissedUntilOnline = false;

  constructor(private opts: ConnectionErrorBannerOptions) {}

  mount(): void {
    if (this.mounted) return;
    ensureStyles();

    const overlay = document.createElement('div');
    overlay.className = 'ycb-overlay';
    overlay.style.display = 'none';

    const card = document.createElement('div');
    card.className = 'ycb-card';

    const titleEl = document.createElement('p');
    titleEl.className = 'ycb-title';

    const bodyEl = document.createElement('p');
    bodyEl.className = 'ycb-body';

    const actions = document.createElement('div');
    actions.className = 'ycb-actions';

    const retryBtn = document.createElement('button');
    retryBtn.type = 'button';
    retryBtn.className = 'ycb-btn primary';
    retryBtn.addEventListener('click', () => {
      void this.handleRetry();
    });

    const soloBtn = document.createElement('button');
    soloBtn.type = 'button';
    soloBtn.className = 'ycb-btn ghost';
    soloBtn.addEventListener('click', () => {
      this.handlePlaySolo();
    });

    actions.appendChild(retryBtn);
    actions.appendChild(soloBtn);

    card.appendChild(titleEl);
    card.appendChild(bodyEl);
    card.appendChild(actions);
    overlay.appendChild(card);

    document.body.appendChild(overlay);

    this.overlay = overlay;
    this.card = card;
    this.titleEl = titleEl;
    this.bodyEl = bodyEl;
    this.retryBtn = retryBtn;
    this.soloBtn = soloBtn;
    this.mounted = true;

    this.applyLanguage();
    onLanguageChange(() => this.applyLanguage());
  }

  /** Show the banner after a confirmed connection failure. */
  show(): void {
    if (!this.mounted) this.mount();
    if (this.dismissedUntilOnline) return;
    if (!this.overlay || !this.card) return;
    this.overlay.style.display = 'flex';
    // Force reflow so the CSS transition runs.
    void this.card.offsetWidth;
    this.card.classList.add('visible');
    this.applyLanguage();
    if (this.retryBtn) {
      this.retryBtn.disabled = false;
    }
  }

  /** Hide the banner (used both on successful reconnect and on dismiss). */
  hide(): void {
    if (!this.overlay || !this.card) return;
    this.card.classList.remove('visible');
    // Wait for transition to finish before removing from the layout.
    window.setTimeout(() => {
      if (this.overlay && !this.card?.classList.contains('visible')) {
        this.overlay.style.display = 'none';
      }
    }, 260);
  }

  /**
   * Called by the WS layer whenever connection health changes. The banner
   * shows itself on the first transition into 'offline', and hides itself
   * on 'good'/'unstable'. The dismiss flag is also cleared on a healthy
   * transition so the banner can re-appear if we go offline again later.
   */
  onConnectionHealthChanged(health: 'good' | 'unstable' | 'poor' | 'offline'): void {
    if (health === 'offline') {
      this.show();
    } else {
      this.dismissedUntilOnline = false;
      this.hide();
    }
  }

  private async handleRetry(): Promise<void> {
    if (this.retryInFlight) return;
    this.retryInFlight = true;
    const strings = this.currentStrings();
    if (this.retryBtn) {
      this.retryBtn.disabled = true;
      this.retryBtn.textContent = strings.retrying;
    }
    try {
      await this.opts.onRetry();
    } catch (e) {
      console.warn('[connection-banner] retry failed', e);
    } finally {
      this.retryInFlight = false;
      if (this.retryBtn) {
        this.retryBtn.disabled = false;
        this.retryBtn.textContent = this.currentStrings().retry;
      }
    }
  }

  private handlePlaySolo(): void {
    this.dismissedUntilOnline = true;
    this.hide();
    try {
      this.opts.onPlaySolo?.();
    } catch (e) {
      console.warn('[connection-banner] onPlaySolo threw', e);
    }
  }

  private currentStrings(): BannerStrings {
    const lang = getCurrentLanguage();
    return STRINGS[lang === 'en' ? 'en' : 'ru'];
  }

  private applyLanguage(): void {
    if (!this.titleEl || !this.bodyEl || !this.retryBtn || !this.soloBtn) return;
    const s = this.currentStrings();
    this.titleEl.textContent = s.title;
    this.bodyEl.textContent = s.body;
    this.retryBtn.textContent = this.retryInFlight ? s.retrying : s.retry;
    this.soloBtn.textContent = s.playSolo;
  }
}
