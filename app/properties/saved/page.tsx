import Link from 'next/link';
import { PageHeader } from '@/components/shared/page-header';
import { PropertyPriceBadge } from '@/components/property/property-price-badge';
import { ResponsiveGrid } from '@/components/layout/responsive-grid';
import { Card } from '@/components/ui/card';
import { Bookmark } from 'lucide-react';

export default function SavedPropertiesPage() {
  return (
    <div className="space-y-8 py-4">
      <PageHeader
        title="Saved Real Estate Favorites"
        description="Bookmarked properties saved for future review."
        icon={<Bookmark className="w-6 h-6" />}
        breadcrumbs={[
          { label: 'Properties', href: '/properties' },
          { label: 'Saved Favorites' },
        ]}
      />

      <ResponsiveGrid cols={3}>
        <Link href="/properties/luxury-3-bhk-villa-kozhikode-bypass" className="block group">
          <Card className="p-4 space-y-3 surface-card border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="w-full h-36 rounded-xl bg-slate-100 dark:bg-slate-800/80 animate-shimmer flex items-center justify-center text-xs text-slate-400 font-medium">
              Property Front Photo
            </div>

            <div className="space-y-1">
              <PropertyPriceBadge price={12500000} listingType="sell" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 transition-colors line-clamp-1">
                Luxury 3 BHK Villa in Kozhikode Bypass
              </h4>
              <p className="text-xs text-slate-500 truncate">Thondayad Bypass, Kozhikode</p>
            </div>
          </Card>
        </Link>
      </ResponsiveGrid>
    </div>
  );
}
