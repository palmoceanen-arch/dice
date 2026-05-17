// Cloud save layer for the Yandex Games build.
//
// Yandex provides two storage buckets on the Player object:
//   * setData / getData — JSON, up to 200KB, limit 100 calls per 5 min
//   * setStats / getStats / incrementStats — numbers, up to 10KB,
//     limit 60 calls per minute
//
// We keep:
//   * the player's inventory and settings in `setData`
//   * frequently-incremented counters (pips, totalRolls, ...) in stats
//
// All writes are debounced and mirrored to localStorage so the UI stays
// responsive even on slow networks (or when running locally without YaGames).

import { getPlayer } from './platform';
import presets from '../../shared/presets.json';

const LS_INVENTORY_KEY = 'yandex.inventory';
const LS_SETTINGS_KEY = 'yandex.settings';
const LS_CUSTOM_PRESETS_KEY = 'yandex.customPresets';
const LS_CUSTOM_DICE_KEY = 'yandex.customDice';
const LS_STATS_KEY = 'yandex.stats';

const DATA_FLUSH_DELAY_MS = 1000;
const STATS_FLUSH_DELAY_MS = 1500;

export interface Inventory {
  ownedDiceIds: string[];
  ownedTableIds: string[];
  equippedDiceId: string;
  equippedTableId: string;
  designKeys: number;
}

export interface Settings {
  graphics: 'low' | 'medium' | 'high';
  soundVolume: number;
  language: 'ru' | 'en';
}

export interface Stats {
  pips: number;
  totalRolls: number;
  highestRoll: number;
}

interface CustomPresetMap {
  [id: string]: any;
}

function loadFromLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return { ...fallback, ...JSON.parse(raw) } as T;
  } catch {
    return fallback;
  }
}

function saveToLocal(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage quota — non-fatal
  }
}

function getDefaultOwnedDiceIds(): string[] {
  return Object.entries((presets as any).dice ?? {})
    .filter(([, value]: [string, any]) => (value?.rarity ?? 'common') === 'common')
    .map(([id]) => id);
}

function getDefaultOwnedTableIds(): string[] {
  return Object.entries((presets as any).tables ?? {})
    .filter(([, value]: [string, any]) => (value?.rarity ?? 'common') === 'common')
    .map(([id]) => id);
}

function defaultInventory(): Inventory {
  const owned = getDefaultOwnedDiceIds();
  const tables = getDefaultOwnedTableIds();
  return {
    ownedDiceIds: owned,
    ownedTableIds: tables,
    equippedDiceId: owned[0] ?? 'classic_white',
    equippedTableId: tables[0] ?? 'classic_green',
    designKeys: 0,
  };
}

function defaultSettings(): Settings {
  return {
    graphics: 'medium',
    soundVolume: 1,
    language: 'en',
  };
}

function defaultStats(): Stats {
  return { pips: 0, totalRolls: 0, highestRoll: 0 };
}

class CloudSaveManager {
  private inventory: Inventory = defaultInventory();
  private settings: Settings = defaultSettings();
  private stats: Stats = defaultStats();
  private customPresets: CustomPresetMap = {};
  // The player's currently-saved custom dice config. When non-null this
  // overrides the equipped preset's config (matches the Telegram flow that
  // uses localStorage.customDiceConfig).
  private customDice: any | null = null;
  private customDiceListeners = new Set<() => void>();
  // Notified whenever the equipped dice / table / custom dice changes —
  // used by the live WebSocket client to push `set_player_items` to the
  // server so multiplayer opponents see the player's actual local skin.
  private inventoryListeners = new Set<() => void>();

  private dataFlushTimer: number | null = null;
  private statsFlushTimer: number | null = null;
  private pendingStatsDelta: Partial<Stats> = {};
  private loaded = false;

  // --- public API ---

