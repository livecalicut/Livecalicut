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
import { MapPin } from 'lucide-react';
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
    .select(
      '*, business_categories(name, slug), areas(name, slug), business_images(id, url, caption), business_hours(*), business_reviews(id, rating, comment, created_at, profiles(full_name, avatar, avatar_url))'
    )
    .eq('slug', slug)
    .is('deleted_at', null)
    .maybeSingle();

  if (error || !business) notFound();

  const category = (business.business_categories as { name?: string } | null)?.name || 'Local business';
  const location =
    (business.areas as { name?: string } | null)?.name ||
    business.address ||
    'Kozhikode';
  const rating = Number(business.rating_avg ?? 0);
  const reviews = ((business.business_reviews as ReviewRow[] | null) || [])
    .slice()
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  const reviewCount = business.review_count ?? reviews.length;
  const gallery = ((business.business_images as { id: string; url: string; caption?: string }[] | null) || []).map(
    (img) => ({ id: img.id, url: img.url, caption: img.caption })
  );

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
