'use client';

import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { CountUp } from '@/components/animated/count-up';

export type StatTone = 'blue' | 'emerald' | 'purple' | 'indigo' | 'teal' | 'amber' | 'rose' | 'cyan';

const TONES: Record<StatTone, string> = {
  blue: 'bg-blue-50 border-blue-200 text-[#2563EB]',
  emerald: 'bg-emerald-50 border-emerald-200 text-emerald-600',
  purple: 'bg-purple-50 border-purple-200 text-purple-600',
  indigo: 'bg-indigo-50 border-indigo-200 text-indigo-600',
  teal: 'bg-teal-50 border-teal-200 text-teal-600',
  amber: 'bg-amber-50 border-amber-200 text-amber-600',
  rose: 'bg-rose-50 border-rose-200 text-rose-600',
  cyan: 'bg-cyan-50 border-cyan-200 text-cyan-600',
};

interface StatTileProps {
  title: string;
  value: number;
  icon: LucideIcon;
  tone?: StatTone;
  hint?: string;
  suffix?: string;
}

export const StatTile: React.FC<StatTileProps> = ({
  title,
  value,
  icon: Icon,
  tone = 'blue',
  hint,
  suffix,
}) => {
  return (
    <Card className="space-y-3 rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-xs transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
      <div className="flex items-center justify-between gap-2">
        <span className="font-sans text-xs font-bold text-[#6B7280]">{title}</span>
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${TONES[tone]}`}
        >
          <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
        </div>
      </div>

      <p className="font-sans text-3xl font-extrabold tracking-tight text-[#111827]">
        <CountUp value={value} suffix={suffix} />
      </p>

      {hint && <p className="text-[11px] font-medium text-[#9CA3AF]">{hint}</p>}
    </Card>
  );
};
