'use client';

import React, { useEffect, useRef, useState, useEffectEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Search } from 'lucide-react';
import { gsap, useGSAP, ScrollTrigger, DURATION, EASE, prefersReducedMotion } from '@/lib/gsap';

interface HeroBannerProps {
  title?: string;
  subtitle?: string;
  badgeText?: string;
  videoUrl?: string;
}

const SLIDES = [
  {
    kicker: 'City directory',
    line: 'Verified shops, dining, hospitals, and neighbourhood services across Kozhikode wards.',
    image: '/heroes/city-market.jpg',
    alt: 'Busy local market street representing Kozhikode commerce',
  },
  {
    kicker: 'Cyberpark careers',
    line: 'IT hiring, walk-ins, and local openings updated for Calicut talent every week.',
    image: '/heroes/workplace.jpg',
    alt: 'Modern workspace for Cyberpark and local job seekers',
  },
  {
    kicker: 'Malabar coast',
    line: 'Beaches, stays, and weekend plans along the Kozhikode shoreline.',
    image: '/heroes/coastal-life.jpg',
    alt: 'Coastal shoreline representing Malabar travel and leisure',
  },
  {
    kicker: 'Kerala living',
    line: 'Homes, classifieds, and everyday city life — mapped for Kozhikode citizens.',
    image: '/heroes/kerala-coast.jpg',
    alt: 'Kerala waterways and green coastline atmosphere',
  },
] as const;

const DESTINATIONS = [
  { href: '/business', label: 'Businesses' },
  { href: '/jobs', label: 'Jobs' },
  { href: '/marketplace', label: 'Marketplace' },
  { href: '/properties', label: 'Properties' },
  { href: '/news', label: 'News' },
  { href: '/events', label: 'Events' },
] as const;

const INTERVAL_MS = 5600;

