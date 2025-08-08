'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/app/store/auth.store';
import AdminSidebar from '@/app/components/admin/sidebar';
import AdminHeader from '@/app/components/admin/header';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, checkAuth } = useAuthStore();
  
  // Extract current locale from pathname
  const currentLocale = pathname.split('/')[1] || 'zh';
  const localePrefix = `/${currentLocale}`;

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    // 检查是否登录且是管理员
    if (!isAuthenticated) {
      router.push(`${localePrefix}/login`);
    } else if (user?.role !== 'ADMIN') {
      router.push(`${localePrefix}/dashboard`);
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6 ml-64">
          {children}
        </main>
      </div>
    </div>
  );
}