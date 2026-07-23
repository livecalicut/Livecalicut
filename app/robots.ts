import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://livecalicut.in';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/merchant/', '/api/', '/billing/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
