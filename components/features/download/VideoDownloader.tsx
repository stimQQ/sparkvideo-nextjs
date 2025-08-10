'use client'

import React, { useState, useEffect } from 'react'
import { Platform, VideoInfo, VideoFormat } from '@/types/models'
import { Button } from '@/components/ui/Button'
import { api } from '@/lib/api/client'
import { isValidVideoUrl, formatFileSize, formatDuration, generateId } from '@/lib/utils'
import { useAppStore } from '@/stores/useAppStore'
import { cn } from '@/lib/utils'

interface VideoDownloaderProps {
  platform: Platform
}

export const VideoDownloader: React.FC<VideoDownloaderProps> = ({ platform }) => {
  const [videoUrl, setVideoUrl] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null)
  const [selectedQuality, setSelectedQuality] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const { addToQueue, isAuthenticated } = useAppStore()

  // 监听剪贴板（可选功能）
  useEffect(() => {
    const checkClipboard = async () => {
      try {
        const text = await navigator.clipboard.readText()
        // 如果剪贴板有内容且包含当前平台域名，自动填充
        if (text && text.trim() && platform.domain) {
          const platformDomains = platform.domain.split(',').map(d => d.trim())
          const isCurrentPlatform = platformDomains.some(domain => 
            text.toLowerCase().includes(domain.toLowerCase())
          )
          if (isCurrentPlatform) {
            setVideoUrl(text)
          }
        }
      } catch (err) {
        // 用户可能未授权剪贴板访问，这是正常的
      }
    }
    
    // 仅在组件加载时检查一次
    checkClipboard()
  }, [platform])

  const handleAnalyze = async () => {
    // 清理URL（去除首尾空格）
    const cleanUrl = videoUrl.trim()
    
    if (!cleanUrl) {
      setError('请输入视频链接')
      return
    }

    setError(null)
    setIsAnalyzing(true)
    setVideoInfo(null)

    try {
      // 直接发送URL到后端，让后端处理验证
      const result = await api.videos.parse(cleanUrl, platform.slug)
      setVideoInfo(result)
      if (result.formats && result.formats.length > 0) {
        setSelectedQuality(result.formats[0].quality_note)
      }
    } catch (err: any) {
      // 显示后端返回的错误信息
      setError(err.message || '解析失败，请检查链接是否正确')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleDownload = (format: VideoFormat) => {
    if (!isAuthenticated) {
      setError('请先登录后再下载')
      return
    }

    // 添加到下载队列
    addToQueue({
      id: generateId(),
      url: videoUrl,
      platform: platform.slug,
      title: videoInfo?.video_title || 'Unknown',
      status: 'pending',
      progress: 0,
      created_at: new Date().toISOString(),
    })

    // 开始下载
    if (format.video_url) {
      window.open(format.video_url, '_blank')
    }
  }

  const handleBatchDownload = () => {
    // 批量下载功能
    const urls = videoUrl.split('\n').filter(url => url.trim())
    console.log('批量下载:', urls)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Platform Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
            style={{ backgroundColor: `${platform.category === 'popular' ? '#EEF2FF' : platform.category === 'china' ? '#FEF2F2' : '#F0FDF4'}` }}
          >
            {platform.icon}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {platform.name} Video Downloader
            </h2>
            <p className="text-gray-600">{platform.description}</p>
          </div>
        </div>
      </div>

      {/* Download Input Area */}
      <div className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📎 粘贴{platform.name}视频链接:
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder={`https://www.${platform.domain}/...`}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                onPaste={(e) => {
                  const text = e.clipboardData.getData('text')
                  if (text) {
                    setVideoUrl(text)
                    e.preventDefault()
                  }
                }}
              />
              <Button 
                onClick={handleAnalyze}
                loading={isAnalyzing}
                disabled={!videoUrl || isAnalyzing}
              >
                分析视频
              </Button>
              <Button 
                variant="outline"
                onClick={handleBatchDownload}
                disabled={!videoUrl.includes('\n')}
              >
                批量下载
              </Button>
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-2">
            {platform.features.map((feature) => (
              <span
                key={feature}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
              >
                ✓ {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Analyzing State */}
        {isAnalyzing && (
          <div className="mt-6 p-6 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <div>
                <p className="font-medium text-gray-900">正在解析视频信息...</p>
                <p className="text-sm text-gray-600">请稍候，这可能需要几秒钟</p>
              </div>
            </div>
          </div>
        )}

        {/* Video Info Display */}
        {videoInfo && (
          <div className="mt-6 space-y-6">
            {/* Video Preview */}
            <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
              {videoInfo.thumbnail_url && (
                <img
                  src={videoInfo.thumbnail_url}
                  alt={videoInfo.video_title}
                  className="w-40 h-24 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-1">
                  {videoInfo.video_title}
                </h3>
                <div className="flex gap-4 text-sm text-gray-600">
                  <span>时长: {formatDuration(videoInfo.video_duration)}</span>
                  <span>大小: {formatFileSize(videoInfo.file_size)}</span>
                  <span>平台: {platform.name}</span>
                </div>
              </div>
            </div>

            {/* Download Options */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">下载选项</h4>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">质量</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">格式</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">大小</th>
                      <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {videoInfo.formats.map((format, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="quality"
                              value={format.quality_note}
                              checked={selectedQuality === format.quality_note}
                              onChange={() => setSelectedQuality(format.quality_note)}
                              className="mr-2"
                            />
                            <span className={cn(
                              'font-medium',
                              format.quality >= 1080 ? 'text-indigo-600' : 'text-gray-900'
                            )}>
                              {format.quality_note}
                            </span>
                            {format.quality >= 2160 && (
                              <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-600 text-xs rounded">4K</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {format.video_ext.toUpperCase()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {formatFileSize(format.video_size)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            size="sm"
                            onClick={() => handleDownload(format)}
                          >
                            下载
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {videoInfo.audio_url && (
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="quality"
                              value="audio"
                              checked={selectedQuality === 'audio'}
                              onChange={() => setSelectedQuality('audio')}
                              className="mr-2"
                            />
                            <span className="font-medium text-gray-900">仅音频</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">MP3</td>
                        <td className="px-4 py-3 text-sm text-gray-600">-</td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            size="sm"
                            onClick={() => window.open(videoInfo.audio_url, '_blank')}
                          >
                            下载
                          </Button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* How to Use */}
      <div className="p-6 bg-gray-50 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-4">使用步骤</h4>
        <div className="grid grid-cols-4 gap-4">
          {[
            { step: 1, title: '复制链接', icon: '📋' },
            { step: 2, title: '粘贴URL', icon: '📍' },
            { step: 3, title: '选择质量', icon: '⚙️' },
            { step: 4, title: '开始下载', icon: '⬇️' },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="text-2xl mb-2">{item.icon}</div>
              <p className="text-sm text-gray-600">
                Step {item.step}<br />
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}