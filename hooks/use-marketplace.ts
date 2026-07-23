'use client';
// hooks/use-marketplace.ts
import { useQuery } from '@tanstack/react-query';
import { marketplaceApi } from '@/lib/services/api-client';

export function useMarketplace(params: Record<string, unknown> = {}) {
  return useQuery({
    queryKey: ['marketplace', params],
    queryFn: () => marketplaceApi.list(params),
    staleTime: 1000 * 60 * 5,
  });
}

export function useMarketplaceItem(slug: string) {
  return useQuery({
    queryKey: ['marketplace-item', slug],
    queryFn: () => marketplaceApi.get(slug),
    enabled: !!slug,
  });
}
