'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, Building2, Calendar, ChevronLeft, ChevronRight, Home, Search, Utensils } from 'lucide-react';
import { ALL_LOCATIONS_LABEL } from '@/config/constants';
import { LocationSelect } from '@/components/shared/location-select';
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap';

interface HeroRedesignProps {
  initialQuery?: string;
  initialLocation?: string;
}

const SLIDES = [
  {
    image: '/heroes/lighthouse-coast.jpg',
    alt: 'Lighthouse on the coast at sunset',
    position: 'object-[70%_center]',
  },
  {
    image: '/heroes/kerala-coast.jpg',
    alt: 'Palm-lined Kerala backwaters',
    position: 'object-center',
  },
  {
    image: '/heroes/coastal-life.jpg',
    alt: 'Sunset over the Malabar coast',
    position: 'object-center',
  },
] as const;

const QUICK_LINKS = [
  {
    label: 'Local Businesses',
    blurb: 'Shops, services & more',
    href: '/business',
    icon: Building2,
    iconClass: 'bg-[#2563EB]',
  },
  {
    label: 'Jobs',
    blurb: 'Find your next opportunity',
    href: '/jobs',
    icon: Briefcase,
    iconClass: 'bg-emerald-500',
  },
  {
    label: 'Properties',
    blurb: 'Rent, buy, sell',
    href: '/properties',
    icon: Home,
    iconClass: 'bg-violet-500',
  },
  {
    label: 'Restaurants',
    blurb: 'Great food, great places',
    href: '/restaurants',
    icon: Utensils,
    iconClass: 'bg-orange-500',
  },
  {
    label: 'Events',
    blurb: 'Happenings in Kozhikode',
    href: '/events',
    icon: Calendar,
    iconClass: 'bg-pink-500',
  },
] as const;

const INTERVAL_MS = 5000;

