'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { useAppStore } from '@/stores/useAppStore'

interface NavItem {
  label: string
  href?: string
  children?: NavItem[]
}

const navItems: NavItem[] = [
  {
    label: '视频工具',
    children: [
      { label: '视频压缩', href: '/video/compress' },
      { label: '视频转换', href: '/video/convert' },
      { label: '视频裁剪', href: '/video/crop' },
      { label: '视频合并', href: '/video/merge' },
      { label: '视频文字识别', href: '/video/extract-text' },
      { label: '视频下载', href: '/video/download' },
    ],
  },
  {
    label: '音频工具',
    children: [
      { label: '音频转文字', href: '/audio/transcribe' },
      { label: '音频翻译', href: '/audio/translate' },
      { label: '音频格式转换', href: '/audio/convert' },
      { label: '音频剪辑', href: '/audio/trim' },
      { label: '音频降噪', href: '/audio/denoise' },
    ],
  },
  {
    label: '博客',
    href: '/blog',
  },
  {
    label: '定价',
    href: '/pricing',
  },
]

export const Navigation: React.FC = () => {
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useAppStore()
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const handleDropdownToggle = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 backdrop-blur-md bg-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
                SparkVideo
              </span>
            </Link>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <div key={item.label} className="relative">
                {item.children ? (
                  <>
                    <button
                      onClick={() => handleDropdownToggle(item.label)}
                      className={cn(
                        'px-4 py-2 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors duration-200 flex items-center gap-1',
                        openDropdown === item.label && 'text-indigo-600 bg-gray-50'
                      )}
                    >
                      {item.label}
                      <svg
                        className={cn(
                          'w-4 h-4 transition-transform duration-200',
                          openDropdown === item.label && 'rotate-180'
                        )}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Dropdown Menu */}
                    {openDropdown === item.label && (
                      <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href!}
                            className={cn(
                              'block px-4 py-2 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition-colors duration-200',
                              pathname === child.href && 'text-indigo-600 bg-gray-50'
                            )}
                            onClick={() => setOpenDropdown(null)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href!}
                    className={cn(
                      'px-4 py-2 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors duration-200',
                      pathname === item.href && 'text-indigo-600 bg-gray-50'
                    )}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    仪表板
                  </Button>
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {user?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
                    </div>
                  </button>
                  
                  {/* User Dropdown */}
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 hidden group-hover:block">
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                    >
                      设置
                    </Link>
                    <Link
                      href="/tasks"
                      className="block px-4 py-2 text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                    >
                      我的任务
                    </Link>
                    <hr className="my-2 border-gray-200" />
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      退出登录
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    登录
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">
                    注册
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-50">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  )
}