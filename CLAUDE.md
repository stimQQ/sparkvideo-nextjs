# SparkVideo 前端项目规范文档

## 🎯 项目概述
SparkVideo 是一个专业的视频音频处理平台，提供视频下载、转换、压缩、音频转文字等功能。

## 📋 开发规范
1. 每次代码的大更新都必须要记录到这里
2. 修复和优化要在原有的文件中更改，重构或者更换实现方案才新建新版本的代码文件
3. 当重新构建代码文件后需要删除旧版本的代码文件或函数
4. 示例：新建videodownloader-v2.ts后，需要删除videodownloader.ts

## 🏗️ 项目架构

### 目录结构
```
app/                          # Next.js 14 App Router
├── (marketing)/             # 营销页面组 (SSG/ISR)
│   ├── page.tsx            # 首页
│   ├── layout.tsx          # 营销页面布局
│   ├── video/              # 视频工具
│   │   ├── page.tsx        # 视频工具中心
│   │   ├── compress/       # 视频压缩
│   │   ├── convert/        # 视频转换
│   │   ├── extract-text/   # 视频文字识别
│   │   └── download/       # 视频下载
│   │       ├── page.tsx    # 下载中心
│   │       └── [platform]/ # 动态平台页面
│   ├── audio/              # 音频工具
│   │   ├── page.tsx        # 音频工具中心
│   │   ├── transcribe/     # 音频转文字
│   │   └── translate/      # 音频翻译
│   └── blog/               # 博客系统
│       └── [slug]/         # 动态文章页面
│
├── (app)/                   # 应用页面组 (CSR - 需认证)
│   ├── dashboard/          # 用户仪表板
│   ├── tasks/              # 任务管理
│   └── settings/           # 用户设置
│
├── (auth)/                  # 认证页面组
│   ├── login/              # 登录
│   └── register/           # 注册
│
├── api/                     # API路由
│   └── v1/                 # API版本
│
components/                  # 组件库
├── common/                  # 通用组件
│   ├── Layout/             # 布局组件
│   ├── Navigation/         # 导航组件
│   └── SEO/                # SEO组件
├── features/               # 功能组件
│   ├── video/              # 视频相关
│   ├── audio/              # 音频相关
│   └── download/           # 下载相关
└── ui/                     # UI组件
    ├── Button/
    ├── Card/
    └── Modal/

lib/                        # 工具库
├── api/                    # API客户端
├── hooks/                  # 自定义Hooks
├── utils/                  # 工具函数
└── constants/              # 常量定义

styles/                     # 样式文件
├── globals.css            # 全局样式
└── themes/                # 主题配置

types/                      # TypeScript类型
├── api.ts                 # API类型
├── models.ts              # 数据模型
└── components.ts          # 组件类型
```

## 🎨 设计系统

### 颜色规范
```typescript
const colors = {
  primary: '#6366F1',       // Indigo-500 - 主色调
  secondary: '#EC4899',     // Pink-500 - 辅助色
  accent: '#10B981',        // Emerald-500 - 强调色
  
  // 中性色
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  
  // 功能色
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // 平台品牌色
  platforms: {
    youtube: '#FF0000',
    tiktok: '#000000',
    instagram: '#E4405F',
    bilibili: '#00A1D6',
    douyin: '#161823',
  }
}
```

### 字体规范
```css
--font-sans: -apple-system, "SF Pro Display", "Inter", sans-serif;
--font-mono: "SF Mono", "Monaco", monospace;
--font-chinese: "PingFang SC", "Microsoft YaHei", sans-serif;

/* 字体大小 */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
```

### 间距系统
```typescript
const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
}
```

## 💼 业务逻辑

### 核心功能模块

#### 1. 视频下载模块
```typescript
interface VideoDownloadFlow {
  // 平台配置
  platforms: Platform[]
  
  // 核心流程
  validateURL: (url: string) => boolean
  detectPlatform: (url: string) => Platform
  parseVideo: (url: string) => Promise<VideoInfo>
  selectQuality: (quality: Quality) => void
  downloadVideo: (options: DownloadOptions) => Promise<void>
  
  // 状态管理
  status: 'idle' | 'parsing' | 'downloading' | 'completed' | 'error'
  progress: number
}
```

#### 2. 视频处理模块
```typescript
interface VideoProcessing {
  compress: (file: File, options: CompressOptions) => Promise<Blob>
  convert: (file: File, format: VideoFormat) => Promise<Blob>
  crop: (file: File, aspectRatio: AspectRatio) => Promise<Blob>
  merge: (files: File[]) => Promise<Blob>
  extractText: (file: File) => Promise<TextResult>
}
```

#### 3. 音频处理模块
```typescript
interface AudioProcessing {
  transcribe: (file: File, options: TranscribeOptions) => Promise<Transcript>
  translate: (file: File, targetLang: Language) => Promise<Translation>
  convert: (file: File, format: AudioFormat) => Promise<Blob>
}
```

