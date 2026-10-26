'use client';

import React, { useState, useMemo } from 'react';
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
import { useMarketplace } from '@/hooks/use-marketplace';
import { ALL_LOCATIONS_LABEL } from '@/config/constants';
import { AuthGateLink } from '@/components/auth/auth-gate-link';
import { RoleCreateLink } from '@/components/auth/role-create-link';
import {
  ShoppingBag,
  PlusCircle,
  Bookmark,
  ArrowUpDown,
  Smartphone,
  Car,
  Armchair,
  Tv,
  Shirt,
  Dumbbell,
  Laptop,
  LayoutGrid,
} from 'lucide-react';
import type { MarketplaceListing } from '@/lib/types/api.types';

const CATEGORY_CHIPS = [
  { name: 'All Categories', icon: LayoutGrid },
  { name: 'Electronics', icon: Laptop },
  { name: 'Mobiles & Tablets', icon: Smartphone },
  { name: 'Vehicles', icon: Car },
  { name: 'Furniture', icon: Armchair },
  { name: 'Home Appliances', icon: Tv },
  { name: 'Fashion', icon: Shirt },
  { name: 'Sports & Hobbies', icon: Dumbbell },
];

export default function MarketplaceHomePage() {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState(ALL_LOCATIONS_LABEL);
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');
  const LIMIT = 8;

  const { data, isLoading, isError, refetch } = useMarketplace({
    page,
    limit: LIMIT,
    q: q || undefined,
    category: category || undefined,
  });

  const listingsData = data?.data as MarketplaceListing[] | undefined;
  const areaFilter = location !== ALL_LOCATIONS_LABEL ? location.toLowerCase() : '';

  const filteredListings = useMemo(() => {
    const rawList = listingsData || [];
    let list = areaFilter
      ? rawList.filter((item) =>
          `${item.area || ''} ${item.location || ''}`.toLowerCase().includes(areaFilter)
        )
      : [...rawList];

    if (sortBy === 'price_asc') {
      list.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    }

    return list;
  }, [listingsData, areaFilter, sortBy]);

  const total = areaFilter ? filteredListings.length : data?.meta?.total ?? (listingsData?.length || 0);
  const hasFilters = Boolean(q || category || areaFilter);

  return (
    <Container className="py-8 sm:py-12 space-y-8">
      <PageHeader
        title="Calicut Buy & Sell Marketplace"
        description="Verified pre-owned electronics, mobiles, vehicles, furniture & appliances posted directly by Calicut citizens."
        icon={<ShoppingBag className="w-6 h-6" />}
        breadcrumbs={[{ label: 'Marketplace' }]}
        action={
          <div className="flex items-center gap-2">
            <AuthGateLink
              href="/marketplace/saved"
              loginMessage="Sign in to view your marketplace favourites."
              pending={{ type: 'custom', href: '/marketplace/saved' }}
            >
              <Button variant="outline" size="sm" className="gap-1.5 h-[40px] px-4 rounded-2xl cursor-pointer">
                <Bookmark className="w-4 h-4 text-[#2563EB]" /> Favorites
              </Button>
            </AuthGateLink>
            <RoleCreateLink href="/marketplace/create">
              <Button size="sm" className="gap-1.5 h-[40px] px-5 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold cursor-pointer shadow-sm">
                <PlusCircle className="w-4 h-4" /> Post Item
              </Button>
            </RoleCreateLink>
          </div>
        }
      />

      {/* Category Chips Horizontal Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORY_CHIPS.map((chip) => {
          const Icon = chip.icon;
          const isSelected = (category === '' && chip.name === 'All Categories') || category === chip.name;

          return (
            <button
              key={chip.name}
              onClick={() => {
                setCategory(chip.name === 'All Categories' ? '' : chip.name);
                setPage(1);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                isSelected
                  ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{chip.name}</span>
            </button>
          );
        })}
      </div>

      {/* Search, Location and Sort Toolbar */}
      <div className="space-y-4 bg-slate-50/80 p-4 sm:p-5 rounded-3xl border border-slate-200/90">
        <UniversalSearch
          placeholder="Search electronics, iPhones, bikes, furniture in Calicut..."
          onSearch={(val) => { setQ(val); setPage(1); }}
        />
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-3">
            <LocationSelect
              compact
              value={location}
              onChange={(val) => { setLocation(val); setPage(1); }}
            />
            {hasFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setQ(''); setCategory(''); setLocation(ALL_LOCATIONS_LABEL); setPage(1); }}
                className="h-[36px] rounded-xl text-xs cursor-pointer"
              >
                Clear Filters
              </Button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#2563EB] cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="space-y-6">
        <SectionTitle
          title={isLoading ? 'Loading pre-owned items…' : `${total.toLocaleString()} items listed`}
          subtitle={q ? `Showing results for "${q}"` : 'Verified classifieds across Calicut'}
        />

        {isLoading && <ListSkeleton count={LIMIT} cols={4} />}

        {isError && (
          <ErrorState
            title="Could not load marketplace items"
            description="Something went wrong while fetching listings."
            onRetry={() => refetch()}
          />
        )}

        {!isLoading && !isError && filteredListings.length === 0 && (
          <EmptyState
            title="No marketplace listings found"
            description={q ? `No items found matching "${q}".` : 'No pre-owned items posted yet.'}
          />
        )}

        {!isLoading && !isError && filteredListings.length > 0 && (
          <ResponsiveGrid cols={4}>
            {filteredListings.map((item) => (
              <MarketplaceCard
                key={item.id}
                id={item.id}
                title={item.title}
                price={item.price_display || (item.price ? `₹${item.price.toLocaleString()}` : 'Contact Seller')}
                condition={item.condition || 'Used'}
                location={item.location || item.area || 'Calicut'}
                image={item.images?.[0] || (item as any).cover_image || null}
                href={`/marketplace/${item.slug || item.id}`}
                isVerifiedSeller={Boolean((item as any).seller_profiles?.is_verified)}
              />
            ))}
          </ResponsiveGrid>
        )}

        <Pagination page={page} total={total} limit={LIMIT} onPageChange={setPage} />
      </div>
    </Container>
  );
}

