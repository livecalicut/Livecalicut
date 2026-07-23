import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const LoadingCard: React.FC = () => {
  return (
    <Card className="p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
      <Skeleton className="w-full h-32 rounded-xl" />
      <div className="flex items-center justify-between">
        <Skeleton className="w-20 h-3 rounded" />
        <Skeleton className="w-14 h-4 rounded-full" />
      </div>
      <Skeleton className="w-3/4 h-4 rounded" />
      <Skeleton className="w-1/2 h-3 rounded" />
    </Card>
  );
};
