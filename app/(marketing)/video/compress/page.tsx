'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { api } from '@/lib/api/client'
import { formatFileSize, generateId } from '@/lib/utils'
import { useAppStore } from '@/stores/useAppStore'
import { cn } from '@/lib/utils'

interface CompressionSettings {
  quality: 'low' | 'medium' | 'high' | 'custom'
  targetSize?: number
  resolution?: string
  bitrate?: string
  format: string
}

export default function VideoCompressPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [isCompressing, setIsCompressing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [compressedUrl, setCompressedUrl] = useState('')
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addToQueue, isAuthenticated } = useAppStore()

  const [settings, setSettings] = useState<CompressionSettings>({
    quality: 'medium',
    format: 'mp4',
  })

  const [stats, setStats] = useState({
    originalSize: 0,
    compressedSize: 0,
    compressionRatio: 0,
  })

  const qualityPresets = {
    low: {
      label: '低质量',
      description: '最大压缩率，文件最小',
      compression: '~70-80%',
      icon: '🔽',
    },
    medium: {
      label: '中等质量',
      description: '平衡质量和大小',
      compression: '~50-60%',
      icon: '⚖️',
    },
    high: {
      label: '高质量',
      description: '保持较高画质',
      compression: '~30-40%',
      icon: '🔼',
    },
    custom: {
      label: '自定义',
      description: '自定义压缩参数',
      compression: '自定义',
      icon: '⚙️',
    },
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024 * 1024) {
        setError('文件大小不能超过2GB')
        return
      }
      setVideoFile(file)
      setStats({
        ...stats,
        originalSize: file.size,
      })
      setError(null)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file)
      setStats({
        ...stats,
        originalSize: file.size,
      })
      setError(null)
    }
  }

  const handleCompress = async () => {
    if (!isAuthenticated) {
      setError('请先登录后再使用压缩功能')
      return
    }

    if (!videoFile && !videoUrl) {
      setError('请选择视频文件或输入视频URL')
      return
    }

    setError(null)
    setIsCompressing(true)
    setProgress(0)

    try {
      // 模拟进度
      const interval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90))
      }, 1000)

      let inputUrl = videoUrl
      if (videoFile) {
        // 上传文件获取URL
        // const uploadResult = await api.videos.upload(videoFile)
        // inputUrl = uploadResult.url
      }

      const result = await api.videos.compress(
        inputUrl,
        settings.quality,
        settings.targetSize
      )

      clearInterval(interval)
      setProgress(100)
      setCompressedUrl(result.output_url)
      
      // 更新统计
      setStats({
        originalSize: stats.originalSize,
        compressedSize: result.file_size,
        compressionRatio: Math.round(
          ((stats.originalSize - result.file_size) / stats.originalSize) * 100
        ),
      })

      // 添加到任务队列
      addToQueue({
        id: generateId(),
        url: inputUrl,
        platform: 'compress',
        title: videoFile?.name || 'Video Compression',
        status: 'completed',
        progress: 100,
        created_at: new Date().toISOString(),
      })
    } catch (err: any) {
      setError(err.message || '压缩失败，请重试')
    } finally {
      setIsCompressing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
              🗜️
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">视频压缩</h1>
              <p className="text-gray-600">智能压缩视频，减小文件大小高达90%</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upload Area */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-medium text-gray-900 mb-4">选择视频</h3>
              
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors"
              >
                {videoFile ? (
                  <div className="space-y-2">
                    <div className="text-4xl">🎬</div>
                    <p className="font-medium text-gray-900">{videoFile.name}</p>
                    <p className="text-sm text-gray-600">
                      原始大小: {formatFileSize(videoFile.size)}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setVideoFile(null)}
                    >
                      更换文件
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="text-4xl mb-4">📹</div>
                    <p className="text-gray-600 mb-4">拖拽视频文件到此处</p>
                    <p className="text-gray-500 mb-4">或者</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      选择视频文件
                    </Button>
                    <p className="text-xs text-gray-500 mt-4">
                      支持格式: MP4, AVI, MOV, MKV, WebM | 最大文件: 2GB
                    </p>
                  </>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  或输入视频URL
                </label>
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://example.com/video.mp4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Quality Settings */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-medium text-gray-900 mb-4">压缩设置</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                {Object.entries(qualityPresets).map(([key, preset]) => (
                  <button
                    key={key}
                    onClick={() => setSettings({ ...settings, quality: key as any })}
                    className={cn(
                      'p-4 rounded-lg border-2 text-left transition-all',
                      settings.quality === key
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-2xl">{preset.icon}</span>
                      {settings.quality === key && (
                        <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                        </svg>
                      )}
                    </div>
                    <h4 className="font-medium text-gray-900">{preset.label}</h4>
                    <p className="text-sm text-gray-600 mt-1">{preset.description}</p>
                    <p className="text-xs text-indigo-600 mt-2">压缩率: {preset.compression}</p>
                  </button>
                ))}
              </div>

              {settings.quality === 'custom' && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      目标文件大小 (MB)
                    </label>
                    <input
                      type="number"
                      value={settings.targetSize || ''}
                      onChange={(e) => setSettings({ ...settings, targetSize: parseInt(e.target.value) })}
                      placeholder="例如: 100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      输出格式
                    </label>
                    <select
                      value={settings.format}
                      onChange={(e) => setSettings({ ...settings, format: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="mp4">MP4</option>
                      <option value="webm">WebM</option>
                      <option value="avi">AVI</option>
                      <option value="mov">MOV</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Compress Button */}
            <Button
              onClick={handleCompress}
              loading={isCompressing}
              disabled={!videoFile && !videoUrl}
              fullWidth
              size="lg"
            >
              开始压缩
            </Button>

            {/* Progress */}
            {isCompressing && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">压缩进度</span>
                    <span className="text-sm text-gray-600">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    正在压缩视频，请稍候...
                  </p>
                </div>
              </div>
            )}

            {/* Results */}
            {compressedUrl && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-medium text-green-900 mb-4">压缩完成！</h3>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">原始大小</p>
                    <p className="font-medium">{formatFileSize(stats.originalSize)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">压缩后大小</p>
                    <p className="font-medium">{formatFileSize(stats.compressedSize)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">压缩率</p>
                    <p className="font-medium text-green-600">{stats.compressionRatio}%</p>
                  </div>
                </div>
                <Button
                  onClick={() => window.open(compressedUrl, '_blank')}
                  fullWidth
                >
                  下载压缩后的视频
                </Button>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600">{error}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Features */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-medium text-gray-900 mb-4">功能特点</h3>
              <ul className="space-y-3">
                {[
                  '智能压缩算法',
                  '保持视频质量',
                  '批量处理支持',
                  '云端快速处理',
                  '支持所有格式',
                  '无文件大小限制',
                ].map((feature) => (
                  <li key={feature} className="flex items-center text-sm text-gray-600">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-medium text-blue-900 mb-3">💡 使用提示</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• 选择"中等质量"可在文件大小和画质之间取得平衡</li>
                <li>• 对于社交媒体分享，"低质量"通常已足够</li>
                <li>• 自定义设置可精确控制输出文件大小</li>
                <li>• 批量处理可同时压缩多个视频</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}