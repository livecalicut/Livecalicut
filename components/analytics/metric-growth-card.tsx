import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, ArrowUpRight } from 'lucide-react';

interface MetricGrowthCardProps {
  title: string;
  value: string;
  trend: string;
  isPositive?: boolean;
}

export const MetricGrowthCard: React.FC<MetricGrowthCardProps> = ({
  title,
  value,
  trend,
  isPositive = true,
}) => {
  return (
    <Card className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 surface-card space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 truncate">{title}</span>
        <Badge variant={isPositive ? 'success' : 'destructive'} className="text-[10px] gap-1">
          <TrendingUp className="w-3 h-3" /> {trend}
        </Badge>
      </div>

      <div className="flex items-baseline justify-between pt-1">
        <span className="text-2xl font-black text-slate-900 dark:text-white">{value}</span>
        <ArrowUpRight className="w-4 h-4 text-slate-400" />
      </div>
    </Card>
  );
};