  async loadAll(): Promise<void> {
    // Hydrate from localStorage first so the UI has data immediately.
    this.inventory = loadFromLocal(LS_INVENTORY_KEY, defaultInventory());
    this.settings = loadFromLocal(LS_SETTINGS_KEY, defaultSettings());
    this.stats = loadFromLocal(LS_STATS_KEY, defaultStats());
    this.customPresets = loadFromLocal(LS_CUSTOM_PRESETS_KEY, {});
    try {
      const raw = localStorage.getItem(LS_CUSTOM_DICE_KEY);
      this.customDice = raw ? JSON.parse(raw) : null;
    } catch {
      this.customDice = null;
    }

    const player = getPlayer();
    if (!player) {
      this.loaded = true;
      return;
    }

    try {
      const [data, statsData] = await Promise.all([
        player.getData().catch((e) => {
          console.warn('[cloud] getData failed', e);
          return {} as Record<string, unknown>;
        }),
        player.getStats().catch((e) => {
          console.warn('[cloud] getStats failed', e);
          return {} as Record<string, number>;
        }),
      ]);

      if (data && typeof data === 'object') {
        if (data.inventory) {
          this.inventory = { ...this.inventory, ...(data.inventory as Inventory) };
          saveToLocal(LS_INVENTORY_KEY, this.inventory);
        }
        if (data.settings) {
          this.settings = { ...this.settings, ...(data.settings as Settings) };
          saveToLocal(LS_SETTINGS_KEY, this.settings);
        }
        if (data.customPresets) {
          this.customPresets = { ...this.customPresets, ...(data.customPresets as CustomPresetMap) };
          saveToLocal(LS_CUSTOM_PRESETS_KEY, this.customPresets);
        }
        if (data.customDice !== undefined) {
          this.customDice = (data.customDice as any) || null;
          if (this.customDice) {
            saveToLocal(LS_CUSTOM_DICE_KEY, this.customDice);
          } else {
            try { localStorage.removeItem(LS_CUSTOM_DICE_KEY); } catch {}
          }
        }
      }

      if (statsData && typeof statsData === 'object') {
        this.stats = {
          pips: Number(statsData.pips ?? this.stats.pips ?? 0),
          totalRolls: Number(statsData.totalRolls ?? this.stats.totalRolls ?? 0),
          highestRoll: Number(statsData.highestRoll ?? this.stats.highestRoll ?? 0),
        };
        saveToLocal(LS_STATS_KEY, this.stats);
      }
    } catch (e) {
      console.warn('[cloud] failed to load player data, using local cache', e);
    }

    this.loaded = true;
  }

  isLoaded(): boolean {
    return this.loaded;
  }

  getInventory(): Inventory {
    return this.inventory;
  }

  getSettings(): Settings {
    return this.settings;
  }

  getStats(): Stats {
    return this.stats;
  }

  getPips(): number {
    return this.stats.pips;
  }

  getCustomPresets(): CustomPresetMap {
    return this.customPresets;
  }

  getDesignKeys(): number {
    return Math.max(0, this.inventory.designKeys | 0);
  }

  getCustomDiceConfig(): any | null {
    return this.customDice;
  }

  hasCustomDice(): boolean {
    return this.customDice != null;
  }

  onCustomDiceChange(cb: () => void): () => void {
    this.customDiceListeners.add(cb);
    return () => this.customDiceListeners.delete(cb);
  }

  private notifyCustomDiceChange(): void {
    this.customDiceListeners.forEach((cb) => {
      try { cb(); } catch (e) { console.warn('[cloud] custom-dice listener threw', e); }
    });
    // Custom-dice changes also affect what config is served as the
    // player's "equipped" dice, so fire the inventory listeners too.
    this.notifyInventoryChange();
  }

  onInventoryChange(cb: () => void): () => void {
    this.inventoryListeners.add(cb);
    return () => this.inventoryListeners.delete(cb);
  }

  private notifyInventoryChange(): void {
    this.inventoryListeners.forEach((cb) => {
      try { cb(); } catch (e) { console.warn('[cloud] inventory listener threw', e); }
    });
  }

  // --- equipped item helpers (mirrors the WebSocketClient API used by Game.ts) ---

  getEquippedDiceConfig(): any | null {
    // A saved custom dice config always takes priority — it matches the
    // Telegram build's localStorage.customDiceConfig behaviour.
    if (this.customDice) return this.customDice;
    const id = this.inventory.equippedDiceId;
    if (!id) return null;
    const entry = (presets as any).dice?.[id];
    return entry?.config ?? null;
  }

  getEquippedTableConfig(): any | null {
    const id = this.inventory.equippedTableId;
    if (!id) return null;
    const entry = (presets as any).tables?.[id];
    return entry?.config ?? null;
  }

  // --- mutations ---

  async incrementPips(delta: number): Promise<void> {
    if (!Number.isFinite(delta) || delta === 0) return;
    this.stats.pips = Math.max(0, this.stats.pips + delta);
    saveToLocal(LS_STATS_KEY, this.stats);
    this.queueStats({ pips: delta });
  }

  async setPips(value: number): Promise<void> {
    if (!Number.isFinite(value)) return;
    const next = Math.max(0, Math.floor(value));
    const delta = next - this.stats.pips;
    if (delta === 0) return;
    this.stats.pips = next;
    saveToLocal(LS_STATS_KEY, this.stats);
    this.queueStats({ pips: delta });
  }

  async spendPips(amount: number): Promise<boolean> {
    if (!Number.isFinite(amount) || amount <= 0) return false;
    if (this.stats.pips < amount) return false;
    this.stats.pips -= amount;
    saveToLocal(LS_STATS_KEY, this.stats);
    this.queueStats({ pips: -amount });
    return true;
  }

  async bumpRollCount(): Promise<void> {
    this.stats.totalRolls += 1;
    saveToLocal(LS_STATS_KEY, this.stats);
    this.queueStats({ totalRolls: 1 });
  }

