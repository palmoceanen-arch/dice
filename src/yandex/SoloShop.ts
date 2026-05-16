// In-game shop for the Yandex Games build. Everything is bought with
// `pips` (the in-game currency) — there is no real-money purchase flow.
//
// The catalog comes from `shared/presets.json` for dice and tables; the
// design-key catalog mirrors server/add-keys.js (the same keys the
// Telegram build sells, just denominated in pips). Items with a
// Telegram-Stars `price` of 0 are free (the player starts with all of
// them); everything else costs `price * PIPS_PER_STAR` pips on Yandex.

import presets from '../../shared/presets.json';
import { cloudSave } from './cloudSave';
import { t } from '../../shared/i18n';
import { haptic } from './platform';

const PIPS_PER_STAR = 100;

// Design-key catalogue. Pricing intentionally matches
// server/add-keys.js: Design (5k), Creator (15k locked), Unusual (30k
// locked). The two premium tiers stay locked behind moderation — they
// give us a hook for future Yandex-side promotions without surprising
// players in the soft launch.
interface KeyEntry {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic';
  pipsPrice: number;
  color: string;
  locked: boolean;
}

const DESIGN_KEYS: KeyEntry[] = [
  {
    id: 'design_key',
    name: 'Design Key',
    description: 'Save your custom dice design permanently',
    rarity: 'common',
    pipsPrice: 5000,
    color: '#4A90E2',
    locked: false,
  },
  {
    id: 'creators_key',
    name: "Creator's Key",
    description: 'Premium key for master designers',
    rarity: 'rare',
    pipsPrice: 15000,
    color: '#E74C3C',
    locked: true,
  },
  {
    id: 'unusual_key',
    name: 'Unusual Key',
    description: 'Legendary key for elite creators',
    rarity: 'epic',
    pipsPrice: 30000,
    color: '#9B59B6',
    locked: true,
  },
];

type PresetEntry = {
  name: string;
  description?: string;
  price: number;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic';
  config: any;
};

interface CatalogItem {
  id: string;
  name: string;
  description: string;
  rarity: string;
  pipsPrice: number;
  config: any;
  kind: 'dice' | 'tables';
}

const RARITY_ORDER: Record<string, number> = {
  common: 0,
  uncommon: 1,
  rare: 2,
  epic: 3,
};

function buildCatalog(kind: 'dice' | 'tables'): CatalogItem[] {
  const raw = ((presets as any)[kind] ?? {}) as Record<string, PresetEntry>;
  const items: CatalogItem[] = Object.entries(raw).map(([id, entry]) => ({
    id,
    name: entry.name,
    description: entry.description ?? '',
    rarity: entry.rarity ?? 'common',
    pipsPrice: (entry.price ?? 0) * PIPS_PER_STAR,
    config: entry.config,
    kind,
  }));
  items.sort((a, b) => {
    const ra = RARITY_ORDER[a.rarity] ?? 99;
    const rb = RARITY_ORDER[b.rarity] ?? 99;
    if (ra !== rb) return ra - rb;
    return a.pipsPrice - b.pipsPrice;
  });
  return items;
}

const STYLE_ID = 'yandex-shop-style';