function useKozhikodeClock() {
  const [label, setLabel] = useState('Kozhikode');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const time = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).format(now);
      const day = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        weekday: 'long',
      }).format(now);
      setLabel(`Kozhikode · ${day} · ${time}`);
    };
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return label;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  title = 'LiveCalicut.com',
  subtitle = 'Find verified businesses, Cyberpark jobs, homes, and local stories — one platform built for Kozhikode.',
  badgeText = 'Digital operating system for the city',
}) => {
  const router = useRouter();
  const rootRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const progressTween = useRef<ReturnType<typeof gsap.to> | null>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [query, setQuery] = useState('');
  const clockLabel = useKozhikodeClock();

  const restartProgress = useEffectEvent(() => {
    const bar = progressRef.current;
    if (!bar) return;
    progressTween.current?.kill();
    gsap.set(bar, { scaleX: 0 });
    if (paused || prefersReducedMotion()) {
      gsap.set(bar, { scaleX: paused ? 0 : 1 });
      return;
    }
    progressTween.current = gsap.to(bar, {
      scaleX: 1,
      duration: INTERVAL_MS / 1000,
      ease: 'none',
    });
  });

  const goTo = useEffectEvent((next: number) => {
    if (next === index) return;
    const reduced = prefersReducedMotion();
    const el = slideRef.current;

    if (!el || reduced) {
      setIndex(next);
      return;
    }

    gsap.killTweensOf(el);
    gsap.to(el, {
      opacity: 0,
      y: 12,
      duration: DURATION.fast,
      ease: EASE.out,
      onComplete: () => {
        setIndex(next);
        gsap.fromTo(
          el,
          { opacity: 0, y: -12 },
          { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.out }
        );
      },
    });
  });

  useEffect(() => {
    SLIDES.forEach((slide) => {
      const img = new Image();
      img.src = slide.image;
    });
  }, []);

  useEffect(() => {
    restartProgress();
  }, [index, paused]);

  useEffect(() => {
    if (paused || prefersReducedMotion()) return;
    const id = window.setInterval(() => {
      goTo((index + 1) % SLIDES.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [index, paused]);

  useGSAP(
    () => {
      if (!rootRef.current || !mediaRef.current || !contentRef.current) return;

      const reduced = prefersReducedMotion();
      const pieces = contentRef.current.querySelectorAll('[data-hero-piece]');

      gsap.set(pieces, { opacity: 1, y: 0 });

      if (reduced) {
        gsap.set(mediaRef.current, { clearProps: 'transform' });
        return;
      }

      const intro = gsap.timeline({ defaults: { ease: EASE.out } });

      intro.fromTo(
        mediaRef.current,
        { scale: 1.12 },
        { scale: 1, duration: 1.55 },
        0
      );

      intro.fromTo(
        pieces,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: DURATION.slow,
          stagger: 0.08,
          overwrite: true,
        },
        0.12
      );

      gsap.to(mediaRef.current, {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.to(contentRef.current, {
        opacity: 0.15,
        y: -36,
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    },
    { scope: rootRef }
  );

  const slide = SLIDES[index];

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
  };

  return (
    <section
      ref={rootRef}
      className="hero-banner relative flex w-full min-h-[calc(100dvh-4.75rem)] flex-col justify-end overflow-hidden font-sans sm:justify-center"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false);
      }}
    >
      <div
        ref={mediaRef}
        className="pointer-events-none absolute inset-[-12%_0] z-0 will-change-transform"
        aria-hidden
      >
        {SLIDES.map((item, i) => (
          <div
            key={item.image}
            className="absolute inset-0 transition-opacity duration-[1200ms] ease-out"
            style={{ opacity: i === index ? 1 : 0 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image}
              alt=""
              className={`h-full w-full object-cover transition-transform duration-[5600ms] ease-out ${
                i === index ? 'scale-105' : 'scale-100'
              }`}
              draggable={false}
            />
          </div>
        ))}

        {/* Cinematic scrim: readable type, photo still leads */}
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(8,15,30,0.78)_0%,rgba(8,15,30,0.55)_38%,rgba(8,15,30,0.28)_68%,rgba(8,15,30,0.42)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,15,30,0.35)_0%,transparent_28%,transparent_58%,rgba(8,15,30,0.72)_100%)]" />
      </div>

      <div
        ref={contentRef}
        className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col px-5 pb-16 pt-20 sm:px-10 sm:pb-20 sm:pt-24 lg:px-20 lg:pb-24"
      >
        <div className="max-w-3xl">
          <p
            data-hero-piece
            className="mb-4 text-[11px] font-semibold tracking-[0.28em] text-white/70 uppercase"
          >
            {clockLabel}
          </p>

          <p
            data-hero-piece
            className="mb-3 text-[12px] font-semibold tracking-[0.22em] text-[#93C5FD] uppercase"
          >
            {badgeText}
          </p>

          <h1
            data-hero-piece
            className="font-sans text-[2.65rem] font-extrabold tracking-[-0.045em] text-white sm:text-5xl lg:text-[4rem] lg:leading-[0.96]"
          >
            {title}
          </h1>

          <p
            data-hero-piece
            className="mt-5 max-w-2xl font-sans text-[16px] font-medium leading-relaxed text-white/85 sm:text-[18px]"
          >
            {subtitle}
          </p>

          <div
            data-hero-piece
            className="mt-7 max-w-xl"
            aria-live="polite"
            aria-atomic="true"
          >
            <div ref={slideRef}>
              <p className="text-[12px] font-bold tracking-[0.18em] text-[#93C5FD] uppercase">
                {slide.kicker}
              </p>
              <p className="mt-2 font-sans text-[15px] font-medium leading-relaxed text-white/78 sm:text-[16px]">
                {slide.line}
              </p>
            </div>
          </div>

          <form
            data-hero-piece
            onSubmit={onSearch}
            className="mt-8 flex w-full max-w-xl overflow-hidden rounded-2xl border border-white/15 bg-white/95 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.55)] backdrop-blur-md"
            role="search"
          >
            <label className="sr-only" htmlFor="hero-search">
              Search LiveCalicut
            </label>
            <div className="flex flex-1 items-center gap-2.5 px-4">
              <Search className="h-4 w-4 shrink-0 text-[#2563EB]" aria-hidden />
              <input
                id="hero-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search shops, jobs, homes, news…"
                className="h-12 w-full bg-transparent py-3.5 font-sans text-[14px] font-medium text-[#111827] outline-none placeholder:text-[#9CA3AF] sm:text-[15px]"
              />
            </div>
            <button
              type="submit"
              className="inline-flex h-12 shrink-0 items-center gap-1.5 bg-[#2563EB] px-5 font-sans text-[13px] font-bold tracking-wide text-white transition hover:bg-[#1D4ED8] sm:px-6"
            >
              Search
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </form>

          <div data-hero-piece className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/business"
              className="inline-flex h-12 min-w-[148px] items-center justify-center rounded-full bg-white px-7 font-sans text-[14px] font-bold tracking-wide text-[#111827] transition duration-300 hover:-translate-y-0.5 hover:bg-[#EFF6FF]"
            >
              Explore directory
            </Link>
            <Link
              href="/jobs"
              className="inline-flex h-12 min-w-[148px] items-center justify-center rounded-full border border-white/30 bg-white/10 px-7 font-sans text-[14px] font-bold tracking-wide text-white backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:border-white/55 hover:bg-white/18"
            >
              Browse jobs
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-12 items-center justify-center px-3 font-sans text-[14px] font-semibold tracking-wide text-white/75 transition hover:text-white"
            >
              Contact
            </Link>
          </div>

          <nav
            data-hero-piece
            className="mt-9 flex flex-wrap items-center gap-x-1 gap-y-2 border-t border-white/15 pt-6"
            aria-label="Popular destinations"
          >
            {DESTINATIONS.map((item, i) => (
              <span key={item.href} className="inline-flex items-center">
                {i > 0 && (
                  <span className="mx-3 text-white/25" aria-hidden>
                    /
                  </span>
                )}
                <Link
                  href={item.href}
                  className="font-sans text-[13px] font-semibold text-white/70 transition hover:text-white"
                >
                  {item.label}
                </Link>
              </span>
            ))}
          </nav>
        </div>

        <div
          data-hero-piece
          className="mt-10 flex max-w-xl flex-col gap-3"
          role="tablist"
          aria-label="Hero highlights"
        >
          <div className="flex items-center gap-2">
            {SLIDES.map((item, i) => (
              <button
                key={item.kicker}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={item.alt}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index
                    ? 'w-8 bg-white'
                    : 'w-1.5 bg-white/35 hover:bg-white/55'
                }`}
              />
            ))}
          </div>
          <div className="h-px w-full overflow-hidden rounded-full bg-white/20">
            <div
              ref={progressRef}
              className="h-full w-full origin-left scale-x-0 bg-[#60A5FA]"
            />
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 hidden justify-center pb-6 sm:flex"
        aria-hidden
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] font-semibold tracking-[0.22em] text-white/45 uppercase">
            Scroll
          </span>
          <span className="hero-scroll-line block h-8 w-px origin-top bg-gradient-to-b from-white/80 to-transparent" />
        </div>
      </div>
    </section>
  );
};
