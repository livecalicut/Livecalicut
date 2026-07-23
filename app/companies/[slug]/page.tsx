import { PageHeader } from '@/components/shared/page-header';
import { JobCard } from '@/components/cards/job-card';
import { ResponsiveGrid } from '@/components/layout/responsive-grid';
import { Card } from '@/components/ui/card';
import { Building, MapPin, Globe, Phone, Mail } from 'lucide-react';

export default async function CompanyProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const companyName = slug ? slug.replace(/-/g, ' ').toUpperCase() : 'CYBERPARK SOFTWARE SOLUTIONS';

  const company = {
    name: companyName,
    industry: 'IT & Cyberpark Software',
    location: 'Sahya Building, Cyberpark Phase 1, Nellikode, Calicut',
    website: 'https://cyberparkkerala.org',
    email: 'careers@cyberpark.in',
    phone: '+91 495 255 1200',
    description: `
      Cyberpark Software Solutions is a premier technology firm operating within Hilite Cyberpark cluster in Kozhikode, delivering modern Web, Mobile, and Cloud software solutions to international clients.
    `,
  };

  return (
    <div className="space-y-8 py-4">
      <PageHeader
        title={company.name}
        description={company.location}
        icon={<Building className="w-6 h-6" />}
        breadcrumbs={[
          { label: 'Company Directory', href: '/companies' },
          { label: company.name },
        ]}
      />

      {/* Company Overview Card */}
      <Card className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 surface-card space-y-4">
        <p className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
          {company.industry}
        </p>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {company.description}
        </p>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="flex items-center gap-1">
            <Phone className="w-3.5 h-3.5 text-cyan-600" /> {company.phone}
          </span>
          <span className="flex items-center gap-1">
            <Mail className="w-3.5 h-3.5 text-cyan-600" /> {company.email}
          </span>
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-cyan-600 hover:underline"
          >
            <Globe className="w-3.5 h-3.5" /> {company.website}
          </a>
        </div>
      </Card>

      {/* Company Active Openings */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Active Vacancies at {company.name}
        </h3>
        <ResponsiveGrid cols={3}>
          <JobCard
            title="Senior React & Fullstack Engineer"
            company={company.name}
            location="Cyberpark Phase 1, Calicut"
            jobType="Full Time"
            salary="₹65,000 - ₹95,000 / mo"
          />
        </ResponsiveGrid>
      </div>
    </div>
  );
}
