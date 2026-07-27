import React from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { SalaryBadge, UrgentBadge, FeaturedBadge } from '@/components/jobs/salary-badge';
import { Card } from '@/components/ui/card';
import { MapPin, Briefcase, Calendar } from 'lucide-react';
import { JobDetailActions, JobApplyCta } from '@/components/jobs/job-detail-actions';

export default async function JobDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const job = {
    title: slug ? slug.replace(/-/g, ' ').toUpperCase() : 'SENIOR REACT & FULLSTACK ENGINEER',
    company: 'Cyberpark Software Solutions',
    companySlug: 'cyberpark-software-solutions',
    location: 'Cyberpark Phase 1, Nellikode, Calicut',
    employmentType: 'Full Time',
    salary: '₹65,000 - ₹95,000 / mo',
    experience: '3 - 5 Years Experience',
    openings: 4,
    isUrgent: true,
    isFeatured: true,
    description: `
      Cyberpark Software Solutions is seeking an experienced Senior React & Fullstack Engineer to join our growing product engineering team in Hilite Cyberpark cluster, Kozhikode.
    `,
    responsibilities: `
      • Develop scalable Web & Next.js applications
      • Collaborate with backend engineers to integrate Supabase & REST APIs
      • Perform code reviews and guide junior frontend developers
    `,
    requirements: `
      • 3+ years experience with Next.js, TypeScript & React
      • Strong understanding of SQL databases and REST APIs
      • Based in Kozhikode or willing to relocate to Cyberpark hub
    `,
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    employmentType: 'FULL_TIME',
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company,
      sameAs: 'https://cyberparkkerala.org',
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Kozhikode',
        addressRegion: 'Kerala',
        addressCountry: 'IN',
      },
    },
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      {/* JobPosting Schema.org Structured Metadata */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHeader
        title={job.title}
        description={`${job.company} • ${job.location}`}
        icon={<Briefcase className="w-6 h-6 text-[#2563EB]" />}
        breadcrumbs={[
          { label: 'Jobs & Careers', href: '/jobs' },
          { label: 'Job Opening' },
        ]}
        action={<JobDetailActions slug={slug} />}
      />

      {/* Hero Salary & Status Card */}
      <Card className="p-6 border border-[#E5E7EB] bg-white rounded-3xl shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E7EB] pb-4">
          <div className="flex items-center gap-2">
            <SalaryBadge amount={job.salary} />
            {job.isUrgent && <UrgentBadge />}
            {job.isFeatured && <FeaturedBadge />}
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {job.openings} Open Positions
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium text-[#4B5563]">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[#2563EB] shrink-0" />
            <span>Type: <strong className="text-[#111827]">{job.employmentType}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#2563EB] shrink-0" />
            <span>Experience: <strong className="text-[#111827]">{job.experience}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#2563EB] shrink-0" />
            <span className="truncate">Location: <strong className="text-[#111827]">{job.location}</strong></span>
          </div>
        </div>
      </Card>

      {/* Job Description & Requirements */}
      <Card className="p-6 sm:p-8 border border-[#E5E7EB] bg-white rounded-3xl shadow-xs space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-[#111827] font-sans">Role Overview</h3>
          <p className="text-sm text-[#4B5563] leading-relaxed">
            {job.description}
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-bold text-[#111827] font-sans">Key Responsibilities</h3>
          <pre className="text-xs sm:text-sm text-[#4B5563] font-sans leading-relaxed whitespace-pre-line">
            {job.responsibilities}
          </pre>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-bold text-[#111827] font-sans">Candidate Requirements</h3>
          <pre className="text-xs sm:text-sm text-[#4B5563] font-sans leading-relaxed whitespace-pre-line">
            {job.requirements}
          </pre>
        </div>

        <div className="pt-4 border-t border-[#E5E7EB]">
          <JobApplyCta slug={slug} />
        </div>
      </Card>
    </div>
  );
}
