'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { api } from '@/lib/api/client'
import { formatFileSize, generateId } from '@/lib/utils'
import { useAppStore } from '@/stores/useAppStore'
import { cn } from '@/lib/utils'

const videoFormats = [
  {
    category: '常用格式',
    formats: [
      { value: 'mp4', label: 'MP4', description: '最通用的视频格式', icon: '📹' },
      { value: 'avi', label: 'AVI', description: 'Windows标准格式', icon: '🎬' },
      { value: 'mov', label: 'MOV', description: 'Apple QuickTime格式', icon: '🍎' },
      { value: 'webm', label: 'WebM', description: '网页视频格式', icon: '🌐' },
    ],
  },
  {
    category: '专业格式',
    formats: [
      { value: 'mkv', label: 'MKV', description: '高质量开源格式', icon: '🎥' },
      { value: 'flv', label: 'FLV', description: 'Flash视频格式', icon: '⚡' },
      { value: 'wmv', label: 'WMV', description: 'Windows媒体格式', icon: '🪟' },
      { value: 'mpg', label: 'MPG', description: 'MPEG视频格式', icon: '📼' },
    ],
  },
  {
    category: '音频格式',
    formats: [
      { value: 'mp3', label: 'MP3', description: '提取音频为MP3', icon: '🎵' },
      { value: 'wav', label: 'WAV', description: '无损音频格式', icon: '🎶' },
      { value: 'aac', label: 'AAC', description: '高级音频编码', icon: '🎧' },
      { value: 'flac', label: 'FLAC', description: '无损音频压缩', icon: '💿' },
    ],
  },
]

