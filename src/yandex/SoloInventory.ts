// Player inventory overlay for the Yandex Games build.
//
// This is the solo-only equivalent of the inventory tab inside
// `MultiplayerUI`: it shows everything the player has unlocked through
// the in-game shop (dice, tables, design keys) and lets them equip
// what they own without going back to the shop. It also surfaces the
// player's saved "custom dice" — the design-key flow stored in
// cloudSave.customDice — so they can toggle it on/off.

import presets from '../../shared/presets.json';
import { cloudSave } from './cloudSave';
import { t } from '../../shared/i18n';
import { haptic } from './platform';

type PresetEntry = {
  name: string;
  description?: string;
  rarity?: string;
  config: any;
};

const STYLE_ID = 'yandex-inventory-style';

function escape(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function ensureStyles(): void {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .yinv-overlay {
      position: fixed; inset: 0; z-index: 100;
      background: rgba(0, 0, 0, 0.85);
      display: flex; align-items: stretch; justify-content: center;
      font-family: 'Montserrat', system-ui, sans-serif; color: #fff;
    }
    .yinv-panel {
      width: min(720px, 100%); max-height: 100%;
      display: flex; flex-direction: column;
      background: linear-gradient(180deg, #1f1f24 0%, #0d0d10 100%);
      box-shadow: 0 10px 40px rgba(0,0,0,0.6);
    }
    .yinv-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    .yinv-title { font-weight: 700; font-size: 20px; }
    .yinv-close {
      background: none; border: 0; color: #fff; font-size: 24px;
      cursor: pointer; padding: 4px 8px;
    }
    .yinv-list {
      flex: 1; overflow-y: auto; padding: 16px 20px 24px;
      display: flex; flex-direction: column; gap: 24px;
    }
    .yinv-section-title {
      font-size: 13px; opacity: 0.7; text-transform: uppercase;
      letter-spacing: 0.08em; margin-bottom: 8px;
    }
    .yinv-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 10px;
    }
    .yinv-card {
      display: flex; flex-direction: column; gap: 6px;
      padding: 10px; border-radius: 12px;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      cursor: pointer; user-select: none;
      transition: border-color 120ms, background 120ms;
    }
    .yinv-card:hover { border-color: rgba(255,255,255,0.18); background: rgba(255,255,255,0.06); }
    .yinv-card.equipped { border-color: #4caf50; background: rgba(76,175,80,0.12); }
    .yinv-card.disabled { opacity: 0.6; cursor: default; }
    .yinv-card.disabled:hover { border-color: rgba(255,255,255,0.08); background: rgba(255,255,255,0.04); }
    .yinv-preview {
      width: 100%; aspect-ratio: 1 / 1;
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      box-shadow: inset 0 0 0 1px rgba(255,255,255,0.06);
      overflow: hidden;
    }
    .yinv-preview-dice {
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
    .yinv-preview-dot { border-radius: 50%; align-self: center; justify-self: center; width: 60%; height: 60%; }
    .yinv-preview-dot.invisible { visibility: hidden; }
    .yinv-preview-table {
      width: 100%; height: 100%; display: flex; flex-direction: column;
    }
    .yinv-preview-table .wall { flex: 1; }
    .yinv-preview-table .floor { flex: 1.4; box-shadow: inset 0 6px 12px rgba(0,0,0,0.35); }
    .yinv-preview-key {
      width: 64%; aspect-ratio: 1 / 1; border-radius: 18px;
      display: flex; align-items: center; justify-content: center;
      background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
      box-shadow:
        inset 0 -4px 10px rgba(0,0,0,0.35),
        inset 0 4px 10px rgba(255,255,255,0.2),
        0 6px 14px rgba(0,0,0,0.5);
      font-size: 32px;
    }
    .yinv-card .name { font-weight: 700; font-size: 13px; }
    .yinv-card .meta { font-size: 11px; opacity: 0.65; }
    .yinv-empty { color: rgba(255,255,255,0.6); font-size: 13px; }
    .yinv-summary {
      display: flex; align-items: center; gap: 12px;
      padding: 12px 14px; border-radius: 12px;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
    }
    .yinv-summary .yinv-preview { width: 64px; flex: 0 0 64px; }
    .yinv-summary .info { flex: 1; display: flex; flex-direction: column; gap: 4px; }
    .yinv-summary .info .title { font-weight: 700; font-size: 14px; }
    .yinv-summary .info .desc { font-size: 12px; opacity: 0.7; }
    .yinv-summary .actions { display: flex; gap: 8px; flex-direction: column; }
    .yinv-btn {
      padding: 8px 12px; border-radius: 8px; border: 0;
      cursor: pointer; font-weight: 700; font-size: 12px; font-family: inherit;
      background: rgba(255,255,255,0.08); color: #fff;
    }
    .yinv-btn.primary { background: #ffd84d; color: #1a1a1a; }
    .yinv-btn.danger { background: rgba(229, 75, 75, 0.16); color: #f1a5a5; }
    .yinv-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  `;
  document.head.appendChild(style);
}

function renderDicePreview(config: any): string {
  const baseColor = (config?.baseColor ?? '#ffffff') as string;
  const dotColor = (config?.dotColor ?? '#000000') as string;
  const borderColor = (config?.borderColor ?? baseColor) as string;
  const positions = [
    [true, false, true],
    [false, true, false],
    [true, false, true],
  ];
  const grid = positions
    .flat()
    .map(
      (visible) =>
        `<div class="yinv-preview-dot${visible ? '' : ' invisible'}" style="background:${escape(dotColor)};"></div>`,
    )
    .join('');
  return `
    <div class="yinv-preview">
      <div class="yinv-preview-dice" style="background:${escape(baseColor)}; outline: 1px solid ${escape(borderColor)};">${grid}</div>
    </div>
  `;
}

function renderTablePreview(config: any): string {
  const floor =
    typeof config?.floor === 'object'
      ? (config.floor.color as string) ?? '#2d5a3d'
      : (config?.floorColor as string) ?? '#2d5a3d';
  const wall =
    typeof config?.wall === 'object'
      ? (config.wall.color as string) ?? '#1a3d2a'
      : (config?.wallColor as string) ?? '#1a3d2a';
  return `
    <div class="yinv-preview" style="background: rgba(0,0,0,0.25);">
      <div class="yinv-preview-table">
        <div class="wall" style="background:${escape(wall)};"></div>
        <div class="floor" style="background:${escape(floor)};"></div>
      </div>
    </div>
  `;
}

export interface SoloInventoryDeps {
  onChange: () => void;
  onOpenShopKeys: () => void;
}

export class SoloInventory {
  private overlay: HTMLElement | null = null;
  private deps: SoloInventoryDeps;
  private unsubscribe?: () => void;

  constructor(deps: SoloInventoryDeps) {
    this.deps = deps;
  }

  open(): void {
    ensureStyles();
    if (this.overlay) {
      this.overlay.style.display = 'flex';
      this.render();
      return;
    }
    this.overlay = document.createElement('div');
    this.overlay.className = 'yinv-overlay';
    document.body.appendChild(this.overlay);
    this.render();

    // Re-render whenever the saved custom dice changes (e.g. after using
    // a design key inside the editor).
    this.unsubscribe = cloudSave.onCustomDiceChange(() => {
      if (this.overlay && this.overlay.style.display !== 'none') {
        this.render();
      }
    });
  }

  close(): void {
    if (this.overlay) this.overlay.style.display = 'none';
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = undefined;
    }
  }

  private render(): void {
    if (!this.overlay) return;
    const inventory = cloudSave.getInventory();
    const dice = (presets as any).dice as Record<string, PresetEntry>;
    const tables = (presets as any).tables as Record<string, PresetEntry>;

    const ownedDice = inventory.ownedDiceIds.filter((id) => dice[id]);
    const ownedTables = inventory.ownedTableIds.filter((id) => tables[id]);
    const keysOwned = cloudSave.getDesignKeys();
    const customDice = cloudSave.getCustomDiceConfig();

    this.overlay.innerHTML = `
      <div class="yinv-panel">
        <div class="yinv-header">
          <div class="yinv-title">${escape(t('inventory.title') || 'Inventory')}</div>
          <button class="yinv-close" data-action="close">×</button>
        </div>
        <div class="yinv-list">
          <section>
            <div class="yinv-section-title">${escape(t('inventory.customDice') || 'Custom Dice')}</div>
            ${this.renderCustomDice(customDice, inventory.equippedDiceId, dice)}
          </section>

          <section>
            <div class="yinv-section-title">${escape(t('inventory.keys') || 'Design Keys')}</div>
            ${this.renderKeys(keysOwned)}
          </section>

          <section>
            <div class="yinv-section-title">${escape(t('inventory.dice') || 'Dice')} (${ownedDice.length})</div>
            ${
              ownedDice.length === 0
                ? `<div class="yinv-empty">${escape(t('inventory.noDice') || 'No dice yet')}</div>`
                : `<div class="yinv-grid">${ownedDice
                    .map((id) => this.renderDiceCard(id, dice[id], inventory.equippedDiceId === id))
                    .join('')}</div>`
            }
          </section>

          <section>
            <div class="yinv-section-title">${escape(t('inventory.tables') || 'Tables')} (${ownedTables.length})</div>
            ${
              ownedTables.length === 0
                ? `<div class="yinv-empty">${escape(t('inventory.noTables') || 'No tables yet')}</div>`
                : `<div class="yinv-grid">${ownedTables
                    .map((id) => this.renderTableCard(id, tables[id], inventory.equippedTableId === id))
                    .join('')}</div>`
            }
          </section>
        </div>
      </div>
    `;

    this.overlay.querySelectorAll('[data-action="close"]').forEach((el) => {
      el.addEventListener('click', () => this.close());
    });
    this.overlay.querySelectorAll('[data-equip-dice]').forEach((el) => {
      el.addEventListener('click', () => this.equipDice((el as HTMLElement).dataset.equipDice!));
    });
    this.overlay.querySelectorAll('[data-equip-table]').forEach((el) => {
      el.addEventListener('click', () => this.equipTable((el as HTMLElement).dataset.equipTable!));
    });
    this.overlay.querySelectorAll('[data-action="clear-custom"]').forEach((el) => {
      el.addEventListener('click', () => this.clearCustomDice());
    });
    this.overlay.querySelectorAll('[data-action="open-shop-keys"]').forEach((el) => {
      el.addEventListener('click', () => {
        this.close();
        this.deps.onOpenShopKeys();
      });
    });
  }

  private renderCustomDice(
    customDice: any | null,
    equippedDiceId: string,
    dice: Record<string, PresetEntry>,
  ): string {
    if (!customDice) {
      return `<div class="yinv-empty">${escape(t('inventory.noCustomDice') || "You haven't saved a custom dice yet")}</div>`;
    }
    const equipped = dice[equippedDiceId];
    const equippedName = equipped?.name ?? equippedDiceId;
    return `
      <div class="yinv-summary">
        ${renderDicePreview(customDice)}
        <div class="info">
          <div class="title">${escape(t('inventory.customDiceSaved') || 'Saved custom dice')}</div>
          <div class="desc">${escape(t('inventory.clearCustom') || 'Reset to equipped')} → ${escape(equippedName)}</div>
        </div>
        <div class="actions">
          <button class="yinv-btn danger" data-action="clear-custom">${escape(t('inventory.clearCustom') || 'Reset')}</button>
        </div>
      </div>
    `;
  }

  private renderKeys(count: number): string {
    if (count <= 0) {
      return `
        <div class="yinv-summary">
          <div class="yinv-preview" style="background: rgba(0,0,0,0.25);">
            <div class="yinv-preview-key">🔑</div>
          </div>
          <div class="info">
            <div class="title">${escape(t('inventory.noKeys') || 'No keys yet — buy one in the shop')}</div>
          </div>
          <div class="actions">
            <button class="yinv-btn primary" data-action="open-shop-keys">${escape(t('shop.title') || 'Shop')}</button>
          </div>
        </div>
      `;
    }
    return `
      <div class="yinv-summary">
        <div class="yinv-preview" style="background: rgba(0,0,0,0.25);">
          <div class="yinv-preview-key">🔑</div>
        </div>
        <div class="info">
          <div class="title">Design Key</div>
          <div class="desc">${escape((t('inventory.keysOwned') || '{count} key(s)').replace('{count}', String(count)))}</div>
        </div>
        <div class="actions">
          <button class="yinv-btn" data-action="open-shop-keys">+1</button>
        </div>
      </div>
    `;
  }

  private renderDiceCard(id: string, entry: PresetEntry, equipped: boolean): string {
    return `
      <div class="yinv-card ${equipped ? 'equipped' : ''}" data-equip-dice="${escape(id)}">
        ${renderDicePreview(entry.config)}
        <div class="name">${escape(entry.name)}</div>
        <div class="meta">${escape(entry.rarity ?? 'common')}${equipped ? ' · ✓' : ''}</div>
      </div>
    `;
  }

  private renderTableCard(id: string, entry: PresetEntry, equipped: boolean): string {
    return `
      <div class="yinv-card ${equipped ? 'equipped' : ''}" data-equip-table="${escape(id)}">
        ${renderTablePreview(entry.config)}
        <div class="name">${escape(entry.name)}</div>
        <div class="meta">${escape(entry.rarity ?? 'common')}${equipped ? ' · ✓' : ''}</div>
      </div>
    `;
  }

  private async equipDice(id: string): Promise<void> {
    const owned = cloudSave.getInventory().ownedDiceIds.includes(id);
    if (!owned) {
      haptic.warning();
      return;
    }
    await cloudSave.equipDice(id);
    haptic.success();
    this.deps.onChange();
    this.render();
  }

  private async equipTable(id: string): Promise<void> {
    const owned = cloudSave.getInventory().ownedTableIds.includes(id);
    if (!owned) {
      haptic.warning();
      return;
    }
    await cloudSave.equipTable(id);
    haptic.success();
    this.deps.onChange();
    this.render();
  }

  private async clearCustomDice(): Promise<void> {
    await cloudSave.clearCustomDice();
    haptic.success();
    this.deps.onChange();
    this.render();
  }
}
