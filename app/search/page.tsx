'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/shared/page-header';
import { UniversalSearch } from '@/components/shared/universal-search';
import { BusinessCard } from '@/components/cards/business-card';
import { JobCard } from '@/components/cards/job-card';
import { SectionTitle } from '@/components/shared/section-title';
import { Pagination } from '@/components/shared/pagination';
import { ListSkeleton } from '@/components/shared/loading-skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { Badge } from '@/components/ui/badge';
import { Container } from '@/components/layout/container';
import { useSearch, useTrending } from '@/hooks/use-search';
import { ALL_LOCATIONS_LABEL } from '@/config/constants';
import { LocationSelect } from '@/components/shared/location-select';
import {
  Search,
  TrendingUp,
  Clock,
  Building2,
  Briefcase,
  Calendar,
  ShoppingBag,
  SlidersHorizontal,
} from 'lucide-react';
import type { SearchGroupedResults } from '@/lib/types/api.types';

const SEARCH_HOOKS = [
  { href: '/business', label: 'Browse businesses', description: 'Verified shops & dining', icon: Building2 },
  { href: '/jobs', label: 'Explore jobs', description: 'Cyberpark & local roles', icon: Briefcase },
  { href: '/events', label: 'See events today', description: 'What’s on in the city', icon: Calendar },
  { href: '/marketplace', label: 'Marketplace', description: 'Buy & sell nearby', icon: ShoppingBag },
];

const MODULES = [
  { value: 'all', label: 'All' },
  { value: 'business', label: 'Businesses' },
  { value: 'job', label: 'Jobs' },
  { value: 'marketplace', label: 'Marketplace' },
  { value: 'property', label: 'Properties' },
  { value: 'event', label: 'Events' },
  { value: 'news', label: 'News' },
];

function SearchPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [q, setQ] = useState(searchParams.get('q') || '');
  const [area, setArea] = useState(searchParams.get('area') || ALL_LOCATIONS_LABEL);
  const [module, setModule] = useState(searchParams.get('module') || 'all');
  const [sort, setSort] = useState(searchParams.get('sort') || 'relevance');
  const [page, setPage] = useState(1);

  const LIMIT = 12;

  const { data, isLoading, isFetching, dataUpdatedAt } = useSearch(
    {
      q,
      module,
      sort,
      page,
      limit: LIMIT,
      ...(area && area !== ALL_LOCATIONS_LABEL ? { area } : {}),
    },
    q.length >= 1
  );

  const { data: trendingData } = useTrending();

  const results = data?.data as SearchGroupedResults | undefined;
  const total = results?.total ?? 0;
  const trending = (trendingData?.data as string[] | undefined) ?? [];

  useEffect(() => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (area && area !== ALL_LOCATIONS_LABEL) params.set('area', area);
    if (module !== 'all') params.set('module', module);
    if (sort !== 'relevance') params.set('sort', sort);
    router.replace(`/search?${params.toString()}`, { scroll: false });
  }, [q, area, module, sort, router]);

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

  const searchedAt =
    dataUpdatedAt > 0
      ? new Date(dataUpdatedAt).toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
        })
      : null;

  return (
    <Container className="space-y-8 py-8 sm:py-12">
      <PageHeader
        title="Search Kozhikode"
        description="Businesses, jobs, marketplace, events, and news in one place."
        icon={<Search className="h-6 w-6" />}
        breadcrumbs={[{ label: 'Search' }]}
      />

      <div className="space-y-4">
        <UniversalSearch
          placeholder="Search anything in Kozhikode…"
          defaultValue={q}
          onSearch={(query) => {
            setQ(query);
            setPage(1);
          }}
          autoFocus
        />

        <div className="flex flex-wrap items-center gap-2">
          {MODULES.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => {
                setModule(m.value);
                setPage(1);
              }}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                module === m.value
                  ? 'bg-[#2563EB] font-bold text-white shadow-xs'
                  : 'border border-[#E5E7EB] bg-[#F8FAFC] text-[#6B7280] hover:bg-white hover:text-[#2563EB]'
              }`}
            >
              {m.label}
            </button>
          ))}

          <LocationSelect
            compact
            value={area}
            onChange={(val) => {
              setArea(val);
              setPage(1);
            }}
          />

          <label className="ml-auto flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-1.5 text-xs text-[#111827]">
            <SlidersHorizontal className="h-3.5 w-3.5 text-[#2563EB]" aria-hidden />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border-none bg-transparent text-xs font-semibold outline-none"
              aria-label="Sort results"
            >
              <option value="relevance">Relevance</option>
              <option value="latest">Latest</option>
              <option value="trending">Trending</option>
              <option value="highest_rated">Highest rated</option>
            </select>
          </label>
        </div>
      </div>

      {!q && trending.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 font-sans text-sm font-bold text-[#111827]">
            <TrendingUp className="h-4 w-4 text-[#2563EB]" />
            Trending in Kozhikode
          </div>
          <div className="flex flex-wrap gap-2">
            {trending.map((term) => (
              <Badge
                key={term}
                variant="secondary"
                className="cursor-pointer rounded-xl border border-[#E5E7EB] px-3 py-1 text-xs transition-colors hover:bg-blue-50 hover:text-[#2563EB]"
                onClick={() => {
                  setQ(term);
                  setPage(1);
                }}
              >
                {term}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {q && (
        <div className="space-y-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <SectionTitle
              title={
                isLoading || isFetching
                  ? 'Searching…'
                  : `${total.toLocaleString()} results for "${q}"`
              }
              subtitle={
                [
                  module !== 'all'
                    ? `in ${MODULES.find((m) => m.value === module)?.label}`
                    : 'Across all modules',
                  area !== ALL_LOCATIONS_LABEL ? `near ${area}` : null,
                ]
                  .filter(Boolean)
                  .join(' · ')
              }
            />
            {searchedAt && !isLoading && (
              <p className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#9CA3AF]">
                <Clock className="h-3.5 w-3.5" aria-hidden />
                Updated {searchedAt}
              </p>
            )}
          </div>

          {(isLoading || isFetching) && allResults.length === 0 && (
            <ListSkeleton count={LIMIT} cols={3} />
          )}

          {!isLoading && allResults.length === 0 && (
            <EmptyState
              icon={<Search className="h-6 w-6" />}
              title={`No results for “${q}”`}
              description={
                area !== ALL_LOCATIONS_LABEL
                  ? `Nothing matched in ${area}. Try another area, a shorter keyword, or browse a category.`
                  : 'Try a different keyword, clear filters, or jump into a category below.'
              }
              actionLabel="Clear search"
              onAction={() => {
                setQ('');
                setArea(ALL_LOCATIONS_LABEL);
                setModule('all');
                setPage(1);
              }}
              hooks={SEARCH_HOOKS}
            />
          )}

          {allResults.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {allResults.slice(0, LIMIT).map((doc) => {
                if (doc.module === 'business') {
                  return (
                    <BusinessCard
                      key={doc.id}
                      id={doc.id}
                      slug={doc.slug || doc.entity_id}
                      name={doc.title}
                      category={doc.category || ''}
                      location={doc.area || ''}
                      rating={doc.ranking_score || 0}
                      reviewCount={0}
                      isVerified={doc.is_verified}
                    />
                  );
                }
                if (doc.module === 'job') {
                  return (
                    <JobCard
                      key={doc.id}
                      slug={doc.slug || doc.entity_id}
                      title={doc.title}
                      company={doc.description?.split(' · ')[0] || ''}
                      location={doc.area || ''}
                      jobType={doc.category || ''}
                      salary=""
                    />
                  );
                }
                // Fallback generic result card with link when slug exists
                const href =
                  doc.module === 'news'
                    ? `/news/${doc.slug || doc.entity_id}`
                    : doc.module === 'event'
                      ? `/events/${doc.slug || doc.entity_id}`
                      : doc.module === 'marketplace'
                        ? `/marketplace/${doc.slug || doc.entity_id}`
                        : doc.module === 'property'
                          ? `/properties/${doc.slug || doc.entity_id}`
                          : `/search?q=${encodeURIComponent(doc.title)}`;

                return (
                  <a
                    key={doc.id}
                    href={href}
                    className="surface-card flex h-full flex-col justify-between space-y-2 p-5 transition hover:border-[#2563EB]"
                  >
                    <span className="text-[11px] font-bold tracking-wider text-[#2563EB] uppercase">
                      {doc.module}
                    </span>
                    <h4 className="line-clamp-2 font-sans text-[18px] font-bold text-[#111827]">
                      {doc.title}
                    </h4>
                    {doc.description && (
                      <p className="line-clamp-2 text-[14px] text-[#6B7280]">{doc.description}</p>
                    )}
                    {doc.area && (
                      <p className="border-t border-[#E5E7EB] pt-2 text-xs font-medium text-[#6B7280]">
                        {doc.area}
                      </p>
                    )}
                  </a>
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

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <Container className="py-16 text-center text-sm text-[#6B7280]">Loading search…</Container>
      }
    >
      <SearchPageInner />
    </Suspense>
  );
}
