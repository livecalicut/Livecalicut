'use client';
// hooks/use-businesses.ts
import { useQuery } from '@tanstack/react-query';
import { businessApi } from '@/lib/services/api-client';
import type { Business } from '@/lib/types/api.types';

export interface UseBusinessesParams {
  page?: number;
  limit?: number;
  q?: string;
  category?: string;
  city?: string;
  featured?: boolean;
  verified?: boolean;
}

export function useBusinesses(params: UseBusinessesParams = {}) {
  return useQuery({
    queryKey: ['businesses', params],
    queryFn: async () => {
      const result = await businessApi.list(params as Record<string, unknown>);
      return result;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useBusiness(slug: string) {
  return useQuery({
    queryKey: ['business', slug],
    queryFn: () => businessApi.get(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });
}

export function useBusinessCategories() {
  return useQuery({
    queryKey: ['business-categories'],
    queryFn: () => businessApi.categories(),
    staleTime: 1000 * 60 * 30,
  });
}
