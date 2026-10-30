import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { VerifiedBadge, PremiumBadge } from '@/components/business/verified-badge';
import { RatingComponent, ReviewCard } from '@/components/business/rating-component';
import { GalleryComponent } from '@/components/business/gallery-component';
import { MapComponent } from '@/components/business/map-component';
import { ContactCard } from '@/components/business/contact-card';
import { Card } from '@/components/ui/card';
import {
  Check,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Building2,
  Calendar,
} from 'lucide-react';
import { businessImages, businessCover } from '@/lib/business/images';
import { getExactBusinessLocation } from '@/lib/business/location';
import { DetailSaveActions } from '@/components/auth/detail-save-actions';
import { WriteReviewButton } from '@/components/business/write-review-button';

type ReviewRow = {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  profiles?: { full_name?: string | null; avatar?: string | null; avatar_url?: string | null } | null;
};

export default async function BusinessDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: business, error } = await supabase
    .from('businesses')
    .select('*, business_categories(name, slug), areas(name, slug)')
    .eq('slug', slug)
    .is('deleted_at', null)
    .maybeSingle();

  if (error || !business) notFound();

  const { data: reviewRows } = await supabase
    .from('business_reviews')
    .select('id, rating, comment, created_at, profiles(full_name, avatar, avatar_url)')
    .eq('business_id', business.id)
    .order('created_at', { ascending: false })
    .limit(20);

  const extras = (business.social_media ?? {}) as {
    opening_hours?: string;
    amenities?: string[];
    banner?: string;
    cover_image?: string;
    logo?: string;
  };
  const amenities = Array.isArray(extras.amenities)
    ? extras.amenities.filter((a) => typeof a === 'string')
    : [];

  const category =
    (business.business_categories as { name?: string } | null)?.name ||
    business.category ||
    'Local Business';

  // Exact location resolver
  const location = getExactBusinessLocation(business);

  const rating = Number(business.rating_avg ?? 0);
  const reviews = (reviewRows as unknown as ReviewRow[] | null) || [];
  const reviewCount = business.review_count ?? reviews.length;

  const rawImages = businessImages(business);
  const gallery = rawImages.map((url, i) => ({ id: String(i), url, caption: `${business.name} photo ${i + 1}` }));

  // Cover Banner resolution
  const bannerImage =
    extras.banner ||
    extras.cover_image ||
    (rawImages.length > 1 ? rawImages[rawImages.length - 1] : rawImages[0]) ||
    '/heroes/kerala-coast.jpg';

  // Logo image resolution
  const logoImage = extras.logo || rawImages[0] || businessCover(business) || '/heroes/city-market.jpg';
  const cleanPhone = business.phone?.replace(/[^0-9]/g, '');

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Breadcrumb Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 font-medium">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-[#2563EB] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/business" className="hover:text-[#2563EB] transition-colors">
            Business Directory
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-semibold truncate max-w-[200px] sm:max-w-none">
            {business.name}
          </span>
        </div>

        <Link
          href="/business"
          className="inline-flex items-center gap-1 text-[#2563EB] hover:text-[#1D4ED8] font-bold text-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Directory
        </Link>
      </div>

      {/* Ultra-Premium Hero Banner */}
      <div className="relative w-full rounded-3xl overflow-hidden shadow-xl border border-slate-200/90 bg-slate-900">
        {/* Banner Backdrop Photo */}
        <div className="relative w-full h-64 sm:h-80 lg:h-96 bg-slate-950 overflow-hidden">
          <img
            src={bannerImage}
            alt={`${business.name} banner`}
            className="w-full h-full object-cover object-center scale-100 filter brightness-90"
          />
          {/* Rich Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/20" />
        </div>

        {/* Floating Actions on Top Right of Banner */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <DetailSaveActions
            kind="business"
            entityId={business.id}
            slug={slug}
            title={business.name}
            label="Save"
            showShare
          />
        </div>

        {/* Banner Info Content (Anchored Bottom) */}
        <div className="absolute bottom-0 inset-x-0 p-5 sm:p-8 z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 min-w-0">
            {/* Logo Avatar Box (100% visible, centered, not cropped) */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white shadow-2xl p-2.5 border-2 border-white flex items-center justify-center shrink-0 overflow-hidden">
              <img
                src={logoImage}
                alt={business.name}
                className="max-h-full max-w-full object-contain mx-auto"
              />
            </div>

            {/* Title & Badges */}
            <div className="space-y-1.5 text-white min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-white font-extrabold text-[11px] uppercase tracking-wider">
                  {category}
                </span>
                {business.is_verified && <VerifiedBadge />}
                {(business.is_featured || business.is_premium) && <PremiumBadge />}
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                {business.name}
              </h1>

              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-white/90">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="truncate">{location}</span>
              </div>
            </div>
          </div>

          {/* Quick CTA Desk (Call & WhatsApp) */}
          <div className="flex items-center gap-2.5 shrink-0 pt-2 sm:pt-0">
            {cleanPhone && (
              <a
                href={`tel:${cleanPhone}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-lg transition-all active:scale-95"
              >
                <Phone className="w-4 h-4" />
                <span>Call Desk</span>
              </a>
            )}

            {cleanPhone && (
              <a
                href={`https://wa.me/91${cleanPhone}?text=Hi%20${encodeURIComponent(business.name)},%20I%20saw%20your%20listing%20on%20LiveCalicut`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-emerald-600 text-white font-bold text-xs shadow-lg transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Layout Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column (2 Cols): Overview, Amenities, Gallery, Reviews */}
        <div className="space-y-6 lg:col-span-2">
          {/* Key Outlets Bar / Operating Hours & Genuine Rating */}
          <Card className="p-5 sm:p-6 border border-slate-200/90 bg-white rounded-3xl shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#2563EB]" />
                <h2 className="text-base font-bold text-slate-900">Commercial Outlet Overview</h2>
              </div>
              <RatingComponent rating={rating} count={reviewCount} size="md" />
            </div>

            {/* Operating Hours & Amenities */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {extras.opening_hours && (
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                  <Clock className="h-3.5 w-3.5 text-slate-500" /> {extras.opening_hours}
                </span>
              )}
              {amenities.map((a) => (
                <span
                  key={a}
                  className="inline-flex items-center gap-1 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700"
                >
                  <Check className="h-3.5 w-3.5" /> {a}
                </span>
              ))}
            </div>

            {/* Description */}
            {business.description && (
              <div className="pt-2 text-sm leading-relaxed text-slate-700 space-y-2 border-t border-slate-100">
                <p>{business.description}</p>
              </div>
            )}
          </Card>

          {/* Photo Gallery */}
          <div className="p-6 border border-slate-200/90 bg-white rounded-3xl shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Storefront &amp; Photo Gallery</h3>
            <GalleryComponent images={gallery} />
          </div>

          {/* Customer Reviews Section */}
          <div className="p-6 border border-slate-200/90 bg-white rounded-3xl shadow-xs space-y-5">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Customer Reviews ({reviewCount})
                </h3>
                <p className="text-xs text-slate-500">Genuine reviews verified by Calicut residents</p>
              </div>
              <WriteReviewButton
                businessId={business.id}
                slug={slug}
                businessName={business.name}
              />
            </div>

            {reviews.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center space-y-2">
                <p className="text-sm font-semibold text-slate-700">No reviews yet.</p>
                <p className="text-xs text-slate-500">
                  Be the first to share your experience with {business.name}.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <ReviewCard
                    key={rev.id}
                    userName={rev.profiles?.full_name || 'Verified Customer'}
                    userAvatar={rev.profiles?.avatar_url || rev.profiles?.avatar || undefined}
                    rating={rev.rating}
                    date={new Date(rev.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                    comment={rev.comment || ''}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 Col): Store Contacts, Location & Map */}
        <div className="space-y-6">
          <ContactCard
            phone={business.phone || undefined}
            whatsapp={business.whatsapp || undefined}
            email={business.email || undefined}
            website={business.website || undefined}
            address={
              business.address ||
              business.short_description ||
              (business.areas as { name?: string } | null)?.name ||
              location
            }
          />

          <MapComponent
            locationName={business.name}
            googleMapsLink={business.google_maps_link || undefined}
          />
        </div>
      </div>
    </div>
  );
}
