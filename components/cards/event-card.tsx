'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Calendar, MapPin, ArrowUpRight } from 'lucide-react';
import { CoverImage } from '@/components/shared/cover-image';

interface EventCardProps {
  title: string;
  date: string;
  venue: string;
  category: string;
  image?: string | null;
  href?: string;
}

export const EventCard: React.FC<EventCardProps> = ({
  title,
  date,
  venue,
  category,
  image,
  href = '/events',
}) => {
  const titleLower = `${title || ''} ${category || ''}`.toLowerCase();
  const contextualFallback =
    titleLower.includes('food') || titleLower.includes('culinary') || titleLower.includes('feast')
      ? '/heroes/malabar-food.jpg'
      : titleLower.includes('tech') || titleLower.includes('developer') || titleLower.includes('meetup')
        ? '/heroes/workplace.jpg'
        : titleLower.includes('music') || titleLower.includes('beach') || titleLower.includes('carnival') || titleLower.includes('fest')
          ? '/heroes/lighthouse-coast.jpg'
          : '/heroes/calicut-hero.jpg';

  const finalImage = image || contextualFallback;

  return (
    <Link href={href} className="group block h-full">
      <Card className="surface-card flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="relative h-44 w-full shrink-0 overflow-hidden bg-slate-900">
          <CoverImage src={finalImage} alt={title} fallbackSrc={contextualFallback} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60" />
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-xs text-slate-900 font-extrabold text-[10px] uppercase tracking-wider shadow-xs">
              {category}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-between p-4 sm:p-5 space-y-3">
          <div className="space-y-2">
            <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-bold text-[#2563EB]">
              <Calendar className="h-3.5 w-3.5 text-[#2563EB]" />
              <span>{date}</span>
            </div>
            <h4 className="line-clamp-2 text-base font-bold leading-snug text-slate-900 transition-colors group-hover:text-[#2563EB]">
              {title}
            </h4>
          </div>

          <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5 font-medium truncate max-w-[180px]">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-[#2563EB]" />
              <span className="truncate">{venue}</span>
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-[#2563EB] group-hover:translate-x-0.5 transition-transform">
              Details <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
};
