import React from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/shared/page-header';
import { BusinessCard } from '@/components/cards/business-card';
import { ResponsiveGrid } from '@/components/layout/responsive-grid';
import { EmptyState } from '@/components/shared/empty-state';
import { Building2, PlusCircle, ArrowLeft } from 'lucide-react';
import { createPublicClient } from '@/lib/supabase/server';
import { getExactBusinessLocation } from '@/lib/business/location';
import { businessCover } from '@/lib/business/images';
import { Button } from '@/components/ui/button';
import { GENUINE_MEGAMENU_CATEGORIES, GENUINE_MEGAMENU_SUBCATEGORIES } from '@/app/api/v1/admin/taxonomy/route';

export const revalidate = 60;

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createPublicClient();

  // 1. Resolve Category from DB or Fallback Registry
  let category: { id: string; name: string; slug: string } | null = null;
  try {
    const { data } = await supabase
      .from('business_categories')
      .select('id, name, slug')
      .eq('slug', slug)
      .is('deleted_at', null)
      .maybeSingle();
    if (data) category = data;
  } catch {
    // Supabase fallback
  }

  if (!category) {
    const fallback = GENUINE_MEGAMENU_CATEGORIES.find((c) => c.slug === slug);
    if (fallback) {
      category = { id: fallback.id, name: fallback.name, slug: fallback.slug };
    } else {
      category = {
        id: slug,
        name: slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        slug,
      };
    }
  }

  // 2. Fetch Subcategories
  let subcategories: { id: string; name: string; slug: string }[] = [];
  try {
    const { data: subData } = await supabase
      .from('business_subcategories')
      .select('id, name, slug')
      .eq('category_id', category.id)
      .is('deleted_at', null);

    if (subData && subData.length > 0) {
      subcategories = subData;
    }
  } catch {
    // fallback
  }

  if (subcategories.length === 0) {
    subcategories = GENUINE_MEGAMENU_SUBCATEGORIES.filter((s) => s.category_id === category.id);
  }

  // 3. Fetch Businesses matching this Category
  let businesses: any[] = [];
  try {
    const { data: bizData } = await supabase
      .from('businesses')
      .select('id, slug, name, phone, rating_avg, review_count, is_verified, short_description, location, address, social_media, business_categories(name, slug), areas(name)')
      .or(`category_id.eq.${category.id},business_categories.slug.eq.${slug},category.ilike.%${category.name}%`)
      .eq('status', 'active')
      .is('deleted_at', null)
      .order('is_featured', { ascending: false })
      .order('rating_avg', { ascending: false })
      .limit(60);

    if (bizData) businesses = bizData;
  } catch {
    // fallback
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <PageHeader
        title={`${category.name} in Calicut`}
        description={`Explore verified ${category.name.toLowerCase()} listings, outlets & service providers across Calicut wards.`}
        icon={<Building2 className="h-6 w-6 text-[#2563EB]" />}
        breadcrumbs={[
          { label: 'Business Directory', href: '/business' },
          { label: category.name },
        ]}
        action={
          <Link href="/business/create">
            <Button
              size="sm"
              className="gap-1.5 h-[40px] px-5 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" /> Add Business
            </Button>
          </Link>
        }
      />

      {/* Subcategories Filter Chips */}
      {subcategories.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Explore Subcategories
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {subcategories.map((sub) => (
              <span
                key={sub.id}
                className="px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
              >
                {sub.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Listing Grid */}
      {businesses.length === 0 ? (
        <EmptyState
          title={`No ${category.name} listed yet`}
          description={`Be the first verified merchant to list under ${category.name} in Calicut. Get discovered by thousands of active residents.`}
          actionLabel="Add Your Business"
          actionHref="/business/create"
          hooks={[
            { href: '/business', label: 'All Businesses', description: 'Browse full directory', icon: Building2 },
          ]}
        />
      ) : (
        <ResponsiveGrid cols={3}>
          {businesses.map((business) => (
            <BusinessCard
              key={business.id}
              id={business.id}
              slug={business.slug}
              name={business.name}
              category={business.business_categories?.name || category.name}
              location={getExactBusinessLocation(business)}
              rating={Number(business.rating_avg ?? 0)}
              reviewCount={business.review_count ?? 0}
              phone={business.phone ?? undefined}
              isVerified={Boolean(business.is_verified)}
              image={businessCover(business)}
            />
          ))}
        </ResponsiveGrid>
      )}
    </div>
  );
}
