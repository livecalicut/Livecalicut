'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/shared/page-header';
import { UniversalSearch } from '@/components/shared/universal-search';
import { MarketplaceCard } from '@/components/cards/marketplace-card';
import { ResponsiveGrid } from '@/components/layout/responsive-grid';
import { Pagination } from '@/components/shared/pagination';
import { ListSkeleton } from '@/components/shared/loading-skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/Select';
import { Container } from '@/components/layout/container';
import { SectionTitle } from '@/components/shared/section-title';
import { useMarketplace } from '@/hooks/use-marketplace';
import { ShoppingBag, PlusCircle, Bookmark, SlidersHorizontal } from 'lucide-react';
import type { MarketplaceListing } from '@/lib/types/api.types';

const MARKETPLACE_CATEGORIES = [
  'All Categories', 'Electronics', 'Mobiles & Tablets', 'Vehicles',
  'Furniture', 'Home Appliances', 'Fashion', 'Sports & Hobbies',
];

export default function MarketplaceHomePage() {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const LIMIT = 8;

  const { data, isLoading, isError, refetch } = useMarketplace({
    page,
    limit: LIMIT,
    q: q || undefined,
    category: category || undefined,
  });

  const listings = (data?.data as MarketplaceListing[] | undefined) ?? [];
  const total = data?.meta?.total ?? 0;

  return (
    <Container className="py-8 sm:py-12 space-y-8">
      <PageHeader
        title="Kozhikode Buy & Sell Marketplace"
        description="Verified pre-owned electronics, mobiles, vehicles, teak furniture & appliances posted by residents."
        icon={<ShoppingBag className="w-6 h-6" />}
        breadcrumbs={[{ label: 'Marketplace' }]}
        action={
          <div className="flex items-center gap-2">
            <Link href="/marketplace/saved">
              <Button variant="outline" size="sm" className="gap-1.5 h-[40px] px-4 rounded-2xl">
                <Bookmark className="w-4 h-4 text-[#2563EB]" /> Favorites
              </Button>
            </Link>
            <Link href="/marketplace/create">
              <Button size="sm" className="gap-1.5 h-[40px] px-5 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold">
                <PlusCircle className="w-4 h-4" /> Post Item
              </Button>
            </Link>
          </div>
        }
      />

      <div className="space-y-4">
        <UniversalSearch
          placeholder="Search electronics, iPhones, bikes, furniture in Calicut..."
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
              {MARKETPLACE_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </Select>
          </div>
          {(q || category) && (
            <Button variant="outline" size="sm" onClick={() => { setQ(''); setCategory(''); setPage(1); }} className="h-[36px] rounded-xl text-xs">
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
