'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';

interface SearchTabsProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const SearchTabs: React.FC<SearchTabsProps> = ({ activeTab, onSelectTab }) => {
  const tabs = [
    { id: 'all', label: 'All Modules' },
    { id: 'businesses', label: 'Businesses' },
    { id: 'news', label: 'News' },
    { id: 'events', label: 'Events' },
    { id: 'jobs', label: 'Jobs' },
    { id: 'marketplace', label: 'Marketplace' },
    { id: 'properties', label: 'Properties' },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onSelectTab(tab.id)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === tab.id
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-cyan-300'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
