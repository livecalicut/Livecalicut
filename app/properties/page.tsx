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
import { Container } from '@/components/layout/container';
import { SectionTitle } from '@/components/shared/section-title';
import { useProperties } from '@/hooks/use-properties';
import { AuthGateLink } from '@/components/auth/auth-gate-link';
import { RoleCreateLink } from '@/components/auth/role-create-link';
import { Building, PlusCircle, Bookmark, Bed, Maximize, MapPin, Heart } from 'lucide-react';
import type { Property } from '@/lib/types/api.types';

const PROPERTY_TYPES = [
  { label: 'All Properties', value: '' },
  { label: 'For Rent', value: 'rent' },
  { label: 'For Sale', value: 'sell' },
  { label: 'Commercial', value: 'commercial' },
  { label: 'Plots / Land', value: 'land' },
];

export default function PropertiesHomePage() {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [listingType, setListingType] = useState('');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const LIMIT = 6;

  const { data, isLoading, isError, refetch } = useProperties({
    page,
    limit: LIMIT,
    q: q || undefined,
    listingType: listingType || undefined,
  });

  const properties = (data?.data as Property[] | undefined) ?? [];
  const total = data?.meta?.total ?? 0;

  const toggleFav = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Container className="py-8 sm:py-12 space-y-8">
      <PageHeader
        title="Calicut Real Estate & Properties"
        description="Explore luxury villas, 2/3 BHK apartments, commercial offices & plots for sale or rent across Calicut."
        icon={<Building className="w-6 h-6" />}
        breadcrumbs={[{ label: 'Properties & Real Estate' }]}
        action={
          <div className="flex items-center gap-2">
            <AuthGateLink
              href="/properties/saved"
              loginMessage="Sign in to view your saved properties."
              pending={{ type: 'custom', href: '/properties/saved' }}
            >
              <Button variant="outline" size="sm" className="gap-1.5 h-[40px] px-4 rounded-2xl cursor-pointer">
                <Bookmark className="w-4 h-4 text-[#2563EB]" /> Favorites
              </Button>
            </AuthGateLink>
            <RoleCreateLink href="/properties/create">
              <Button size="sm" className="gap-1.5 h-[40px] px-5 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold cursor-pointer shadow-sm">
                <PlusCircle className="w-4 h-4" /> Post Property
              </Button>
            </RoleCreateLink>
          </div>
        }
      />

      {/* Property Type Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {PROPERTY_TYPES.map((t) => {
          const isSelected = listingType === t.value;
          return (
            <button
              key={t.label}
              onClick={() => {
                setListingType(t.value);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                isSelected
                  ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Search & Location Box */}
      <div className="space-y-4 bg-slate-50/80 p-4 sm:p-5 rounded-3xl border border-slate-200/90">
        <UniversalSearch
          placeholder="Search villas, 3 BHK apartments, land plots in Calicut..."
          onSearch={(val) => { setQ(val); setPage(1); }}
        />
        {(q || listingType) && (
          <div className="pt-1 flex items-center justify-between text-xs text-slate-500">
            <span>Filters active: {listingType || 'All'} {q ? `"${q}"` : ''}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setQ(''); setListingType(''); setPage(1); }}
              className="h-[32px] rounded-xl text-xs cursor-pointer"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Properties Grid */}
      <div className="space-y-6">
        <SectionTitle
          title={isLoading ? 'Loading real estate…' : `${total.toLocaleString()} active properties`}
          subtitle={q ? `Showing results for "${q}"` : 'Verified real estate listings in Calicut'}
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
            {properties.map((prop) => {
              const isFav = favorites[prop.id];

              return (
                <Link key={prop.id} href={`/properties/${prop.slug || prop.id}`} className="block group h-full">
                  <Card className="surface-card flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                    {/* Image Container */}
                    <div className="relative w-full h-[190px] rounded-xl bg-slate-100 overflow-hidden shrink-0">
                      {prop.images?.[0] ? (
                        <img src={prop.images[0]} alt={prop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-gradient-to-br from-cyan-50 to-blue-50">
                          <Building className="w-8 h-8 text-cyan-600 mb-1" />
                          <span className="text-xs font-semibold">Verified Property</span>
                        </div>
                      )}

                      {/* Listing Type Badge */}
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-xs text-[10px] font-bold text-white uppercase shadow-xs">
                        {prop.listing_type || 'For Sale'}
                      </span>

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => toggleFav(prop.id, e)}
                        className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-xs flex items-center justify-center text-white transition-colors cursor-pointer"
                        aria-label="Save property"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500 text-rose-500' : 'text-white'}`}
                        />
                      </button>
                    </div>

                    {/* Content Details */}
                    <div className="pt-3 space-y-2 flex-1">
                      <PropertyPriceBadge
                        price={prop.price ?? 0}
                        listingType={prop.listing_type || 'sell'}
                      />
                      <h4 className="text-[16px] sm:text-[17px] font-bold text-slate-900 group-hover:text-[#2563EB] transition-colors line-clamp-2 font-sans">
                        {prop.title}
                      </h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1 truncate">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{prop.location || prop.area || 'Calicut'}</span>
                      </p>
                    </div>

                    {/* Meta Specifications & CTA */}
                    <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                      <div className="flex items-center gap-2.5">
                        {(prop.bedrooms ?? 0) > 0 && (
                          <span className="flex items-center gap-1">
                            <Bed className="w-3.5 h-3.5 text-[#2563EB]" /> {prop.bedrooms} BHK
                          </span>
                        )}
                        {prop.area_sqft && (
                          <span className="flex items-center gap-1">
                            <Maximize className="w-3.5 h-3.5 text-slate-400" /> {prop.area_sqft} sqft
                          </span>
                        )}
                      </div>

                      <span className="font-bold text-[#2563EB] group-hover:translate-x-0.5 transition-transform">
                        Enquire &rarr;
                      </span>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </ResponsiveGrid>
        )}

        <Pagination page={page} total={total} limit={LIMIT} onPageChange={setPage} />
      </div>
    </Container>
  );
}

