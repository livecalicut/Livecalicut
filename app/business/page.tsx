'use client';

import React, { useState } from 'react';
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
import { Container } from '@/components/layout/container';
import { LocationSelect } from '@/components/shared/location-select';
import { FilterSelect } from '@/components/shared/filter-select';
import { useBusinesses } from '@/hooks/use-businesses';
import { ALL_LOCATIONS_LABEL } from '@/config/constants';
import { RoleCreateLink } from '@/components/auth/role-create-link';
import { Building2, PlusCircle, Tag, Briefcase, ShoppingBag, Calendar, Store } from 'lucide-react';
import type { Business } from '@/lib/types/api.types';

const BUSINESS_CATEGORIES = [
  'All Categories',
  'Dining & Cafes',
  'Healthcare',
  'IT & Technology',
  'Hotels & Resorts',
  'Textiles & Shopping',
  'Education',
  'Automobile',
  'Real Estate',
  'Banking & Finance',
  'Beauty & Wellness',
  'Home Services',
];

export default function BusinessDirectoryPage() {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState(ALL_LOCATIONS_LABEL);
  const LIMIT = 9;

  const { data, isLoading, isError, refetch } = useBusinesses({
    page, limit: LIMIT, q: q || undefined, category: category || undefined,
  });

  const allBusinesses = (data?.data as Business[] | undefined) ?? [];
  const areaFilter = location !== ALL_LOCATIONS_LABEL ? location.toLowerCase() : '';
  const businesses = areaFilter
    ? allBusinesses.filter((b) =>
        `${b.area || ''} ${b.location || ''}`.toLowerCase().includes(areaFilter)
      )
    : allBusinesses;
  const total = areaFilter ? businesses.length : data?.meta?.total ?? allBusinesses.length;
  const hasFilters = Boolean(q || category || areaFilter);

  return (
    <Container className="py-8 sm:py-12 space-y-8">
      <PageHeader
        title="Kozhikode Commercial Directory"
        description="Explore verified shops, hospitals, IT firms, restaurants & services across Kozhikode Wards."
        icon={<Building2 className="w-6 h-6" />}
        breadcrumbs={[{ label: 'Business Directory' }]}
        action={
          <RoleCreateLink href="/business/create">
            <Button size="sm" className="gap-1.5 h-[40px] px-5 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold">
              <PlusCircle className="w-4 h-4" /> Add Business
            </Button>
          </RoleCreateLink>
        }
      />

      {/* Search & Filters */}
      <div className="space-y-4">
        <UniversalSearch
          placeholder="Search businesses by name, location, or category..."
          onSearch={(val) => { setQ(val); setPage(1); }}
        />
        <div className="flex flex-wrap items-center gap-3">
          <FilterSelect
            compact
            label="Category"
            icon={Tag}
            placeholder="All Categories"
            searchPlaceholder="Search category…"
            value={category || 'All Categories'}
            options={BUSINESS_CATEGORIES}
            onChange={(val) => {
              setCategory(val === 'All Categories' ? '' : val);
              setPage(1);
            }}
          />

          <LocationSelect
            compact
            value={location}
            onChange={(val) => { setLocation(val); setPage(1); }}
          />

          {hasFilters && (
            <Button variant="outline" size="sm" onClick={() => { setQ(''); setCategory(''); setLocation(ALL_LOCATIONS_LABEL); setPage(1); }} className="h-[36px] rounded-xl text-xs">
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
            title={q ? `No businesses for “${q}”` : 'No businesses listed yet'}
            description={
              q
                ? 'Try another keyword, or browse jobs and marketplace while the directory grows.'
                : 'Verified outlets will appear here once merchants publish their listings.'
            }
            actionLabel={q ? 'Clear search' : 'Search Kozhikode'}
            actionHref={q ? undefined : '/search'}
            onAction={q ? () => { setQ(''); setPage(1); } : undefined}
            hooks={[
              { href: '/jobs', label: 'Browse jobs', description: 'Cyberpark & local hiring', icon: Briefcase },
              { href: '/marketplace', label: 'Marketplace', description: 'Buy & sell nearby', icon: ShoppingBag },
              { href: '/events', label: 'City events', description: 'What’s happening now', icon: Calendar },
              { href: '/merchant', label: 'List your shop', description: 'Free merchant signup', icon: Store },
            ]}
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
                image={b.cover_image || null}
              />
            ))}
          </ResponsiveGrid>
        )}

        <Pagination page={page} total={total} limit={LIMIT} onPageChange={setPage} />
      </div>
    </Container>
  );
}
