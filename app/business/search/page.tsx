import { PageHeader } from '@/components/shared/page-header';
import { UniversalSearch } from '@/components/shared/universal-search';
import { BusinessCard } from '@/components/cards/business-card';
import { ResponsiveGrid } from '@/components/layout/responsive-grid';
import { Search } from 'lucide-react';

export default function BusinessSearchPage() {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-6 sm:py-10">
      <PageHeader
        title="Business Search Results"
        description="Filter and search verified local business listings in Calicut."
        icon={<Search className="w-6 h-6" />}
        breadcrumbs={[
          { label: 'Business Directory', href: '/business' },
          { label: 'Search Results' },
        ]}
      />

      <UniversalSearch />

      <ResponsiveGrid cols={3}>
        <BusinessCard
          id="1"
          name="Aster MIMS Hospital"
          category="Hospitals & Clinics"
          location="Govindapuram, Calicut"
          rating={4.8}
          reviewCount={850}
          phone="+91 495 274 0100"
          isVerified={true}
        />
      </ResponsiveGrid>
    </div>
  );
}
