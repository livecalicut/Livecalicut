import React from 'react';
// Icons imported dynamically below
import { StaggerContainer, StaggerItem } from '@/components/animated/scroll-reveal';

import * as Icons from 'lucide-react';

export interface CityMetric {
  value: string;
  label: string;
  subtext: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

interface CityMetricsProps {
  metrics?: CityMetric[];
}

export const CityMetrics: React.FC<CityMetricsProps> = ({ metrics: customMetrics }) => {
  const defaultMetrics = [
    {
      value: '12,400+',
      label: 'Verified Outlets',
      subtext: 'Shops, dining & healthcare across 21 Calicut spatial wards',
      icon: 'Building2',
      color: 'text-[#2563EB]',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      value: '5,200+',
      label: 'Cyberpark IT Jobs',
      subtext: 'Software engineering & corporate hiring positions posted',
      icon: 'Briefcase',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
    },
    {
      value: '1.2M+',
      label: 'Connected Citizens',
      subtext: 'Daily Kozhikode residents relying on city OS data',
      icon: 'Users',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
    {
      value: '24/7 Priority',
      label: 'Emergency Response',
      subtext: 'Ambulance helplines, blood donors & round-the-clock labs',
      icon: 'ShieldAlert',
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
    },
  ];

  const metrics = customMetrics || defaultMetrics;

  return (
    <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => {
        // @ts-ignore
        const Icon = (Icons[metric.icon as keyof typeof Icons] || Icons.HelpCircle) as React.ElementType;
        return (
          <StaggerItem key={metric.label}>
            <div className="surface-card p-6 flex flex-col justify-between space-y-4 transition-all duration-300 hover:-translate-y-2 h-full">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-2xl ${metric.bgColor} border ${metric.borderColor} flex items-center justify-center ${metric.color} shadow-xs`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                  Live Metric
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-3xl lg:text-4xl font-extrabold text-[#111827] tracking-tight font-sans">
                  {metric.value}
                </h3>
                <p className="text-base font-bold text-[#111827] font-sans">{metric.label}</p>
                <p className="text-[13px] text-[#6B7280] leading-relaxed font-normal">{metric.subtext}</p>
              </div>
            </div>
          </StaggerItem>
        );
      })}
    </StaggerContainer>
  );
};
