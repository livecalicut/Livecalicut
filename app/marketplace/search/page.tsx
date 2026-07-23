import { PageHeader } from '@/components/shared/page-header';
import { UniversalSearch } from '@/components/shared/universal-search';
import { MarketplaceCard } from '@/components/cards/marketplace-card';
import { ResponsiveGrid } from '@/components/layout/responsive-grid';
import { Search } from 'lucide-react';

export default function MarketplaceSearchPage() {
  return (
    <div className="space-y-8 py-4">
      <PageHeader
        title="Marketplace Search Results"
        description="Filter pre-owned items by category, price, condition & area."
        icon={<Search className="w-6 h-6" />}
        breadcrumbs={[
          { label: 'Marketplace', href: '/marketplace' },
          { label: 'Search Results' },
        ]}
      />

      <UniversalSearch placeholder="Search classified items..." />

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
