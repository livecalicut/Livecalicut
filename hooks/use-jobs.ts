'use client';
// hooks/use-jobs.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobsApi } from '@/lib/services/api-client';

export interface UseJobsParams {
  page?: number;
  limit?: number;
  q?: string;
  category?: string;
  city?: string;
  jobType?: string;
  featured?: boolean;
}

export function useJobs(params: UseJobsParams = {}) {
  return useQuery({
    queryKey: ['jobs', params],
    queryFn: () => jobsApi.list(params as Record<string, unknown>),
    staleTime: 1000 * 60 * 5,
  });
}

export function useJob(slug: string) {
  return useQuery({
    queryKey: ['job', slug],
    queryFn: () => jobsApi.get(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });
}

export function useJobApply() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ slug, payload }: { slug: string; payload: Record<string, unknown> }) =>
      jobsApi.apply(slug, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['jobs'] }),
  });
}
