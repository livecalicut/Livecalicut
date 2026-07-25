'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { Flip } from 'gsap/Flip';
import { useGSAP } from '@gsap/react';

/**
 * The single easing curve used across the product. Mirrors the cubic-bezier
 * already baked into `.surface-card` transitions in globals.css so CSS and JS
 * motion stay visually identical.
 */
gsap.registerEase('liveEase', (progress) => 1 - Math.pow(1 - progress, 3));

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Flip, useGSAP);
  gsap.defaults({ ease: 'liveEase', duration: 0.7 });
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export const DURATION = {
  fast: 0.28,
  base: 0.55,
  slow: 0.8,
} as const;

export const EASE = {
  out: 'liveEase',
  inOut: 'power2.inOut',
  spring: 'back.out(1.6)',
} as const;

/**
 * True when the visitor has asked the OS to minimise animation. Every animation
 * helper here must consult this and jump straight to the end state rather than
 * tweening.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export { gsap, ScrollTrigger, ScrollToPlugin, Flip, useGSAP };