export const HeroRedesign: React.FC<HeroRedesignProps> = ({
  initialQuery = '',
  initialLocation = ALL_LOCATIONS_LABEL,
}) => {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const previousIndex = useRef(0);
  const [query, setQuery] = useState(initialQuery);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    SLIDES.forEach((slide) => {
      const img = new Image();
      img.src = slide.image;
    });
  }, []);

  useEffect(() => {
    const onChange = () => setPaused(document.hidden);
    document.addEventListener('visibilitychange', onChange);
    return () => document.removeEventListener('visibilitychange', onChange);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % SLIDES.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [paused, index]);

  useGSAP(
    () => {
      if (!mediaRef.current || !sectionRef.current || prefersReducedMotion()) return;
      gsap.from(contentRef.current, { y: 28, opacity: 0, duration: 0.85, ease: 'power2.out' });
      gsap.from('[data-hero-chip]', {
        y: 16,
        opacity: 0,
        duration: 0.6,
        stagger: 0.06,
        delay: 0.25,
        ease: 'power2.out',
      });
      gsap.to(mediaRef.current, {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    },
    { scope: sectionRef }
  );

  useGSAP(
    () => {
      const slides = gsap.utils.toArray<HTMLElement>('[data-hero-slide]');
      const reduced = prefersReducedMotion();
      const from = previousIndex.current;
      const changed = from !== index;
      const forward = (index - from + SLIDES.length) % SLIDES.length;
      const direction = forward === 0 || forward <= SLIDES.length / 2 ? 1 : -1;

      slides.forEach((slide, slideIndex) => {
        const active = slideIndex === index;
        const image = slide.querySelector('img');
        gsap.killTweensOf(slide);
        if (image) gsap.killTweensOf(image);

        if (reduced || !changed) {
          gsap.set(slide, { xPercent: active ? 0 : direction * 100, opacity: active ? 1 : 0 });
          if (image && active && !reduced && !paused) {
            gsap.fromTo(
              image,
              { scale: 1.06 },
              { scale: 1.14, duration: INTERVAL_MS / 1000, ease: 'none' }
            );
          } else if (image) {
            gsap.set(image, { scale: 1.06 });
          }
          return;
        }

        if (active) {
          gsap.fromTo(
            slide,
            { xPercent: direction * 100, opacity: 1 },
            { xPercent: 0, duration: 0.9, ease: 'power2.inOut' }
          );
          if (image) {
            gsap.fromTo(
              image,
              { scale: 1.06 },
              { scale: 1.14, duration: INTERVAL_MS / 1000, ease: 'none' }
            );
          }
        } else if (slideIndex === from) {
          gsap.fromTo(
            slide,
            { xPercent: 0, opacity: 1 },
            { xPercent: direction * -100, duration: 0.9, ease: 'power2.inOut' }
          );
        } else {
          gsap.set(slide, { xPercent: direction * 100, opacity: 0 });
        }
      });

      previousIndex.current = index;

      if (progressRef.current) {
        gsap.killTweensOf(progressRef.current);
        if (paused) {
          gsap.set(progressRef.current, { scaleX: 0 });
        } else {
          gsap.fromTo(
            progressRef.current,
            { scaleX: 0 },
            { scaleX: 1, duration: INTERVAL_MS / 1000, ease: 'none' }
          );
        }
      }
    },
    { scope: sectionRef, dependencies: [index, paused] }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (selectedLocation && selectedLocation !== ALL_LOCATIONS_LABEL) {
      params.set('location', selectedLocation);
      params.set('area', selectedLocation);
    }
    router.push(`/search?${params.toString()}`);
  };

  const go = (next: number) => {
    setIndex((next + SLIDES.length) % SLIDES.length);
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[720px] w-full overflow-hidden text-white sm:min-h-[660px] lg:h-[min(740px,76vh)] lg:min-h-[600px]"
      aria-roledescription="carousel"
      aria-label="LiveCalicut highlights"
    >
      <div ref={mediaRef} className="absolute inset-0 will-change-transform">
        {SLIDES.map((slide, slideIndex) => (
          <div
            key={slide.image}
            data-hero-slide
            className="absolute inset-0"
            style={{ opacity: slideIndex === 0 ? 1 : 0 }}
          >
            <img
              src={slide.image}
              alt={slideIndex === index ? slide.alt : ''}
              aria-hidden={slideIndex !== index}
              className={`h-[115%] w-full object-cover ${slide.position}`}
              fetchPriority={slideIndex === 0 ? 'high' : 'low'}
              decoding="async"
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-slate-950/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-950/10 to-slate-950/25" />

      <div className="absolute top-5 left-4 z-10 flex items-center gap-3 text-sm font-semibold sm:left-8">
        <span>
          {index + 1} / {SLIDES.length}
        </span>
        <span className="block h-0.5 w-16 overflow-hidden rounded-full bg-white/35">
          <span ref={progressRef} className="block h-full origin-left scale-x-0 bg-white" />
        </span>
      </div>

      <button
        type="button"
        onClick={() => go(index - 1)}
        aria-label="Previous slide"
        className="absolute top-[42%] left-3 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/25 text-white backdrop-blur-sm transition hover:bg-black/45 sm:flex lg:left-6"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => go(index + 1)}
        aria-label="Next slide"
        className="absolute top-[42%] right-3 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/25 text-white backdrop-blur-sm transition hover:bg-black/45 sm:flex lg:right-6"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div
        ref={contentRef}
        className="relative z-10 mx-auto flex min-h-[720px] w-full max-w-5xl flex-col items-center justify-center px-4 pt-16 pb-24 text-center sm:min-h-[660px] sm:px-8 lg:h-full lg:min-h-0 lg:pb-20"
      >
        <p className="text-[11px] font-bold tracking-[0.22em] text-white/90 uppercase">Discover Kozhikode</p>
        <h1 className="mt-3 text-[2rem] leading-[1.08] font-extrabold tracking-tight sm:text-5xl lg:text-[3.35rem]">
          Everything Kozhikode.
          <br />
          Connected in <span className="text-[#3B82F6]">One Place.</span>
        </h1>
        <p className="mt-3 max-w-xl text-sm text-white/90 sm:text-base [@media(max-height:700px)]:hidden">
          Discover local businesses, jobs, homes, and events across Kozhikode — all in one place.
        </p>

        <form
          onSubmit={handleSearch}
          className="mt-6 flex w-full max-w-3xl items-center gap-1 rounded-full bg-white p-1.5 pl-4 text-slate-900 shadow-[0_16px_40px_rgba(0,0,0,0.28)] focus-within:ring-4 focus-within:ring-white/70"
        >
          <Search className="h-5 w-5 shrink-0 text-[#2563EB]" aria-hidden />
          <label htmlFor="hero-search" className="sr-only">
            What are you looking for in Kozhikode?
          </label>
          <input
            id="hero-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What are you looking for in Kozhikode?"
            className="h-11 min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:outline-none"
          />
          <div className="mx-1 hidden h-6 w-px shrink-0 bg-slate-200 sm:block" />
          <LocationSelect
            value={selectedLocation}
            onChange={setSelectedLocation}
            tone="plain"
            className="hidden w-40 shrink-0 sm:block"
          />
          <button
            type="submit"
            className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-[#2563EB] px-5 text-sm font-bold text-white transition hover:bg-[#1D4ED8]"
          >
            <Search className="h-4 w-4" aria-hidden />
            Search
          </button>
        </form>

        <div className="mt-2 w-full max-w-3xl rounded-full bg-white px-2 sm:hidden">
          <LocationSelect value={selectedLocation} onChange={setSelectedLocation} tone="plain" className="w-full" />
        </div>

        <div className="mx-auto mt-4 flex w-max max-w-full gap-2 overflow-x-auto px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {QUICK_LINKS.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                data-hero-chip
                href={item.href}
                className="flex shrink-0 items-center gap-2 rounded-full border border-white/20 bg-slate-950/40 py-1.5 pr-3.5 pl-1.5 backdrop-blur-md transition hover:bg-slate-950/60"
              >
                <span className={`flex h-8 w-8 items-center justify-center rounded-full text-white ${item.iconClass}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-sm font-semibold whitespace-nowrap">{item.label}</span>
              </a>
            );
          })}
        </div>
      </div>

      <div className="absolute right-5 bottom-16 z-10 flex items-center gap-1.5 sm:right-8 sm:bottom-20">
        {SLIDES.map((slide, slideIndex) => (
          <button
            key={slide.image}
            type="button"
            aria-label={`Show slide ${slideIndex + 1}`}
            aria-current={slideIndex === index ? 'true' : undefined}
            onClick={() => go(slideIndex)}
            className={`h-2 rounded-full transition-all ${slideIndex === index ? 'w-6 bg-[#2563EB]' : 'w-2 bg-white/70'}`}
          />
        ))}
      </div>

      <svg
        className="pointer-events-none absolute bottom-0 left-0 z-10 h-14 w-full text-white sm:h-16"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path d="M0,48 C240,80 480,8 720,32 C980,58 1200,8 1440,40 L1440,80 L0,80 Z" fill="currentColor" />
      </svg>
    </section>
  );
};
