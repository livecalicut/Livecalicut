import React from 'react';
import Link from 'next/link';
import { Inbox, ArrowRight, type LucideIcon } from 'lucide-react';

export type EmptyHook = {
  href: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
};

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  icon?: React.ReactNode;
  /** Suggested next steps when there is no data */
  hooks?: EmptyHook[];
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Nothing here yet',
  description = 'No results matched what you were looking for. Try a different search or browse a category below.',
  actionLabel,
  onAction,
  actionHref,
  icon,
  hooks = [],
  className = '',
}) => {
  return (
    <div
      className={`mx-auto w-full max-w-2xl rounded-3xl border border-[#E5E7EB] bg-white px-6 py-10 text-center shadow-xs sm:px-10 ${className}`}
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-[#2563EB]">
        {icon || <Inbox className="h-6 w-6" aria-hidden />}
      </div>

      <h3 className="mt-5 font-sans text-xl font-bold tracking-tight text-[#111827]">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#6B7280]">{description}</p>

      {(actionLabel && (onAction || actionHref)) && (
        <div className="mt-5">
          {actionHref ? (
            <Link
              href={actionHref}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 text-sm font-bold text-white transition hover:bg-[#1D4ED8]"
            >
              {actionLabel}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          ) : (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 text-sm font-bold text-white transition hover:bg-[#1D4ED8]"
            >
              {actionLabel}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          )}
        </div>
      )}

      {hooks.length > 0 && (
        <div className="mt-8 border-t border-[#F3F4F6] pt-6">
          <p className="mb-3 text-[11px] font-bold tracking-wide text-[#9CA3AF] uppercase">
            Try these instead
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {hooks.map((hook) => {
              const Icon = hook.icon;
              return (
                <Link
                  key={hook.href + hook.label}
                  href={hook.href}
                  className="group flex items-start gap-3 rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] px-3.5 py-3 text-left transition hover:border-[#2563EB] hover:bg-white"
                >
                  {Icon && (
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-white text-[#2563EB]">
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                  )}
                  <span className="min-w-0">
                    <span className="block text-sm font-bold text-[#111827] group-hover:text-[#2563EB]">
                      {hook.label}
                    </span>
                    {hook.description && (
                      <span className="mt-0.5 block text-[12px] leading-snug text-[#6B7280]">
                        {hook.description}
                      </span>
                    )}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
