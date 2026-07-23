import Link from 'next/link';
import { PageHeader } from '@/components/shared/page-header';
import { ResponsiveGrid } from '@/components/layout/responsive-grid';
import { Card } from '@/components/ui/card';
import { Building2, MapPin, ArrowRight } from 'lucide-react';

export default function AgenciesDirectoryPage() {
  const sampleAgencies = [
    {
      name: 'Calicut Prime Real Estate Agency',
      slug: 'calicut-prime-real-estate',
      phone: '+91 495 270 1122',
      location: 'Mavoor Road, Kozhikode',
      propertyCount: 14,
    },
    {
      name: 'Malabar Heritage Builders & Realtors',
      slug: 'malabar-heritage-realtors',
      phone: '+91 495 230 4455',
      location: 'Hilite City, Bypass, Calicut',
      propertyCount: 22,
    },
  ];

  return (
    <div className="space-y-8 py-4">
      <PageHeader
        title="Kozhikode Real Estate Agencies"
        description="Explore verified real estate agencies, builders & brokerages across Malabar."
        icon={<Building2 className="w-6 h-6" />}
        breadcrumbs={[{ label: 'Agencies Directory' }]}
      />

      <ResponsiveGrid cols={3}>
        {sampleAgencies.map((agency) => (
          <Link key={agency.slug} href={`/agencies/${agency.slug}`} className="block group">
            <Card className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 surface-card space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-slate-800 border border-cyan-200 dark:border-cyan-500/30 flex items-center justify-center font-bold text-cyan-600">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 transition-colors">
                    {agency.name}
                  </h4>
                  <p className="text-xs text-slate-400">{agency.phone}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {agency.location}</span>
                <span className="font-bold text-cyan-600 flex items-center gap-1 group-hover:underline">
                  {agency.propertyCount} Properties <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Card>
          </Link>
        ))}
      </ResponsiveGrid>
    </div>
  );
}
