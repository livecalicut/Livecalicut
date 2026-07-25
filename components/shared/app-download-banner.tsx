import React from 'react';
import { Smartphone, Download, ShieldCheck, Zap } from 'lucide-react';
export const AppDownloadBanner: React.FC = () => {
  return (
    <div className="surface-card p-8 lg:p-12 bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-white border-none shadow-xl rounded-3xl overflow-hidden relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        <div className="lg:col-span-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-md">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Official Kozhikode Companion App</span>
          </div>

          <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight font-sans">
            Carry Kozhikode in Your Pocket
          </h3>

          <p className="text-[16px] text-blue-100 max-w-2xl leading-relaxed font-normal">
            Get instant push notifications for 24/7 blood bank emergencies, live beach traffic alerts, Cyberpark walk-in interviews, and local news releases.
          </p>

          {/* The mobile apps are not published yet, so these announce rather
              than link to a /download route that does not exist. */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <span className="inline-flex h-[48px] items-center gap-2 rounded-2xl bg-white/90 px-6 text-[15px] font-bold text-[#2563EB] shadow-md">
              <Download className="h-4 w-4" aria-hidden="true" />
              <span>iOS app — coming soon</span>
            </span>
            <span className="inline-flex h-[48px] items-center gap-2 rounded-2xl bg-slate-900 px-6 text-[15px] font-bold text-white shadow-md">
              <Download className="h-4 w-4" aria-hidden="true" />
              <span>Android app — coming soon</span>
            </span>
          </div>
        </div>

        <div className="lg:col-span-4 flex justify-center lg:justify-end">
          <div className="w-48 h-64 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-4 flex flex-col justify-between shadow-2xl">
            <div className="flex items-center justify-between text-xs font-bold text-white">
              <span>LiveCalicut OS</span>
              <Zap className="w-4 h-4 text-amber-300" />
            </div>
            <div className="space-y-2 text-center my-auto">
              <ShieldCheck className="w-12 h-12 text-blue-200 mx-auto" />
              <p className="text-xs font-semibold text-white">Verified Kozhikode Platform</p>
              <p className="text-[10px] text-blue-200">21 Wards Coverage</p>
            </div>
            <div className="w-full py-2 bg-white/20 rounded-xl text-[11px] font-bold text-center text-white">
              Open App →
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
