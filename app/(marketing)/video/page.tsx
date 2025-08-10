import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '视频工具中心 - SparkVideo',
  description: '专业的视频处理工具套件，包括视频压缩、格式转换、视频裁剪、视频合并等功能',
  keywords: ['视频压缩', '视频转换', '视频编辑', '视频处理'],
}

const videoTools = [
  {
    id: 'compress',
    name: '视频压缩',
    description: '智能压缩视频，减小文件大小高达90%，同时保持画质',
    icon: '🗜️',
    href: '/video/compress',
    features: ['保持原画质', '批量压缩', '自定义参数', '极速处理'],
    badge: '热门',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'convert',
    name: '视频格式转换',
    description: '支持50+视频格式互转，包括MP4、AVI、MOV、WebM等',
    icon: '🔄',
    href: '/video/convert',
    features: ['50+格式', '批量转换', '保持质量', '快速转换'],
    badge: '推荐',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'crop',
    name: '视频裁剪',
    description: '调整视频比例，适配各种社交媒体平台要求',
    icon: '✂️',
    href: '/video/crop',
    features: ['多种比例', '精确裁剪', '实时预览', '批量处理'],
    color: 'from-green-500 to-teal-500',
  },
  {
    id: 'merge',
    name: '视频合并',
    description: '将多个视频文件合并为一个，支持不同格式',
    icon: '🔗',
    href: '/video/merge',
    features: ['无缝拼接', '顺序调整', '转场效果', '音频同步'],
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 'split',
    name: '视频分割',
    description: '精确分割视频，按时间或大小切分',
    icon: '✂️',
    href: '/video/split',
    features: ['精确到帧', '多段分割', '自动切分', '保持质量'],
    color: 'from-indigo-500 to-blue-500',
  },
  {
    id: 'extract-text',
    name: '视频文字识别',
    description: 'AI智能识别视频中的文字内容，支持多语言',
    icon: '📝',
    href: '/video/extract-text',
    features: ['OCR识别', '多语言', '批量提取', '导出文档'],
    badge: '新功能',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    id: 'enhance',
    name: '视频增强',
    description: 'AI增强视频画质，提升清晰度和色彩',
    icon: '✨',
    href: '/video/enhance',
    features: ['画质增强', '降噪处理', '色彩优化', '防抖处理'],
    color: 'from-pink-500 to-rose-500',
  },
  {
    id: 'download',
    name: '视频下载',
    description: '支持15+平台视频下载，包括YouTube、TikTok等',
    icon: '⬇️',
    href: '/video/download',
    features: ['15+平台', '4K画质', '批量下载', '无水印'],
    badge: '最受欢迎',
    color: 'from-teal-500 to-green-500',
  },
]

const categories = [
  {
    name: '基础编辑',
    tools: ['compress', 'convert', 'crop', 'merge', 'split'],
  },
  {
    name: '高级功能',
    tools: ['extract-text', 'enhance'],
  },
  {
    name: '下载工具',
    tools: ['download'],
  },
]

export default function VideoToolsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              视频工具中心
            </h1>
            <p className="text-xl opacity-90 mb-8">
              Your Complete Video Processing Suite
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              {['🎥 专业工具', '⚡ 快速处理', '🔒 安全私密', '💎 高质量输出'].map((feature) => (
                <span key={feature} className="bg-white/20 px-4 py-2 rounded-full">
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 -mt-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-indigo-600">50+</div>
              <div className="text-gray-600">支持格式</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-600">90%</div>
              <div className="text-gray-600">压缩率</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-600">4K</div>
              <div className="text-gray-600">最高画质</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-600">100%</div>
              <div className="text-gray-600">免费使用</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videoTools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Badge */}
              {tool.badge && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                    {tool.badge}
                  </span>
                </div>
              )}

              {/* Gradient Background */}
              <div className={`h-2 bg-gradient-to-r ${tool.color}`} />

              <div className="p-6">
                {/* Icon and Title */}
                <div className="flex items-start mb-4">
                  <div className="text-4xl mr-4">{tool.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {tool.name}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {tool.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {tool.features.map((feature) => (
                    <span
                      key={feature}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Action */}
                <div className="flex items-center text-indigo-600 font-medium">
                  <span>立即使用</span>
                  <svg
                    className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">按功能分类</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div key={category.name} className="bg-white rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-4">{category.name}</h3>
                <div className="space-y-2">
                  {category.tools.map((toolId) => {
                    const tool = videoTools.find((t) => t.id === toolId)
                    if (!tool) return null
                    return (
                      <Link
                        key={tool.id}
                        href={tool.href}
                        className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <span className="text-2xl mr-3">{tool.icon}</span>
                        <span className="text-gray-700 hover:text-indigo-600">
                          {tool.name}
                        </span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            需要批量处理视频？
          </h2>
          <p className="text-lg mb-6 opacity-90">
            升级到专业版，解锁批量处理、更快速度、更多功能
          </p>
          <Link
            href="/pricing"
            className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
          >
            查看专业版
          </Link>
        </div>
      </div>
    </div>
  )
}