  async recordRollValue(total: number): Promise<void> {
    if (!Number.isFinite(total) || total <= this.stats.highestRoll) return;
    this.stats.highestRoll = total;
    saveToLocal(LS_STATS_KEY, this.stats);
    // Stats API only supports set/increment — use a one-shot setStats here.
    const player = getPlayer();
    if (!player) return;
    try {
      await player.setStats({ highestRoll: total });
    } catch (e) {
      console.warn('[cloud] setStats(highestRoll) failed', e);
    }
  }

  async equipDice(id: string): Promise<void> {
    if (!this.inventory.ownedDiceIds.includes(id)) return;
    this.inventory.equippedDiceId = id;
    saveToLocal(LS_INVENTORY_KEY, this.inventory);
    this.queueData();
    this.notifyInventoryChange();
  }

  async equipTable(id: string): Promise<void> {
    if (!this.inventory.ownedTableIds.includes(id)) return;
    this.inventory.equippedTableId = id;
    saveToLocal(LS_INVENTORY_KEY, this.inventory);
    this.queueData();
    this.notifyInventoryChange();
  }

  async purchaseDice(id: string, price: number): Promise<boolean> {
    if (this.inventory.ownedDiceIds.includes(id)) return false;
    if (!(await this.spendPips(price))) return false;
    this.inventory.ownedDiceIds.push(id);
    saveToLocal(LS_INVENTORY_KEY, this.inventory);
    this.queueData();
    return true;
  }

  async purchaseTable(id: string, price: number): Promise<boolean> {
    if (this.inventory.ownedTableIds.includes(id)) return false;
    if (!(await this.spendPips(price))) return false;
    this.inventory.ownedTableIds.push(id);
    saveToLocal(LS_INVENTORY_KEY, this.inventory);
    this.queueData();
    return true;
  }

  async purchaseDesignKey(price: number): Promise<boolean> {
    if (!(await this.spendPips(price))) return false;
    this.inventory.designKeys = this.getDesignKeys() + 1;
    saveToLocal(LS_INVENTORY_KEY, this.inventory);
    this.queueData();
    return true;
  }

  consumeDesignKey(): boolean {
    const current = this.getDesignKeys();
    if (current <= 0) return false;
    this.inventory.designKeys = current - 1;
    saveToLocal(LS_INVENTORY_KEY, this.inventory);
    this.queueData();
    return true;
  }

  async saveCustomDice(config: any): Promise<void> {
    this.customDice = config;
    saveToLocal(LS_CUSTOM_DICE_KEY, config);
    this.queueData();
    this.notifyCustomDiceChange();
  }

  async clearCustomDice(): Promise<void> {
    this.customDice = null;
    try { localStorage.removeItem(LS_CUSTOM_DICE_KEY); } catch {}
    this.queueData();
    this.notifyCustomDiceChange();
  }

  async updateSettings(patch: Partial<Settings>): Promise<void> {
    this.settings = { ...this.settings, ...patch };
    saveToLocal(LS_SETTINGS_KEY, this.settings);
    this.queueData();
  }

  async saveCustomPreset(id: string, value: any): Promise<void> {
    this.customPresets[id] = value;
    saveToLocal(LS_CUSTOM_PRESETS_KEY, this.customPresets);
    this.queueData();
  }

  // --- flush plumbing ---

  private queueData(): void {
    if (this.dataFlushTimer != null) return;
    this.dataFlushTimer = window.setTimeout(() => {
      this.dataFlushTimer = null;
      this.flushData().catch(() => undefined);
    }, DATA_FLUSH_DELAY_MS);
  }

  private queueStats(delta: Partial<Stats>): void {
    for (const key of Object.keys(delta) as (keyof Stats)[]) {
      const v = (delta as any)[key];
      if (typeof v !== 'number') continue;
      this.pendingStatsDelta[key] = ((this.pendingStatsDelta[key] as number) ?? 0) + v;
    }
    if (this.statsFlushTimer != null) return;
    this.statsFlushTimer = window.setTimeout(() => {
      this.statsFlushTimer = null;
      this.flushStats().catch(() => undefined);
    }, STATS_FLUSH_DELAY_MS);
  }

  private async flushData(): Promise<void> {
    const player = getPlayer();
    if (!player) return;
    try {
      await player.setData(
        {
          inventory: this.inventory,
          settings: this.settings,
          customPresets: this.customPresets,
          customDice: this.customDice,
        },
        false,
      );
    } catch (e) {
      console.warn('[cloud] setData failed', e);
    }
  }

  private async flushStats(): Promise<void> {
    const player = getPlayer();
    if (!player) return;
    const delta = this.pendingStatsDelta;
    this.pendingStatsDelta = {};
    const numericDelta: Record<string, number> = {};
    for (const k of Object.keys(delta)) {
      const v = (delta as any)[k];
      if (typeof v === 'number' && v !== 0) numericDelta[k] = v;
    }
    if (Object.keys(numericDelta).length === 0) return;
    try {
      await player.incrementStats(numericDelta);
    } catch (e) {
      console.warn('[cloud] incrementStats failed', e);
    }
  }
}

export const cloudSave = new CloudSaveManager();
