import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getPlatformBySlug, VIDEO_PLATFORMS } from '@/lib/constants/platforms'
import { VideoDownloader } from '@/components/features/download/VideoDownloader'

interface PageProps {
  params: {
    platform: string
  }
}

// 生成静态路径
export async function generateStaticParams() {
  return VIDEO_PLATFORMS.map((platform) => ({
    platform: platform.slug,
  }))
}

// 生成元数据
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const platform = getPlatformBySlug(params.platform)
  
  if (!platform) {
    return {
      title: 'Platform Not Found',
    }
  }

  return {
    title: `${platform.name} Video Downloader - Free HD Download | SparkVideo`,
    description: platform.description,
    keywords: platform.keywords,
    openGraph: {
      title: `${platform.name} Video Downloader`,
      description: platform.description,
      images: [`/og/${platform.slug}.png`],
    },
    alternates: {
      canonical: `/video/download/${platform.slug}`,
    },
  }
}

export default function PlatformDownloadPage({ params }: PageProps) {
  const platform = getPlatformBySlug(params.platform)

  if (!platform) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO优化的标题区域 */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center text-3xl">
              {platform.icon}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                {platform.name} Video Downloader
              </h1>
              <p className="text-lg opacity-90 mt-2">
                {platform.description}
              </p>
            </div>
          </div>
          
          {/* 特性标签 */}
          <div className="flex flex-wrap gap-2">
            {platform.features.map((feature) => (
              <span
                key={feature}
                className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm"
              >
                ✓ {feature}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 主要内容区 */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧 - 下载器 */}
          <div className="lg:col-span-2">
            <VideoDownloader platform={platform} />
          </div>

          {/* 右侧 - 信息和FAQ */}
          <div className="space-y-6">
            {/* 如何使用 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">
                如何下载{platform.name}视频？
              </h2>
              <ol className="space-y-3">
                <li className="flex">
                  <span className="text-indigo-600 font-semibold mr-3">1.</span>
                  <span className="text-gray-600">
                    复制{platform.name}视频链接
                  </span>
                </li>
                <li className="flex">
                  <span className="text-indigo-600 font-semibold mr-3">2.</span>
                  <span className="text-gray-600">
                    粘贴链接到上方输入框
                  </span>
                </li>
                <li className="flex">
                  <span className="text-indigo-600 font-semibold mr-3">3.</span>
                  <span className="text-gray-600">
                    点击"分析视频"按钮
                  </span>
                </li>
                <li className="flex">
                  <span className="text-indigo-600 font-semibold mr-3">4.</span>
                  <span className="text-gray-600">
                    选择质量并下载
                  </span>
                </li>
              </ol>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">常见问题</h2>
              <div className="space-y-4">
                <details className="group">
                  <summary className="cursor-pointer font-medium text-gray-900">
                    支持下载什么类型的内容？
                  </summary>
                  <p className="mt-2 text-sm text-gray-600">
                    我们支持下载{platform.name}平台上的所有公开视频内容，包括普通视频、直播回放等。
                  </p>
                </details>
                
                <details className="group">
                  <summary className="cursor-pointer font-medium text-gray-900">
                    下载的视频有水印吗？
                  </summary>
                  <p className="mt-2 text-sm text-gray-600">
                    我们提供无水印下载，保持视频原始质量。
                  </p>
                </details>
                
                <details className="group">
                  <summary className="cursor-pointer font-medium text-gray-900">
                    支持批量下载吗？
                  </summary>
                  <p className="mt-2 text-sm text-gray-600">
                    是的，您可以粘贴多个链接（每行一个）进行批量下载。
                  </p>
                </details>
                
                <details className="group">
                  <summary className="cursor-pointer font-medium text-gray-900">
                    下载速度慢怎么办？
                  </summary>
                  <p className="mt-2 text-sm text-gray-600">
                    下载速度取决于您的网络连接和源服务器。建议在网络空闲时段下载大文件。
                  </p>
                </details>
              </div>
            </div>

            {/* 相关工具 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">相关工具</h2>
              <div className="space-y-2">
                {VIDEO_PLATFORMS
                  .filter(p => p.id !== platform.id && p.category === platform.category)
                  .slice(0, 4)
                  .map((p) => (
                    <a
                      key={p.id}
                      href={`/video/download/${p.slug}`}
                      className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <span className="text-xl mr-3">{p.icon}</span>
                      <span className="text-gray-700">{p.name}下载器</span>
                    </a>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEO内容区域 */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          <h2>关于{platform.name}视频下载器</h2>
          <p>
            SparkVideo的{platform.name}视频下载器是一款专业的在线视频下载工具，
            支持从{platform.name}平台下载各种视频内容。我们的服务完全免费，
            无需注册即可使用基础功能。
          </p>
          
          <h3>主要特点</h3>
          <ul>
            {platform.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
          
          <h3>支持的视频质量</h3>
          <p>
            我们支持下载多种质量的视频，从360p到4K超清，您可以根据需要选择合适的质量。
            同时也支持仅下载音频，方便您提取视频中的音乐或语音内容。
          </p>
          
          <h3>使用场景</h3>
          <ul>
            <li>离线观看：下载视频到本地，随时随地观看</li>
            <li>素材收集：为创作收集视频素材</li>
            <li>教育学习：保存教育视频供学习使用</li>
            <li>备份存档：备份重要的视频内容</li>
          </ul>
        </div>
      </div>
    </div>
  )
}