import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './app/i18n/config';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always', // Changed from 'as-needed' to 'always' to ensure all routes have locale prefix
});

export const config = {
  matcher: [
    // Match all pathnames except for
    // - ... if they start with `/api`, `/_next` or `/_vercel`
    // - ... the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)',
    // However, match all pathnames within `/users`, including the ones with a dot
    '/([\\w-]+)?/users/(.+)'
  ]
};