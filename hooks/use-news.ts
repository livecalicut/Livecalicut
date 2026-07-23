'use client';
// hooks/use-news.ts
import { useQuery } from '@tanstack/react-query';
import { newsApi, eventsApi } from '@/lib/services/api-client';

export function useNews(params: Record<string, unknown> = {}) {
  return useQuery({
    queryKey: ['news', params],
    queryFn: () => newsApi.list(params),
    staleTime: 1000 * 60 * 15,
  });
}

export function useNewsArticle(slug: string) {
  return useQuery({
    queryKey: ['news-article', slug],
    queryFn: () => newsApi.get(slug),
    enabled: !!slug,
  });
}

export function useEvents(params: Record<string, unknown> = {}) {
  return useQuery({
    queryKey: ['events', params],
    queryFn: () => eventsApi.list(params),
    staleTime: 1000 * 60 * 10,
  });
}