function ensureStyles(): void {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .yshop-overlay {
      position: fixed; inset: 0; z-index: 100;
      background: rgba(0, 0, 0, 0.85);
      display: flex; align-items: stretch; justify-content: center;
      font-family: 'Montserrat', system-ui, sans-serif; color: #fff;
    }
    .yshop-panel {
      width: min(720px, 100%); max-height: 100%;
      display: flex; flex-direction: column;
      background: linear-gradient(180deg, #1f1f24 0%, #0d0d10 100%);
      box-shadow: 0 10px 40px rgba(0,0,0,0.6);
    }
    .yshop-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    .yshop-title { font-weight: 700; font-size: 20px; }
    .yshop-tabs { display: flex; gap: 8px; padding: 12px 20px 0; }
    .yshop-tab {
      flex: 1; padding: 10px 12px; border-radius: 999px;
      background: rgba(255,255,255,0.06); cursor: pointer; text-align: center;
      font-weight: 600; font-size: 14px; user-select: none;
    }
    .yshop-tab.active { background: #ffd84d; color: #1a1a1a; }
    .yshop-balance {
      padding: 4px 12px; border-radius: 999px;
      background: rgba(255, 216, 77, 0.15); color: #ffd84d;
      font-weight: 700; font-size: 14px;
    }
    .yshop-close {
      background: none; border: 0; color: #fff; font-size: 24px;
      cursor: pointer; padding: 4px 8px;
    }
    .yshop-list {
      flex: 1; overflow-y: auto; padding: 16px 20px 24px;
      display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 12px;
    }
    /* On phones the modal is the full viewport width, so auto-fill with
       a 180px floor stretches every card to ~360px tall (aspect-ratio
       1/1 preview), making the shop scroll forever. Force a 2-up grid
       below 600px and slightly reduce padding for a denser layout. */
    @media (max-width: 600px) {
      .yshop-list {
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
        padding: 12px 12px 20px;
      }
      .yshop-card { padding: 8px; }
      .yshop-card .name { font-size: 13px; }
      .yshop-card .rarity { font-size: 11px; }
      .yshop-card .desc { font-size: 11px; min-height: 24px; }
    }
    .yshop-card {
      display: flex; flex-direction: column; gap: 6px;
      padding: 12px; border-radius: 12px;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
    }
    .yshop-preview {
      width: 100%; aspect-ratio: 1 / 1;
      border-radius: 10px; margin-bottom: 4px;
      display: flex; align-items: center; justify-content: center;
      box-shadow: inset 0 0 0 1px rgba(255,255,255,0.06);
      overflow: hidden; position: relative;
    }
    .yshop-preview-dice {
      width: 60%; aspect-ratio: 1 / 1; border-radius: 12px;
      display: grid; grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(3, 1fr);
      gap: 2px; padding: 8%;
      box-sizing: border-box;
      box-shadow:
        inset 0 -4px 8px rgba(0,0,0,0.25),
        inset 0 4px 8px rgba(255,255,255,0.18),
        0 4px 10px rgba(0,0,0,0.4);
    }
    .yshop-preview-dot {
      border-radius: 50%; align-self: center; justify-self: center;
      width: 60%; height: 60%;
    }
    .yshop-preview-dot.invisible { visibility: hidden; }
    .yshop-preview-table {
      width: 100%; height: 100%; display: flex; flex-direction: column;
    }
    .yshop-preview-table .wall { flex: 1; }
    .yshop-preview-table .floor { flex: 1.4; box-shadow: inset 0 6px 12px rgba(0,0,0,0.35); }
    .yshop-preview-table .border { height: 6px; }
    .yshop-card .name { font-weight: 700; font-size: 14px; }
    .yshop-card .rarity { font-size: 12px; opacity: 0.7; text-transform: uppercase; }
    .yshop-card .desc { font-size: 12px; opacity: 0.7; min-height: 28px; }
    .yshop-card .actions { display: flex; gap: 8px; margin-top: auto; }
    .yshop-btn {
      flex: 1; padding: 8px; border-radius: 8px; border: 0;
      cursor: pointer; font-weight: 700; font-size: 13px; font-family: inherit;
    }
    .yshop-btn.primary { background: #ffd84d; color: #1a1a1a; }
    .yshop-btn.primary:disabled { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.4); cursor: not-allowed; }
    .yshop-btn.secondary { background: rgba(255,255,255,0.1); color: #fff; }
    .yshop-btn.equipped { background: #4caf50; color: #fff; cursor: default; }
    .yshop-card.rare { border-color: rgba(180, 130, 255, 0.4); }
    .yshop-card.epic { border-color: rgba(255, 200, 80, 0.5); }
    .yshop-card.uncommon { border-color: rgba(100, 180, 255, 0.35); }
    .yshop-preview-key {
      width: 64%; aspect-ratio: 1 / 1; border-radius: 18px;
      display: flex; align-items: center; justify-content: center;
      box-shadow:
        inset 0 -4px 10px rgba(0,0,0,0.35),
        inset 0 4px 10px rgba(255,255,255,0.2),
        0 6px 14px rgba(0,0,0,0.5);
    }
    .yshop-key-icon { font-size: 36px; line-height: 1; }
    .yshop-card-badge {
      position: absolute; top: 8px; right: 8px;
      background: #4caf50; color: #fff; padding: 2px 8px;
      border-radius: 999px; font-weight: 700; font-size: 12px;
      z-index: 2;
    }
    .yshop-card-lock {
      position: absolute; top: 8px; left: 8px;
      background: rgba(0,0,0,0.6); color: #fff; padding: 2px 8px;
      border-radius: 999px; font-weight: 700; font-size: 12px;
      z-index: 2;
    }
  `;
  document.head.appendChild(style);
}

type ShopTab = 'dice' | 'tables' | 'keys';

export class SoloShop {
  private overlay: HTMLElement | null = null;
  private currentTab: ShopTab = 'dice';
  private onChange: () => void;

  constructor(onChange: () => void) {
    this.onChange = onChange;
  }

  openTab(tab: ShopTab): void {
    this.currentTab = tab;
    this.open();
  }

  open(): void {
    ensureStyles();
    if (this.overlay) {
      this.overlay.style.display = 'flex';
      this.render();
      return;
    }
    this.overlay = document.createElement('div');
    this.overlay.className = 'yshop-overlay';
    document.body.appendChild(this.overlay);
    this.render();
  }

  close(): void {
    if (this.overlay) this.overlay.style.display = 'none';
  }

  private render(): void {
    if (!this.overlay) return;
    const stats = cloudSave.getStats();

    let body: string;
    if (this.currentTab === 'keys') {
      body = this.renderKeysTab(stats.pips);
    } else {
      const items = buildCatalog(this.currentTab);
      const inventory = cloudSave.getInventory();
      const ownedSet = new Set(
        this.currentTab === 'dice' ? inventory.ownedDiceIds : inventory.ownedTableIds,
      );
      const equippedId =
        this.currentTab === 'dice' ? inventory.equippedDiceId : inventory.equippedTableId;
      body = items
        .map((item) => this.renderCard(item, ownedSet.has(item.id), item.id === equippedId, stats.pips))
        .join('');
    }

    this.overlay.innerHTML = `
      <div class="yshop-panel">
        <div class="yshop-header">
          <div class="yshop-title">${escape(t('shop.title') || 'Shop')}</div>
          <div class="yshop-balance">${stats.pips.toLocaleString('en-US')} pips</div>
          <button class="yshop-close" data-action="close">×</button>
        </div>
        <div class="yshop-tabs">
          <div class="yshop-tab ${this.currentTab === 'dice' ? 'active' : ''}" data-tab="dice">${escape(t('shop.dice') || 'Dice')}</div>
          <div class="yshop-tab ${this.currentTab === 'tables' ? 'active' : ''}" data-tab="tables">${escape(t('shop.tables') || 'Tables')}</div>
          <div class="yshop-tab ${this.currentTab === 'keys' ? 'active' : ''}" data-tab="keys">${escape(t('shop.keys') || 'Keys')}</div>
        </div>
        <div class="yshop-list">${body}</div>
      </div>
    `;

    this.overlay.querySelectorAll('[data-tab]').forEach((el) => {
      el.addEventListener('click', () => {
        const tab = (el as HTMLElement).dataset.tab as ShopTab;
        this.currentTab = tab;
        this.render();
      });
    });
    this.overlay.querySelectorAll('[data-action="close"]').forEach((el) => {
      el.addEventListener('click', () => this.close());
    });
    this.overlay.querySelectorAll('[data-buy]').forEach((el) => {
      el.addEventListener('click', () => this.buy((el as HTMLElement).dataset.buy!));
    });
    this.overlay.querySelectorAll('[data-equip]').forEach((el) => {
      el.addEventListener('click', () => this.equip((el as HTMLElement).dataset.equip!));
    });
    this.overlay.querySelectorAll('[data-buy-key]').forEach((el) => {
      el.addEventListener('click', () => this.buyKey((el as HTMLElement).dataset.buyKey!));
    });
  }

  private renderKeysTab(pips: number): string {
    const owned = cloudSave.getDesignKeys();
    return DESIGN_KEYS.map((key) => {
      const canAfford = pips >= key.pipsPrice;
      let action: string;
      if (key.locked) {
        action = `<button class="yshop-btn secondary" disabled>${escape(t('shop.locked') || 'Locked')}</button>`;
      } else {
        action = `<button class="yshop-btn primary" data-buy-key="${escape(key.id)}" ${canAfford ? '' : 'disabled'}>${key.pipsPrice.toLocaleString('en-US')} pips</button>`;
      }
      const ownedBadge = key.id === 'design_key' && owned > 0
        ? `<div class="yshop-card-badge">${owned}×</div>`
        : '';
      const lockedIcon = key.locked
        ? `<div class="yshop-card-lock">—</div>`
        : '';
      return `
        <div class="yshop-card ${escape(key.rarity)}" style="position:relative;">
          ${ownedBadge}${lockedIcon}
          <div class="yshop-preview" style="background: radial-gradient(circle at 30% 25%, rgba(255,255,255,0.08), rgba(0,0,0,0.35));">
            <div class="yshop-preview-key" style="background:${escape(key.color)};">
              <span class="yshop-key-icon">🔑</span>
            </div>
          </div>
          <div class="name">${escape(key.name)}</div>
          <div class="rarity">${escape(key.rarity)}</div>
          <div class="desc">${escape(key.description)}</div>
          <div class="actions">${action}</div>
        </div>
      `;
    }).join('');
  }

  private async buyKey(id: string): Promise<void> {
    const key = DESIGN_KEYS.find((k) => k.id === id);
    if (!key) return;
    if (key.locked) {
      haptic.warning();
      return;
    }
    if (key.id !== 'design_key') {
      // Premium keys are display-only for now — they unlock with future
      // gameplay milestones, not via the shop button.
      haptic.warning();
      return;
    }
    const ok = await cloudSave.purchaseDesignKey(key.pipsPrice);
    if (ok) {
      haptic.success();
      this.onChange();
      this.render();
    } else {
      haptic.warning();
      this.render();
    }
  }

  private renderCard(item: CatalogItem, owned: boolean, equipped: boolean, pips: number): string {
    const canAfford = pips >= item.pipsPrice;
    const action = equipped
      ? `<button class="yshop-btn equipped" disabled>${escape(t('buttons.equipped') || 'Equipped')}</button>`
      : owned
        ? `<button class="yshop-btn primary" data-equip="${escape(item.id)}">${escape(t('buttons.equip') || 'Equip')}</button>`
        : `<button class="yshop-btn primary" data-buy="${escape(item.id)}" ${canAfford ? '' : 'disabled'}>${item.pipsPrice} pips</button>`;
    const preview = item.kind === 'dice'
      ? renderDicePreview(item.config)
      : renderTablePreview(item.config);
    return `
      <div class="yshop-card ${escape(item.rarity)}">
        ${preview}
        <div class="name">${escape(item.name)}</div>
        <div class="rarity">${escape(item.rarity)}</div>
        <div class="desc">${escape(item.description)}</div>
        <div class="actions">${action}</div>
      </div>
    `;
  }

  private async buy(id: string): Promise<void> {
    if (this.currentTab === 'keys') return;
    const kind: 'dice' | 'tables' = this.currentTab;
    const items = buildCatalog(kind);
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const ok =
      kind === 'dice'
        ? await cloudSave.purchaseDice(id, item.pipsPrice)
        : await cloudSave.purchaseTable(id, item.pipsPrice);
    if (ok) {
      haptic.success();
      // Equip immediately for convenience.
      await this.equip(id);
    } else {
      haptic.warning();
      this.render();
    }
  }

  private async equip(id: string): Promise<void> {
    if (this.currentTab === 'keys') return;
    if (this.currentTab === 'dice') {
      await cloudSave.equipDice(id);
    } else {
      await cloudSave.equipTable(id);
    }
    haptic.light();
    this.onChange();
    this.render();
  }
}

function escape(s: string): string {
  return String(s).replace(/[&<>"']/g, (c) =>
    c === '&' ? '&amp;' : c === '<' ? '&lt;' : c === '>' ? '&gt;' : c === '"' ? '&quot;' : '&#39;',
  );
}

function sanitizeColor(value: unknown, fallback: string): string {
  if (typeof value !== 'string') return fallback;
  // Only allow #RGB / #RRGGBB / rgb()/rgba() shapes — never inject arbitrary CSS.
  if (/^#[0-9a-fA-F]{3,8}$/.test(value)) return value;
  if (/^rgba?\([\d\s.,%]+\)$/.test(value)) return value;
  return fallback;
}

function renderDicePreview(config: any): string {
  const base = sanitizeColor(config?.baseColor, '#ffffff');
  const dot = sanitizeColor(config?.dotColor, '#000000');
  const border = sanitizeColor(config?.borderColor, base);
  // Render the 5-face: 4 corners + center dot — recognisable as a die.
  const dots = [true, false, true, false, true, false, true, false, true];
  const cells = dots
    .map(
      (visible) =>
        `<span class="yshop-preview-dot ${visible ? '' : 'invisible'}" style="background:${dot}"></span>`,
    )
    .join('');
  return `
    <div class="yshop-preview" style="background: radial-gradient(circle at 30% 25%, rgba(255,255,255,0.08), rgba(0,0,0,0.35));">
      <div class="yshop-preview-dice" style="background:${base}; box-shadow: inset 0 -4px 8px rgba(0,0,0,0.25), inset 0 4px 8px rgba(255,255,255,0.18), 0 4px 10px rgba(0,0,0,0.4), 0 0 0 1px ${border};">
        ${cells}
      </div>
    </div>
  `;
}

function renderTablePreview(config: any): string {
  const wall = sanitizeColor(config?.wall?.color, '#888888');
  const floor = sanitizeColor(config?.floor?.color, '#1b4b02');
  const border = sanitizeColor(config?.border?.color, '#000000');
  return `
    <div class="yshop-preview">
      <div class="yshop-preview-table">
        <div class="wall" style="background:${wall}"></div>
        <div class="border" style="background:${border}"></div>
        <div class="floor" style="background:${floor}"></div>
      </div>
    </div>
  `;
}
