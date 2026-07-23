import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://livecalicut.in';

  const routes = [
    '',
    '/business',
    '/feed',
    '/jobs',
    '/marketplace',
    '/properties',
    '/explore',
    '/places',
    '/restaurants',
    '/hotels',
    '/experiences',
    '/ai',
    '/subscriptions',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  return routes;
}
