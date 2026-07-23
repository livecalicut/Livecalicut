import { PageHeader } from '@/components/shared/page-header';
import { PlaceCard } from '@/components/explore/place-card';
import { ResponsiveGrid } from '@/components/layout/responsive-grid';
import { Bookmark } from 'lucide-react';

export default function SavedExplorePage() {
  return (
    <div className="space-y-8 py-4">
      <PageHeader
        title="Saved Exploration Spots & Tours"
        description="Bookmarked heritage landmarks, beaches & culinary tours in Kozhikode."
        icon={<Bookmark className="w-6 h-6" />}
        breadcrumbs={[
          { label: 'Explore', href: '/explore' },
          { label: 'Saved Spots' },
        ]}
      />

      <ResponsiveGrid cols={3}>
        <PlaceCard
          title="Kozhikode Beach & Historical Freedom Square"
          slug="kozhikode-beach-freedom-square"
          category="Beaches & Waterfronts"
          location="Beach Road, Kozhikode Wards"
          rating={4.8}
        />
      </ResponsiveGrid>
    </div>
  );
}
