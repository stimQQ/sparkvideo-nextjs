import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { VIDEO_PLATFORMS } from '@/lib/constants/platforms'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SparkVideo - 专业的视频音频处理平台',
  description: '提供视频下载、压缩、转换、音频转文字等专业服务。支持YouTube、TikTok、Bilibili等15+平台视频下载。',
  keywords: ['视频下载', '视频压缩', '音频转文字', 'YouTube下载', 'TikTok下载'],
}

export default function HomePage() {
  const popularTools = [
    { name: 'YouTube下载', href: '/video/download/youtube', icon: '📺' },
    { name: '视频压缩', href: '/video/compress', icon: '🗜️' },
    { name: '音频转文字', href: '/audio/transcribe', icon: '🎤' },
    { name: 'TikTok下载', href: '/video/download/tiktok', icon: '🎵' },
    { name: '视频转MP4', href: '/video/convert', icon: '🔄' },
    { name: '音频翻译', href: '/audio/translate', icon: '🌍' },
    { name: 'Instagram下载', href: '/video/download/instagram', icon: '📷' },
    { name: '视频裁剪', href: '/video/crop', icon: '✂️' },
  ]

  const features = [
    {
      title: '批量处理',
      description: '一次处理多个文件，提高工作效率',
      icon: '🚀',
    },
    {
      title: '高速转换',
      description: 'GPU加速，5倍速度提升',
      icon: '⚡',
    },
    {
      title: '无水印下载',
      description: '原画质下载，保持最佳质量',
      icon: '✨',
    },
    {
      title: '云端处理',
      description: '无需安装软件，在线即可使用',
      icon: '☁️',
    },
  ]

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center px-4 py-20 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-pink-50 -z-10" />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
        </div>

        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
              强大的视频音频处理平台
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The Most Powerful Video & Audio Processing Suite
            <br />
            支持15+平台视频下载 | 20+专业处理工具 | 完全免费
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/video/download">
              <Button size="lg" className="min-w-[200px]">
                开始使用视频工具
              </Button>
            </Link>
            <Link href="/audio/transcribe">
              <Button size="lg" variant="outline" className="min-w-[200px]">
                探索音频工具
              </Button>
            </Link>
          </div>

          <p className="text-sm text-gray-500">
            已服务 <span className="font-semibold text-indigo-600">1,000,000+</span> 用户 | 
            处理 <span className="font-semibold text-indigo-600">50,000,000+</span> 文件
          </p>
        </div>
      </section>

      {/* Quick Access Tools */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">热门工具</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularTools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group p-4 bg-gray-50 rounded-xl hover:bg-indigo-50 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{tool.icon}</span>
                  <span className="font-medium text-gray-700 group-hover:text-indigo-600">
                    {tool.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">为什么选择 SparkVideo？</h2>
            <p className="text-gray-600">专业、快速、安全的视频音频处理服务</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Three Column Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Video Tools */}
            <div className="bg-white rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <span className="mr-2">📹</span> 视频处理
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/video/compress" className="flex items-center text-gray-600 hover:text-indigo-600">
                    <span className="mr-2">▪</span> 视频压缩
                    <span className="ml-auto text-xs text-gray-400">最高90%压缩</span>
                  </Link>
                </li>
                <li>
                  <Link href="/video/convert" className="flex items-center text-gray-600 hover:text-indigo-600">
                    <span className="mr-2">▪</span> 格式转换
                    <span className="ml-auto text-xs text-gray-400">50+格式支持</span>
                  </Link>
                </li>
                <li>
                  <Link href="/video/crop" className="flex items-center text-gray-600 hover:text-indigo-600">
                    <span className="mr-2">▪</span> 视频编辑
                    <span className="ml-auto text-xs text-gray-400">专业剪辑</span>
                  </Link>
                </li>
              </ul>
              <Link href="/video">
                <Button variant="ghost" fullWidth className="mt-4">
                  探索视频工具 →
                </Button>
              </Link>
            </div>

            {/* Audio Tools */}
            <div className="bg-white rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <span className="mr-2">🎵</span> 音频处理
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/audio/transcribe" className="flex items-center text-gray-600 hover:text-indigo-600">
                    <span className="mr-2">▪</span> 音频转文字
                    <span className="ml-auto text-xs text-gray-400">99%准确率</span>
                  </Link>
                </li>
                <li>
                  <Link href="/audio/translate" className="flex items-center text-gray-600 hover:text-indigo-600">
                    <span className="mr-2">▪</span> 音频翻译
                    <span className="ml-auto text-xs text-gray-400">100+语言</span>
                  </Link>
                </li>
                <li>
                  <Link href="/audio/trim" className="flex items-center text-gray-600 hover:text-indigo-600">
                    <span className="mr-2">▪</span> 音频剪辑
                    <span className="ml-auto text-xs text-gray-400">精确剪切</span>
                  </Link>
                </li>
              </ul>
              <Link href="/audio">
                <Button variant="ghost" fullWidth className="mt-4">
                  探索音频工具 →
                </Button>
              </Link>
            </div>

            {/* Platform Downloads */}
            <div className="bg-white rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <span className="mr-2">⬇️</span> 平台下载
              </h3>
              <ul className="space-y-3">
                {VIDEO_PLATFORMS.slice(0, 3).map((platform) => (
                  <li key={platform.id}>
                    <Link
                      href={`/video/download/${platform.slug}`}
                      className="flex items-center text-gray-600 hover:text-indigo-600"
                    >
                      <span className="mr-2">▪</span> {platform.name}
                      <span className="ml-auto text-xs text-gray-400">{platform.features[0]}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/video/download">
                <Button variant="ghost" fullWidth className="mt-4">
                  查看所有平台 →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">准备好开始了吗？</h2>
          <p className="text-gray-600 mb-8">
            立即体验专业的视频音频处理服务，完全免费
          </p>
          <Link href="/register">
            <Button size="lg" className="min-w-[200px]">
              免费注册
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}