'use client';

import React from 'react';
import { Send } from 'lucide-react';
import { SaveFavoriteButton } from '@/components/auth/save-favorite-button';
import { AuthActionButton } from '@/components/auth/auth-action-button';

interface JobDetailActionsProps {
  slug: string;
  jobId?: string;
}

export const JobDetailActions: React.FC<JobDetailActionsProps> = ({ slug, jobId }) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <SaveFavoriteButton
        kind="job"
        entityId={jobId || slug}
        slug={slug}
        label="Save Job"
        savedLabel="Saved"
      />
      <AuthActionButton
        size="sm"
        className="gap-1.5 h-[40px] px-5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold shadow-md"
        hrefWhenAuthed={`/jobs/apply/${slug}`}
        loginMessage="Sign in to apply for this job."
        pending={{ type: 'apply-job', id: slug, href: `/jobs/apply/${slug}` }}
      >
        <Send className="w-4 h-4" /> Apply Now
      </AuthActionButton>
    </div>
  );
};

export const JobApplyCta: React.FC<{ slug: string }> = ({ slug }) => (
  <AuthActionButton
    className="h-[44px] px-6 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs gap-2 shadow-md"
    hrefWhenAuthed={`/jobs/apply/${slug}`}
    loginMessage="Sign in to submit your application."
    pending={{ type: 'apply-job', id: slug, href: `/jobs/apply/${slug}` }}
  >
    <Send className="w-4 h-4" /> Submit Resume Application
  </AuthActionButton>
);
