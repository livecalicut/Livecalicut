'use client';
// hooks/use-properties.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { propertiesApi } from '@/lib/services/api-client';

export function useProperties(params: Record<string, unknown> = {}) {
  return useQuery({
    queryKey: ['properties', params],
    queryFn: () => propertiesApi.list(params),
    staleTime: 1000 * 60 * 5,
  });
}

export function useProperty(slug: string) {
  return useQuery({
    queryKey: ['property', slug],
    queryFn: () => propertiesApi.get(slug),
    enabled: !!slug,
  });
}

export function usePropertyInquiry() {
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) => propertiesApi.inquiry(payload),
  });
}
