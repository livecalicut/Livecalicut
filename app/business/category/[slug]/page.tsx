import { PageHeader } from '@/components/shared/page-header';
import { BusinessCard } from '@/components/cards/business-card';
import { ResponsiveGrid } from '@/components/layout/responsive-grid';
import { Building2 } from 'lucide-react';

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const categoryTitle = slug.replace(/-/g, ' ').toUpperCase();

  return (
    <div className="space-y-8 py-4">
      <PageHeader
        title={`${categoryTitle} in Kozhikode`}
        description={`Explore verified outlets and providers in ${categoryTitle}`}
        icon={<Building2 className="w-6 h-6" />}
        breadcrumbs={[
          { label: 'Business Directory', href: '/business' },
          { label: categoryTitle },
        ]}
      />

      <ResponsiveGrid cols={3}>
        <BusinessCard
          id="1"
          name="Paragon Restaurant"
          category="Dining & Malabar Cuisine"
          location="Mavoor Road Junction, Calicut"
          rating={4.9}
          reviewCount={1240}
          phone="+91 495 276 8920"
          isVerified={true}
        />
      </ResponsiveGrid>
    </div>
  );
}
