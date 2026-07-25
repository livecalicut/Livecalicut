'use client';

import React, { useRef } from 'react';
import { usePathname } from 'next/navigation';
import { gsap, useGSAP, DURATION, EASE, prefersReducedMotion } from '@/lib/gsap';

/**
 * Fades and lifts route content on navigation. Re-runs whenever the pathname
 * changes so client-side transitions feel intentional rather than instant.
 */
export const PageTransition: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set(ref.current, { opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.out }
      );
    },
    { dependencies: [pathname] }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};
