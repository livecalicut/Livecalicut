import { Suspense } from 'react';
import { HeroRedesign } from '@/components/home/hero-redesign';
import { ExploreCategories } from '@/components/home/explore-categories';
import { CitySpotlights } from '@/components/home/city-spotlights';
import { FeaturedBusinessesSection, FeaturedBusinessItem } from '@/components/home/featured-businesses-section';
import { PopularBusinessesSection, PopularBusinessItem } from '@/components/home/popular-businesses-section';
import { LatestListingsSection, UnifiedListingItem } from '@/components/home/latest-listings-section';
import { ExploreCalicutSection } from '@/components/home/explore-kozhikode-section';
import { AdvertiseSection } from '@/components/home/advertise-section';
import { StayUpdatedSection } from '@/components/home/stay-updated-section';
import { createPublicClient } from '@/lib/supabase/server';

import { businessCover } from '@/lib/business/images';

export const revalidate = 60;

function extractBusinessImage(biz: any): string | null {
  return businessCover(biz) || biz?.image_url || biz?.social_media?.cover_image || biz?.social_media?.logo || null;
}

function getExactBusinessLocation(biz: any): string {
  // 1. If areas relation has a specific area name
  const areaName = biz.areas?.name?.trim();
  if (areaName && !['calicut', 'kozhikode', 'all locations'].includes(areaName.toLowerCase())) {
    return areaName;
  }
  // 2. Check short_description, location, ward_location, or address
  const locCandidate = (biz.short_description || biz.location || biz.ward_location || biz.address || '')
    .toString()
    .trim();
  if (locCandidate) {
    const parts = locCandidate.split(',').map((p: string) => p.trim()).filter(Boolean);
    const specific = parts.find((p: string) => !['calicut', 'kozhikode', 'kerala', 'india'].includes(p.toLowerCase()));
    if (specific) return specific;
    if (parts[0] && !['calicut', 'kozhikode'].includes(parts[0].toLowerCase())) return parts[0];
  }
  // 3. Known specific merchant names fallback
  const lowerName = (biz.name || '').toLowerCase();
  if (lowerName.includes('sunshine ventures')) return 'Thondayad Bypass';
  if (lowerName.includes('decolink')) return 'Nadakkavu';
  if (lowerName.includes('ziacare')) return 'Mavoor Road';

  return areaName || 'Calicut';
}

function withTimeout<T>(promise: PromiseLike<{ data: T | null; error: unknown }>, ms = 4000) {
  return Promise.race([
    Promise.resolve(promise),
    new Promise<{ data: null; error: { message: string } }>((resolve) => {
      setTimeout(() => resolve({ data: null, error: { message: 'timeout' } }), ms);
    }),
  ]);
}

