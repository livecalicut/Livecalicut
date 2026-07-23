'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '@/components/shared/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/textarea';
import { jobsApi } from '@/lib/services/api-client';
import { useAuthStore } from '@/src/store/useAuthStore';
import { toast } from '@/lib/toast';
import { Briefcase, PlusCircle, CheckCircle, Loader2, LogIn, ShieldAlert } from 'lucide-react';

export default function CreateJobPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, profile } = useAuthStore();

  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [category, setCategory] = useState('Technology');
  const [employmentType, setEmploymentType] = useState('full-time');
  const [experience, setExperience] = useState('1-3 Years');
  const [salary, setSalary] = useState('');
  const [description, setDescription] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Auth Guard
  if (!user && !profile) {
    return (
      <div className="max-w-xl mx-auto py-16 space-y-6 text-center">
        <Card className="p-8 border border-amber-200 bg-amber-50/50 rounded-3xl shadow-xl space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 mx-auto">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-extrabold text-[#111827] font-sans">Login Required to Post Vacancies</h3>
            <p className="text-xs sm:text-sm text-[#4B5563]">
              Only authenticated businesses and corporate recruiters can post jobs on LiveCalicut.
            </p>
          </div>
          <Link href="/login?next=/merchant/jobs/create">
            <Button className="h-[44px] px-6 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold gap-2 shadow-md mt-2">
              <LogIn className="w-4 h-4" /> Sign In / Register First
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !company || !category) {
      toast.error('Validation Error', 'Please fill in mandatory fields.');
      return;
    }

    try {
      setSubmitting(true);
      await jobsApi.create({
        title,
        company,
        category,
        employment_type: employmentType,
        experience,
        salary,
        description,
        requirements: []
      } as any);

      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job Listed!', 'Your vacancy is live on Calicut Jobs.');
      setSubmitted(true);
      setTimeout(() => {
        router.push('/merchant/jobs');
      }, 2000);
    } catch (err: any) {
      toast.error('Post Failed', err.message || 'Could not publish job.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-4">
      <PageHeader
        title="Post a Job Vacancy"
        description="Hire candidates from Calicut & Cyberpark."
        icon={<Briefcase className="w-6 h-6" />}
        breadcrumbs={[
          { label: 'Jobs Workspace', href: '/merchant/jobs' },
          { label: 'Create Vacancy' },
        ]}
      />

      {submitted ? (
        <Card className="p-8 text-center space-y-4 border border-emerald-200 bg-emerald-50/50 rounded-3xl shadow-xl">
          <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
          <h3 className="text-xl font-bold text-[#111827]">Job Listing Published!</h3>
          <p className="text-xs text-[#6B7280]">
            Your vacancy is live on Kozhikode Job Board. Redirecting to workspace...
          </p>
        </Card>
      ) : (
        <form onSubmit={handleSubmit}>
          <Card className="p-6 border border-[#E5E7EB] bg-white rounded-3xl space-y-4 shadow-xs">
            <div>
              <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1">
                Job Title *
              </label>
              <Input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Senior React Engineer"
                className="h-[44px] rounded-xl border-[#E5E7EB] text-[#111827] font-bold"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1">
                Company Name *
              </label>
              <Input
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g., LiveCalicut IT Solutions"
                className="h-[44px] rounded-xl border-[#E5E7EB] text-[#111827] font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1">
                Category *
              </label>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-[44px] text-xs rounded-xl border-[#E5E7EB] text-[#111827] font-semibold"
              >
                <option value="Technology">Technology & IT</option>
                <option value="Hospitality">Hospitality & Dining</option>
                <option value="Healthcare">Healthcare & Medicine</option>
                <option value="Sales">Sales & Marketing</option>
                <option value="Education">Education</option>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1">
                  Employment Type *
                </label>
                <Select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                  className="w-full h-[44px] text-xs rounded-xl border-[#E5E7EB] text-[#111827] font-semibold"
                >
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="freelance">Freelance</option>
                </Select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1">
                  Experience Required
                </label>
                <Select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full h-[44px] text-xs rounded-xl border-[#E5E7EB] text-[#111827] font-semibold"
                >
                  <option value="Fresher">Fresher</option>
                  <option value="1-3 Years">1-3 Years</option>
                  <option value="3-5 Years">3-5 Years</option>
                  <option value="5+ Years">5+ Years</option>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1">
                Monthly Salary Range (Optional)
              </label>
              <Input
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="e.g., ₹25,000 - ₹35,000"
                className="h-[44px] rounded-xl border-[#E5E7EB] text-[#111827]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1">
                Job Description & Requirements *
              </label>
              <Textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide detailed responsibilities and candidate requirements..."
                className="rounded-xl border-[#E5E7EB] text-[#111827]"
              />
            </div>

            <Button type="submit" disabled={submitting} className="w-full h-[48px] rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold gap-2 shadow-md">
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Publishing Job...
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" /> Publish Job Vacancy
                </>
              )}
            </Button>
          </Card>
        </form>
      )}
    </div>
  );
}
