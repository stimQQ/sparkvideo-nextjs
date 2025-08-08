import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/app/i18n/config';
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const messages = await getMessages();
  const isZh = locale === 'zh';
  
  return {
    title: {
      default: isZh ? 'SparkVideo - 专业视频音频处理平台' : 'SparkVideo - Professional Video & Audio Processing Platform',
      template: isZh ? '%s | SparkVideo' : '%s | SparkVideo'
    },
    description: isZh 
      ? '使用AI技术处理您的视频和音频文件，支持压缩、转换、增强、转录等多种功能。免费开始使用。'
      : 'Process your video and audio files with AI technology. Compression, conversion, enhancement, transcription and more. Start free.',
    keywords: isZh
      ? ['视频处理', '音频转录', 'AI视频增强', '视频压缩', '视频转换', '在线视频编辑', '语音转文字']
      : ['video processing', 'audio transcription', 'AI video enhancement', 'video compression', 'video conversion', 'online video editor', 'speech to text'],
    authors: [{ name: 'SparkVideo Team' }],
    creator: 'SparkVideo',
    publisher: 'SparkVideo',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      title: isZh ? 'SparkVideo - 专业视频音频处理平台' : 'SparkVideo - Professional Video & Audio Processing',
      description: isZh 
        ? '使用AI技术处理您的视频和音频文件'
        : 'Process your video and audio files with AI technology',
      url: 'https://sparkvideo.com',
      siteName: 'SparkVideo',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: 'SparkVideo',
        },
      ],
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'SparkVideo',
      description: isZh 
        ? '专业视频音频处理平台'
        : 'Professional Video & Audio Processing Platform',
      images: ['/twitter-image.png'],
      creator: '@sparkvideo',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: 'https://sparkvideo.com',
      languages: {
        'en': 'https://sparkvideo.com/en',
        'zh': 'https://sparkvideo.com/zh',
      },
    },
    viewport: {
      width: 'device-width',
      initialScale: 1,
      maximumScale: 1,
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
    },
  };
}

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}