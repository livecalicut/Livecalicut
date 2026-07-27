'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { UniversalSearch } from '@/components/shared/universal-search';
import { MarketplaceCard } from '@/components/cards/marketplace-card';
import { ResponsiveGrid } from '@/components/layout/responsive-grid';
import { Pagination } from '@/components/shared/pagination';
import { ListSkeleton } from '@/components/shared/loading-skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/container';
import { SectionTitle } from '@/components/shared/section-title';
import { LocationSelect } from '@/components/shared/location-select';
import { FilterSelect } from '@/components/shared/filter-select';
import { useMarketplace } from '@/hooks/use-marketplace';
import { ALL_LOCATIONS_LABEL } from '@/config/constants';
import { AuthGateLink } from '@/components/auth/auth-gate-link';
import { RoleCreateLink } from '@/components/auth/role-create-link';
import { ShoppingBag, PlusCircle, Bookmark, Tag } from 'lucide-react';
import type { MarketplaceListing } from '@/lib/types/api.types';

const MARKETPLACE_CATEGORIES = [
  'All Categories',
  'Electronics',
  'Mobiles & Tablets',
  'Vehicles',
  'Furniture',
  'Home Appliances',
  'Fashion',
  'Sports & Hobbies',
  'Books & Stationery',
  'Pets & Accessories',
  'Kids & Baby',
  'Tools & Hardware',
];

export default function MarketplaceHomePage() {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState(ALL_LOCATIONS_LABEL);
  const LIMIT = 8;

  const { data, isLoading, isError, refetch } = useMarketplace({
    page,
    limit: LIMIT,
    q: q || undefined,
    category: category || undefined,
  });

  const allListings = (data?.data as MarketplaceListing[] | undefined) ?? [];
  const areaFilter = location !== ALL_LOCATIONS_LABEL ? location.toLowerCase() : '';
  const listings = areaFilter
    ? allListings.filter((item) =>
        `${item.area || ''} ${item.location || ''}`.toLowerCase().includes(areaFilter)
      )
    : allListings;
  const total = areaFilter ? listings.length : data?.meta?.total ?? allListings.length;
  const hasFilters = Boolean(q || category || areaFilter);

  return (
    <Container className="py-8 sm:py-12 space-y-8">
      <PageHeader
        title="Kozhikode Buy & Sell Marketplace"
        description="Verified pre-owned electronics, mobiles, vehicles, teak furniture & appliances posted by residents."
        icon={<ShoppingBag className="w-6 h-6" />}
        breadcrumbs={[{ label: 'Marketplace' }]}
        action={
          <div className="flex items-center gap-2">
            <AuthGateLink
              href="/marketplace/saved"
              loginMessage="Sign in to view your marketplace favourites."
              pending={{ type: 'custom', href: '/marketplace/saved' }}
            >
              <Button variant="outline" size="sm" className="gap-1.5 h-[40px] px-4 rounded-2xl">
                <Bookmark className="w-4 h-4 text-[#2563EB]" /> Favorites
              </Button>
            </AuthGateLink>
            <RoleCreateLink href="/marketplace/create">
              <Button size="sm" className="gap-1.5 h-[40px] px-5 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold">
                <PlusCircle className="w-4 h-4" /> Post Item
              </Button>
            </RoleCreateLink>
          </div>
        }
      />

      <div className="space-y-4">
        <UniversalSearch
          placeholder="Search electronics, iPhones, bikes, furniture in Calicut..."
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
            options={MARKETPLACE_CATEGORIES}
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

      <div className="space-y-6">
        <SectionTitle
          title={isLoading ? 'Loading pre-owned items…' : `${total.toLocaleString()} items listed`}
          subtitle={q ? `Showing results for "${q}"` : 'Verified classifieds across Kozhikode'}
        />

        {isLoading && <ListSkeleton count={LIMIT} cols={4} />}

        {isError && (
          <ErrorState
            title="Could not load marketplace items"
            description="Something went wrong while fetching listings."
            onRetry={() => refetch()}
          />
        )}

        {!isLoading && !isError && listings.length === 0 && (
          <EmptyState
            title="No marketplace listings found"
            description={q ? `No items found matching "${q}".` : 'No pre-owned items posted yet.'}
          />
        )}

        {!isLoading && !isError && listings.length > 0 && (
          <ResponsiveGrid cols={4}>
            {listings.map((item) => (
              <MarketplaceCard
                key={item.id}
                title={item.title}
                price={item.price_display || (item.price ? `₹${item.price.toLocaleString()}` : 'Contact Seller')}
                condition={item.condition || 'Used'}
                location={item.location || item.area || ''}
              />
            ))}
          </ResponsiveGrid>
        )}

        <Pagination page={page} total={total} limit={LIMIT} onPageChange={setPage} />
      </div>
    </Container>
  );
}
