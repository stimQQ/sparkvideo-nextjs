import { Platform } from '@/types/models'

// 视频平台配置
export const VIDEO_PLATFORMS: Platform[] = [
  // 热门平台
  {
    id: 'youtube',
    name: 'YouTube',
    slug: 'youtube',
    domain: 'youtube.com',
    logo: '/logos/youtube.svg',
    icon: '📺',
    features: ['4K下载', '播放列表', '字幕下载', '音频提取'],
    keywords: ['youtube downloader', 'youtube to mp4', 'youtube视频下载'],
    description: '下载YouTube视频，支持4K/HD画质，无水印，免费快速',
    category: 'popular',
    active: true,
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    slug: 'tiktok',
    domain: 'tiktok.com',
    logo: '/logos/tiktok.svg',
    icon: '🎵',
    features: ['无水印下载', 'HD画质', '批量下载'],
    keywords: ['tiktok downloader', 'tiktok no watermark', 'tiktok视频下载'],
    description: '下载TikTok视频，去除水印，高清画质',
    category: 'popular',
    active: true,
  },
  {
    id: 'instagram',
    name: 'Instagram',
    slug: 'instagram',
    domain: 'instagram.com',
    logo: '/logos/instagram.svg',
    icon: '📷',
    features: ['Stories下载', 'Reels下载', 'IGTV', '图片下载'],
    keywords: ['instagram downloader', 'instagram reels download', 'ig视频下载'],
    description: '下载Instagram视频、图片、Stories和Reels',
    category: 'popular',
    active: true,
  },
  {
    id: 'facebook',
    name: 'Facebook',
    slug: 'facebook',
    domain: 'facebook.com',
    logo: '/logos/facebook.svg',
    icon: '👥',
    features: ['视频下载', '直播下载', 'HD画质'],
    keywords: ['facebook video downloader', 'fb视频下载'],
    description: '下载Facebook视频和直播内容',
    category: 'popular',
    active: true,
  },
  
  // 国内平台
  {
    id: 'bilibili',
    name: 'Bilibili',
    slug: 'bilibili',
    domain: 'bilibili.com',
    logo: '/logos/bilibili.svg',
    icon: '📺',
    features: ['1080P+', '4K画质', '番剧下载', '弹幕下载'],
    keywords: ['B站下载', 'bilibili下载器', 'B站视频下载'],
    description: 'B站视频下载，支持高清画质，批量下载番剧',
    category: 'china',
    active: true,
  },
  {
    id: 'douyin',
    name: '抖音',
    slug: 'douyin',
    domain: 'douyin.com',
    logo: '/logos/douyin.svg',
    icon: '🎭',
    features: ['去水印', '批量下载', '直播录制'],
    keywords: ['抖音下载', '抖音去水印', '抖音视频下载'],
    description: '抖音视频无水印下载，支持批量下载',
    category: 'china',
    active: true,
  },
  {
    id: 'kuaishou',
    name: '快手',
    slug: 'kuaishou',
    domain: 'kuaishou.com',
    logo: '/logos/kuaishou.svg',
    icon: '📹',
    features: ['高清原画', '直播录制', '去水印'],
    keywords: ['快手下载', '快手视频下载'],
    description: '快手视频下载，支持高清原画质量',
    category: 'china',
    active: true,
  },
  {
    id: 'xiaohongshu',
    name: '小红书',
    slug: 'xiaohongshu',
    domain: 'xiaohongshu.com',
    logo: '/logos/xiaohongshu.svg',
    icon: '📝',
    features: ['图文下载', '视频下载', '无水印'],
    keywords: ['小红书下载', '小红书视频下载', '小红书图片下载'],
    description: '小红书视频和图片下载，支持图文笔记',
    category: 'china',
    active: true,
  },
  {
    id: 'weibo',
    name: '微博',
    slug: 'weibo',
    domain: 'weibo.com',
    logo: '/logos/weibo.svg',
    icon: '🌟',
    features: ['视频下载', '直播回放', 'GIF下载'],
    keywords: ['微博视频下载', '微博下载器'],
    description: '微博视频下载，支持直播回放',
    category: 'china',
    active: true,
  },
  
  // 国际平台
  {
    id: 'twitter',
    name: 'Twitter',
    slug: 'twitter',
    domain: 'twitter.com',
    logo: '/logos/twitter.svg',
    icon: '🐦',
    features: ['视频下载', 'GIF下载', 'HD画质'],
    keywords: ['twitter video downloader', 'twitter下载'],
    description: '下载Twitter视频和GIF动图',
    category: 'international',
    active: true,
  },
  {
    id: 'vimeo',
    name: 'Vimeo',
    slug: 'vimeo',
    domain: 'vimeo.com',
    logo: '/logos/vimeo.svg',
    icon: '🎬',
    features: ['4K支持', '私密视频', '高质量'],
    keywords: ['vimeo downloader', 'vimeo视频下载'],
    description: '下载Vimeo高质量视频，支持4K',
    category: 'international',
    active: true,
  },
  {
    id: 'dailymotion',
    name: 'Dailymotion',
    slug: 'dailymotion',
    domain: 'dailymotion.com',
    logo: '/logos/dailymotion.svg',
    icon: '📺',
    features: ['HD下载', '多语言字幕'],
    keywords: ['dailymotion downloader', 'dailymotion下载'],
    description: '下载Dailymotion视频',
    category: 'international',
    active: true,
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    slug: 'pinterest',
    domain: 'pinterest.com',
    logo: '/logos/pinterest.svg',
    icon: '📌',
    features: ['视频下载', '图片下载', 'GIF下载'],
    keywords: ['pinterest video downloader', 'pinterest下载'],
    description: '下载Pinterest视频和图片',
    category: 'international',
    active: true,
  },
  {
    id: 'reddit',
    name: 'Reddit',
    slug: 'reddit',
    domain: 'reddit.com',
    logo: '/logos/reddit.svg',
    icon: '👽',
    features: ['视频下载', 'GIF下载', '音频合并'],
    keywords: ['reddit video downloader', 'reddit下载'],
    description: '下载Reddit视频和GIF',
    category: 'international',
    active: true,
  },
  {
    id: 'twitch',
    name: 'Twitch',
    slug: 'twitch',
    domain: 'twitch.tv',
    logo: '/logos/twitch.svg',
    icon: '🎮',
    features: ['直播录制', 'VOD下载', '精彩集锦'],
    keywords: ['twitch downloader', 'twitch视频下载', 'twitch直播下载'],
    description: '下载Twitch直播和视频',
    category: 'international',
    active: true,
  },
]

// 按分类分组的平台
export const PLATFORM_CATEGORIES = [
  {
    id: 'popular',
    name: '🔥 热门平台',
    platforms: VIDEO_PLATFORMS.filter(p => p.category === 'popular'),
  },
  {
    id: 'china',
    name: '🇨🇳 国内平台',
    platforms: VIDEO_PLATFORMS.filter(p => p.category === 'china'),
  },
  {
    id: 'international',
    name: '🌍 国际平台',
    platforms: VIDEO_PLATFORMS.filter(p => p.category === 'international'),
  },
]

// 获取平台信息
export const getPlatformBySlug = (slug: string): Platform | undefined => {
  return VIDEO_PLATFORMS.find(p => p.slug === slug)
}

// 检测URL对应的平台
export const detectPlatform = (url: string): Platform | null => {
  const urlLower = url.toLowerCase()
  
  for (const platform of VIDEO_PLATFORMS) {
    if (urlLower.includes(platform.domain)) {
      return platform
    }
  }
  
  return null
}