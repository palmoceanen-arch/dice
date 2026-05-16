// Minimal UI overlay for the solo-only Yandex Games build. We deliberately
// do NOT reuse MultiplayerUI.ts here — it depends on the WebSocket client,
// friends/lobbies, Telegram-specific share flows, etc.
//
// Responsibilities:
//   * Top-left menu button → small menu with Shop, Inventory, Custom
//     Dice, Settings.
//   * Top-right pips balance (kept in sync with cloudSave).
//   * Settings: graphics quality, sound volume, language.
//   * Custom Dice opens the shared DiceEditorModal that already exists
//     in the Telegram UI. The wsClient stub bridges its key/save calls
//     into the cloud save layer.

import type { Game } from '../game/Game';
import { cloudSave } from './cloudSave';
import { SoloShop } from './SoloShop';
import { SoloInventory } from './SoloInventory';
import { DiceEditorModal } from '../ui/DiceEditorModal';
import { BoostsModal } from '../ui/BoostsModal';
import { MultiplayerLobbyUI } from './MultiplayerLobbyUI';
import { haptic, isPlayerAuthorized, openAuthDialog } from './platform';
import { getCurrentLanguage, setLanguage, onLanguageChange, t } from '../../shared/i18n';
import type { Language } from '../../shared/i18n';

const STYLE_ID = 'yandex-soloui-style';

