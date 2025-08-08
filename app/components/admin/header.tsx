'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/store/auth.store';

export default function AdminHeader() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-card border-b z-50">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gradient">SparkVideo</span>
            <span className="text-sm bg-primary text-primary-foreground px-2 py-0.5 rounded">Admin</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Link 
            href="/" 
            target="_blank"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            查看网站
          </Link>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">管理员</p>
            </div>
            
            <button
              onClick={handleLogout}
              className="btn-ghost text-sm"
            >
              退出
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}