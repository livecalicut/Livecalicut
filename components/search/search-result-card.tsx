import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SearchResultItem } from '@/lib/services/global-search.service';
import { MapPin, ArrowUpRight } from 'lucide-react';

interface SearchResultCardProps {
  item: SearchResultItem;
}

export const SearchResultCard: React.FC<SearchResultCardProps> = ({ item }) => {
  const moduleBadgeVariants: Record<string, 'default' | 'secondary' | 'purple' | 'success' | 'warning' | 'info'> = {
    businesses: 'default',
    news: 'info',
    events: 'purple',
    jobs: 'warning',
    marketplace: 'success',
    properties: 'secondary',
  };

  return (
    <Link href={item.url} className="block group">
      <Card className="p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 surface-card space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant={moduleBadgeVariants[item.module] || 'default'} className="uppercase text-[10px] font-bold">
              {item.module}
            </Badge>
            <span className="text-xs font-semibold text-slate-400">{item.category}</span>
          </div>

          <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-600 transition-colors" />
        </div>

        <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 transition-colors line-clamp-1">
          {item.title}
        </h4>

        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
          {item.summary}
        </p>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" /> {item.location}
          </span>
          {item.metaBadge && (
            <span className="font-extrabold text-cyan-600 dark:text-cyan-400">{item.metaBadge}</span>
          )}
        </div>
      </Card>
    </Link>
  );
};
