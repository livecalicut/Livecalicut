'use client';

import React, { useRef } from 'react';
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap';

interface CountUpProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

/**
 * Counts a metric up from zero when it scrolls into view. Used for dashboard
 * and marketing stat tiles.
 */
export const CountUp: React.FC<CountUpProps> = ({
  value,
  duration = 1.4,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
}) => {
  const ref = useRef<HTMLSpanElement>(null);

  const format = (n: number) =>
    `${prefix}${n.toLocaleString('en-IN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${suffix}`;

  useGSAP(
    () => {
      const node = ref.current;
      if (!node) return;

      if (prefersReducedMotion()) {
        node.textContent = format(value);
        return;
      }

      const counter = { current: 0 };

      gsap.to(counter, {
        current: value,
        duration,
        ease: 'power2.out',
        onUpdate: () => {
          node.textContent = format(counter.current);
        },
        scrollTrigger: { trigger: node, start: 'top bottom-=40', once: true },
      });
    },
    { dependencies: [value, duration, decimals, prefix, suffix] }
  );

  // Render the final value on the server so crawlers and no-JS users see the real number.
  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
};
