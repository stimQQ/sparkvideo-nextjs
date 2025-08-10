import React from 'react'
import Link from 'next/link'
import { VIDEO_PLATFORMS } from '@/lib/constants/platforms'

const footerLinks = {
  视频工具: [
    { label: '视频压缩', href: '/video/compress' },
    { label: '视频转换', href: '/video/convert' },
    { label: '视频裁剪', href: '/video/crop' },
    { label: '视频合并', href: '/video/merge' },
    { label: '视频文字识别', href: '/video/extract-text' },
  ],
  音频工具: [
    { label: '音频转文字', href: '/audio/transcribe' },
    { label: '音频翻译', href: '/audio/translate' },
    { label: '音频格式转换', href: '/audio/convert' },
    { label: '音频剪辑', href: '/audio/trim' },
  ],
  下载平台: VIDEO_PLATFORMS.slice(0, 5).map(p => ({
    label: `${p.name}下载`,
    href: `/video/download/${p.slug}`,
  })),
  关于: [
    { label: '关于我们', href: '/about' },
    { label: '博客', href: '/blog' },
    { label: '定价', href: '/pricing' },
    { label: '联系我们', href: '/contact' },
  ],
  法律: [
    { label: '服务条款', href: '/terms' },
    { label: '隐私政策', href: '/privacy' },
    { label: 'Cookie政策', href: '/cookies' },
  ],
}

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <div className="mb-4">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
                SparkVideo
              </h3>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              专业的视频音频处理平台，提供免费、快速、高质量的服务
            </p>
            <div className="flex space-x-4">
              {/* Social Media Icons */}
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-white mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © 2024 SparkVideo. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <select className="bg-gray-800 text-gray-300 text-sm rounded px-3 py-1 border border-gray-700">
                <option value="zh">简体中文</option>
                <option value="en">English</option>
                <option value="ja">日本語</option>
                <option value="ko">한국어</option>
              </select>
              <select className="bg-gray-800 text-gray-300 text-sm rounded px-3 py-1 border border-gray-700">
                <option value="USD">USD</option>
                <option value="CNY">CNY</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}