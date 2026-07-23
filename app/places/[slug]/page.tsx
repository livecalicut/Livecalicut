import { PageHeader } from '@/components/shared/page-header';
import { ShareButtons } from '@/components/shared/share-buttons';
import { GalleryComponent } from '@/components/business/gallery-component';
import { MapComponent } from '@/components/business/map-component';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Clock, MapPin, Navigation, Bookmark } from 'lucide-react';

export default async function PlaceDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const place = {
    title: slug ? slug.replace(/-/g, ' ').toUpperCase() : 'KOZHIKODE BEACH & FREEDOM SQUARE',
    category: 'Beaches & Waterfronts',
    location: 'Beach Road, Kozhikode Wards',
    openingHours: '05:00 AM - 10:00 PM',
    entryFee: 'Free Entry',
    ratingAvg: 4.8,
    ratingCount: 340,
    googleMapsLink: 'https://maps.google.com/?q=Kozhikode+Beach',
    description: `
      Kozhikode Beach is a legendary sunset destination along the Arabian Sea shore.
      Features the historic sea piers built over 120 years ago, Freedom Square cultural plaza, local Kozhikode Halwa & Ice Orath stalls, and fresh Malabar seafood vendors.
    `,
  };

  return (
    <div className="space-y-8 py-4">
      <PageHeader
        title={place.title}
        description={place.location}
        breadcrumbs={[
          { label: 'Explore', href: '/explore' },
          { label: 'Places', href: '/places' },
          { label: place.title },
        ]}
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Bookmark className="w-4 h-4" /> Save Spot
            </Button>
            <ShareButtons title={place.title} />
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <GalleryComponent />

          <Card className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 surface-card space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-amber-500 flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400" /> {place.ratingAvg} ★
                </span>
                <span className="text-xs text-slate-400">({place.ratingCount} verified reviews)</span>
              </div>
              <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400">{place.entryFee}</span>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Historical Overview</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {place.description}
              </p>
            </div>

            <div className="pt-2">
              <a href={place.googleMapsLink} target="_blank" rel="noopener noreferrer" className="inline-block">
                <Button className="gap-2">
                  <Navigation className="w-4 h-4" /> Get Google Maps Directions
                </Button>
              </a>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Visiting Timings</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-cyan-600" /> {place.openingHours}
            </p>
          </Card>

          <MapComponent locationName={place.location} />
        </div>
      </div>
    </div>
  );
}
