'use client';

import React from 'react';
import { Flame } from 'lucide-react';

interface TrendingSearchesWidgetProps {
  keywords: string[];
  onSelectKeyword: (keyword: string) => void;
}

export const TrendingSearchesWidget: React.FC<TrendingSearchesWidgetProps> = ({
  keywords,
  onSelectKeyword,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
        <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
        Trending Searches in Kozhikode
      </div>

      <div className="flex flex-wrap gap-2">
        {keywords.map((kw) => (
          <button
            key={kw}
            onClick={() => onSelectKeyword(kw)}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 text-slate-700 dark:text-slate-300 hover:text-cyan-600 border border-slate-200 dark:border-slate-800 transition-colors"
          >
            {kw}
          </button>
        ))}
      </div>
    </div>
  );
};
