import React from 'react';
import { cn } from '@/lib/utils';

interface PageWrapperProps extends React.HTMLAttributes<HTMLDivElement> {}

export const PageWrapper: React.FC<PageWrapperProps> = ({ children, className, ...props }) => {
  return (
    <div className={cn('min-h-screen py-8 space-y-12', className)} {...props}>
      {children}
    </div>
  );
};
