// Yandex Games build language detection — replaces the Telegram-based
// detection in shared/i18n/platformLang.ts via vite alias.
//
// We do NOT call YaGames here because shared/i18n/index.ts wants a synchronous
// answer. The Yandex platform layer (src/yandex/platform.ts) updates the
// language asynchronously once the SDK is ready.

import type { Language } from '../../../shared/i18n/types';

export function detectPlatformLanguage(): Language | null {
  if (typeof navigator !== 'undefined' && typeof navigator.language === 'string') {
    if (navigator.language.toLowerCase().startsWith('ru')) return 'ru';
    if (navigator.language.toLowerCase().startsWith('en')) return 'en';
  }
  return null;
}
