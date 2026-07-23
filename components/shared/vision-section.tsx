import React from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, Globe2 } from 'lucide-react';
import Link from 'next/link';

export const VisionSection: React.FC = () => {
  const pillars = [
    {
      title: 'Hyperlocal Trust & Verification',
      description: 'Every business, hospital, and job opening is physical-checked in Kozhikode to ensure zero fraud.',
      icon: ShieldCheck,
    },
    {
      title: 'Realtime Civic Connectivity',
      description: 'Sub-second search engine connecting residents directly with Cyberpark recruiters & local merchants.',
      icon: Zap,
    },
    {
      title: 'Unified Malabar Digital Infrastructure',
      description: 'One single digital account powering business directory, classifieds, events, and emergency helplines.',
      icon: Globe2,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
      {/* Left Manifesto Column */}
      <div className="lg:col-span-6 space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-[#2563EB]">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Our Vision & Mission</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#111827] leading-[1.15] tracking-tight font-sans">
          Building the Digital Backbone for Kozhikode’s Future
        </h2>

        <p className="text-[16px] text-[#6B7280] leading-relaxed font-normal">
          For centuries, Kozhikode has been the legendary City of Spices and Malabar trade. LiveCalicut evolves this heritage into a modern Digital Operating System—unifying commerce, employment, news, and public safety into one intuitive civic engine.
        </p>

        <div className="pt-2 flex flex-wrap gap-4">
          <Link
            href="/business"
            className="inline-flex items-center gap-2 px-6 h-[44px] rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-[15px] transition-all shadow-sm"
          >
            <span>Explore City Directory</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 px-6 h-[44px] rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#2563EB] text-[#111827] font-bold text-[15px] transition-all shadow-sm"
          >
            <span>Cyberpark Openings</span>
          </Link>
        </div>
      </div>

      {/* Right Column Feature Pillars */}
      <div className="lg:col-span-6 space-y-4">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.title}
              className="p-6 surface-card flex items-start gap-4 transition-all duration-200 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB] shrink-0 shadow-xs">
                <Icon className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[18px] font-bold text-[#111827] font-sans">{pillar.title}</h4>
                <p className="text-[15px] text-[#6B7280] leading-relaxed font-normal">
                  {pillar.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
