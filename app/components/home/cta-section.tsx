'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

export default function CTASection() {
  const t = useTranslations();
  const pathname = usePathname();
  
  // Extract current locale from pathname
  const currentLocale = pathname.split('/')[1] || 'zh';
  const localePrefix = `/${currentLocale}`;

  return (
    <section className="py-24 bg-primary">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-primary-foreground sm:text-4xl">
          {t('hero.title')}
        </h2>
        <p className="mt-4 text-lg text-primary-foreground/90 max-w-2xl mx-auto">
          {t('hero.subtitle')}
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href={`${localePrefix}/register`}
            className="rounded-md bg-white px-8 py-3 text-lg font-semibold text-primary shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {t('hero.cta.getStarted')}
          </Link>
          <Link
            href={`${localePrefix}/video`}
            className="text-lg font-semibold leading-6 text-white hover:text-gray-100"
          >
            {t('hero.cta.watchDemo')} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}