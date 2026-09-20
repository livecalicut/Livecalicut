import { Suspense } from 'react';
import { HeroRedesign } from '@/components/home/hero-redesign';
import { ExploreCategories } from '@/components/home/explore-categories';
import { FeaturedBusinessesSection, FeaturedBusinessItem } from '@/components/home/featured-businesses-section';
import { PopularBusinessesSection, PopularBusinessItem } from '@/components/home/popular-businesses-section';
import { LatestListingsSection, UnifiedListingItem } from '@/components/home/latest-listings-section';
import { ExploreKozhikodeSection } from '@/components/home/explore-kozhikode-section';
import { AdvertiseSection } from '@/components/home/advertise-section';
import { StayUpdatedSection } from '@/components/home/stay-updated-section';
import { createPublicClient } from '@/lib/supabase/server';

export const revalidate = 60;

function extractBusinessImage(biz: any): string | null {
  if (!biz) return null;
  if (biz.cover_image) return biz.cover_image;
  if (biz.image_url) return biz.image_url;
  if (biz.social_media?.cover_image) return biz.social_media.cover_image;
  if (biz.social_media?.image_url) return biz.social_media.image_url;
  if (biz.social_media?.logo) return biz.social_media.logo;
  if (Array.isArray(biz.business_images) && biz.business_images.length > 0) {
    return biz.business_images[0]?.url || null;
  }
  return null;
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

    const [allBizRes, jobsRes, propertiesRes, marketplaceRes] = await Promise.all([
      withTimeout(
        supabase
          .from('businesses')
          .select('id, slug, name, phone, rating_avg, review_count, is_featured, is_premium, is_verified, social_media, business_images(url), business_categories(name), areas(name)')
          .is('deleted_at', null)
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

    const rawAll = allBizRes?.data || [];
    const rawFeatured = rawAll.filter((biz: any) => biz.is_featured || biz.is_premium);

    if (rawFeatured.length > 0) {
      featuredBusinesses = rawFeatured.slice(0, 8).map((biz: any) => ({
        id: biz.id,
        slug: biz.slug,
        name: biz.name,
        category: biz.business_categories?.name || 'Business',
        location: biz.areas?.name || 'Kozhikode',
        rating: Number(biz.rating_avg) || 4.5,
        reviewCount: Number(biz.review_count) || 0,
        image: extractBusinessImage(biz),
        phone: biz.phone,
        isSponsored: true,
      }));
    }

    if (rawAll.length > 0) {
      popularBusinesses = rawAll.map((biz: any) => ({
        id: biz.id,
        slug: biz.slug,
        name: biz.name,
        category: biz.business_categories?.name || 'Business',
        location: biz.areas?.name || 'Kozhikode',
        rating: Number(biz.rating_avg) || 4.4,
        reviewCount: Number(biz.review_count) || 0,
        image: extractBusinessImage(biz),
      }));

      if (featuredBusinesses.length === 0) {
        featuredBusinesses = rawAll.slice(0, 4).map((biz: any) => ({
          id: biz.id,
          slug: biz.slug,
          name: biz.name,
          category: biz.business_categories?.name || 'Business',
          location: biz.areas?.name || 'Kozhikode',
          rating: Number(biz.rating_avg) || 4.5,
          reviewCount: Number(biz.review_count) || 0,
          image: extractBusinessImage(biz),
          phone: biz.phone,
          isSponsored: true,
        }));
      }
    }

    (jobsRes?.data || []).forEach((j: any) => {
      latestListings.push({
        id: `job-${j.id}`,
        type: 'job',
        title: j.title,
        subtitle: j.companies?.name || 'Full-time',
        priceOrSalary: j.salary || '₹20,000 – 35,000',
        location: j.areas?.name || 'Kozhikode',
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
        location: p.location || 'Kozhikode',
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
        location: m.location || 'Kozhikode',
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
    <div className="w-full flex flex-col bg-white">
      <HeroRedesign />
      <ExploreCategories />
      <Suspense fallback={<HomeFeedSkeleton />}>
        <HomeFeed />
      </Suspense>
      <ExploreKozhikodeSection />
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
