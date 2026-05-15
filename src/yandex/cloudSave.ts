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
const LS_STATS_KEY = 'yandex.stats';

const DATA_FLUSH_DELAY_MS = 1000;
const STATS_FLUSH_DELAY_MS = 1500;

export interface Inventory {
  ownedDiceIds: string[];
  ownedTableIds: string[];
  equippedDiceId: string;
  equippedTableId: string;
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

  // --- equipped item helpers (mirrors the WebSocketClient API used by Game.ts) ---

  getEquippedDiceConfig(): any | null {
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
  }

  async equipTable(id: string): Promise<void> {
    if (!this.inventory.ownedTableIds.includes(id)) return;
    this.inventory.equippedTableId = id;
    saveToLocal(LS_INVENTORY_KEY, this.inventory);
    this.queueData();
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
