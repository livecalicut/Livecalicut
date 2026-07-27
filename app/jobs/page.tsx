'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { UniversalSearch } from '@/components/shared/universal-search';
import { JobCard } from '@/components/cards/job-card';
import { ResponsiveGrid } from '@/components/layout/responsive-grid';
import { Pagination } from '@/components/shared/pagination';
import { ListSkeleton } from '@/components/shared/loading-skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/container';
import { SectionTitle } from '@/components/shared/section-title';
import { LocationSelect } from '@/components/shared/location-select';
import { FilterSelect } from '@/components/shared/filter-select';
import { useJobs } from '@/hooks/use-jobs';
import { ALL_LOCATIONS_LABEL } from '@/config/constants';
import { AuthGateLink } from '@/components/auth/auth-gate-link';
import { Briefcase, BookmarkCheck, Tag, Building2, ShoppingBag, Calendar, Search } from 'lucide-react';
import type { Job } from '@/lib/types/api.types';

const JOB_TYPES = [
  'All Types',
  'Full Time',
  'Part Time',
  'Contract',
  'Walk-In',
  'Internship',
  'Freelance',
  'Temporary',
];

const JOB_CATEGORIES = [
  'All Categories',
  'IT & Technology',
  'Healthcare',
  'Retail',
  'Hospitality',
  'Education',
  'Finance',
  'Sales & Marketing',
  'Customer Support',
  'Logistics',
  'Construction',
  'Media & Design',
];

export default function JobsPage() {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [jobType, setJobType] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState(ALL_LOCATIONS_LABEL);
  const LIMIT = 9;

  const { data, isLoading, isError, refetch } = useJobs({
    page, limit: LIMIT,
    q: q || undefined,
    jobType: jobType || undefined,
    category: category || undefined,
  });

  const allJobs = (data?.data as Job[] | undefined) ?? [];
  const areaFilter = location !== ALL_LOCATIONS_LABEL ? location.toLowerCase() : '';
  const jobs = areaFilter
    ? allJobs.filter((j) =>
        `${j.area || ''} ${j.location || ''}`.toLowerCase().includes(areaFilter)
      )
    : allJobs;
  const total = areaFilter ? jobs.length : data?.meta?.total ?? allJobs.length;
  const hasFilters = Boolean(q || jobType || category || areaFilter);

  return (
    <Container className="py-8 sm:py-12 space-y-8">
      <PageHeader
        title="Kozhikode Employment & Jobs Portal"
        description="Software openings at Cyberpark, retail walk-ins, hospital clinical vacancies & local shop hiring."
        icon={<Briefcase className="w-6 h-6" />}
        breadcrumbs={[{ label: 'Jobs & Careers' }]}
        action={
          <div className="flex items-center gap-2">
            <AuthGateLink
              href="/jobs/saved"
              loginMessage="Sign in to view your saved jobs."
              pending={{ type: 'custom', href: '/jobs/saved' }}
            >
              <Button variant="outline" size="sm" className="gap-1.5 h-[40px] px-4 rounded-2xl">
                <BookmarkCheck className="w-4 h-4 text-[#2563EB]" /> Saved Jobs
              </Button>
            </AuthGateLink>
            <AuthGateLink
              href="/applications"
              loginMessage="Sign in to track your job applications."
              pending={{ type: 'custom', href: '/applications' }}
            >
              <Button size="sm" className="h-[40px] px-5 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold">
                My Applications
              </Button>
            </AuthGateLink>
          </div>
        }
      />

      <div className="space-y-4">
        <UniversalSearch
          placeholder="Search job title, Cyberpark company, or skill..."
          onSearch={(val) => { setQ(val); setPage(1); }}
        />
        <div className="flex flex-wrap items-center gap-3">
          <FilterSelect
            compact
            label="Job type"
            icon={Briefcase}
            placeholder="All Types"
            searchPlaceholder="Search job type…"
            value={jobType || 'All Types'}
            options={JOB_TYPES}
            onChange={(val) => {
              setJobType(val === 'All Types' ? '' : val);
              setPage(1);
            }}
          />
          <FilterSelect
            compact
            label="Category"
            icon={Tag}
            placeholder="All Categories"
            searchPlaceholder="Search category…"
            value={category || 'All Categories'}
            options={JOB_CATEGORIES}
            onChange={(val) => {
              setCategory(val === 'All Categories' ? '' : val);
              setPage(1);
            }}
          />
          <LocationSelect
            compact
            value={location}
            onChange={(val) => { setLocation(val); setPage(1); }}
          />
          {hasFilters && (
            <Button variant="outline" size="sm" onClick={() => { setQ(''); setJobType(''); setCategory(''); setLocation(ALL_LOCATIONS_LABEL); setPage(1); }} className="h-[36px] rounded-xl text-xs">
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
          <EmptyState
            title={q ? `No jobs for “${q}”` : 'No vacancies listed yet'}
            description={
              q
                ? 'Try another keyword, or explore businesses and marketplace while hiring picks up.'
                : 'New Cyberpark and local openings will show up here as employers post roles.'
            }
            actionLabel={q ? 'Clear search' : 'Browse businesses'}
            actionHref={q ? undefined : '/business'}
            onAction={q ? () => { setQ(''); setPage(1); } : undefined}
            hooks={[
              { href: '/business', label: 'Browse businesses', description: 'Companies hiring in Kozhikode', icon: Building2 },
              { href: '/marketplace', label: 'Marketplace', description: 'Side gigs & classifieds', icon: ShoppingBag },
              { href: '/events', label: 'Career events', description: 'Walk-ins & meetups', icon: Calendar },
              { href: '/search', label: 'Universal search', description: 'Search across the city OS', icon: Search },
            ]}
          />
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
