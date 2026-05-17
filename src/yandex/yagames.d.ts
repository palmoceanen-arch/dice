// Minimal ambient typings for the Yandex Games SDK (v2).
// See https://yandex.ru/dev/games/doc/ru/sdk/sdk-player.html

export {};

declare global {
  interface YaGamesSDK {
    init(): Promise<YSDK>;
  }

  interface YSDK {
    environment: {
      app: { id: string };
      browser: { lang: string };
      i18n: { lang: string; tld: string };
      payload?: string | null;
    };
    getPlayer(options?: { signed?: boolean; scopes?: boolean }): Promise<YPlayer>;
    auth: {
      openAuthDialog(): Promise<void>;
    };
    features: {
      LoadingAPI?: {
        ready(): void;
      };
      GameplayAPI?: {
        start(): void;
        stop(): void;
      };
    };
    adv: {
      showFullscreenAdv(options?: {
        callbacks?: {
          onOpen?: () => void;
          onClose?: (wasShown: boolean) => void;
          onError?: (error: unknown) => void;
          onOffline?: () => void;
        };
      }): void;
      showRewardedVideo(options?: {
        callbacks?: {
          onOpen?: () => void;
          onRewarded?: () => void;
          onClose?: () => void;
          onError?: (error: unknown) => void;
        };
      }): void;
    };
    dispatchEvent(name: string, payload?: unknown): Promise<void>;
    EVENTS: {
      EXIT: string;
      HISTORY_BACK: string;
    };
    onEvent(event: string, cb: (...args: any[]) => void): () => void;
  }

  interface YPlayer {
    signature?: string;
    getUniqueID(): string;
    getName(): string;
    getPhoto(size: 'small' | 'medium' | 'large'): string;
    isAuthorized(): boolean;
    getMode(): string;
    setData(data: Record<string, unknown>, flush?: boolean): Promise<void>;
    getData(keys?: string[]): Promise<Record<string, unknown>>;
    setStats(stats: Record<string, number>): Promise<void>;
    getStats(keys?: string[]): Promise<Record<string, number>>;
    incrementStats(increments: Record<string, number>): Promise<Record<string, number>>;
  }

  interface Window {
    YaGames?: YaGamesSDK;
  }
}
