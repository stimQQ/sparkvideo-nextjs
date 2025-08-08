'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/app/lib/utils';

export default function AdminSidebar() {
  const pathname = usePathname();
  
  const menuItems = [
    {
      title: '仪表板',
      icon: '📊',
      href: '/admin',
    },
    {
      title: '博客管理',
      icon: '📝',
      href: '/admin/blog',
      subItems: [
        { title: '所有文章', href: '/admin/blog' },
        { title: '新建文章', href: '/admin/blog/new' },
        { title: '分类管理', href: '/admin/blog/categories' },
        { title: '标签管理', href: '/admin/blog/tags' },
      ],
    },
    {
      title: '用户管理',
      icon: '👥',
      href: '/admin/users',
    },
    {
      title: '视频管理',
      icon: '🎬',
      href: '/admin/videos',
    },
    {
      title: '音频管理',
      icon: '🎵',
      href: '/admin/audio',
    },
    {
      title: '订阅管理',
      icon: '💳',
      href: '/admin/subscriptions',
    },
    {
      title: '系统设置',
      icon: '⚙️',
      href: '/admin/settings',
    },
  ];

  return (
    <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-card border-r overflow-y-auto">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <div key={item.href}>
            <Link
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors',
                pathname === item.href
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent'
              )}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.title}</span>
            </Link>
            
            {item.subItems && pathname.startsWith(item.href) && (
              <div className="ml-8 mt-2 space-y-1">
                {item.subItems.map((subItem) => (
                  <Link
                    key={subItem.href}
                    href={subItem.href}
                    className={cn(
                      'block px-3 py-1.5 text-sm rounded-md transition-colors',
                      pathname === subItem.href
                        ? 'bg-accent text-foreground font-medium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    )}
                  >
                    {subItem.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}