'use client';
// hooks/use-locations.ts
import { useEffect, useState } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { KOZHIKODE_AREAS } from '@/config/constants';

export type AreaRow = {
  id: string;
  name: string;
  slug: string;
  pincode?: string | null;
  city_id?: string;
  cities?: { id: string; name: string; slug: string } | null;
};

type LocationsMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
  /** true when the API served the static list because the database was unreachable */
  fallback?: boolean;
};

export const LOCATIONS_PAGE_SIZE = 12;

/** Pickers switch from a plain list to a searchable one past this many areas. */
export const LOCATION_SEARCH_THRESHOLD = 10;

function buildUrl(params: Record<string, string | number | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') search.set(key, String(value));
  }
  return `/api/v1/locations?${search.toString()}`;
}

async function fetchLocations(params: Record<string, string | number | undefined>) {
  const res = await fetch(buildUrl(params), { cache: 'no-store' });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error?.message || json.message || 'Failed to load locations');
  }
  return { rows: (json.data || []) as AreaRow[], meta: (json.meta || {}) as LocationsMeta };
}

/** Delays a fast-changing value so typing doesn't fire a request per keystroke. */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

/**
 * Page-based location feed for scroll pagination. `search` is sent to the server,
 * so results are not limited to the rows already downloaded.
 */
export function useLocationsFeed({
  search = '',
  cityId,
  limit = LOCATIONS_PAGE_SIZE,
}: { search?: string; cityId?: string; limit?: number } = {}) {
  return useInfiniteQuery({
    queryKey: ['locations-feed', { search, cityId, limit }],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      fetchLocations({ q: search || undefined, city_id: cityId, page: pageParam, limit }),
    getNextPageParam: (lastPage) =>
      lastPage.meta?.hasMore ? (lastPage.meta.page ?? 1) + 1 : undefined,
    staleTime: 1000 * 60 * 5,
  });
}

const LOCAL_AREAS = {
  rows: KOZHIKODE_AREAS,
  meta: {
    total: KOZHIKODE_AREAS.length,
    page: 1,
    limit: KOZHIKODE_AREAS.length,
    totalPages: 1,
    hasMore: false,
  } satisfies LocationsMeta,
};

/** Full area list — for dropdowns that filter in place. */
export function useAllLocations(cityId?: string) {
  return useQuery({
    queryKey: ['locations-all', cityId],
    queryFn: async () => {
      try {
        const result = await fetchLocations({ all: 1, city_id: cityId });
        if (result.rows.length > 0) return result;
      } catch {
        // Database unreachable — keep the local Calicut list.
      }
      return LOCAL_AREAS;
    },
    placeholderData: LOCAL_AREAS,
    staleTime: 1000 * 60 * 10,
  });
}
