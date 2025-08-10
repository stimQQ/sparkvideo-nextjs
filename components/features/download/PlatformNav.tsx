'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Platform } from '@/types/models'

interface PlatformCategory {
  id: string
  name: string
  platforms: Platform[]
}

interface PlatformNavProps {
  categories: PlatformCategory[]
  selectedPlatform: Platform
  onSelectPlatform: (platform: Platform) => void
}

export const PlatformNav: React.FC<PlatformNavProps> = ({
  categories,
  selectedPlatform,
  onSelectPlatform,
}) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    categories.map(c => c.id) // 默认全部展开
  )
  const [stats] = useState({
    today: 1234,
    week: 8567,
    total: 125600,
  })

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Platform Categories */}
      <div className="p-4">
        {categories.map((category) => (
          <div key={category.id} className="mb-4">
            {/* Category Header */}
            <button
              onClick={() => toggleCategory(category.id)}
              className="w-full flex items-center justify-between p-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
            >
              <span className="font-medium text-gray-900">{category.name}</span>
              <svg
                className={cn(
                  'w-4 h-4 text-gray-400 transition-transform',
                  expandedCategories.includes(category.id) && 'rotate-180'
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Platform List */}
            {expandedCategories.includes(category.id) && (
              <div className="mt-2 space-y-1">
                {category.platforms.map((platform) => (
                  <button
                    key={platform.id}
                    onClick={() => onSelectPlatform(platform)}
                    className={cn(
                      'w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200',
                      selectedPlatform.id === platform.id
                        ? 'bg-gradient-to-r from-indigo-50 to-transparent border-l-3 border-indigo-600 text-indigo-600'
                        : 'hover:bg-gray-50 text-gray-700 hover:translate-x-1'
                    )}
                  >
                    <span className="text-lg">{platform.icon}</span>
                    <span className="text-sm font-medium">{platform.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Statistics */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
          <span className="mr-2">📊</span> 使用统计
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">今日:</span>
            <span className="font-medium text-gray-900">
              {stats.today.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">本周:</span>
            <span className="font-medium text-gray-900">
              {stats.week.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">总计:</span>
            <span className="font-medium text-indigo-600">
              {(stats.total / 1000).toFixed(1)}K
            </span>
          </div>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="border-t border-gray-200 p-4">
        <h4 className="font-medium text-gray-900 mb-2 flex items-center">
          <span className="mr-2">💡</span> 快速提示
        </h4>
        <p className="text-xs text-gray-600">
          支持批量下载，粘贴多个链接用换行分隔即可
        </p>
      </div>
    </div>
  )
}