'use client';

import React, { useRef } from 'react';
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap';
import { Card } from '@/components/ui/card';

export type TrendSeries = { key: string; label: string; color: string };
export type TrendRow = Record<string, number | string> & { month: string };

interface TrendChartProps {
  title: string;
  rows: TrendRow[];
  series: TrendSeries[];
}

const VIEW_W = 640;
const VIEW_H = 200;
const PAD = 16;

/**
 * Grouped column chart drawn as inline SVG — no charting dependency. The SVG is
 * aria-hidden and a visually hidden table carries the same figures.
 */
export const TrendChart: React.FC<TrendChartProps> = ({ title, rows, series }) => {
  const ref = useRef<HTMLDivElement>(null);

  const max = Math.max(
    1,
    ...rows.flatMap((row) => series.map((s) => Number(row[s.key]) || 0))
  );

  const groupWidth = rows.length ? (VIEW_W - PAD * 2) / rows.length : 0;
  const barWidth = series.length ? Math.min(18, (groupWidth * 0.7) / series.length) : 0;

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.from('[data-col]', {
        scaleY: 0,
        transformOrigin: 'bottom center',
        duration: 0.7,
        stagger: 0.02,
        ease: 'liveEase',
        scrollTrigger: { trigger: ref.current, start: 'top bottom-=40', once: true },
      });
    },
    { scope: ref, dependencies: [rows.length, series.length] }
  );

  const hasData = rows.some((row) => series.some((s) => Number(row[s.key]) > 0));

  return (
    <Card ref={ref} className="space-y-4 rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-sans text-sm font-extrabold text-[#111827]">{title}</h3>
        <ul className="flex flex-wrap items-center gap-3">
          {series.map((s) => (
            <li key={s.key} className="flex items-center gap-1.5 text-[11px] font-bold text-[#6B7280]">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: s.color }}
                aria-hidden="true"
              />
              {s.label}
            </li>
          ))}
        </ul>
      </div>

      {!hasData ? (
        <p className="py-10 text-center text-xs text-[#6B7280]">
          Not enough activity yet to chart a trend.
        </p>
      ) : (
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="h-48 w-full"
          role="img"
          aria-label={`${title}. The same figures are listed in the table below.`}
        >
          {[0, 0.25, 0.5, 0.75, 1].map((frac) => (
            <line
              key={frac}
              x1={PAD}
              x2={VIEW_W - PAD}
              y1={PAD + (VIEW_H - PAD * 2) * frac}
              y2={PAD + (VIEW_H - PAD * 2) * frac}
              stroke="#F1F5F9"
              strokeWidth={1}
            />
          ))}

          {rows.map((row, rowIndex) => {
            const groupX = PAD + groupWidth * rowIndex + groupWidth / 2;
            const clusterWidth = barWidth * series.length;

            return (
              <g key={`${row.month}-${rowIndex}`}>
                {series.map((s, seriesIndex) => {
                  const value = Number(row[s.key]) || 0;
                  const height = (value / max) * (VIEW_H - PAD * 3);
                  const x = groupX - clusterWidth / 2 + barWidth * seriesIndex;

                  return (
                    <rect
                      key={s.key}
                      data-col
                      x={x}
                      y={VIEW_H - PAD - height}
                      width={Math.max(2, barWidth - 3)}
                      height={Math.max(0, height)}
                      rx={3}
                      fill={s.color}
                    />
                  );
                })}
                <text
                  x={groupX}
                  y={VIEW_H - 2}
                  textAnchor="middle"
                  className="fill-[#9CA3AF] text-[10px] font-bold"
                >
                  {row.month}
                </text>
              </g>
            );
          })}
        </svg>
      )}

      <table className="sr-only">
        <caption>{title}</caption>
        <thead>
          <tr>
            <th scope="col">Month</th>
            {series.map((s) => (
              <th key={s.key} scope="col">
                {s.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={`${row.month}-${i}`}>
              <th scope="row">{row.month}</th>
              {series.map((s) => (
                <td key={s.key}>{Number(row[s.key]) || 0}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};
