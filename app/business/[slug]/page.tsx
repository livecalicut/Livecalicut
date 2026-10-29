import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/shared/page-header';
import { VerifiedBadge, PremiumBadge } from '@/components/business/verified-badge';
import { RatingComponent, ReviewCard } from '@/components/business/rating-component';
import { GalleryComponent } from '@/components/business/gallery-component';
import { MapComponent } from '@/components/business/map-component';
import { ContactCard } from '@/components/business/contact-card';
import { Card } from '@/components/ui/card';
import { Check, Clock, MapPin } from 'lucide-react';
import { businessImages } from '@/lib/business/images';
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
    // Photos, hours and amenities live in social_media; the image/hours tables are not in production
    .select('*, business_categories(name, slug), areas(name, slug)')
    .eq('slug', slug)
    .is('deleted_at', null)
    .maybeSingle();

  if (error || !business) notFound();

  // Reviews table may not exist yet; a failure just means no reviews
  const { data: reviewRows } = await supabase
    .from('business_reviews')
    .select('id, rating, comment, created_at, profiles(full_name, avatar, avatar_url)')
    .eq('business_id', business.id)
    .order('created_at', { ascending: false })
    .limit(20);
  const extras = (business.social_media ?? {}) as { opening_hours?: string; amenities?: string[] };
  const amenities = Array.isArray(extras.amenities) ? extras.amenities.filter((a) => typeof a === 'string') : [];

  const category = (business.business_categories as { name?: string } | null)?.name || 'Local business';
  const location =
    (business.areas as { name?: string } | null)?.name ||
    business.short_description ||
    'Calicut';
  const rating = Number(business.rating_avg ?? 0);
  const reviews = (reviewRows as unknown as ReviewRow[] | null) || [];
  const reviewCount = business.review_count ?? reviews.length;
  const gallery = businessImages(business).map((url, i) => ({ id: String(i), url, caption: business.name }));

  return (
    <div className="space-y-8 py-4">
      <PageHeader
        title={business.name}
        description={business.short_description || business.description?.slice(0, 140) || ''}
        breadcrumbs={[
          { label: 'Business Directory', href: '/business' },
          { label: business.name },
        ]}
        action={
          <DetailSaveActions
            kind="business"
            entityId={business.id}
            slug={slug}
            title={business.name}
            label="Save"
            showShare
          />
        }
      />

      <Card className="space-y-4 border border-slate-200 bg-white p-6 surface-card dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            {business.is_verified ? <VerifiedBadge /> : null}
            {business.is_featured || business.is_premium ? <PremiumBadge /> : null}
          </div>
          <RatingComponent rating={rating} count={reviewCount} size="lg" />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
            {category}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
            <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
            <span>{location}</span>
          </div>
        </div>

        {(extras.opening_hours || amenities.length > 0) && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {extras.opening_hours && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                <Clock className="h-3.5 w-3.5" /> {extras.opening_hours}
              </span>
            )}
            {amenities.map((a) => (
              <span
                key={a}
                className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700"
              >
                <Check className="h-3 w-3" /> {a}
              </span>
            ))}
          </div>
        )}

        {business.description ? (
          <p className="pt-2 text-xs leading-relaxed text-slate-600 sm:text-sm dark:text-slate-300">
            {business.description}
          </p>
        ) : null}
      </Card>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Photo Gallery</h3>
            <GalleryComponent images={gallery} />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Customer Reviews ({reviewCount})
              </h3>
              <WriteReviewButton
                businessId={business.id}
                slug={slug}
                businessName={business.name}
              />
            </div>

            {reviews.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                No reviews yet. Be the first to share your experience.
              </p>
            ) : (
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <ReviewCard
                    key={rev.id}
                    userName={rev.profiles?.full_name || 'Verified customer'}
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

        <div className="space-y-6">
          <ContactCard
            phone={business.phone || undefined}
            whatsapp={business.whatsapp || undefined}
            email={business.email || undefined}
            website={business.website || undefined}
          />
          <MapComponent
            locationName={business.name}
            googleMapsLink={business.google_maps_link || undefined}
          />
          <p className="text-center text-xs text-slate-400">
            <Link href="/business" className="hover:text-[#2563EB]">
              ← Back to directory
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
