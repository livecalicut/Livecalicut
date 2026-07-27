'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { PageHeader } from '@/components/shared/page-header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Clock, CheckCircle, ArrowRight, XCircle, Loader2 } from 'lucide-react';

type ApplicationRow = {
  id: string;
  status: string;
  created_at: string;
  jobs?: {
    title?: string;
    slug?: string;
    salary_min?: number;
    salary_max?: number;
    businesses?: { name?: string } | null;
  } | null;
};

function ApplicationsInner() {
  const [applications, setApplications] = useState<ApplicationRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/jobs/my-applications');
        const json = await res.json();
        if (!cancelled && res.ok) {
          setApplications(json.data || []);
        }
      } catch {
        /* ignore */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const statusBadge = (status: string) => {
    const s = (status || 'pending').toLowerCase();
    if (s === 'shortlisted' || s === 'accepted' || s === 'hired') {
      return (
        <Badge variant="success" className="gap-1">
          <CheckCircle className="w-3 h-3" /> {status}
        </Badge>
      );
    }
    if (s === 'rejected') {
      return (
        <Badge variant="destructive" className="gap-1">
          <XCircle className="w-3 h-3" /> Rejected
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="gap-1">
        <Clock className="w-3 h-3" /> {status || 'Under review'}
      </Badge>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 px-4">
      <PageHeader
        title="My Job Applications Tracker"
        description="Track the status of your submitted resumes with Kozhikode employers."
        icon={<Briefcase className="w-6 h-6" />}
        breadcrumbs={[
          { label: 'Account', href: '/account' },
          { label: 'My Applications' },
        ]}
      />

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-[#6B7280]">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading applications…
        </div>
      ) : applications.length === 0 ? (
        <Card className="p-10 text-center space-y-3 border border-[#E5E7EB]">
          <Briefcase className="w-10 h-10 text-[#D1D5DB] mx-auto" />
          <p className="font-semibold text-[#111827]">No applications yet</p>
          <p className="text-sm text-[#6B7280]">Browse open roles and apply — they will show up here.</p>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1 text-sm font-bold text-[#2563EB] hover:underline"
          >
            Browse jobs <ArrowRight className="w-4 h-4" />
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const job = app.jobs;
            const company = job?.businesses?.name || 'Employer';
            const salary =
              job?.salary_min || job?.salary_max
                ? `₹${job?.salary_min ?? '—'} – ₹${job?.salary_max ?? '—'} / mo`
                : 'Salary not listed';

            return (
              <Card
                key={app.id}
                className="p-5 border border-[#E5E7EB] bg-white space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="text-base font-bold text-[#111827]">
                      {job?.title || 'Job posting'}
                    </h4>
                    <p className="text-xs text-[#6B7280]">
                      {company} • {salary}
                    </p>
                  </div>
                  {statusBadge(app.status)}
                </div>

                <div className="pt-2 border-t border-[#F3F4F6] flex items-center justify-between text-xs text-[#6B7280]">
                  <span>
                    Applied on{' '}
                    {new Date(app.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                  {job?.slug ? (
                    <Link
                      href={`/jobs/${job.slug}`}
                      className="font-semibold text-[#2563EB] hover:underline flex items-center gap-1"
                    >
                      View posting <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : null}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function MyApplicationsPage() {
  return (
    <ProtectedRoute>
      <ApplicationsInner />
    </ProtectedRoute>
  );
}
