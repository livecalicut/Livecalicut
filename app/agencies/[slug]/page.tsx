import Link from 'next/link';
import { PageHeader } from '@/components/shared/page-header';
import { ResponsiveGrid } from '@/components/layout/responsive-grid';
import { Card } from '@/components/ui/card';
import { Building2, Phone, Mail, Globe, MapPin } from 'lucide-react';

export default async function AgencyProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const agencyName = slug ? slug.replace(/-/g, ' ').toUpperCase() : 'CALICUT PRIME REAL ESTATE AGENCY';

  return (
    <div className="space-y-8 py-4">
      <PageHeader
        title={agencyName}
        description="Verified Real Estate Agency & Property Brokerage in Kozhikode."
        icon={<Building2 className="w-6 h-6" />}
        breadcrumbs={[
          { label: 'Agencies Directory', href: '/agencies' },
          { label: agencyName },
        ]}
      />

      <Card className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 surface-card space-y-4">
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {agencyName} specializes in luxury residential villas, 2/3 BHK apartments, land plots, and commercial office rentals across Kozhikode district.
        </p>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-cyan-600" /> +91 495 270 1122</span>
          <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-cyan-600" /> contact@calicutprime.com</span>
          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-cyan-600" /> Mavoor Road, Kozhikode</span>
        </div>
      </Card>
    </div>
  );
}
