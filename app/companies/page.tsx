import { PageHeader } from '@/components/shared/page-header';
import { CompanyCard } from '@/components/jobs/company-card';
import { ResponsiveGrid } from '@/components/layout/responsive-grid';
import { Building } from 'lucide-react';

export default function CompaniesDirectoryPage() {
  const sampleCompanies = [
    {
      name: 'Cyberpark Software Solutions',
      slug: 'cyberpark-software-solutions',
      industry: 'IT & Cyberpark',
      openingsCount: 4,
      location: 'Cyberpark Phase 1, Calicut',
    },
    {
      name: 'Hilite Mall Outlets',
      slug: 'hilite-mall-outlets',
      industry: 'Retail & Textiles',
      openingsCount: 6,
      location: 'Thondayad Bypass, Calicut',
    },
    {
      name: 'Aster MIMS Health Hub',
      slug: 'aster-mims-health-hub',
      industry: 'Healthcare & Clinical',
      openingsCount: 3,
      location: 'Govindapuram, Calicut',
    },
  ];

  return (
    <div className="space-y-8 py-4">
      <PageHeader
        title="Kozhikode Employers & Companies"
        description="Explore top IT firms in Cyberpark, retail chains & clinical healthcare hubs hiring in Kozhikode."
        icon={<Building className="w-6 h-6" />}
        breadcrumbs={[{ label: 'Company Directory' }]}
      />

      <ResponsiveGrid cols={3}>
        {sampleCompanies.map((c) => (
          <CompanyCard
            key={c.slug}
            name={c.name}
            slug={c.slug}
            industry={c.industry}
            openingsCount={c.openingsCount}
            location={c.location}
          />
        ))}
      </ResponsiveGrid>
    </div>
  );
}
