'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/app/store/auth.store';
import { formatBytes, formatDate } from '@/app/lib/utils';

export default function AdminDashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    totalUsers: 1250,
    totalVideos: 3420,
    totalAudio: 1890,
    totalBlogs: 45,
    todayUsers: 23,
    todayVideos: 67,
    todayAudio: 34,
    todayRevenue: 1299.50,
  });

  const recentActivities = [
    { id: 1, type: 'user', action: '新用户注册', user: 'john.doe@example.com', time: '5分钟前' },
    { id: 2, type: 'video', action: '视频处理完成', user: 'alice@example.com', time: '10分钟前' },
    { id: 3, type: 'payment', action: '订阅升级', user: 'bob@example.com', time: '15分钟前' },
    { id: 4, type: 'blog', action: '发布新文章', user: 'admin', time: '30分钟前' },
    { id: 5, type: 'audio', action: '音频转录完成', user: 'sara@example.com', time: '1小时前' },
  ];

  const quickStats = [
    { label: '总用户数', value: stats.totalUsers, change: '+12%', icon: '👥' },
    { label: '视频处理', value: stats.totalVideos, change: '+23%', icon: '🎬' },
    { label: '音频处理', value: stats.totalAudio, change: '+18%', icon: '🎵' },
    { label: '博客文章', value: stats.totalBlogs, change: '+5%', icon: '📝' },
  ];

  const todayStats = [
    { label: '今日新增用户', value: stats.todayUsers, icon: '👤' },
    { label: '今日视频处理', value: stats.todayVideos, icon: '📹' },
    { label: '今日音频处理', value: stats.todayAudio, icon: '🎙️' },
    { label: '今日收入', value: `¥${stats.todayRevenue}`, icon: '💰' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">管理后台</h1>
        <p className="text-muted-foreground mt-2">欢迎回来，{user?.name}</p>
      </div>

      {/* 快速统计 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {quickStats.map((stat) => (
          <div key={stat.label} className="card p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">{stat.icon}</span>
              <span className="text-sm text-green-600 font-medium">{stat.change}</span>
            </div>
            <p className="text-2xl font-bold">{stat.value.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* 今日数据 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {todayStats.map((stat) => (
          <div key={stat.label} className="card p-4 bg-primary/5">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{stat.icon}</span>
              <div>
                <p className="text-lg font-semibold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* 最近活动 */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">最近活动</h2>
            <Link href="/admin/logs" className="text-sm text-primary hover:underline">
              查看全部
            </Link>
          </div>
          
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <div>
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.user}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 快速操作 */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">快速操作</h2>
          
          <div className="grid grid-cols-2 gap-3">
            <Link href="/admin/blog/new" className="btn-outline text-center py-4">
              <span className="block text-2xl mb-1">📝</span>
              <span className="text-sm">新建文章</span>
            </Link>
            
            <Link href="/admin/users" className="btn-outline text-center py-4">
              <span className="block text-2xl mb-1">👥</span>
              <span className="text-sm">用户管理</span>
            </Link>
            
            <Link href="/admin/videos" className="btn-outline text-center py-4">
              <span className="block text-2xl mb-1">🎬</span>
              <span className="text-sm">视频管理</span>
            </Link>
            
            <Link href="/admin/settings" className="btn-outline text-center py-4">
              <span className="block text-2xl mb-1">⚙️</span>
              <span className="text-sm">系统设置</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 系统状态 */}
      <div className="card p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">系统状态</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">服务器状态</p>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-sm">运行正常</span>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-1">存储使用</p>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-secondary rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '67%' }}></div>
              </div>
              <span className="text-sm">67%</span>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-1">API调用</p>
            <div className="flex items-center space-x-2">
              <span className="text-sm">12,345 / 50,000</span>
              <span className="text-xs text-green-600">正常</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}