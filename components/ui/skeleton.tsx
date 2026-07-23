import React from 'react';
import { cn } from '@/lib/utils';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-xl bg-[#F1F5F9] border border-[#E5E7EB] animate-pulse', className)}
      {...props}
    />
  );
}

export { Skeleton };