function ensureStyles(): void {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .yui-balance {
      position: fixed; top: 12px; right: 12px; z-index: 50;
      padding: 8px 14px; border-radius: 999px;
      background: rgba(0, 0, 0, 0.55);
      color: #ffd84d; font-weight: 700; font-size: 14px;
      font-family: 'Montserrat', system-ui, sans-serif;
      pointer-events: none;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    }
    .yui-menu-btn {
      position: fixed; top: 12px; left: 12px; z-index: 50;
      width: 44px; height: 44px; border-radius: 50%;
      background: rgba(0, 0, 0, 0.55); border: 0; color: #fff;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    }
    .yui-menu-btn:active { background: rgba(0,0,0,0.75); }
    .yui-menu {
      position: fixed; top: 64px; left: 12px; z-index: 60;
      width: 240px; padding: 8px; border-radius: 12px;
      background: rgba(20, 20, 24, 0.95);
      box-shadow: 0 8px 24px rgba(0,0,0,0.5);
      display: none;
      font-family: 'Montserrat', system-ui, sans-serif; color: #fff;
    }
    .yui-menu.open { display: block; }
    .yui-menu .item {
      padding: 10px 12px; border-radius: 8px;
      cursor: pointer; font-weight: 600; font-size: 14px;
      display: flex; align-items: center; gap: 8px;
    }
    .yui-menu .item:hover { background: rgba(255,255,255,0.08); }
    .yui-settings-overlay {
      position: fixed; inset: 0; z-index: 100; background: rgba(0,0,0,0.85);
      display: flex; align-items: center; justify-content: center;
      font-family: 'Montserrat', system-ui, sans-serif; color: #fff;
    }
    .yui-settings-panel {
      width: min(420px, 92%); padding: 20px;
      background: linear-gradient(180deg, #1f1f24 0%, #0d0d10 100%);
      border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.6);
      display: flex; flex-direction: column; gap: 16px;
    }
    .yui-settings-panel h2 { font-size: 18px; }
    .yui-row {
      display: flex; align-items: center; justify-content: space-between;
      gap: 12px;
    }
    .yui-row label { font-size: 14px; opacity: 0.8; }
    .yui-row select, .yui-row input[type=range] {
      flex: 1; max-width: 200px;
    }
    .yui-row select {
      padding: 6px 10px; border-radius: 8px;
      background: rgba(255,255,255,0.08); color: #fff; border: 0;
      font-family: inherit;
    }
    .yui-btn {
      padding: 10px 14px; border-radius: 8px; border: 0;
      cursor: pointer; font-weight: 700; font-size: 14px;
      font-family: inherit;
    }
    .yui-btn.primary { background: #ffd84d; color: #1a1a1a; }
    .yui-btn.ghost { background: rgba(255,255,255,0.08); color: #fff; }

    /* Floating boost button on the idle screen. Mirrors the Telegram
       build's #boost-icon position (bottom-center) so behaviour and
       muscle memory are consistent. The icon is hidden during an
       active multiplayer game by Game.updateUIVisibility(); on Yandex
       the GameSync stub always reports "not in multiplayer", so the
       icon stays visible on idle. */
    #boost-icon {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      width: 56px;
      height: 56px;
      background: rgba(0, 0, 0, 0.55);
      border: 0;
      border-radius: 50%;
      display: none;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: transform 0.2s, background 0.2s;
      pointer-events: auto;
      z-index: 150;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
    }
    #boost-icon:hover { transform: translateX(-50%) scale(1.08); background: rgba(0, 0, 0, 0.75); }
    #boost-icon:active { transform: translateX(-50%) scale(0.95); }
    #boost-icon svg { filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4)); }
    @keyframes pulse {
      0%, 100% { transform: translateX(-50%) scale(1); }
      50% { transform: translateX(-50%) scale(1.12); }
    }
    @keyframes slideDown {
      from { transform: translateX(-50%) translateY(-20px); opacity: 0; }
      to { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
    @keyframes slideUp {
      from { transform: translateX(-50%) translateY(0); opacity: 1; }
      to { transform: translateX(-50%) translateY(-20px); opacity: 0; }
    }

    /* Styles below are re-exported from MultiplayerUI for the shared
       DiceEditorModal, which the Yandex solo build opens directly. */
    .mp-confirm-overlay {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.7);
      display: flex; align-items: center; justify-content: center;
      z-index: 200; pointer-events: auto;
    }
    .mp-confirm-dialog {
      background: rgba(30,30,30,0.95);
      border-radius: 12px; padding: 20px; max-width: 280px;
      text-align: center;
      font-family: 'Montserrat', system-ui, sans-serif; color: #fff;
    }
    .mp-btn {
      padding: 10px 14px; border-radius: 8px; border: 0;
      cursor: pointer; font-weight: 700; font-size: 14px;
      font-family: 'Montserrat', system-ui, sans-serif;
    }
    .mp-btn.secondary { background: rgba(255,255,255,0.2); color: #fff; }
  `;
  document.head.appendChild(style);
}

const ICON_MENU = `
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>
`;

// Same gold zap glyph the Telegram build ships in index.html for #boost-icon.
const ICON_BOOST = `
  <svg width="32" height="32" viewBox="0 0 24 24">
    <defs>
      <linearGradient id="yui-gold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFD700" stop-opacity="1" />
        <stop offset="100%" stop-color="#FFA500" stop-opacity="1" />
      </linearGradient>
    </defs>
    <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" fill="url(#yui-gold)"/>
  </svg>
`;

export class SoloUI {
  private game: Game;
  private shop: SoloShop;
  private inventory: SoloInventory;
  private balanceEl!: HTMLElement;
  private menuEl!: HTMLElement;
  private menuButton!: HTMLElement;
  private settingsOverlay: HTMLElement | null = null;
  private multiplayer: MultiplayerLobbyUI | null = null;
  private boostButton!: HTMLElement;

  constructor(game: Game) {
    this.game = game;
    this.shop = new SoloShop(() => this.onInventoryChanged());
    this.inventory = new SoloInventory({
      onChange: () => this.onInventoryChanged(),
      onOpenShopKeys: () => this.shop.openTab('keys'),
    });
    cloudSave.onCustomDiceChange(() => this.onInventoryChanged());
  }

  private isMultiplayerEnabled(): boolean {
    // Mirrors the same check main.yandex.ts uses to decide whether to
    // open the live WebSocket connection. Until VITE_WS_URL is configured
    // for the build (street-dice.online) we hide the menu item.
    const url = (import.meta as any).env?.VITE_WS_URL ?? '';
    return typeof url === 'string' && url.length > 0;
  }

  private openMultiplayer(): void {
    if (!this.multiplayer) {
      this.multiplayer = new MultiplayerLobbyUI();
      this.multiplayer.mount();
    }
    this.multiplayer.open();
  }

  mount(): void {
    ensureStyles();
    this.menuButton = document.createElement('button');
    this.menuButton.className = 'yui-menu-btn';
    this.menuButton.innerHTML = ICON_MENU;
    this.menuButton.addEventListener('click', () => this.toggleMenu());
    document.body.appendChild(this.menuButton);

    this.menuEl = document.createElement('div');
    this.menuEl.className = 'yui-menu';
    document.body.appendChild(this.menuEl);

    this.balanceEl = document.createElement('div');
    this.balanceEl.className = 'yui-balance';
    document.body.appendChild(this.balanceEl);

    this.mountBoostButton();

    this.renderMenu();
    this.refreshBalance();
    this.startBalanceTicker();

    onLanguageChange(() => this.renderMenu());

    document.addEventListener('click', (e) => {
      if (!this.menuEl.classList.contains('open')) return;
      const target = e.target as HTMLElement;
      if (this.menuEl.contains(target) || this.menuButton.contains(target)) return;
      this.menuEl.classList.remove('open');
    });
  }

  /**
   * Mount the boost button at the bottom of the idle screen and wire it
   * up to BoostsModal. The Telegram build hard-codes this element in
   * index.html; we create it in JS for parity. BoostsModal.init() does
   * the rest (cooldown timers, ad-rewarded activation via the Yandex
   * stub WS client). Game.updateUIVisibility() toggles its visibility
   * when entering/leaving a live multiplayer game.
   */
  private mountBoostButton(): void {
    let button = document.getElementById('boost-icon') as HTMLButtonElement | null;
    if (!button) {
      const created = document.createElement('button');
      created.id = 'boost-icon';
      created.type = 'button';
      created.setAttribute('aria-label', 'Boosts');
      created.innerHTML = ICON_BOOST;
      document.body.appendChild(created);
      button = created;
    } else {
      button.innerHTML = ICON_BOOST;
    }
    button.addEventListener('click', () => {
      haptic.light();
      BoostsModal.toggle();
    });
    this.boostButton = button;
    // Make sure the icon is visible immediately on the idle screen.
    // Game.updateUIVisibility() will keep it correct as multiplayer
    // toggles, but on first paint that runs before the canvas dimensions
    // are settled, so we show it eagerly here too.
    this.boostButton.style.display = 'flex';
  }

  private toggleMenu(): void {
    haptic.light();
    this.menuEl.classList.toggle('open');
  }

  private renderMenu(): void {
    const items: Array<{ label: string; action: () => void }> = [
      { label: t('shop.title') || 'Shop', action: () => this.openShop() },
      { label: t('inventory.title') || 'Inventory', action: () => this.openInventory() },
      { label: t('menu.customDice') || 'Custom Dice', action: () => this.openDiceEditor() },
    ];
    if (this.isMultiplayerEnabled()) {
      items.push({
        label: t('menu.multiplayer') || 'Multiplayer',
        action: () => this.openMultiplayer(),
      });
    }
    items.push({ label: t('settings.title') || 'Settings', action: () => this.openSettings() });
    if (!isPlayerAuthorized()) {
      items.push({
        label: t('menu.signInYandex') || 'Sign in with Yandex',
        action: () => this.signIn(),
      });
    }
    this.menuEl.innerHTML = items
      .map(
        (it, i) =>
          `<div class="item" data-i="${i}">${escapeHtml(it.label)}</div>`,
      )
      .join('');
    this.menuEl.querySelectorAll('.item').forEach((el) => {
      el.addEventListener('click', () => {
        const i = parseInt((el as HTMLElement).dataset.i ?? '0', 10);
        this.menuEl.classList.remove('open');
        items[i]?.action();
      });
    });
  }

  private openShop(): void {
    this.shop.open();
  }

  private openInventory(): void {
    this.inventory.open();
  }

  private openDiceEditor(): void {
    DiceEditorModal.toggle(this.game);
  }

  private async signIn(): Promise<void> {
    const ok = await openAuthDialog();
    if (ok) {
      await cloudSave.loadAll();
      this.applyInventoryToGame();
      this.refreshBalance();
      this.renderMenu();
    }
  }

  private openSettings(): void {
    if (this.settingsOverlay) {
      this.settingsOverlay.style.display = 'flex';
      return;
    }
    this.settingsOverlay = document.createElement('div');
    this.settingsOverlay.className = 'yui-settings-overlay';
    const settings = cloudSave.getSettings();
    this.settingsOverlay.innerHTML = `
      <div class="yui-settings-panel">
        <h2>${escapeHtml(t('settings.title') || 'Settings')}</h2>
        <div class="yui-row">
          <label for="yui-graphics">${escapeHtml(t('settings.graphics') || 'Graphics')}</label>
          <select id="yui-graphics">
            <option value="low" ${settings.graphics === 'low' ? 'selected' : ''}>Low</option>
            <option value="medium" ${settings.graphics === 'medium' ? 'selected' : ''}>Medium</option>
            <option value="high" ${settings.graphics === 'high' ? 'selected' : ''}>High</option>
          </select>
        </div>
        <div class="yui-row">
          <label for="yui-volume">${escapeHtml(t('settings.sound') || 'Sound')}</label>
          <input id="yui-volume" type="range" min="0" max="1" step="0.05" value="${settings.soundVolume}" />
        </div>
        <div class="yui-row">
          <label for="yui-lang">${escapeHtml(t('settings.language') || 'Language')}</label>
          <select id="yui-lang">
            <option value="en" ${getCurrentLanguage() === 'en' ? 'selected' : ''}>English</option>
            <option value="ru" ${getCurrentLanguage() === 'ru' ? 'selected' : ''}>Русский</option>
          </select>
        </div>
        <div class="yui-row">
          <button class="yui-btn ghost" id="yui-close">${escapeHtml(t('buttons.close') || 'Close')}</button>
        </div>
      </div>
    `;
    document.body.appendChild(this.settingsOverlay);

    const graphicsEl = this.settingsOverlay.querySelector<HTMLSelectElement>('#yui-graphics');
    graphicsEl?.addEventListener('change', () => {
      const value = graphicsEl.value as 'low' | 'medium' | 'high';
      cloudSave.updateSettings({ graphics: value });
      (this.game as any).setGraphicsQuality?.(value);
    });
    const volEl = this.settingsOverlay.querySelector<HTMLInputElement>('#yui-volume');
    volEl?.addEventListener('input', () => {
      const v = parseFloat(volEl.value);
      cloudSave.updateSettings({ soundVolume: v });
      (this.game as any).setSoundVolume?.(v);
    });
    const langEl = this.settingsOverlay.querySelector<HTMLSelectElement>('#yui-lang');
    langEl?.addEventListener('change', () => {
      const lang = langEl.value as Language;
      setLanguage(lang);
      cloudSave.updateSettings({ language: lang });
    });
    this.settingsOverlay.querySelector('#yui-close')?.addEventListener('click', () => {
      if (this.settingsOverlay) this.settingsOverlay.style.display = 'none';
    });
  }

  private startBalanceTicker(): void {
    let lastPips = -1;
    const tick = () => {
      const pips = cloudSave.getPips();
      if (pips !== lastPips) {
        lastPips = pips;
        this.refreshBalance();
      }
    };
    setInterval(tick, 500);
  }

  refreshBalance(): void {
    const pips = cloudSave.getPips();
    this.balanceEl.textContent = `${pips.toLocaleString('en-US')} pips`;
  }

  private onInventoryChanged(): void {
    this.applyInventoryToGame();
    this.refreshBalance();
  }

  applyInventoryToGame(): void {
    const dice = cloudSave.getEquippedDiceConfig();
    if (dice && typeof (this.game as any).updateDiceAppearance === 'function') {
      (this.game as any).updateDiceAppearance(dice);
    }
    const table = cloudSave.getEquippedTableConfig();
    if (table && typeof (this.game as any).updateTableAppearance === 'function') {
      (this.game as any).updateTableAppearance(table);
    }
  }
}

function escapeHtml(s: string): string {
  return String(s).replace(/[&<>"']/g, (c) =>
    c === '&' ? '&amp;' : c === '<' ? '&lt;' : c === '>' ? '&gt;' : c === '"' ? '&quot;' : '&#39;',
  );
}
