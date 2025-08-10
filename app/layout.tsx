import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SparkVideo - 专业的视频音频处理平台",
  description: "提供视频下载、压缩、转换、音频转文字等专业服务。支持YouTube、TikTok、Bilibili等15+平台视频下载。",
  keywords: ["视频下载", "视频压缩", "音频转文字", "YouTube下载", "TikTok下载"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
