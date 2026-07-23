import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  viewAllHref,
  viewAllLabel = 'Explore All',
}) => {
  return (
    <div className="flex items-end justify-between gap-4 mb-6">
      <div className="space-y-1.5">
        <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-bold tracking-tight text-[#111827] leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-[15px] text-[#6B7280] font-normal leading-relaxed">{subtitle}</p>
        )}
      </div>

      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="group inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] transition-colors shrink-0 bg-blue-50 border border-blue-200 px-3.5 py-2 rounded-xl"
        >
          <span>{viewAllLabel}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      )}
    </div>
  );
};
