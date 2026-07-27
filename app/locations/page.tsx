'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Loader2, MapPin, Search, Building2, Briefcase } from 'lucide-react';
import { EmptyState } from '@/components/shared/empty-state';
import {
  useDebouncedValue,
  useLocationsFeed,
  type AreaRow,
} from '@/hooks/use-locations';

export default function LocationsPage() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 300);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const {
    data,
    error,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useLocationsFeed({ search: debouncedSearch });

  const rows: AreaRow[] = useMemo(
    () => (data?.pages || []).flatMap((page) => page.rows),
    [data]
  );
  const total = data?.pages?.[0]?.meta?.total ?? rows.length;

  // Auto-load the next page as the sentinel scrolls into view
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isFetchingNextPage) fetchNextPage();
      },
      { rootMargin: '240px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const grouped = useMemo(() => {
    const map = new Map<string, AreaRow[]>();
    for (const loc of rows) {
      const city = loc.cities?.name || 'Other';
      if (!map.has(city)) map.set(city, []);
      map.get(city)!.push(loc);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [rows]);

  const searching = isFetching && !isFetchingNextPage && !isLoading;

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-[#F8FAFC]">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-10">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#111827]">Locations</h1>
            <p className="mt-1 text-sm text-[#6B7280]">
              {total} areas and wards across LiveCalicut
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            {searching ? (
              <Loader2 className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 animate-spin text-[#2563EB]" />
            ) : (
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-[#6B7280]" />
            )}
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search area or pincode…"
              aria-label="Search areas"
              className="h-9 w-full rounded-xl border border-[#D1D5DB] bg-white pl-9 pr-3 text-xs font-semibold text-[#111827] outline-none focus:border-[#2563EB]"
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error instanceof Error ? error.message : 'Failed to load locations'}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-10 text-sm text-[#6B7280]">
            <Loader2 className="h-4 w-4 animate-spin text-[#2563EB]" />
            Loading locations…
          </div>
        ) : grouped.length === 0 ? (
          <EmptyState
            icon={<MapPin className="h-6 w-6" />}
            title={debouncedSearch ? 'No matching areas' : 'No locations listed yet'}
            description={
              debouncedSearch
                ? 'Try another search term, or clear the filter.'
                : 'Areas appear here after Super Admin adds them. You can still browse the city without a ward filter.'
            }
            actionLabel={debouncedSearch ? 'Clear search' : 'Browse businesses'}
            actionHref={debouncedSearch ? undefined : '/business'}
            onAction={debouncedSearch ? () => setSearch('') : undefined}
            hooks={[
              { href: '/business', label: 'Businesses', description: 'Shops across Kozhikode', icon: Building2 },
              { href: '/jobs', label: 'Jobs', description: 'Hiring citywide', icon: Briefcase },
              { href: '/search', label: 'Universal search', description: 'Search without area', icon: Search },
            ]}
          />
        ) : (
          <div className="space-y-6">
            {grouped.map(([city, cityRows]) => (
              <section key={city} className="rounded-xl border border-[#E5E7EB] bg-white p-4 sm:p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-[#111827]">{city}</h2>
                  <span className="text-[11px] font-semibold text-[#6B7280]">
                    {cityRows.length} areas
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cityRows.map((loc) => (
                    <span
                      key={loc.id}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-1.5 text-xs font-semibold text-[#111827]"
                    >
                      <MapPin className="h-3 w-3 text-[#2563EB]" />
                      {loc.name}
                      {loc.pincode ? (
                        <span className="font-medium text-[#9CA3AF]">{loc.pincode}</span>
                      ) : null}
                    </span>
                  ))}
                </div>
              </section>
            ))}

            <div ref={sentinelRef} className="pb-2">
              {isFetchingNextPage ? (
                <p className="flex items-center justify-center gap-2 py-4 text-xs font-semibold text-[#6B7280]">
                  <Loader2 className="h-4 w-4 animate-spin text-[#2563EB]" />
                  Loading more areas…
                </p>
              ) : hasNextPage ? (
                <button
                  type="button"
                  onClick={() => fetchNextPage()}
                  className="mx-auto block h-9 rounded-xl border border-[#E5E7EB] bg-white px-4 text-xs font-bold text-[#2563EB] hover:border-[#2563EB]"
                >
                  Load more
                </button>
              ) : (
                <p className="py-3 text-center text-[11px] font-semibold text-[#9CA3AF]">
                  Showing all {rows.length} of {total} areas
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
