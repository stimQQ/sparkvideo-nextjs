'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PLATFORM_CATEGORIES, getPlatformBySlug } from '@/lib/constants/platforms'
import { VideoDownloader } from '@/components/features/download/VideoDownloader'
import { PlatformNav } from '@/components/features/download/PlatformNav'
import { useAppStore } from '@/stores/useAppStore'
import { Platform } from '@/types/models'

export default function VideoDownloadCenter() {
  const router = useRouter()
  const { selectedPlatform, setSelectedPlatform } = useAppStore()
  const [currentPlatform, setCurrentPlatform] = useState<Platform>(selectedPlatform)

  const handlePlatformSelect = (platform: Platform) => {
    setCurrentPlatform(platform)
    setSelectedPlatform(platform)
    // 更新URL但不刷新页面
    window.history.pushState(null, '', `/video/download/${platform.slug}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900">视频下载中心</h1>
          <p className="mt-2 text-gray-600">
            Download Videos from 15+ Platforms - Free & Fast
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Left Sidebar - Platform Navigation */}
          <aside className="w-64 flex-shrink-0">
            <PlatformNav
              categories={PLATFORM_CATEGORIES}
              selectedPlatform={currentPlatform}
              onSelectPlatform={handlePlatformSelect}
            />
          </aside>

          {/* Right Content - Video Downloader */}
          <main className="flex-1">
            <VideoDownloader platform={currentPlatform} />
          </main>
        </div>
      </div>
    </div>
  )
}