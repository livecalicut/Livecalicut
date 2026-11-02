import { PageHeader } from '@/components/shared/page-header';
import { MarketplaceCard } from '@/components/cards/marketplace-card';
import { ResponsiveGrid } from '@/components/layout/responsive-grid';
import { Bookmark } from 'lucide-react';

export default function SavedMarketplacePage() {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-6 sm:py-10">
      <PageHeader
        title="Saved Marketplace Favorites"
        description="Bookmarked items saved for quick access."
        icon={<Bookmark className="w-6 h-6" />}
        breadcrumbs={[
          { label: 'Marketplace', href: '/marketplace' },
          { label: 'Saved Favorites' },
        ]}
      />

      <ResponsiveGrid cols={4}>
        <MarketplaceCard
          title="MacBook Pro M2 16GB / 512GB SSD"
          price="₹88,000"
          condition="Like New"
          location="Hilite City, Thondayad"
        />
      </ResponsiveGrid>
    </div>
  );
}
