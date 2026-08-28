import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://xuanhien.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'], // Chặn Bot crawl API nội bộ để tiết kiệm băng thông
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
