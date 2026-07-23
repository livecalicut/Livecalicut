'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/shared/page-header';
import { UniversalSearch } from '@/components/shared/universal-search';
import { BusinessCard } from '@/components/cards/business-card';
import { SectionTitle } from '@/components/shared/section-title';
import { ResponsiveGrid } from '@/components/layout/responsive-grid';
import { Pagination } from '@/components/shared/pagination';
import { ListSkeleton } from '@/components/shared/loading-skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/Select';
import { Container } from '@/components/layout/container';
import { useBusinesses } from '@/hooks/use-businesses';
import { Building2, PlusCircle, SlidersHorizontal } from 'lucide-react';
import type { Business } from '@/lib/types/api.types';

const BUSINESS_CATEGORIES = [
  'All Categories', 'Dining & Cafes', 'Healthcare', 'IT & Technology',
  'Hotels & Resorts', 'Textiles & Shopping', 'Education', 'Automobile',
  'Real Estate', 'Banking & Finance', 'Beauty & Wellness',
];

export default function BusinessDirectoryPage() {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const LIMIT = 9;

  const { data, isLoading, isError, refetch } = useBusinesses({
    page, limit: LIMIT, q: q || undefined, category: category || undefined,
  });

  const businesses = (data?.data as Business[] | undefined) ?? [];
  const total = data?.meta?.total ?? 0;

  return (
    <Container className="py-8 sm:py-12 space-y-8">
      <PageHeader
        title="Kozhikode Commercial Directory"
        description="Explore verified shops, hospitals, IT firms, restaurants & services across Kozhikode Wards."
        icon={<Building2 className="w-6 h-6" />}
        breadcrumbs={[{ label: 'Business Directory' }]}
        action={
          <Link href="/business/create">
            <Button size="sm" className="gap-1.5 h-[40px] px-5 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold">
              <PlusCircle className="w-4 h-4" /> Add Business
            </Button>
          </Link>
        }
      />

      {/* Search & Filters */}
      <div className="space-y-4">
        <UniversalSearch
          placeholder="Search businesses by name, location, or category..."
          onSearch={(val) => { setQ(val); setPage(1); }}
        />
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB] text-xs text-[#111827]">
            <SlidersHorizontal className="w-4 h-4 text-[#2563EB]" />
            <span className="font-bold">Category:</span>
            <Select
              value={category}
              onChange={(e) => { setCategory(e.target.value === 'All Categories' ? '' : e.target.value); setPage(1); }}
              className="border-none bg-transparent h-7 py-0 text-xs font-semibold focus:ring-0 shadow-none"
            >
              {BUSINESS_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </Select>
          </div>

          {(q || category) && (
            <Button variant="outline" size="sm" onClick={() => { setQ(''); setCategory(''); setPage(1); }} className="h-[36px] rounded-xl text-xs">
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="space-y-6">
        <SectionTitle
          title={isLoading ? 'Loading businesses…' : `${total.toLocaleString()} businesses found`}
          subtitle={q ? `Showing results for "${q}"` : 'Verified commercial outlets in Calicut'}
        />

        {isLoading && <ListSkeleton count={LIMIT} cols={3} />}

        {isError && (
          <ErrorState
            title="Could not load businesses"
            description="Something went wrong while fetching the directory."
            onRetry={() => refetch()}
          />
        )}

        {!isLoading && !isError && businesses.length === 0 && (
          <EmptyState
            title="No businesses found"
            description={q ? `No results for "${q}". Try a different search.` : 'No businesses listed yet.'}
          />
        )}

        {!isLoading && !isError && businesses.length > 0 && (
          <ResponsiveGrid cols={3}>
            {businesses.map((b) => (
              <BusinessCard
                key={b.id}
                id={b.id}
                slug={b.slug}
                name={b.name}
                category={b.category || ''}
                location={b.location || b.area || ''}
                rating={b.rating ?? 0}
                reviewCount={b.review_count ?? 0}
                phone={b.phone}
                isVerified={b.is_verified}
              />
            ))}
          </ResponsiveGrid>
        )}

        <Pagination page={page} total={total} limit={LIMIT} onPageChange={setPage} />
      </div>
    </Container>
  );
}
