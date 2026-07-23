import { PageHeader } from '@/components/shared/page-header';
import { JobCard } from '@/components/cards/job-card';
import { ResponsiveGrid } from '@/components/layout/responsive-grid';
import { BookmarkCheck } from 'lucide-react';

export default function SavedJobsPage() {
  return (
    <div className="space-y-8 py-4">
      <PageHeader
        title="Saved Jobs & Bookmarks"
        description="Bookmarked vacancies saved for future application."
        icon={<BookmarkCheck className="w-6 h-6" />}
        breadcrumbs={[
          { label: 'Jobs & Careers', href: '/jobs' },
          { label: 'Saved Jobs' },
        ]}
      />

      <ResponsiveGrid cols={3}>
        <JobCard
          title="Senior React & Fullstack Engineer"
          company="Cyberpark Software Solutions"
          location="Cyberpark Phase 1, Calicut"
          jobType="Full Time"
          salary="₹65,000 - ₹95,000 / mo"
        />
      </ResponsiveGrid>
    </div>
  );
}
