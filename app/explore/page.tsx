import Link from 'next/link';
import { PageHeader } from '@/components/shared/page-header';
import { UniversalSearch } from '@/components/shared/universal-search';
import { PlaceCard } from '@/components/explore/place-card';
import { ResponsiveGrid } from '@/components/layout/responsive-grid';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Compass, MapPin, Utensils, Hotel, Sparkles, Bookmark } from 'lucide-react';

export default function ExploreHomePage() {
  const samplePlaces = [
    {
      title: 'Kozhikode Beach & Historical Freedom Square',
      slug: 'kozhikode-beach-freedom-square',
      category: 'Beaches & Waterfronts',
      location: 'Beach Road, Kozhikode Wards',
      rating: 4.8,
      entryFee: 'Free Entry',
    },
    {
      title: 'SM Street (Sweetmeat Street Heritage Bazaar)',
      slug: 'sm-street-heritage-bazaar',
      category: 'SM Street & Shopping',
      location: 'Palayam, Kozhikode',
      rating: 4.9,
      entryFee: 'Free Entry',
    },
    {
      title: 'Mananchira Square & Historical Palace Gardens',
      slug: 'mananchira-square-palace-gardens',
      category: 'Historical Sites & Forts',
      location: 'Town Hall Junction, Kozhikode',
      rating: 4.7,
      entryFee: 'Free Entry',
    },
  ];

  return (
    <div className="space-y-8 py-4">
      <PageHeader
        title="Explore Kozhikode (Calicut)"
        description="Discover historical landmarks, SM Street heritage walks, Malabar culinary trails, beach piers & luxury resorts."
        icon={<Compass className="w-6 h-6" />}
        breadcrumbs={[{ label: 'Explore Kozhikode' }]}
        action={
          <Link href="/explore/saved">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Bookmark className="w-4 h-4" /> Saved Exploration Spots
            </Button>
          </Link>
        }
      />

      <UniversalSearch placeholder="Search beaches, SM Street, Halwa shops, resorts in Calicut..." />

      {/* Shortcuts Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link href="/places">
          <Card className="p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 surface-card space-y-2 text-center group">
            <Compass className="w-6 h-6 text-cyan-600 mx-auto group-hover:scale-110 transition-transform" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Places to Visit</h4>
          </Card>
        </Link>

        <Link href="/restaurants">
          <Card className="p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 surface-card space-y-2 text-center group">
            <Utensils className="w-6 h-6 text-amber-500 mx-auto group-hover:scale-110 transition-transform" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Restaurants & Cafes</h4>
          </Card>
        </Link>

        <Link href="/hotels">
          <Card className="p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 surface-card space-y-2 text-center group">
            <Hotel className="w-6 h-6 text-purple-500 mx-auto group-hover:scale-110 transition-transform" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Hotels & Stays</h4>
          </Card>
        </Link>

        <Link href="/experiences">
          <Card className="p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 surface-card space-y-2 text-center group">
            <Sparkles className="w-6 h-6 text-emerald-500 mx-auto group-hover:scale-110 transition-transform" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Food Trails & Tours</h4>
          </Card>
        </Link>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Must Visit Spots in Kozhikode</h3>
        <ResponsiveGrid cols={3}>
          {samplePlaces.map((p) => (
            <PlaceCard
              key={p.slug}
              title={p.title}
              slug={p.slug}
              category={p.category}
              location={p.location}
              rating={p.rating}
              entryFee={p.entryFee}
            />
          ))}
        </ResponsiveGrid>
      </div>
    </div>
  );
}
