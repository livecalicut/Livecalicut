import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/shared/page-header';
import { BusinessCard } from '@/components/cards/business-card';
import { ResponsiveGrid } from '@/components/layout/responsive-grid';
import { Building2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: category } = await supabase
    .from('business_categories')
    .select('id, name')
    .eq('slug', slug)
    .is('deleted_at', null)
    .maybeSingle();

  if (!category) notFound();

  const { data: businesses } = await supabase
    .from('businesses')
    .select('id, slug, name, phone, rating_avg, review_count, is_verified, business_categories(name), areas(name)')
    .eq('category_id', category.id)
    .eq('status', 'active')
    .is('deleted_at', null)
    .order('is_featured', { ascending: false })
    .order('rating_avg', { ascending: false })
    .limit(60);

  const rows = businesses ?? [];

  // PostgREST returns an embedded relation as an object or a single-element
  // array depending on inferred cardinality.
  const nameOf = (rel: unknown): string | undefined => {
    if (Array.isArray(rel)) return (rel[0] as { name?: string } | undefined)?.name;
    return (rel as { name?: string } | null)?.name;
  };

  return (
    <div className="space-y-8 py-4">
      <PageHeader
        title={`${category.name} in Kozhikode`}
        description={`Explore ${rows.length} verified ${category.name.toLowerCase()} listings across the city`}
        icon={<Building2 className="h-6 w-6" />}
        breadcrumbs={[
          { label: 'Business Directory', href: '/business' },
          { label: category.name },
        ]}
      />

      {rows.length === 0 ? (
        <p className="py-16 text-center text-sm text-[#6B7280]">
          No listings in this category yet. Check back soon.
        </p>
      ) : (
        <ResponsiveGrid cols={3}>
          {rows.map((business) => (
            <BusinessCard
              key={business.id}
              id={business.id}
              slug={business.slug}
              name={business.name}
              category={nameOf(business.business_categories) ?? category.name}
              location={nameOf(business.areas) ?? 'Kozhikode'}
              rating={Number(business.rating_avg ?? 0)}
              reviewCount={business.review_count ?? 0}
              phone={business.phone ?? undefined}
              isVerified={Boolean(business.is_verified)}
            />
          ))}
        </ResponsiveGrid>
      )}
    </div>
  );
}
