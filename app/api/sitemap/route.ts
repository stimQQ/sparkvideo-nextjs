import { NextResponse } from 'next/server';
import { locales } from '@/app/i18n/config';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sparkvideo.com';
  const currentDate = new Date().toISOString();

  const staticPages = [
    '',
    '/video',
    '/audio',
    '/documents',
    '/blog',
    '/pricing',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
  ];

  // Generate URLs for all locales and pages
  const urls: string[] = [];
  
  locales.forEach((locale) => {
    staticPages.forEach((page) => {
      const url = locale === 'zh' 
        ? `${baseUrl}${page}` 
        : `${baseUrl}/${locale}${page}`;
      
      urls.push(`
  <url>
    <loc>${url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page === '' ? 'daily' : 'weekly'}</changefreq>
    <priority>${page === '' ? '1.0' : page === '/pricing' ? '0.9' : '0.8'}</priority>
    ${locales.map(l => `<xhtml:link rel="alternate" hreflang="${l}" href="${l === 'zh' ? `${baseUrl}${page}` : `${baseUrl}/${l}${page}`}"/>`).join('\n    ')}
  </url>`);
    });
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}