function HomeFeedSkeleton() {
  return (
    <div className="w-full space-y-8 py-12">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-8 w-48 rounded-lg bg-slate-100 animate-pulse mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-48 rounded-2xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

async function HomeFeed() {
  let featuredBusinesses: FeaturedBusinessItem[] = [];
  let popularBusinesses: PopularBusinessItem[] = [];
  const latestListings: UnifiedListingItem[] = [];

  try {
    const supabase = createPublicClient();

    const [premiumBizRes, allBizRes, jobsRes, propertiesRes, marketplaceRes] = await Promise.all([
      // Only listings with active premium/sponsored advertisement
      withTimeout(
        supabase
          .from('businesses')
          .select('id, slug, name, phone, rating_avg, review_count, is_featured, is_premium, is_verified, short_description, social_media, business_categories(name), areas(name)')
          .is('deleted_at', null)
          .eq('status', 'active')
          .or('is_premium.eq.true,is_featured.eq.true')
          .order('is_premium', { ascending: false })
          .order('rating_avg', { ascending: false })
          .limit(8)
      ),
      // Popular & verified businesses
      withTimeout(
        supabase
          .from('businesses')
          .select('id, slug, name, phone, rating_avg, review_count, is_featured, is_premium, is_verified, short_description, social_media, business_categories(name), areas(name)')
          .is('deleted_at', null)
          .eq('status', 'active')
          .order('rating_avg', { ascending: false })
          .limit(16)
      ),
      withTimeout(
        supabase
          .from('jobs')
          .select('id, slug, title, salary, employment_type, created_at, companies(name, logo), areas(name)')
          .is('deleted_at', null)
          .order('created_at', { ascending: false })
          .limit(6)
      ),
      withTimeout(
        supabase
          .from('properties')
          .select('id, slug, title, price, listing_type, location, created_at, property_categories(name)')
          .is('deleted_at', null)
          .order('created_at', { ascending: false })
          .limit(6)
      ),
      withTimeout(
        supabase
          .from('marketplace_items')
          .select('id, slug, title, price, condition, location, created_at, marketplace_categories(name)')
          .is('deleted_at', null)
          .order('created_at', { ascending: false })
          .limit(6)
      ),
    ]);

    const rawPremium = premiumBizRes?.data || [];
    const rawAll = allBizRes?.data || [];

    // 4. In 3rd image section: ONLY listings that have taken premium advertisement!
    // Never fall back to unfeatured/non-paying businesses.
    if (rawPremium.length > 0) {
      featuredBusinesses = rawPremium.map((biz: any) => ({
        id: biz.id,
        slug: biz.slug,
        name: biz.name,
        category: biz.business_categories?.name || 'Business',
        location: getExactBusinessLocation(biz),
        rating: Number(biz.rating_avg) || 0,
        reviewCount: Number(biz.review_count) || 0,
        image: extractBusinessImage(biz),
        phone: biz.phone,
        isSponsored: true,
      }));
    }

    if (rawAll.length > 0) {
      popularBusinesses = rawAll.slice(0, 6).map((biz: any) => ({
        id: biz.id,
        slug: biz.slug,
        name: biz.name,
        category: biz.business_categories?.name || 'Business',
        location: getExactBusinessLocation(biz),
        rating: Number(biz.rating_avg) || 0,
        reviewCount: Number(biz.review_count) || 0,
        image: extractBusinessImage(biz),
      }));
    }

    (jobsRes?.data || []).forEach((j: any) => {
      latestListings.push({
        id: `job-${j.id}`,
        type: 'job',
        title: j.title,
        subtitle: j.companies?.name || 'Full-time',
        priceOrSalary: j.salary || '₹20,000 – 35,000',
        location: j.areas?.name || 'Calicut',
        timeAgo: formatTimeAgo(j.created_at),
        image: j.companies?.logo || null,
        href: `/jobs/${j.slug || j.id}`,
        badgeText: j.employment_type || 'Full-time',
        badgeVariant: 'blue',
      });
    });

    (propertiesRes?.data || []).forEach((p: any) => {
      latestListings.push({
        id: `prop-${p.id}`,
        type: 'property',
        title: p.title,
        subtitle: p.property_categories?.name || (p.listing_type === 'rent' ? 'For Rent' : 'For Sale'),
        priceOrSalary: p.price ? (p.price.toString().startsWith('₹') ? p.price : `₹${Number(p.price).toLocaleString('en-IN')}`) : 'Price on Request',
        location: p.location || 'Calicut',
        timeAgo: formatTimeAgo(p.created_at),
        image: null,
        href: `/properties/${p.slug || p.id}`,
        badgeText: p.listing_type === 'rent' ? 'Rent' : 'Sale',
        badgeVariant: 'emerald',
      });
    });

    (marketplaceRes?.data || []).forEach((m: any) => {
      latestListings.push({
        id: `mkt-${m.id}`,
        type: 'marketplace',
        title: m.title,
        subtitle: m.marketplace_categories?.name || m.condition || 'Pre-owned',
        priceOrSalary: m.price ? (m.price.toString().startsWith('₹') ? m.price : `₹${Number(m.price).toLocaleString('en-IN')}`) : 'Contact for price',
        location: m.location || 'Calicut',
        timeAgo: formatTimeAgo(m.created_at),
        image: null,
        href: `/marketplace/${m.slug || m.id}`,
        badgeText: m.condition || 'Good Condition',
        badgeVariant: 'purple',
      });
    });
  } catch (err) {
    console.error('[HomePage] Supabase fetch error handled safely:', err);
  }

  return (
    <>
      <FeaturedBusinessesSection businesses={featuredBusinesses} />
      <PopularBusinessesSection businesses={popularBusinesses} />
      <LatestListingsSection initialItems={latestListings} />
    </>
  );
}

export default function HomePage() {
  return (
    <div className="flex w-full flex-col bg-white">
      <HeroRedesign />
      <ExploreCategories />
      <CitySpotlights />
      <Suspense fallback={<HomeFeedSkeleton />}>
        <HomeFeed />
      </Suspense>
      <ExploreCalicutSection />
      <AdvertiseSection />
      <StayUpdatedSection />
    </div>
  );
}

function formatTimeAgo(dateString?: string): string {
  if (!dateString) return 'Recently';
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 30) return `${diffDays} days ago`;
  return 'Recently';
}
