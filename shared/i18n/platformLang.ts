// Telegram-specific language detection used by initI18n().
// Vite aliases this module to the Yandex stub when VITE_PLATFORM=yandex so
// the Yandex bundle does not reference window.Telegram.

import type { Language } from './types';

export function detectPlatformLanguage(): Language | null {
  if (typeof window === 'undefined') return null;
  try {
    const user = (window as any).Telegram?.WebApp?.initDataUnsafe?.user as
      | { language_code?: string }
      | undefined;
    const tgLang = user?.language_code;
    if (tgLang === 'ru') return 'ru';
    if (tgLang === 'en') return 'en';
  } catch {
    // not running inside Telegram
  }
  return null;
}
