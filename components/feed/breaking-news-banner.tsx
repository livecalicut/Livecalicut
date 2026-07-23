import React from 'react';
import { AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface BreakingNewsBannerProps {
  title?: string;
  linkHref?: string;
}

export const BreakingNewsBanner: React.FC<BreakingNewsBannerProps> = ({
  title = 'Kozhikode District Admin Issues Coastal High Tide & Rain Warning for Next 24 Hours',
  linkHref = '/news',
}) => {
  return (
    <div className="w-full p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 flex items-center justify-between gap-3 shadow-sm">
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-extrabold text-[10px] uppercase tracking-wider shrink-0 animate-pulse">
          Alert
        </span>
        <p className="text-xs font-semibold truncate">{title}</p>
      </div>

      <Link
        href={linkHref}
        className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 shrink-0"
      >
        <span>Details</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
};
