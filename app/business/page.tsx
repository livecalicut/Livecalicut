'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/shared/page-header';
import { UniversalSearch } from '@/components/shared/universal-search';
import { BusinessCard } from '@/components/cards/business-card';
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
import { getExactBusinessLocation } from '@/lib/business/location';
import {
  Building2,
  PlusCircle,
  Tag,
  Briefcase,
  ShoppingBag,
  Calendar,
  Store,
  X,
  Sparkles,
  Crown,
} from 'lucide-react';
import type { Business } from '@/lib/types/api.types';

const BUSINESS_CATEGORIES = [
  'All Categories',
  'Restaurants & Cafés',
  'Tourism & Destinations',
  'Lifestyle & Wellness',
  'Shopping & Entertainment',
  'Arts & Culture',
  'Business Directory',
  'Local Services',
  'Classifieds',
  'Properties',
  'Featured Businesses',
  'Jobs & Careers',
  'Internships',
  'Education & Courses',
  'Startups & Creators',
  'Community Stories',
  'Traffic & Transport',
  'Sports & Activities',
  'Local Initiatives',
  'Public Announcements',
];

const SLUG_TO_NAME: Record<string, string> = {
  'restaurants-cafes': 'Restaurants & Cafés',
  'tourism-destinations': 'Tourism & Destinations',
  'lifestyle-wellness': 'Lifestyle & Wellness',
  'shopping-entertainment': 'Shopping & Entertainment',
  'arts-culture': 'Arts & Culture',
  'business-directory': 'Business Directory',
  'local-services': 'Local Services',
  'classifieds': 'Classifieds',
  'properties': 'Properties',
  'featured-businesses': 'Featured Businesses',
  'jobs-careers': 'Jobs & Careers',
  'internships': 'Internships',
  'education-courses': 'Education & Courses',
  'startups-creators': 'Startups & Creators',
  'community-stories': 'Community Stories',
  'traffic-transport': 'Traffic & Transport',
  'sports-activities': 'Sports & Activities',
  'local-initiatives': 'Local Initiatives',
  'public-announcements': 'Public Announcements',
};

function BusinessDirectoryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlCategory = searchParams.get('category') || '';
  const urlFeatured = searchParams.get('featured') === 'true';
  const urlQ = searchParams.get('q') || '';
  const urlLocation = searchParams.get('location') || ALL_LOCATIONS_LABEL;

  // Resolve human-readable category from slug or name
  const resolvedCategory = SLUG_TO_NAME[urlCategory] || urlCategory;

  const [page, setPage] = useState(1);
  const [q, setQ] = useState(urlQ);
  const [category, setCategory] = useState(resolvedCategory);
  const [location, setLocation] = useState(urlLocation);
  const [isFeaturedOnly, setIsFeaturedOnly] = useState(urlFeatured);
  const LIMIT = 9;

  // Sync state when searchParams in URL change
  useEffect(() => {
    const nextCat = searchParams.get('category') || '';
    const nextFeatured = searchParams.get('featured') === 'true';
    const nextQ = searchParams.get('q') || '';
    const nextLoc = searchParams.get('location') || ALL_LOCATIONS_LABEL;

    setCategory(SLUG_TO_NAME[nextCat] || nextCat);
    setIsFeaturedOnly(nextFeatured);
    setQ(nextQ);
    setLocation(nextLoc);
    setPage(1);
  }, [searchParams]);

  const activeCategorySlug = Object.keys(SLUG_TO_NAME).find(
    (k) => SLUG_TO_NAME[k].toLowerCase() === category.toLowerCase()
  ) || category;

  const { data, isLoading, isError, refetch } = useBusinesses({
    page,
    limit: LIMIT,
    q: q || undefined,
    category: activeCategorySlug || undefined,
    featured: isFeaturedOnly || undefined,
  });

  const allBusinesses = (data?.data as Business[] | undefined) ?? [];
  const areaFilter = location !== ALL_LOCATIONS_LABEL ? location.toLowerCase() : '';
  const businesses = areaFilter
    ? allBusinesses.filter((b) =>
        `${b.area || ''} ${b.location || ''}`.toLowerCase().includes(areaFilter)
      )
    : allBusinesses;

  const total = areaFilter ? businesses.length : data?.meta?.total ?? allBusinesses.length;
  const hasFilters = Boolean(q || category || isFeaturedOnly || areaFilter);

  const handleSelectCategory = (catName: string) => {
    const isAll = !catName || catName === 'All Categories';
    const slug = Object.keys(SLUG_TO_NAME).find(
      (k) => SLUG_TO_NAME[k].toLowerCase() === catName.toLowerCase()
    );
    const newParams = new URLSearchParams(searchParams.toString());

    if (isAll) {
      newParams.delete('category');
    } else {
      newParams.set('category', slug || catName);
    }
    newParams.set('page', '1');
    router.push(`/business?${newParams.toString()}`);
  };

  const handleClearFilters = () => {
    router.push('/business');
  };

  return (
    <Container className="py-8 sm:py-12 space-y-8">
      <PageHeader
        title={
          category
            ? `${category} in Calicut`
            : isFeaturedOnly
              ? 'Featured & Premium Businesses in Calicut'
              : 'Calicut Commercial Directory'
        }
        description={
          category
            ? `Verified ${category.toLowerCase()} listings, service providers & outlets across Calicut.`
            : 'Explore verified shops, hospitals, IT firms, restaurants & services across Calicut Wards.'
        }
        icon={<Building2 className="w-6 h-6 text-[#2563EB]" />}
        breadcrumbs={[
          { label: 'Business Directory', href: '/business' },
          ...(category ? [{ label: category }] : []),
        ]}
        action={
          <RoleCreateLink href="/business/create">
            <Button
              size="sm"
              className="gap-1.5 h-[40px] px-5 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" /> Add Business
            </Button>
          </RoleCreateLink>
        }
      />

      {/* Active Filter Banner when coming from Mega Menu */}
      {(category || isFeaturedOnly) && (
        <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-blue-50/80 border border-blue-200 text-blue-950 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shrink-0">
              {isFeaturedOnly ? <Crown className="w-4 h-4 fill-amber-300" /> : <Tag className="w-4 h-4" />}
            </div>
            <div>
              <p className="text-xs font-bold text-blue-900">
                Filtered by:{' '}
                <span className="font-extrabold text-blue-950">
                  {category || (isFeaturedOnly ? 'Featured Businesses' : '')}
                </span>
              </p>
              <p className="text-[11px] text-blue-700">
                Showing genuine listings matching this exact category
              </p>
            </div>
          </div>
          <button
            onClick={handleClearFilters}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-blue-100 text-blue-900 font-bold text-xs border border-blue-200 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear Filter</span>
          </button>
        </div>
      )}

      {/* Quick Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {BUSINESS_CATEGORIES.slice(0, 10).map((catName) => {
          const isSelected =
            (category === '' && catName === 'All Categories') ||
            category.toLowerCase() === catName.toLowerCase();
          return (
            <button
              key={catName}
              onClick={() => handleSelectCategory(catName)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                isSelected
                  ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-xs font-bold'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {catName}
            </button>
          );
        })}
      </div>

      {/* Search & Filters */}
      <div className="space-y-4">
        <UniversalSearch
          placeholder="Search businesses by name, location, or category..."
          onSearch={(val) => {
            setQ(val);
            setPage(1);
          }}
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
            onChange={(val) => handleSelectCategory(val)}
          />

          <LocationSelect
            compact
            value={location}
            onChange={(val) => {
              setLocation(val);
              setPage(1);
            }}
          />

          {hasFilters && (
            <button
              onClick={handleClearFilters}
              className="text-xs font-bold text-[#2563EB] hover:underline cursor-pointer"
            >
              Reset All
            </button>
          )}
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-6">
        {isLoading && <ListSkeleton count={LIMIT} cols={3} />}

        {isError && (
          <ErrorState
            title="Could not load businesses"
            description="We encountered a problem fetching the directory. Please retry."
            onRetry={() => refetch()}
          />
        )}

        {!isLoading && !isError && businesses.length === 0 && (
          <EmptyState
            title={category ? `No businesses in “${category}” yet` : q ? `No businesses for “${q}”` : 'No businesses listed yet'}
            description={
              category
                ? `Be the first to list a business under ${category} in Calicut. Promote your service to thousands of local residents.`
                : q
                  ? 'Try another keyword or browse other categories.'
                  : 'Verified outlets will appear here once merchants publish their listings.'
            }
            actionLabel="Add Business Here"
            actionHref="/business/create"
            hooks={[
              { href: '/business', label: 'All Businesses', description: 'Browse full directory', icon: Store },
              { href: '/jobs', label: 'Browse Jobs', description: 'Cyberpark & local hiring', icon: Briefcase },
              { href: '/marketplace', label: 'Marketplace', description: 'Buy & sell nearby', icon: ShoppingBag },
              { href: '/events', label: 'City Events', description: 'What’s happening now', icon: Calendar },
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
                category={b.category || category || 'Service Provider'}
                location={getExactBusinessLocation(b)}
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

export default function BusinessDirectoryPage() {
  return (
    <Suspense fallback={<ListSkeleton count={9} cols={3} />}>
      <BusinessDirectoryContent />
    </Suspense>
  );
}
