import React from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'full';
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className,
  size = 'lg',
  ...props
}) => {
  const sizeClasses = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-[1440px]',
    full: 'max-w-full',
  };

  return (
    <div
      className={cn('w-full mx-auto px-5 sm:px-10 lg:px-20', sizeClasses[size], className)}
      {...props}
    >
      {children}
    </div>
  );
};
