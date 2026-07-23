'use client';

import React, { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/shared/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useJobApply } from '@/hooks/use-jobs';
import { toast } from '@/lib/toast';
import { Briefcase, Send, CheckCircle, Loader2 } from 'lucide-react';

export default function JobApplyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const applyMutation = useJobApply();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !email || !phone || !resumeUrl) {
      toast.error('Validation Error', 'Please complete all required fields.');
      return;
    }

    try {
      await applyMutation.mutateAsync({
        slug,
        payload: {
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
    } catch (err: any) {
      toast.error('Submission Failed', err.message || 'Could not send job application.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-4">
      <PageHeader
        title="Submit Candidate Application"
        description="Apply directly to employer hiring desk in Kozhikode."
        icon={<Briefcase className="w-6 h-6" />}
        breadcrumbs={[
          { label: 'Jobs', href: '/jobs' },
          { label: 'Application Form' },
        ]}
      />

      {submitted ? (
        <Card className="p-8 text-center space-y-4 border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20">
          <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Application Submitted!</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Your resume has been forwarded directly to the hiring manager. Redirecting to My Applications tracker...
          </p>
        </Card>
      ) : (
        <form onSubmit={handleSubmit}>
          <Card className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name *
              </label>
              <Input
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g., Arjun Nair"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
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
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address *
              </label>
              <Input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="arjun@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
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
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
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
                  <Loader2 className="w-4 h-4 animate-spin" /> Submitting Application...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Confirm & Send Application
                </>
              )}
            </Button>
          </Card>
        </form>
      )}
    </div>
  );
}
