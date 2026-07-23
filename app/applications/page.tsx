import Link from 'next/link';
import { PageHeader } from '@/components/shared/page-header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Clock, CheckCircle, ArrowRight } from 'lucide-react';

export default function MyApplicationsPage() {
  const applications = [
    {
      id: '1',
      jobTitle: 'Senior React & Fullstack Engineer',
      company: 'Cyberpark Software Solutions',
      salary: '₹65,000 - ₹95,000 / mo',
      appliedDate: 'July 11, 2026',
      status: 'shortlisted',
      slug: 'senior-react-fullstack-engineer',
    },
    {
      id: '2',
      jobTitle: 'Retail Operations Store Manager',
      company: 'Hilite Mall Retail Outlets',
      salary: '₹28,000 - ₹38,000 / mo',
      appliedDate: 'July 05, 2026',
      status: 'pending',
      slug: 'retail-operations-store-manager',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <PageHeader
        title="My Job Applications Tracker"
        description="Track the status of your submitted resumes with Kozhikode employers."
        icon={<Briefcase className="w-6 h-6" />}
        breadcrumbs={[
          { label: 'Jobs', href: '/jobs' },
          { label: 'My Applications' },
        ]}
      />

      <div className="space-y-4">
        {applications.map((app) => (
          <Card key={app.id} className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 surface-card space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">{app.jobTitle}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{app.company} • {app.salary}</p>
              </div>

              {app.status === 'shortlisted' ? (
                <Badge variant="success" className="gap-1">
                  <CheckCircle className="w-3 h-3" /> Candidate Shortlisted
                </Badge>
              ) : (
                <Badge variant="secondary" className="gap-1">
                  <Clock className="w-3 h-3" /> Under Review
                </Badge>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>Applied on {app.appliedDate}</span>
              <Link href={`/jobs/${app.slug}`} className="font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1">
                View Posting Details <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