export default function VideoConvertPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [targetFormat, setTargetFormat] = useState('mp4')
  const [isConverting, setIsConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [convertedUrl, setConvertedUrl] = useState('')
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addToQueue, isAuthenticated } = useAppStore()

  const [advancedSettings, setAdvancedSettings] = useState({
    resolution: 'original',
    bitrate: 'auto',
    fps: 'original',
    codec: 'auto',
  })

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024 * 1024) {
        setError('文件大小不能超过2GB')
        return
      }
      setVideoFile(file)
      setError(null)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      setVideoFile(file)
      setError(null)
    }
  }

  const handleConvert = async () => {
    if (!isAuthenticated) {
      setError('请先登录后再使用转换功能')
      return
    }

    if (!videoFile && !videoUrl) {
      setError('请选择视频文件或输入视频URL')
      return
    }

    setError(null)
    setIsConverting(true)
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

      const result = await api.videos.convert(inputUrl, targetFormat)

      clearInterval(interval)
      setProgress(100)
      setConvertedUrl(result.output_url)

      // 添加到任务队列
      addToQueue({
        id: generateId(),
        url: inputUrl,
        platform: 'convert',
        title: videoFile?.name || 'Video Conversion',
        status: 'completed',
        progress: 100,
        created_at: new Date().toISOString(),
      })
    } catch (err: any) {
      setError(err.message || '转换失败，请重试')
    } finally {
      setIsConverting(false)
    }
  }

  const currentFormat = videoFormats
    .flatMap(c => c.formats)
    .find(f => f.value === targetFormat)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-2xl">
              🔄
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">视频格式转换</h1>
              <p className="text-gray-600">支持50+视频格式互转，快速无损转换</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Upload and Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upload Area */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-medium text-gray-900 mb-4">第一步：选择视频</h3>
              
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-500 transition-colors"
              >
                {videoFile ? (
                  <div className="space-y-2">
                    <div className="text-4xl">🎬</div>
                    <p className="font-medium text-gray-900">{videoFile.name}</p>
                    <p className="text-sm text-gray-600">
                      大小: {formatFileSize(videoFile.size)}
                    </p>
                    <p className="text-sm text-gray-500">
                      格式: {videoFile.name.split('.').pop()?.toUpperCase()}
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
                      accept="video/*,audio/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      选择文件
                    </Button>
                    <p className="text-xs text-gray-500 mt-4">
                      支持所有常见视频格式 | 最大文件: 2GB
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Format Selection */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-medium text-gray-900 mb-4">第二步：选择输出格式</h3>
              
              {videoFormats.map((category) => (
                <div key={category.category} className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    {category.category}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {category.formats.map((format) => (
                      <button
                        key={format.value}
                        onClick={() => setTargetFormat(format.value)}
                        className={cn(
                          'p-3 rounded-lg border-2 text-center transition-all',
                          targetFormat === format.value
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                      >
                        <div className="text-2xl mb-1">{format.icon}</div>
                        <div className="font-medium text-gray-900">{format.label}</div>
                        <div className="text-xs text-gray-500 mt-1">{format.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Advanced Settings */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <details>
                <summary className="font-medium text-gray-900 cursor-pointer">
                  高级设置（可选）
                </summary>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      分辨率
                    </label>
                    <select
                      value={advancedSettings.resolution}
                      onChange={(e) => setAdvancedSettings({ ...advancedSettings, resolution: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="original">保持原始</option>
                      <option value="1080p">1080p (Full HD)</option>
                      <option value="720p">720p (HD)</option>
                      <option value="480p">480p (SD)</option>
                      <option value="360p">360p</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      比特率
                    </label>
                    <select
                      value={advancedSettings.bitrate}
                      onChange={(e) => setAdvancedSettings({ ...advancedSettings, bitrate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="auto">自动</option>
                      <option value="high">高质量</option>
                      <option value="medium">标准质量</option>
                      <option value="low">低质量</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      帧率
                    </label>
                    <select
                      value={advancedSettings.fps}
                      onChange={(e) => setAdvancedSettings({ ...advancedSettings, fps: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="original">保持原始</option>
                      <option value="60">60 FPS</option>
                      <option value="30">30 FPS</option>
                      <option value="24">24 FPS</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      编码器
                    </label>
                    <select
                      value={advancedSettings.codec}
                      onChange={(e) => setAdvancedSettings({ ...advancedSettings, codec: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="auto">自动选择</option>
                      <option value="h264">H.264</option>
                      <option value="h265">H.265 (HEVC)</option>
                      <option value="vp9">VP9</option>
                    </select>
                  </div>
                </div>
              </details>
            </div>

            {/* Convert Button */}
            <Button
              onClick={handleConvert}
              loading={isConverting}
              disabled={!videoFile && !videoUrl}
              fullWidth
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              开始转换为 {currentFormat?.label || targetFormat.toUpperCase()}
            </Button>

            {/* Progress */}
            {isConverting && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">转换进度</span>
                    <span className="text-sm text-gray-600">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    正在转换为 {currentFormat?.label} 格式，请稍候...
                  </p>
                </div>
              </div>
            )}

            {/* Results */}
            {convertedUrl && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-start gap-3 mb-4">
                  <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                  <div className="flex-1">
                    <h3 className="font-medium text-green-900">转换完成！</h3>
                    <p className="text-sm text-green-800 mt-1">
                      视频已成功转换为 {currentFormat?.label} 格式
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => window.open(convertedUrl, '_blank')}
                  fullWidth
                >
                  下载转换后的文件
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

          {/* Right Column - Info */}
          <div className="space-y-6">
            {/* Format Info */}
            {currentFormat && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-medium text-gray-900 mb-4">
                  关于 {currentFormat.label} 格式
                </h3>
                <div className="text-4xl mb-3">{currentFormat.icon}</div>
                <p className="text-sm text-gray-600 mb-4">
                  {currentFormat.description}
                </p>
                <div className="space-y-2 text-sm text-gray-600">
                  {currentFormat.value === 'mp4' && (
                    <>
                      <p>✓ 最广泛支持的格式</p>
                      <p>✓ 兼容所有设备和平台</p>
                      <p>✓ 良好的压缩率</p>
                    </>
                  )}
                  {currentFormat.value === 'webm' && (
                    <>
                      <p>✓ 网页优化格式</p>
                      <p>✓ 开源免费</p>
                      <p>✓ 支持透明通道</p>
                    </>
                  )}
                  {currentFormat.value === 'mov' && (
                    <>
                      <p>✓ Apple设备最佳</p>
                      <p>✓ 高质量视频</p>
                      <p>✓ 专业编辑软件支持</p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Features */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-medium text-gray-900 mb-4">转换特点</h3>
              <ul className="space-y-3">
                {[
                  '支持50+视频格式',
                  '无损转换技术',
                  'GPU加速处理',
                  '批量转换支持',
                  '保持原始质量',
                  '音视频同步',
                ].map((feature) => (
                  <li key={feature} className="flex items-center text-sm text-gray-600">
                    <svg className="w-5 h-5 text-purple-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tips */}
            <div className="bg-purple-50 rounded-lg p-6">
              <h3 className="font-medium text-purple-900 mb-3">💡 转换提示</h3>
              <ul className="space-y-2 text-sm text-purple-800">
                <li>• MP4格式兼容性最好，适合大多数用途</li>
                <li>• WebM格式文件较小，适合网页使用</li>
                <li>• 转换为音频格式可提取视频中的声音</li>
                <li>• 高级设置可精确控制输出质量</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}