'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/shared/page-header';
import { UniversalSearch } from '@/components/shared/universal-search';
import { PropertyPriceBadge } from '@/components/property/property-price-badge';
import { ResponsiveGrid } from '@/components/layout/responsive-grid';
import { Pagination } from '@/components/shared/pagination';
import { ListSkeleton } from '@/components/shared/loading-skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/Select';
import { Container } from '@/components/layout/container';
import { SectionTitle } from '@/components/shared/section-title';
import { useProperties } from '@/hooks/use-properties';
import { Building, PlusCircle, Bookmark, Bed, Bath, Maximize, SlidersHorizontal } from 'lucide-react';
import type { Property } from '@/lib/types/api.types';

const LISTING_TYPES = ['All Types', 'rent', 'sale', 'lease'];

export default function PropertiesHomePage() {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [listingType, setListingType] = useState('');
  const LIMIT = 6;

  const { data, isLoading, isError, refetch } = useProperties({
    page,
    limit: LIMIT,
    q: q || undefined,
    listingType: listingType || undefined,
  });

  const properties = (data?.data as Property[] | undefined) ?? [];
  const total = data?.meta?.total ?? 0;

  return (
    <Container className="py-8 sm:py-12 space-y-8">
      <PageHeader
        title="Kozhikode Real Estate & Properties"
        description="Explore luxury villas, 2/3 BHK apartments near Cyberpark, commercial offices & plots for sale or rent."
        icon={<Building className="w-6 h-6" />}
        breadcrumbs={[{ label: 'Properties & Real Estate' }]}
        action={
          <div className="flex items-center gap-2">
            <Link href="/properties/saved">
              <Button variant="outline" size="sm" className="gap-1.5 h-[40px] px-4 rounded-2xl">
                <Bookmark className="w-4 h-4 text-[#2563EB]" /> Favorites
              </Button>
            </Link>
            <Link href="/properties/create">
              <Button size="sm" className="gap-1.5 h-[40px] px-5 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold">
                <PlusCircle className="w-4 h-4" /> Post Property
              </Button>
            </Link>
          </div>
        }
      />

      <div className="space-y-4">
        <UniversalSearch
          placeholder="Search villas, 3 BHK apartments, land plots in Calicut..."
          onSearch={(val) => { setQ(val); setPage(1); }}
        />
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB] text-xs text-[#111827]">
            <SlidersHorizontal className="w-4 h-4 text-[#2563EB]" />
            <span className="font-bold">Listing Type:</span>
            <Select
              value={listingType}
              onChange={(e) => { setListingType(e.target.value === 'All Types' ? '' : e.target.value); setPage(1); }}
              className="border-none bg-transparent h-7 py-0 text-xs font-semibold focus:ring-0 shadow-none uppercase"
            >
              {LISTING_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </Select>
          </div>
          {(q || listingType) && (
            <Button variant="outline" size="sm" onClick={() => { setQ(''); setListingType(''); setPage(1); }} className="h-[36px] rounded-xl text-xs">
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <SectionTitle
          title={isLoading ? 'Loading real estate…' : `${total.toLocaleString()} active properties`}
          subtitle={q ? `Showing results for "${q}"` : 'Verified real estate listings in Kozhikode'}
        />

        {isLoading && <ListSkeleton count={LIMIT} cols={3} />}

        {isError && (
          <ErrorState
            title="Could not load properties"
            description="Something went wrong while fetching properties."
            onRetry={() => refetch()}
          />
        )}

        {!isLoading && !isError && properties.length === 0 && (
          <EmptyState
            title="No properties found"
            description={q ? `No properties found matching "${q}".` : 'No real estate properties posted yet.'}
          />
        )}

        {!isLoading && !isError && properties.length > 0 && (
          <ResponsiveGrid cols={3}>
            {properties.map((prop) => (
              <Link key={prop.id} href={`/properties/${prop.slug || prop.id}`} className="block group">
                <Card className="p-4 space-y-3 surface-card h-full flex flex-col justify-between">
                  <div className="w-full h-[180px] rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] flex items-center justify-center text-xs text-[#6B7280] font-medium overflow-hidden shrink-0">
                    {prop.images?.[0] ? (
                      <img src={prop.images[0]} alt={prop.title} className="w-full h-full object-cover" />
                    ) : (
                      'Property Photo'
                    )}
                  </div>

                  <div className="space-y-1 flex-1">
                    <PropertyPriceBadge
                      price={prop.price ?? 0}
                      listingType={prop.listing_type || 'sale'}
                    />
                    <h4 className="text-[18px] font-bold text-[#111827] group-hover:text-[#2563EB] transition-colors line-clamp-2 font-sans">
                      {prop.title}
                    </h4>
                    <p className="text-[14px] text-[#6B7280] truncate">{prop.location || prop.area || ''}</p>
                  </div>

                  <div className="mt-auto pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-xs text-[#6B7280]">
                    {(prop.bedrooms ?? 0) > 0 && (
                      <span className="flex items-center gap-1">
                        <Bed className="w-3.5 h-3.5 text-[#2563EB]" /> {prop.bedrooms} Bed
                      </span>
                    )}
                    {(prop.bathrooms ?? 0) > 0 && (
                      <span className="flex items-center gap-1">
                        <Bath className="w-3.5 h-3.5 text-[#2563EB]" /> {prop.bathrooms} Bath
                      </span>
                    )}
                    {prop.area_sqft && (
                      <span className="flex items-center gap-1">
                        <Maximize className="w-3.5 h-3.5 text-[#2563EB]" /> {prop.area_sqft} sqft
                      </span>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </ResponsiveGrid>
        )}

        <Pagination page={page} total={total} limit={LIMIT} onPageChange={setPage} />
      </div>
    </Container>
  );
}
