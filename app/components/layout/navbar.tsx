'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/app/lib/utils';
import { useAuthStore } from '@/app/store/auth.store';
import LanguageSwitcher from './language-switcher';
import UserMenu from './user-menu';

export default function Navbar() {
  const t = useTranslations();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();

  // Extract current locale from pathname
  const currentLocale = pathname.split('/')[1] || 'zh';
  const localePrefix = `/${currentLocale}`;

  const navigation = [
    { name: t('nav.home'), href: localePrefix },
    { name: t('nav.video'), href: `${localePrefix}/video` },
    { name: t('nav.audio'), href: `${localePrefix}/audio` },
    { name: t('nav.documents'), href: `${localePrefix}/documents` },
    { name: t('nav.blog'), href: `${localePrefix}/blog` },
    { name: t('nav.pricing'), href: `${localePrefix}/pricing` },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href={localePrefix} className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gradient">SparkVideo</span>
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors',
                      isActive
                        ? 'text-foreground border-b-2 border-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <div className="flex items-center space-x-4">
                <Link href={`${localePrefix}/login`} className="btn-ghost">
                  {t('nav.login')}
                </Link>
                <Link href={`${localePrefix}/register`} className="btn-primary">
                  {t('nav.register')}
                </Link>
              </div>
            )}

            <button
              className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-accent"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 pb-3 pt-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'block border-l-4 px-4 py-2 text-base font-medium transition-colors',
                    isActive
                      ? 'border-primary bg-accent text-foreground'
                      : 'border-transparent text-muted-foreground hover:bg-accent hover:text-foreground'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}