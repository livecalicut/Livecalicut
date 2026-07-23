import React from 'react';
import { SettingsService } from '@/lib/services/settings.service';
import { HeroEditor } from './hero-editor';
import { MetricsEditor } from './metrics-editor';
import { TestimonialsEditor } from './testimonials-editor';
import { PartnersEditor } from './partners-editor';
import { LayoutTemplate, PlaySquare, ListChecks, Users } from 'lucide-react';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminHeader } from '@/components/admin/admin-header';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CMSDashboardPage() {
  const cmsData = await SettingsService.getSetting('cms');
  const heroData = cmsData?.hero || {};

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#111827]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Landing Page CMS' }]} />

        <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight font-sans">Landing Page CMS</h1>
              <p className="text-sm text-[#6B7280] mt-1">Update website content dynamically without writing code.</p>
            </div>
          </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="surface-card p-4 rounded-xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <LayoutTemplate className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-[#6B7280] font-bold uppercase">Hero Block</p>
            <p className="text-lg font-bold">Active</p>
          </div>
        </div>
        <div className="surface-card p-4 rounded-xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <PlaySquare className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-[#6B7280] font-bold uppercase">Background</p>
            <p className="text-lg font-bold">Video Loop</p>
          </div>
        </div>
        <div className="surface-card p-4 rounded-xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
            <ListChecks className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-[#6B7280] font-bold uppercase">Live Metrics</p>
            <p className="text-lg font-bold">{cmsData?.metrics?.length || 4} Cards</p>
          </div>
        </div>
        <div className="surface-card p-4 rounded-xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-[#6B7280] font-bold uppercase">Testimonials</p>
            <p className="text-lg font-bold">{cmsData?.testimonials?.length || 3} Stories</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Hero Section Editor */}
        <div className="surface-card p-6 rounded-xl space-y-6">
          <div className="border-b border-[#E5E7EB] pb-4">
            <h2 className="text-lg font-bold text-[#111827]">Hero Banner Settings</h2>
            <p className="text-sm text-[#6B7280]">Edit the main title, subtitle, and background video of the landing page.</p>
          </div>
          <HeroEditor initialData={heroData} />
        </div>
        
        {/* Metrics Editor */}
        <div className="surface-card p-6 rounded-xl space-y-6">
           <div className="border-b border-[#E5E7EB] pb-4">
            <h2 className="text-lg font-bold text-[#111827]">Live Metrics Settings</h2>
            <p className="text-sm text-[#6B7280]">Update the statistics and data points shown on the homepage.</p>
          </div>
          <MetricsEditor initialData={cmsData?.metrics || []} />
        </div>

        {/* Testimonials Editor */}
        <div className="surface-card p-6 rounded-xl space-y-6">
           <div className="border-b border-[#E5E7EB] pb-4">
            <h2 className="text-lg font-bold text-[#111827]">Testimonials Settings</h2>
            <p className="text-sm text-[#6B7280]">Manage user reviews and success stories.</p>
          </div>
          <TestimonialsEditor initialData={cmsData?.testimonials || []} />
        </div>

        {/* Partners Editor */}
        <div className="surface-card p-6 rounded-xl space-y-6">
           <div className="border-b border-[#E5E7EB] pb-4">
            <h2 className="text-lg font-bold text-[#111827]">Partner Logos Settings</h2>
            <p className="text-sm text-[#6B7280]">Manage featured partners and institutions.</p>
          </div>
          <PartnersEditor initialData={cmsData?.partners || []} />
        </div>
      </div>
        </main>
      </div>
    </div>
  );
}
