import { PageHeader } from '@/components/shared/page-header';
import { SellerCard } from '@/components/marketplace/seller-card';
import { MarketplaceCard } from '@/components/cards/marketplace-card';
import { ResponsiveGrid } from '@/components/layout/responsive-grid';
import { UserCheck } from 'lucide-react';

export default async function SellerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="space-y-8 py-4">
      <PageHeader
        title="Seller Profile & Classified Desk"
        description="Verified local seller in Kozhikode."
        icon={<UserCheck className="w-6 h-6" />}
        breadcrumbs={[
          { label: 'Marketplace', href: '/marketplace' },
          { label: 'Seller Profile' },
        ]}
      />

      <SellerCard
        fullName="Arjun K. Varma"
        phone="+91 98460 77889"
        whatsapp="+91 98460 77889"
        isVerified={true}
      />

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Listings Posted by Seller</h3>
        <ResponsiveGrid cols={4}>
          <MarketplaceCard
            title="MacBook Pro M2 16GB / 512GB SSD"
            price="₹88,000"
            condition="Like New"
            location="Hilite City, Thondayad"
          />
        </ResponsiveGrid>
      </div>
    </div>
  );
}
