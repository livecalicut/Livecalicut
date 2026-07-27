'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/shared/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useJobApply } from '@/hooks/use-jobs';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { toast } from '@/lib/toast';
import { Briefcase, Send, CheckCircle, Loader2, LogIn, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function JobApplyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const applyMutation = useJobApply();
  const { user, profile, isLoading, isAuthenticated, requireAuth } = useRequireAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      requireAuth({
        next: `/jobs/apply/${slug}`,
        pending: { type: 'apply-job', id: slug, href: `/jobs/apply/${slug}` },
        message: 'Sign in to apply for this job.',
      });
      return;
    }
    if (profile?.full_name) setFullName((prev) => prev || profile.full_name);
    if (user?.email || profile?.email) setEmail((prev) => prev || user?.email || profile?.email || '');
    if (profile?.phone) setPhone((prev) => prev || profile.phone || '');
  }, [isLoading, isAuthenticated, profile, requireAuth, slug, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const ok = requireAuth({
      next: `/jobs/apply/${slug}`,
      message: 'Sign in to submit your application.',
    });
    if (!ok) return;

    if (!fullName || !email || !phone || !resumeUrl) {
      toast.error('Validation Error', 'Please complete all required fields.');
      return;
    }

    try {
      await applyMutation.mutateAsync({
        slug,
        payload: {
          slug,
          full_name: fullName,
          email,
          phone,
          resume_url: resumeUrl,
          cover_letter: coverLetter,
        },
      });

      toast.success('Application Sent!', 'Employer hiring desk has received your resume.');
      setSubmitted(true);
      setTimeout(() => {
        router.push('/applications');
      }, 2000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Could not send job application.';
      if (message.toLowerCase().includes('auth') || message.includes('401')) {
        toast.info('Login required', 'Sign in again to submit your application.');
        router.push(`/login?next=${encodeURIComponent(`/jobs/apply/${slug}`)}`);
        return;
      }
      toast.error('Submission Failed', message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-2 text-sm text-[#6B7280]">
        <Loader2 className="h-5 w-5 animate-spin text-[#2563EB]" />
        Checking your session…
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-xl space-y-6 py-16 text-center">
        <Card className="space-y-4 rounded-3xl border border-amber-200 bg-amber-50/50 p-8 shadow-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-300 bg-amber-100 text-amber-700">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <h3 className="font-sans text-2xl font-extrabold text-[#111827]">Login required to apply</h3>
            <p className="text-sm text-[#4B5563]">
              Sign in with your LiveCalicut account to submit a resume. Guests cannot apply.
            </p>
          </div>
          <Link href={`/login?next=${encodeURIComponent(`/jobs/apply/${slug}`)}`}>
            <Button className="mt-2 h-[44px] gap-2 rounded-xl bg-[#2563EB] px-6 font-bold text-white hover:bg-[#1D4ED8]">
              <LogIn className="h-4 w-4" /> Sign In to Continue
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 py-4">
      <PageHeader
        title="Submit Candidate Application"
        description="Apply directly to employer hiring desk in Kozhikode."
        icon={<Briefcase className="h-6 w-6" />}
        breadcrumbs={[
          { label: 'Jobs', href: '/jobs' },
          { label: 'Application Form' },
        ]}
      />

      {submitted ? (
        <Card className="space-y-4 border border-emerald-200 bg-emerald-50/50 p-8 text-center">
          <CheckCircle className="mx-auto h-12 w-12 animate-bounce text-emerald-500" />
          <h3 className="text-xl font-bold text-[#111827]">Application Submitted!</h3>
          <p className="text-xs text-[#4B5563]">
            Your resume has been forwarded to the hiring manager. Redirecting to My Applications…
          </p>
        </Card>
      ) : (
        <form onSubmit={handleSubmit}>
          <Card className="space-y-4 border border-[#E5E7EB] bg-white p-6">
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#374151]">Full Name *</label>
              <Input
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g., Arjun Nair"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-[#374151]">
                Contact Phone Number *
              </label>
              <Input
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-[#374151]">Email Address *</label>
              <Input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="arjun@example.com"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-[#374151]">
                Resume / PDF Portfolio URL *
              </label>
              <Input
                required
                type="url"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                placeholder="https://drive.google.com/your-resume.pdf"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-[#374151]">
                Cover Letter / Intro Note
              </label>
              <Textarea
                rows={3}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Briefly state your relevant experience and notice period..."
              />
            </div>

            <Button type="submit" disabled={applyMutation.isPending} className="w-full gap-2">
              {applyMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Submitting Application...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" /> Confirm & Send Application
                </>
              )}
            </Button>
          </Card>
        </form>
      )}
    </div>
  );
}
