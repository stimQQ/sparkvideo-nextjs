'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useAuthStore } from '@/app/store/auth.store';

export default function UserMenu() {
  const t = useTranslations();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 rounded-full p-1 hover:bg-accent"
      >
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md bg-background shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <div className="px-4 py-2 border-b">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            
            <Link
              href="/dashboard"
              className="block px-4 py-2 text-sm text-foreground hover:bg-accent"
              onClick={() => setIsOpen(false)}
            >
              {t('nav.dashboard')}
            </Link>
            
            <Link
              href="/settings"
              className="block px-4 py-2 text-sm text-foreground hover:bg-accent"
              onClick={() => setIsOpen(false)}
            >
              {t('nav.settings')}
            </Link>
            
            <Link
              href="/subscription"
              className="block px-4 py-2 text-sm text-foreground hover:bg-accent"
              onClick={() => setIsOpen(false)}
            >
              {t('nav.subscription')}
            </Link>
            
            <hr className="my-1" />
            
            <button
              onClick={handleLogout}
              className="block w-full px-4 py-2 text-left text-sm text-foreground hover:bg-accent"
            >
              {t('nav.logout')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}