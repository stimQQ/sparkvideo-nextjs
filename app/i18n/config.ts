export const locales = ['zh', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'zh';

export const localeNames: Record<Locale, string> = {
  zh: '简体中文',
  en: 'English',
};

export const localeCurrencies: Record<Locale, string> = {
  zh: 'CNY',
  en: 'USD',
};

export const localeTimezones: Record<Locale, string> = {
  zh: 'Asia/Shanghai',
  en: 'America/New_York',
};