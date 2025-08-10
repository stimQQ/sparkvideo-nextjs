// 核心数据模型类型定义

// 用户相关
export interface User {
  id: string
  email: string
  username?: string
  avatar_url?: string
  role: 'user' | 'admin'
  is_active: boolean
  created_at: string
  updated_at: string
}

// 平台配置
export interface Platform {
  id: string
  name: string
  slug: string
  domain: string
  logo: string
  icon: string
  features: string[]
  keywords: string[]
  description: string
  category: 'popular' | 'china' | 'international'
  active: boolean
}

// 视频信息
export interface VideoInfo {
  id: string
  platform: string
  source_url: string
  video_title: string
  video_duration: number
  file_size: number
  download_url?: string
  thumbnail_url?: string
  formats: VideoFormat[]
  status: TaskStatus
}

// 视频格式
export interface VideoFormat {
  quality: number
  quality_note: string
  video_url: string
  video_ext: string
  video_size: number
  audio_url?: string
  audio_ext?: string
  audio_size?: number
}

// 下载选项
export interface DownloadOptions {
  url: string
  quality: string
  format: string
  platform?: string
}

// 任务状态
export type TaskStatus = 'idle' | 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'

// 下载任务
export interface DownloadTask {
  id: string
  url: string
  platform: string
  title: string
  status: TaskStatus
  progress: number
  created_at: string
  completed_at?: string
  error?: string
}

// 视频处理选项
export interface CompressOptions {
  quality: 'low' | 'medium' | 'high'
  target_size_mb?: number
}

export interface ConvertOptions {
  target_format: 'mp4' | 'avi' | 'mov' | 'webm' | 'flv' | 'mkv'
}

export interface CropOptions {
  aspect_ratio: '16:9' | '4:3' | '1:1' | '9:16'
}

// 音频处理选项
export interface TranscribeOptions {
  language?: string
  speaker_detection?: boolean
  punctuation?: boolean
  format: 'txt' | 'srt' | 'docx'
}

export interface TranslateOptions {
  source_language: string
  target_language: string
}

// 转写结果
export interface Transcript {
  id: string
  text: string
  segments: TranscriptSegment[]
  language: string
  duration: number
}

export interface TranscriptSegment {
  start: number
  end: number
  text: string
  speaker?: string
}

// API响应
export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// 分页
export interface Pagination {
  page: number
  size: number
  total: number
  total_pages: number
}

export interface PaginatedResponse<T> {
  items: T[]
  pagination: Pagination
}