### API 集成
```typescript
// 基础API配置
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.sparkvideo.com'
const API_VERSION = '/api/v1'

// API客户端
class APIClient {
  private token: string | null = null
  
  async request<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const response = await fetch(`${API_BASE}${API_VERSION}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options?.headers,
      },
    })
    
    if (!response.ok) {
      throw new APIError(response.status, await response.text())
    }
    
    return response.json()
  }
}
```

## 🚀 技术栈

### 核心技术
- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript 5.0+
- **样式**: Tailwind CSS 3.4
- **组件库**: Shadcn/ui
- **状态管理**: Zustand
- **数据获取**: TanStack Query
- **表单**: React Hook Form + Zod
- **动画**: Framer Motion
- **图表**: Recharts
- **国际化**: next-intl

### 开发工具
- **包管理**: pnpm
- **代码规范**: ESLint + Prettier
- **Git Hooks**: Husky + lint-staged
- **测试**: Jest + React Testing Library
- **部署**: Vercel

## 🔧 组件规范

### 组件命名
```typescript
// 功能组件
VideoDownloader.tsx
AudioTranscriber.tsx
PlatformSelector.tsx

// UI组件
Button.tsx
Card.tsx
Modal.tsx

// 布局组件
MainLayout.tsx
SidebarLayout.tsx
```

### 组件结构
```typescript
// components/features/video/VideoDownloader/index.tsx
export { VideoDownloader } from './VideoDownloader'
export type { VideoDownloaderProps } from './types'

// VideoDownloader.tsx
import { FC } from 'react'
import { VideoDownloaderProps } from './types'
import styles from './VideoDownloader.module.css'

export const VideoDownloader: FC<VideoDownloaderProps> = ({ 
  platform,
  onDownload 
}) => {
  // 组件逻辑
  return (
    <div className={styles.container}>
      {/* 组件内容 */}
    </div>
  )
}
```

## 📊 状态管理

### Store 结构
```typescript
// stores/useAppStore.ts
interface AppState {
  // 用户状态
  user: User | null
  isAuthenticated: boolean
  
  // 视频下载状态
  selectedPlatform: Platform
  downloadQueue: DownloadTask[]
  
  // UI状态
  sidebarOpen: boolean
  theme: 'light' | 'dark'
  
  // Actions
  setUser: (user: User) => void
  addToQueue: (task: DownloadTask) => void
  toggleSidebar: () => void
}
```

## 🎯 SEO策略

### 页面Meta配置
```typescript
// 每个页面的SEO配置
export const metadata: Metadata = {
  title: 'YouTube Video Downloader - Free HD/4K Download',
  description: 'Download YouTube videos in HD, 4K quality for free.',
  keywords: ['youtube downloader', 'video download', '4k download'],
  openGraph: {
    title: 'YouTube Video Downloader',
    description: 'Free YouTube video download service',
    images: ['/og-image.png'],
  },
}
```

### 结构化数据
```typescript
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'SparkVideo Downloader',
  applicationCategory: 'MultimediaApplication',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
}
```

## 🔄 路由策略

### 渲染模式
- **SSG**: 营销页面、工具页面、博客文章
- **ISR**: 博客列表、分类页面
- **CSR**: 用户仪表板、设置页面
- **API Routes**: 认证、数据处理

### 路由配置
```typescript
// 静态路由
/video/compress
/audio/transcribe

// 动态路由
/video/download/[platform]
/blog/[slug]

// API路由
/api/v1/videos/parse
/api/v1/auth/login
```

## 📝 更新日志

### 2024-01-09
- 初始化项目架构
- 建立设计系统和代码规范
- 定义核心业务模块
- 实现核心组件:
  - Navigation导航组件
  - Footer页脚组件
  - Button UI组件
  - 营销页面布局
- 实现视频下载模块:
  - PlatformNav左侧平台导航
  - VideoDownloader视频下载器
  - 视频下载中心页面
- 实现音频处理模块:
  - AudioTranscribe音频转文字页面
  - 支持文件上传、URL输入
  - 实时转写进度显示
- 配置状态管理(Zustand)
- 设置API客户端架构

## 🔍 已实现的核心功能

### 页面路由
- `/` - 首页
- `/video/download` - 视频下载中心
- `/video/download/[platform]` - 平台专属下载页
- `/audio/transcribe` - 音频转文字

### 组件架构
```
components/
├── common/          # 通用组件
│   ├── Navigation/  # 顶部导航
│   └── Footer/      # 页脚
├── features/        # 功能组件
│   └── download/    # 下载功能
│       ├── PlatformNav.tsx      # 平台导航
│       └── VideoDownloader.tsx  # 视频下载器
└── ui/             # UI组件
    └── Button/     # 按钮组件
```

### 状态管理
- 使用Zustand进行全局状态管理
- 持久化用户偏好设置
- 下载队列管理

### API集成
- 完整的API客户端封装
- 错误处理机制
- 文件上传支持

## 🚦 开发流程

### 分支管理
- `main`: 生产环境
- `develop`: 开发环境
- `feature/*`: 功能开发
- `fix/*`: Bug修复

### 提交规范
```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式
refactor: 重构
test: 测试
chore: 构建/工具
```

### 代码审查要点
1. 组件是否解耦
2. 是否遵循设计规范
3. 性能优化是否到位
4. SEO是否正确配置
5. 类型定义是否完整