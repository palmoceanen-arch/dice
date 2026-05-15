// i18n types and interfaces

export type Language = 'en' | 'ru';

export interface TranslationParams {
  [key: string]: string | number;
}

export interface Translations {
  [key: string]: string | Translations;
}
