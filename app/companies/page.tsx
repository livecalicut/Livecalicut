'use client';

import React, { useState, useEffect } from 'react';
import { Container } from '@/components/layout/container';
import { PageHeader } from '@/components/shared/page-header';
import { CompanyCard } from '@/components/jobs/company-card';
import { ResponsiveGrid } from '@/components/layout/responsive-grid';
import { EmptyState } from '@/components/shared/empty-state';
import { Building, Loader2 } from 'lucide-react';

export default function CompaniesDirectoryPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/companies')
      .then((r) => r.json())
      .then((json) => setCompanies(json?.data || []))
      .catch(() => setCompanies([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container className="py-6 sm:py-10 space-y-8">
      <PageHeader
        title="Calicut Employers & Companies"
        description="Explore top technology firms, retail enterprises & healthcare organizations hiring in Calicut."
        icon={<Building className="w-6 h-6" />}
        breadcrumbs={[
          { label: 'Jobs', href: '/jobs' },
          { label: 'Company Directory' },
        ]}
      />

      {loading ? (
        <div className="flex items-center justify-center py-20 gap-3 text-[#6B7280]">
          <Loader2 className="w-5 h-5 animate-spin text-[#2563EB]" />
          <span className="text-sm font-medium">Loading companies...</span>
        </div>
      ) : companies.length === 0 ? (
        <EmptyState
          icon={<Building className="w-8 h-8 text-[#2563EB]" />}
          title="No companies listed yet"
          description="There are currently no employers listed in the directory. Check out active job openings."
          actionLabel="Explore All Jobs"
          actionHref="/jobs"
        />
      ) : (
        <ResponsiveGrid cols={3}>
          {companies.map((c) => (
            <CompanyCard
              key={c.slug || c.id}
              name={c.name}
              slug={c.slug || c.id}
              industry={c.industry || 'Business & Technology'}
              openingsCount={c.openings_count || 0}
              location={c.location || c.address || 'Calicut'}
            />
          ))}
        </ResponsiveGrid>
      )}
    </Container>
  );
}
