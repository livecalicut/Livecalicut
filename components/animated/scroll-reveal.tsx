'use client';

import React, { useRef } from 'react';
import { gsap, useGSAP, DURATION, EASE, prefersReducedMotion } from '@/lib/gsap';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
  staggerChildren?: boolean;
}

const DIRECTION_OFFSET = {
  up: { y: 40, x: 0 },
  down: { y: -40, x: 0 },
  left: { x: 40, y: 0 },
  right: { x: -40, y: 0 },
} as const;

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  delay = 0,
  direction = 'up',
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const offset = DIRECTION_OFFSET[direction];

      if (prefersReducedMotion()) {
        gsap.set(ref.current, { opacity: 1, x: 0, y: 0, scale: 1 });
        return;
      }

      gsap.fromTo(
        ref.current,
        { opacity: 0, y: offset.y, x: offset.x, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
          duration: DURATION.slow,
          delay,
          ease: EASE.out,
          scrollTrigger: {
            trigger: ref.current,
            start: 'top bottom-=80',
            once: true,
          },
        }
      );
    },
    { scope: ref, dependencies: [direction, delay] }
  );

  return (
    <div ref={ref} className={`gsap-reveal ${className}`}>
      {children}
    </div>
  );
};

export const StaggerContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>('[data-stagger-item]', ref.current);
      if (!items.length) return;

      if (prefersReducedMotion()) {
        gsap.set(items, { opacity: 1, y: 0, scale: 1 });
        return;
      }

      gsap.fromTo(
        items,
        { opacity: 0, y: 30, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: DURATION.base,
          ease: EASE.out,
          stagger: 0.1,
          scrollTrigger: {
            trigger: ref.current,
            start: 'top bottom-=60',
            once: true,
          },
        }
      );
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export const StaggerItem: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <div data-stagger-item className={`gsap-reveal ${className}`}>
      {children}
    </div>
  );
};
