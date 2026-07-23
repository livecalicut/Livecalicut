'use client';

import React, { useState } from 'react';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminHeader } from '@/components/admin/admin-header';
import { Card } from '@/components/ui/card';
import { Settings, ShieldAlert, Key, Zap, ToggleLeft, ToggleRight, Save, CheckCircle2 } from 'lucide-react';

export default function AdminSettingsPage() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [cyberparkModule, setCyberparkModule] = useState(true);
  const [aiConcierge, setAiConcierge] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#111827]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'System Settings' }]} />

        <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto max-w-4xl">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight font-sans flex items-center gap-2">
              <Settings className="w-7 h-7 text-[#2563EB]" />
              <span>Platform Governance & System Settings</span>
            </h1>
            <p className="text-sm text-[#6B7280]">Configure platform maintenance windows, active feature flags, and API credentials</p>
          </div>

          {savedSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>System configuration updated successfully!</span>
            </div>
          )}

          {/* Maintenance Mode Toggle */}
          <Card className="p-6 border border-[#E5E7EB] bg-white rounded-3xl shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="text-base font-bold text-[#111827] flex items-center gap-2 font-sans">
                  <ShieldAlert className="w-5 h-5 text-rose-600" />
                  <span>Platform Maintenance Mode</span>
                </h4>
                <p className="text-xs text-[#6B7280]">
                  When enabled, public visitors will see a scheduled maintenance banner while Super Admins maintain backend access.
                </p>
              </div>

              <button
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                className={`p-1 rounded-full transition-all ${maintenanceMode ? 'text-[#2563EB]' : 'text-[#9CA3AF]'}`}
              >
                {maintenanceMode ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10" />}
              </button>
            </div>
          </Card>

          {/* Feature Flags Module Toggles */}
          <Card className="p-6 border border-[#E5E7EB] bg-white rounded-3xl shadow-xs space-y-4">
            <h4 className="text-base font-bold text-[#111827] font-sans flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#2563EB]" />
              <span>Ecosystem Feature Flags</span>
            </h4>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB]">
                <div>
                  <p className="text-xs font-bold text-[#111827]">Cyberpark Hiring & Jobs Module</p>
                  <p className="text-[11px] text-[#6B7280]">Enable Cyberpark corporate job board and applicant submissions</p>
                </div>
                <button onClick={() => setCyberparkModule(!cyberparkModule)} className="text-[#2563EB]">
                  {cyberparkModule ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-[#9CA3AF]" />}
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB]">
                <div>
                  <p className="text-xs font-bold text-[#111827]">AI City Concierge Floating Widget</p>
                  <p className="text-[11px] text-[#6B7280]">Enable Gemini natural language search bot on homepage canvas</p>
                </div>
                <button onClick={() => setAiConcierge(!aiConcierge)} className="text-[#2563EB]">
                  {aiConcierge ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-[#9CA3AF]" />}
                </button>
              </div>
            </div>
          </Card>

          {/* API Credentials Overview */}
          <Card className="p-6 border border-[#E5E7EB] bg-white rounded-3xl shadow-xs space-y-4">
            <h4 className="text-base font-bold text-[#111827] font-sans flex items-center gap-2">
              <Key className="w-5 h-5 text-indigo-600" />
              <span>Supabase & Storage Credentials</span>
            </h4>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#111827] uppercase text-[10px] tracking-wider">Supabase API Endpoint</label>
                <input
                  type="text"
                  readOnly
                  value="https://livecalicut-supabase.co"
                  className="w-full mt-1 px-3.5 h-[38px] rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] text-[#6B7280] font-mono cursor-not-allowed"
                />
              </div>

              <div>
                <label className="font-bold text-[#111827] uppercase text-[10px] tracking-wider">Universal Search Indexing Engine</label>
                <input
                  type="text"
                  readOnly
                  value="Algolia / Sub-50ms Physical Ward Vector Index"
                  className="w-full mt-1 px-3.5 h-[38px] rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] text-[#6B7280] font-mono cursor-not-allowed"
                />
              </div>
            </div>
          </Card>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSaveSettings}
              className="px-6 h-[44px] rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs transition-all shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save System Settings
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
