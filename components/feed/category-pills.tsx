'use client';

import React, { useState } from 'react';

interface CategoryPillsProps {
  categories: { id: string; name: string; slug: string }[];
  selectedCategory?: string;
  onSelectCategory?: (slug: string) => void;
  onSelect?: (slug: string) => void;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  onSelect,
}) => {
  const [internalActiveSlug, setInternalActiveSlug] = useState('all');

  const activeSlug = selectedCategory ?? internalActiveSlug;

  const handleSelect = (slug: string) => {
    if (selectedCategory === undefined) {
      setInternalActiveSlug(slug);
    }
    const handler = onSelectCategory || onSelect;
    handler?.(slug === 'all' ? '' : slug);
  };

  const allCategories = [{ id: 'all', name: 'All Activity', slug: 'all' }, ...categories];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {allCategories.map((cat) => {
        const isActive = activeSlug === cat.slug || (!activeSlug && cat.slug === 'all');
        return (
          <button
            key={cat.id}
            onClick={() => handleSelect(cat.slug)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              isActive
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-cyan-500/40'
            }`}
          >
            {cat.name}
          </button>
        );
      })}
    </div>
  );
};
