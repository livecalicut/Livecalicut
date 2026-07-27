import React from 'react';
import { Breadcrumb } from './breadcrumb';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  icon,
  breadcrumbs,
  action,
}) => {
  return (
    <div className="mb-8 space-y-4 border-b border-[#E5E7EB] pb-7 pt-4 sm:pt-6">
      {breadcrumbs && <Breadcrumb items={breadcrumbs} />}

      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-4 sm:items-center">
          {icon && (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-[#2563EB] shadow-xs">
              {icon}
            </div>
          )}
          <div className="min-w-0">
            <h1 className="font-sans text-2xl font-extrabold tracking-tight text-[#111827] sm:text-3xl">
              {title}
            </h1>
            {description && (
              <p className="mt-1.5 max-w-2xl font-sans text-[14px] leading-relaxed font-normal text-[#6B7280] sm:text-[15px]">
                {description}
              </p>
            )}
          </div>
        </div>

        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
};
