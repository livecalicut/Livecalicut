import { PageHeader } from '@/components/shared/page-header';
import { PlaceCard } from '@/components/explore/place-card';
import { ResponsiveGrid } from '@/components/layout/responsive-grid';
import { Bookmark } from 'lucide-react';

export default function SavedExplorePage() {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-6 sm:py-10">
      <PageHeader
        title="Saved Exploration Spots & Tours"
        description="Bookmarked heritage landmarks, beaches & culinary tours in Calicut."
        icon={<Bookmark className="w-6 h-6" />}
        breadcrumbs={[
          { label: 'Explore', href: '/explore' },
          { label: 'Saved Spots' },
        ]}
      />

      <ResponsiveGrid cols={3}>
        <PlaceCard
          title="Calicut Beach & Historical Freedom Square"
          slug="kozhikode-beach-freedom-square"
          category="Beaches & Waterfronts"
          location="Beach Road, Calicut Wards"
          rating={4.8}
        />
      </ResponsiveGrid>
    </div>
  );
}
