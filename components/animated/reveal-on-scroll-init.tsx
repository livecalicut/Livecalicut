'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { gsap, ScrollTrigger, DURATION, EASE, prefersReducedMotion } from '@/lib/gsap';

/**
 * Animates any `[data-reveal]` node in the document.
 * Lives outside the section tree so Server Component children (e.g. Lucide icons)
 * never cross a Client Component boundary as serialized props/children.
 */
export function RevealOnScrollInit() {
  const pathname = usePathname();

  useEffect(() => {
    const targets = gsap.utils.toArray<HTMLElement>('[data-reveal]');
    if (!targets.length) return;

    if (prefersReducedMotion()) {
      gsap.set(targets, { opacity: 1, y: 0, clearProps: 'transform' });
      return;
    }

    const tweens = targets.map((el) =>
      gsap.fromTo(
        el,
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: DURATION.slow,
          ease: EASE.out,
          scrollTrigger: {
            trigger: el,
            start: 'top 92%',
            once: true,
            // If already in view (or layout was late), play immediately
            toggleActions: 'play none none none',
          },
          // Never leave content permanently invisible
          onInterrupt: () => {
            gsap.set(el, { opacity: 1, y: 0 });
          },
        }
      )
    );

    // Layout can settle after images/fonts; refresh then force-reveal stragglers
    const refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    const safetyId = window.setTimeout(() => {
      targets.forEach((el) => {
        const style = window.getComputedStyle(el);
        if (Number.parseFloat(style.opacity) < 0.05) {
          gsap.set(el, { opacity: 1, y: 0 });
        }
      });
    }, 2200);

    return () => {
      window.clearTimeout(refreshId);
      window.clearTimeout(safetyId);
      tweens.forEach((tween) => {
        tween.scrollTrigger?.kill();
        tween.kill();
      });
      // On cleanup / route change, ensure nothing stays hidden
      gsap.set(targets, { opacity: 1, y: 0 });
    };
  }, [pathname]);

  return null;
}
