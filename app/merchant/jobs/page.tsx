'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MerchantSidebar } from '@/components/merchant/merchant-sidebar';
import { MerchantHeader } from '@/components/merchant/merchant-header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Plus, Search, Users, ExternalLink, CheckCircle2, XCircle, Calendar, MessageSquare } from 'lucide-react';

export default function MerchantJobsPage() {
  const [activeTab, setActiveTab] = useState<'openings' | 'applicants'>('openings');

  const [jobListings, setJobListings] = useState([
    { id: '1', title: 'Head Culinary Chef (Malabar Cuisine)', type: 'Full Time', salary: '₹35,000 - ₹45,000 / mo', applicantsCount: 14, status: 'Active' },
    { id: '2', title: 'Cyberpark Fullstack React Engineer', type: 'Full Time (Cyberpark)', salary: '₹65,000 - ₹95,000 / mo', applicantsCount: 28, status: 'Active' },
  ]);

  const [applicants, setApplicants] = useState([
    { id: 'app-1', candidateName: 'Arjun Nair', position: 'Cyberpark Fullstack React Engineer', email: 'arjun@example.com', phone: '+91 98765 43210', experience: '4 Years', resumeUrl: 'https://drive.google.com/resume.pdf', status: 'Shortlisted' },
    { id: 'app-2', candidateName: 'Fayiz K.', position: 'Head Culinary Chef (Malabar Cuisine)', email: 'fayiz@example.com', phone: '+91 98470 12345', experience: '6 Years', resumeUrl: 'https://drive.google.com/resume2.pdf', status: 'Applied' },
    { id: 'app-3', candidateName: 'Deepa V.', position: 'Cyberpark Fullstack React Engineer', email: 'deepa@example.com', phone: '+91 94471 99887', experience: '3 Years', resumeUrl: 'https://drive.google.com/resume3.pdf', status: 'Interview Scheduled' },
  ]);

  const updateCandidateStatus = (id: string, newStatus: string) => {
    setApplicants(applicants.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#111827]">
      <MerchantSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <MerchantHeader breadcrumbs={[{ label: 'Merchant Workspace', href: '/merchant' }, { label: 'Jobs Recruitment Desk' }]} />

        <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight font-sans flex items-center gap-2">
                <Briefcase className="w-7 h-7 text-[#2563EB]" />
                <span>Merchant Recruitment & Hiring Desk</span>
              </h1>
              <p className="text-sm text-[#6B7280]">Manage Cyberpark & local vacancies, review candidate resumes, and schedule candidate interviews</p>
            </div>

            <Link href="/merchant/jobs/create">
              <button className="h-[40px] px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 shrink-0">
                <Plus className="w-4 h-4" /> Create Vacancy
              </button>
            </Link>
          </div>

          {/* Pipeline Switch Tabs */}
          <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-3 text-xs font-bold">
            <button
              onClick={() => setActiveTab('openings')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === 'openings' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#6B7280] hover:bg-white'
              }`}
            >
              Active Job Postings ({jobListings.length})
            </button>
            <button
              onClick={() => setActiveTab('applicants')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === 'applicants' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#6B7280] hover:bg-white'
              }`}
            >
              Candidate Pipeline ({applicants.length})
            </button>
          </div>

          {/* Tab 1: Job Postings */}
          {activeTab === 'openings' && (
            <div className="space-y-4">
              {jobListings.map((j) => (
                <Card key={j.id} className="p-5 border border-[#E5E7EB] bg-white rounded-2xl shadow-xs flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-[#111827] font-sans">{j.title}</h4>
                    <p className="text-xs text-[#6B7280]">{j.type} • <strong className="text-[#2563EB]">{j.salary}</strong></p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-bold border border-blue-200">
                      {j.applicantsCount} Applicants
                    </span>
                    <button className="px-3 py-1.5 rounded-xl border border-[#E5E7EB] text-xs font-bold text-[#6B7280]">
                      Close Vacancy
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Tab 2: Applicants Recruitment Pipeline */}
          {activeTab === 'applicants' && (
            <Card className="p-0 border border-[#E5E7EB] bg-white rounded-3xl shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC] text-[11px] font-extrabold text-[#6B7280] uppercase tracking-wider">
                      <th className="py-3.5 px-6">Candidate / Position</th>
                      <th className="py-3.5 px-4">Contact Info</th>
                      <th className="py-3.5 px-4">Experience</th>
                      <th className="py-3.5 px-4">Recruitment Stage</th>
                      <th className="py-3.5 px-6 text-right">Resume / Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB] text-xs">
                    {applicants.map((a) => (
                      <tr key={a.id} className="hover:bg-[#F8FAFC] transition-colors">
                        <td className="py-4 px-6 font-semibold">
                          <p className="font-bold text-[#111827] font-sans">{a.candidateName}</p>
                          <p className="text-[11px] text-[#6B7280]">{a.position}</p>
                        </td>
                        <td className="py-4 px-4 text-[#4B5563]">
                          <p className="font-mono">{a.phone}</p>
                          <p className="text-[11px] text-[#6B7280]">{a.email}</p>
                        </td>
                        <td className="py-4 px-4 font-bold text-[#111827]">{a.experience}</td>
                        <td className="py-4 px-4">
                          <select
                            value={a.status}
                            onChange={(e) => updateCandidateStatus(a.id, e.target.value)}
                            className="h-[32px] px-2.5 rounded-lg border border-[#E5E7EB] bg-white text-xs font-bold text-[#111827]"
                          >
                            <option value="Applied">Applied</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Interview Scheduled">Interview Scheduled</option>
                            <option value="Hired">Hired</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <a
                            href={a.resumeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E5E7EB] hover:border-[#2563EB] text-[#2563EB] text-xs font-bold transition-all"
                          >
                            <span>View Resume PDF</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
