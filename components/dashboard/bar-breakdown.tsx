'use client';

import React, { useRef } from 'react';
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap';
import { Card } from '@/components/ui/card';

export type BreakdownRow = { label: string; count: number };

interface BarBreakdownProps {
  title: string;
  rows: BreakdownRow[];
  emptyLabel?: string;
}

/**
 * Horizontal proportion bars. Rendered as a real <table> so the figures stay
 * available to screen readers and the bars are purely decorative.
 */
export const BarBreakdown: React.FC<BarBreakdownProps> = ({
  title,
  rows,
  emptyLabel = 'No data yet.',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const max = Math.max(1, ...rows.map((r) => r.count));

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.from('[data-bar]', {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 0.7,
        stagger: 0.05,
        ease: 'liveEase',
        scrollTrigger: { trigger: ref.current, start: 'top bottom-=40', once: true },
      });
    },
    { scope: ref, dependencies: [rows.length] }
  );

  return (
    <Card
      ref={ref}
      className="space-y-4 rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-xs"
    >
      <h3 className="font-sans text-sm font-extrabold text-[#111827]">{title}</h3>

      {rows.length === 0 ? (
        <p className="py-6 text-center text-xs text-[#6B7280]">{emptyLabel}</p>
      ) : (
        <table className="w-full">
          <caption className="sr-only">{title}</caption>
          <tbody className="space-y-3">
            {rows.map((row) => (
              <tr key={row.label} className="block space-y-1.5 py-1.5">
                <th scope="row" className="block text-left text-xs font-bold text-[#4B5563]">
                  <span className="flex items-center justify-between gap-3">
                    <span className="truncate capitalize">{row.label}</span>
                    <span className="shrink-0 font-extrabold text-[#111827] tabular-nums">
                      {row.count.toLocaleString('en-IN')}
                    </span>
                  </span>
                </th>
                <td className="block">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#F1F5F9]">
                    <div
                      data-bar
                      aria-hidden="true"
                      className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#60A5FA]"
                      style={{ width: `${Math.max(4, (row.count / max) * 100)}%` }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  );
};
