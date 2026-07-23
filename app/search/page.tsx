'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/shared/page-header';
import { UniversalSearch } from '@/components/shared/universal-search';
import { BusinessCard } from '@/components/cards/business-card';
import { JobCard } from '@/components/cards/job-card';
import { SectionTitle } from '@/components/shared/section-title';
import { Pagination } from '@/components/shared/pagination';
import { ListSkeleton } from '@/components/shared/loading-skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/badge';
import { Container } from '@/components/layout/container';
import { useSearch, useTrending } from '@/hooks/use-search';
import { Search, TrendingUp, SlidersHorizontal } from 'lucide-react';
import type { SearchGroupedResults } from '@/lib/types/api.types';

const MODULES = [
  { value: 'all', label: 'All' },
  { value: 'business', label: 'Businesses' },
  { value: 'job', label: 'Jobs' },
  { value: 'marketplace', label: 'Marketplace' },
  { value: 'property', label: 'Properties' },
  { value: 'event', label: 'Events' },
  { value: 'news', label: 'News' },
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [q, setQ] = useState(searchParams.get('q') || '');
  const [module, setModule] = useState(searchParams.get('module') || 'all');
  const [sort, setSort] = useState('relevance');
  const [page, setPage] = useState(1);

  const LIMIT = 12;

  const { data, isLoading } = useSearch(
    { q, module, sort, page, limit: LIMIT },
    q.length >= 1
  );

  const { data: trendingData } = useTrending();

  const results = data?.data as SearchGroupedResults | undefined;
  const total = results?.total ?? 0;
  const trending = (trendingData?.data as string[] | undefined) ?? [];

  // Sync URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (module !== 'all') params.set('module', module);
    router.replace(`/search?${params.toString()}`, { scroll: false });
  }, [q, module]);

  const allResults = results
    ? [
        ...results.businesses,
        ...results.jobs,
        ...results.marketplace,
        ...results.properties,
        ...results.events,
        ...results.news,
        ...results.explore,
      ]
    : [];

  return (
    <Container className="py-8 sm:py-12 space-y-8">
      <PageHeader
        title="Universal Search"
        description="Search everything in Kozhikode — businesses, jobs, marketplace, events, news & more."
        icon={<Search className="w-6 h-6" />}
        breadcrumbs={[{ label: 'Search' }]}
      />

      {/* Search bar */}
      <div className="space-y-4">
        <UniversalSearch
          placeholder="Search anything in Kozhikode…"
          defaultValue={q}
          onSearch={(val) => { setQ(val); setPage(1); }}
          autoFocus
        />

        {/* Module filter tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {MODULES.map((m) => (
            <button
              key={m.value}
              onClick={() => { setModule(m.value); setPage(1); }}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-semibold transition-all ${
                module === m.value
                  ? 'bg-[#2563EB] text-white shadow-xs font-bold'
                  : 'bg-[#F8FAFC] border border-[#E5E7EB] text-[#6B7280] hover:text-[#2563EB] hover:bg-white'
              }`}
            >
              {m.label}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB] text-xs text-[#111827]">
            <SlidersHorizontal className="w-4 h-4 text-[#2563EB]" />
            <Select value={sort} onChange={(e) => setSort(e.target.value)} className="border-none bg-transparent h-7 py-0 text-xs font-semibold focus:ring-0 shadow-none">
              <option value="relevance">Relevance</option>
              <option value="latest">Latest</option>
              <option value="trending">Trending</option>
              <option value="highest_rated">Highest Rated</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Trending (when no query) */}
      {!q && trending.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#111827] font-sans">
            <TrendingUp className="w-4 h-4 text-[#2563EB]" />
            Trending in Kozhikode
          </div>
          <div className="flex flex-wrap gap-2">
            {trending.map((term) => (
              <Badge
                key={term}
                variant="secondary"
                className="cursor-pointer hover:bg-blue-50 hover:text-[#2563EB] transition-colors border border-[#E5E7EB] px-3 py-1 text-xs rounded-xl"
                onClick={() => setQ(term)}
              >
                {term}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {q && (
        <div className="space-y-6">
          <SectionTitle
            title={isLoading ? 'Searching…' : `${total.toLocaleString()} results for "${q}"`}
            subtitle={module !== 'all' ? `Filtered to ${MODULES.find(m => m.value === module)?.label}` : 'Across all Kozhikode OS modules'}
          />

          {isLoading && <ListSkeleton count={LIMIT} cols={3} />}

          {!isLoading && allResults.length === 0 && (
            <EmptyState
              title="No results found"
              description={`No results for "${q}". Try different keywords or browse categories.`}
            />
          )}

          {!isLoading && allResults.length > 0 && (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {allResults.slice(0, LIMIT).map((doc) => {
                if (doc.module === 'business') {
                  return (
                    <BusinessCard
                      key={doc.id}
                      id={doc.entity_id}
                      slug={doc.entity_id}
                      name={doc.title}
                      category={doc.category || ''}
                      location={doc.area || ''}
                      rating={0}
                      reviewCount={0}
                      isVerified={doc.is_verified}
                    />
                  );
                }
                if (doc.module === 'job') {
                  return (
                    <JobCard
                      key={doc.id}
                      slug={doc.entity_id}
                      title={doc.title}
                      company=""
                      location={doc.area || ''}
                      jobType=""
                      salary=""
                    />
                  );
                }
                // Fallback generic result card
                return (
                  <div key={doc.id} className="surface-card p-5 space-y-2 flex flex-col justify-between h-full">
                    <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider">
                      {doc.module}
                    </span>
                    <h4 className="text-[18px] font-bold text-[#111827] line-clamp-2 font-sans">{doc.title}</h4>
                    {doc.description && (
                      <p className="text-[14px] text-[#6B7280] line-clamp-2">{doc.description}</p>
                    )}
                    {doc.area && (
                      <p className="text-xs text-[#6B7280] font-medium pt-2 border-t border-[#E5E7EB]">{doc.area}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <Pagination page={page} total={total} limit={LIMIT} onPageChange={setPage} />
        </div>
      )}
    </Container>
  );
}
