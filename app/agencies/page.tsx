'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { PageHeader } from '@/components/shared/page-header';
import { ResponsiveGrid } from '@/components/layout/responsive-grid';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/empty-state';
import { Building2, MapPin, ArrowRight, Loader2 } from 'lucide-react';

export default function AgenciesDirectoryPage() {
  const [agencies, setAgencies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/agencies')
      .then((r) => r.json())
      .then((json) => setAgencies(json?.data || []))
      .catch(() => setAgencies([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container className="py-6 sm:py-10 space-y-8">
      <PageHeader
        title="Calicut Real Estate Agencies"
        description="Explore verified real estate agencies, builders & brokerages across Malabar."
        icon={<Building2 className="w-6 h-6" />}
        breadcrumbs={[
          { label: 'Properties', href: '/properties' },
          { label: 'Agencies' },
        ]}
      />

      {loading ? (
        <div className="flex items-center justify-center py-20 gap-3 text-[#6B7280]">
          <Loader2 className="w-5 h-5 animate-spin text-[#2563EB]" />
          <span className="text-sm font-medium">Loading real estate agencies...</span>
        </div>
      ) : agencies.length === 0 ? (
        <EmptyState
          icon={<Building2 className="w-8 h-8 text-[#2563EB]" />}
          title="No agencies listed yet"
          description="There are currently no real estate agencies registered. Check out all available properties."
          actionLabel="Browse Properties"
          actionHref="/properties"
        />
      ) : (
        <ResponsiveGrid cols={3}>
          {agencies.map((agency) => (
            <Link key={agency.slug || agency.id} href={`/agencies/${agency.slug || agency.id}`} className="block group">
              <Card className="p-5 border border-slate-200 bg-white hover:shadow-lg rounded-2xl transition-all space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center font-bold text-[#2563EB]">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 group-hover:text-[#2563EB] transition-colors">
                      {agency.name}
                    </h4>
                    {agency.phone && <p className="text-xs text-slate-400">{agency.phone}</p>}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {agency.location || 'Calicut'}</span>
                  <span className="font-bold text-[#2563EB] flex items-center gap-1 group-hover:underline">
                    View Agency <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </ResponsiveGrid>
      )}
    </Container>
  );
}
