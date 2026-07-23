'use client';
// hooks/use-search.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { searchApi } from '@/lib/services/api-client';
import type { SearchGroupedResults } from '@/lib/types/api.types';

export function useSearch(params: Record<string, unknown>, enabled = true) {
  return useQuery({
    queryKey: ['search', params],
    queryFn: () => searchApi.search(params),
    enabled: enabled && !!params.q,
    staleTime: 1000 * 60 * 2,
  });
}

export function useSearchSuggestions(q: string, city = 'calicut') {
  return useQuery({
    queryKey: ['search-suggestions', q, city],
    queryFn: () => searchApi.suggestions(q, city),
    enabled: q.length >= 1,
    staleTime: 1000 * 30,
  });
}

export function useTrending(city = 'calicut') {
  return useQuery({
    queryKey: ['search-trending', city],
    queryFn: () => searchApi.trending(city),
    staleTime: 1000 * 60 * 10,
  });
}

export function useRecentSearches() {
  return useQuery({
    queryKey: ['search-recent'],
    queryFn: () => searchApi.recent(),
    staleTime: 1000 * 60,
  });
}

export function useSaveSearch() {
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) => searchApi.save(payload),
  });
}
