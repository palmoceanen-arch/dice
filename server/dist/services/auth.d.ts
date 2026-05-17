import type { TelegramUser, YandexPlayer } from '../types/index.js';
export declare function validateInitData(initData: string): TelegramUser | null;
export declare function parseInitDataUnsafe(initData: string): TelegramUser | null;
export interface YandexSignedPayload {
    uuid: string;
    issuedAt?: number;
    publicName?: string;
    avatarIdHash?: string;
    lang?: string;
}
export declare function validateYandexSignature(signedData: string): YandexSignedPayload | null;
export declare function parseYandexPlayerUnsafe(signedData: string | null, playerInfo: Partial<YandexPlayer> | null): YandexPlayer | null;
export declare function extractStartParam(initData: string): string | null;
//# sourceMappingURL=auth.d.ts.map