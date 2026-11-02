import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/layout/container';
import { PageHeader } from '@/components/shared/page-header';
import { ShareButtons } from '@/components/shared/share-buttons';
import { MapComponent } from '@/components/business/map-component';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Clock, Navigation, Ticket, CheckCircle2 } from 'lucide-react';
import { TOURIST_DESTINATIONS, getDestination } from '@/lib/tourism/destinations';

// Unknown slugs get a real 404 instead of a streamed not-found shell
export const dynamicParams = false;

export function generateStaticParams() {
  return TOURIST_DESTINATIONS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const place = getDestination(slug);
  if (!place) return { title: 'Place not found' };
  return {
    title: `${place.title} | LiveCalicut`,
    description: place.description,
    openGraph: { title: place.title, description: place.description, images: [place.image] },
  };
}

export default async function PlaceDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const place = getDestination(slug);
  if (!place) notFound();

  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.title}, ${place.location}`)}`;

  return (
    <Container className="py-6 sm:py-10 space-y-6 sm:space-y-8">
      <PageHeader
        title={place.title}
        description={place.location}
        breadcrumbs={[
          { label: 'Explore', href: '/explore' },
          { label: 'Tourism', href: '/tourism' },
          { label: place.title },
        ]}
        action={<ShareButtons title={place.title} />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6 min-w-0">
          <div className="relative w-full aspect-[16/9] overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={place.image} alt={place.title} className="absolute inset-0 h-full w-full object-cover" />
          </div>

          <Card className="p-4 sm:p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <span className="text-sm font-bold text-amber-500 flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400" /> {place.rating}
                <span className="text-xs font-normal text-slate-400">({place.reviews.toLocaleString('en-IN')} reviews)</span>
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300">
                {place.category}
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Overview</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{place.description}</p>
            </div>

            <div className="space-y-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Highlights</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {place.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-500" /> {h}
                  </li>
                ))}
              </ul>
            </div>

            <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="block sm:inline-block">
              <Button className="w-full sm:w-auto gap-2">
                <Navigation className="w-4 h-4" /> Get Directions
              </Button>
            </a>
          </Card>
        </div>

        <aside className="space-y-6 min-w-0">
          <Card className="p-4 sm:p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Visiting Info</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2">
              <Clock className="w-4 h-4 mt-0.5 shrink-0 text-cyan-600" /> {place.timings}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2">
              <Ticket className="w-4 h-4 mt-0.5 shrink-0 text-cyan-600" /> {place.entryFee}
            </p>
          </Card>

          <MapComponent locationName={place.location} googleMapsLink={mapsLink} />
        </aside>
      </div>
    </Container>
  );
}
