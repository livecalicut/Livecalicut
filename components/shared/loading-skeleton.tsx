import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export function ListSkeleton({ count = 6, cols = 3 }: { count?: number; cols?: number }) {
  return (
    <div
      className={`grid gap-6 grid-cols-1 sm:grid-cols-2 ${cols === 3 ? 'lg:grid-cols-3' : cols === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="h-full flex flex-col justify-between p-4 space-y-4 surface-card">
          <Skeleton className="w-full h-[180px] rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3 rounded-lg" />
            <Skeleton className="h-6 w-3/4 rounded-lg" />
            <Skeleton className="h-4 w-1/2 rounded-lg" />
          </div>
          <div className="mt-auto pt-3 border-t border-[#E5E7EB] flex items-center justify-between">
            <Skeleton className="h-4 w-1/3 rounded-lg" />
            <Skeleton className="h-4 w-1/4 rounded-lg" />
          </div>
        </Card>
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="space-y-6 py-4">
      <Skeleton className="w-full h-72 rounded-3xl" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-1/4 rounded-lg" />
        <Skeleton className="h-9 w-3/4 rounded-xl" />
        <Skeleton className="h-4 w-1/2 rounded-lg" />
      </div>
      <div className="space-y-3 pt-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-5 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}
