// i18n core functionality

import { en } from './locales/en';
import { ru } from './locales/ru';
import { detectPlatformLanguage } from './platformLang';
import type { Language, TranslationParams, Translations } from './types';

const translations = {
  en,
  ru,
};

let currentLanguage: Language = 'en';

// Language change listeners
type LanguageChangeListener = (lang: Language) => void;
const listeners: LanguageChangeListener[] = [];

/**
 * Initialize i18n with language detection
 */
export function initI18n(): Language {
  // Try to get language from localStorage
  const savedLang = localStorage.getItem('language') as Language | null;

  if (savedLang && (savedLang === 'en' || savedLang === 'ru')) {
    currentLanguage = savedLang;
    return currentLanguage;
  }

  // Platform-specific language hint (Telegram user lang / navigator.language
  // depending on which build is running).
  const platformLang = detectPlatformLanguage();
  if (platformLang) {
    currentLanguage = platformLang;
    localStorage.setItem('language', platformLang);
    return currentLanguage;
  }

  // Default to English
  currentLanguage = 'en';
  localStorage.setItem('language', 'en');
  return currentLanguage;
}

/**
 * Get current language
 */
export function getCurrentLanguage(): Language {
  return currentLanguage;
}

/**
 * Set language
 */
export function setLanguage(lang: Language): void {
  if (lang !== 'en' && lang !== 'ru') {
    console.warn(`[i18n] Unsupported language: ${lang}, falling back to 'en'`);
    lang = 'en';
  }

  currentLanguage = lang;
  localStorage.setItem('language', lang);

  // Notify all listeners
  listeners.forEach(listener => listener(lang));
}

/**
 * Subscribe to language changes
 */
export function onLanguageChange(listener: LanguageChangeListener): () => void {
  listeners.push(listener);
  
  // Return unsubscribe function
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
}

/**
 * Get nested value from object by dot-separated path
 */
function getNestedValue(obj: any, path: string): any {
  const keys = path.split('.');
  let value = obj;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return undefined;
    }
  }

  return value;
}

/**
 * Replace parameters in translation string
 */
function replaceParams(str: string, params?: TranslationParams): string {
  if (!params) return str;

  return str.replace(/\{(\w+)\}/g, (match, key) => {
    const value = params[key];
    return value !== undefined ? String(value) : match;
  });
}

/**
 * Translate a key
 * @param key - Translation key (e.g., 'status.online')
 * @param params - Optional parameters to replace in translation
 * @returns Translated string
 */
export function t(key: string, params?: TranslationParams): string {
  const translation = getNestedValue(translations[currentLanguage], key);

  if (translation === undefined) {
    console.warn(`[i18n] Missing translation for key: ${key} (lang: ${currentLanguage})`);
    return key;
  }

  if (typeof translation !== 'string') {
    console.warn(`[i18n] Translation for key ${key} is not a string`);
    return key;
  }

  return replaceParams(translation, params);
}

/**
 * Translate with count-based pluralization (simple version for Russian)
 * @param key - Base translation key
 * @param count - Number for pluralization
 * @param params - Optional parameters
 */
export function tc(key: string, count: number, params?: TranslationParams): string {
  const mergedParams = { ...params, count };
  return t(key, mergedParams);
}

// Export types
export type { Language, TranslationParams };
