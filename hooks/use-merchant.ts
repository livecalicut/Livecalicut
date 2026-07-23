'use client';
// hooks/use-merchant.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { merchantApi } from '@/lib/services/api-client';

export function useMerchantDashboard() {
  return useQuery({
    queryKey: ['merchant-dashboard'],
    queryFn: () => merchantApi.dashboard(),
    staleTime: 1000 * 60 * 2,
    retry: false,
  });
}

export function useMerchantLeads(params: Record<string, unknown> = {}) {
  return useQuery({
    queryKey: ['merchant-leads', params],
    queryFn: () => merchantApi.leads(params),
    staleTime: 1000 * 60 * 2,
    retry: false,
  });
}
