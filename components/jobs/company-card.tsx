import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Building, MapPin, ArrowRight } from 'lucide-react';

interface CompanyCardProps {
  name: string;
  slug: string;
  industry: string;
  openingsCount?: number;
  location?: string;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({
  name,
  slug,
  industry,
  openingsCount = 3,
  location = 'Calicut Hub',
}) => {
  return (
    <Link href={`/companies/${slug}`} className="block group">
      <Card className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 surface-card space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-slate-800 border border-cyan-200 dark:border-cyan-500/30 flex items-center justify-center text-cyan-600 font-bold text-lg">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 transition-colors">
              {name}
            </h4>
            <span className="text-xs text-slate-400 font-medium">{industry}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" /> {location}
          </span>
          <span className="font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1 group-hover:underline">
            {openingsCount} Openings <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </Card>
    </Link>
  );
};
