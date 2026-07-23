'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/shared/page-header';
import { UniversalSearch } from '@/components/shared/universal-search';
import { JobCard } from '@/components/cards/job-card';
import { ResponsiveGrid } from '@/components/layout/responsive-grid';
import { Pagination } from '@/components/shared/pagination';
import { ListSkeleton } from '@/components/shared/loading-skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/Select';
import { Container } from '@/components/layout/container';
import { SectionTitle } from '@/components/shared/section-title';
import { useJobs } from '@/hooks/use-jobs';
import { Briefcase, BookmarkCheck, SlidersHorizontal } from 'lucide-react';
import type { Job } from '@/lib/types/api.types';

const JOB_TYPES = ['All Types', 'Full Time', 'Part Time', 'Contract', 'Walk-In', 'Internship'];
const JOB_CATEGORIES = ['All Categories', 'IT & Technology', 'Healthcare', 'Retail', 'Hospitality', 'Education', 'Finance'];

export default function JobsPage() {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [jobType, setJobType] = useState('');
  const [category, setCategory] = useState('');
  const LIMIT = 9;

  const { data, isLoading, isError, refetch } = useJobs({
    page, limit: LIMIT,
    q: q || undefined,
    jobType: jobType || undefined,
    category: category || undefined,
  });

  const jobs = (data?.data as Job[] | undefined) ?? [];
  const total = data?.meta?.total ?? 0;

  return (
    <Container className="py-8 sm:py-12 space-y-8">
      <PageHeader
        title="Kozhikode Employment & Jobs Portal"
        description="Software openings at Cyberpark, retail walk-ins, hospital clinical vacancies & local shop hiring."
        icon={<Briefcase className="w-6 h-6" />}
        breadcrumbs={[{ label: 'Jobs & Careers' }]}
        action={
          <div className="flex items-center gap-2">
            <Link href="/jobs/saved">
              <Button variant="outline" size="sm" className="gap-1.5 h-[40px] px-4 rounded-2xl">
                <BookmarkCheck className="w-4 h-4 text-[#2563EB]" /> Saved Jobs
              </Button>
            </Link>
            <Link href="/applications">
              <Button size="sm" className="h-[40px] px-5 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold">
                My Applications
              </Button>
            </Link>
          </div>
        }
      />

      <div className="space-y-4">
        <UniversalSearch
          placeholder="Search job title, Cyberpark company, or skill..."
          onSearch={(val) => { setQ(val); setPage(1); }}
        />
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB] text-xs text-[#111827]">
            <SlidersHorizontal className="w-4 h-4 text-[#2563EB]" />
            <span className="font-bold">Job Type:</span>
            <Select value={jobType} onChange={(e) => { setJobType(e.target.value === 'All Types' ? '' : e.target.value); setPage(1); }} className="border-none bg-transparent h-7 py-0 text-xs font-semibold focus:ring-0 shadow-none">
              {JOB_TYPES.map((t) => <option key={t}>{t}</option>)}
            </Select>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB] text-xs text-[#111827]">
            <span className="font-bold">Category:</span>
            <Select value={category} onChange={(e) => { setCategory(e.target.value === 'All Categories' ? '' : e.target.value); setPage(1); }} className="border-none bg-transparent h-7 py-0 text-xs font-semibold focus:ring-0 shadow-none">
              {JOB_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </Select>
          </div>
          {(q || jobType || category) && (
            <Button variant="outline" size="sm" onClick={() => { setQ(''); setJobType(''); setCategory(''); setPage(1); }} className="h-[36px] rounded-xl text-xs">
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <SectionTitle
          title={isLoading ? 'Loading vacancies…' : `${total.toLocaleString()} active vacancies`}
          subtitle={q ? `Showing results for "${q}"` : 'Cyberpark & Kozhikode local job listings'}
        />

        {isLoading && <ListSkeleton count={LIMIT} cols={3} />}

        {isError && (
          <ErrorState title="Could not load jobs" description="Something went wrong while fetching job listings." onRetry={() => refetch()} />
        )}

        {!isLoading && !isError && jobs.length === 0 && (
          <EmptyState title="No jobs found" description={q ? `No results matching "${q}".` : 'No vacancies listed yet.'} />
        )}

        {!isLoading && !isError && jobs.length > 0 && (
          <ResponsiveGrid cols={3}>
            {jobs.map((j) => (
              <JobCard
                key={j.id}
                slug={j.slug}
                title={j.title}
                company={j.company_name || ''}
                location={j.location || j.area || ''}
                jobType={j.job_type || ''}
                salary={j.salary_display || (j.salary_min ? `₹${j.salary_min.toLocaleString()} / mo` : '')}
              />
            ))}
          </ResponsiveGrid>
        )}

        <Pagination page={page} total={total} limit={LIMIT} onPageChange={setPage} />
      </div>
    </Container>
  );
}
