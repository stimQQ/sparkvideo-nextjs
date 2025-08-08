import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { locales, type Locale } from '../app/i18n/config';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locale || !locales.includes(locale as Locale)) {
    notFound();
  }

  const typedLocale = locale as Locale;

  return {
    locale: typedLocale,
    messages: (await import(`../app/i18n/messages/${typedLocale}.json`)).default,
    timeZone: 'Asia/Shanghai',
    now: new Date()
  };
});