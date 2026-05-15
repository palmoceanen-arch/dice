// In-game shop for the Yandex Games build. Everything is bought with
// `pips` (the in-game currency) — there is no real-money purchase flow.
//
// The catalog comes from `shared/presets.json`. Items with a Telegram-Stars
// `price` of 0 are free (the player starts with all of them); everything
// else costs `price * PIPS_PER_STAR` pips on Yandex.

import presets from '../../shared/presets.json';
import { cloudSave } from './cloudSave';
import { t } from '../../shared/i18n';
import { haptic } from './platform';

const PIPS_PER_STAR = 100;

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
      display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 12px;
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
  `;
  document.head.appendChild(style);
}

export class SoloShop {
  private overlay: HTMLElement | null = null;
  private currentTab: 'dice' | 'tables' = 'dice';
  private onChange: () => void;

  constructor(onChange: () => void) {
    this.onChange = onChange;
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
    const items = buildCatalog(this.currentTab);
    const inventory = cloudSave.getInventory();
    const ownedSet = new Set(
      this.currentTab === 'dice' ? inventory.ownedDiceIds : inventory.ownedTableIds,
    );
    const equippedId =
      this.currentTab === 'dice' ? inventory.equippedDiceId : inventory.equippedTableId;

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
        </div>
        <div class="yshop-list">
          ${items
            .map((item) => this.renderCard(item, ownedSet.has(item.id), item.id === equippedId, stats.pips))
            .join('')}
        </div>
      </div>
    `;

    this.overlay.querySelectorAll('[data-tab]').forEach((el) => {
      el.addEventListener('click', () => {
        const tab = (el as HTMLElement).dataset.tab as 'dice' | 'tables';
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
    const items = buildCatalog(this.currentTab);
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const ok = this.currentTab === 'dice'
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
