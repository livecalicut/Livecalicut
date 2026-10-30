'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Phone, CheckCircle2, Heart } from 'lucide-react';
import { getExactBusinessLocation } from '@/lib/business/location';

interface BusinessCardProps {
  id: string;
  slug?: string;
  name: string;
  category: string;
  location: string;
  rating: number;
  reviewCount: number;
  phone?: string;
  isVerified?: boolean;
  image?: string | null;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({
  id,
  slug,
  name,
  category,
  location,
  rating,
  reviewCount,
  phone,
  isVerified = true,
  image,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const href = slug ? `/business/${slug}` : id ? `/business/${id}` : '/business';

  const toggleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  // Safe exact location that is never blank, never "Door No", always clean Calicut locality
  const resolvedLocation = getExactBusinessLocation({
    name,
    location,
    address: location,
  });

  return (
    <Link href={href} className="group block h-full">
      <Card className="surface-card flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-2xs hover:shadow-md transition-all duration-300 hover:-translate-y-1">
        {/* Clean Logo Container (100% visible, centered, not cropped, zero logo break) */}
        <div className="relative h-44 sm:h-48 w-full shrink-0 overflow-hidden rounded-xl bg-white border border-slate-100 flex items-center justify-center p-4">
          <img
            src={image || '/heroes/city-market.jpg'}
            alt={name}
            loading="lazy"
            className="max-h-full max-w-full object-contain mx-auto transition-transform duration-300 group-hover:scale-105"
          />

          {isVerified && (
            <Badge
              variant="success"
              className="absolute left-2.5 top-2.5 gap-1 text-[10px] font-bold shadow-xs bg-emerald-500 text-white border-none"
            >
              <CheckCircle2 className="h-3 w-3" /> Verified
            </Badge>
          )}

          {/* Favorite Toggle Button */}
          <button
            onClick={toggleFav}
            className="absolute right-2.5 top-2.5 w-7 h-7 rounded-full bg-slate-100/90 hover:bg-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors cursor-pointer shadow-xs"
            aria-label="Save business"
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-600'
              }`}
            />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex flex-1 flex-col justify-between pt-3 space-y-2.5">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#2563EB]">
                {category || 'Service Provider'}
              </span>
              {reviewCount > 0 && rating > 0 ? (
                <div className="flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-500" aria-hidden="true" />
                  <span>{rating.toFixed(1)}</span>
                  <span className="font-normal text-slate-500">({reviewCount})</span>
                </div>
              ) : (
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                  New
                </span>
              )}
            </div>

            <h4 className="line-clamp-2 text-[15px] sm:text-[16px] font-bold leading-snug text-slate-900 transition-colors group-hover:text-[#2563EB]">
              {name}
            </h4>

            {/* Exact Location - Never Empty */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-[#2563EB]" />
              <span className="truncate">{resolvedLocation}</span>
            </div>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
          {phone ? (
            <span className="flex items-center gap-1 font-semibold text-slate-700">
              <Phone className="h-3.5 w-3.5 text-[#2563EB]" aria-hidden="true" />
              <span>{phone}</span>
            </span>
          ) : (
            <span className="text-[11px] text-slate-400 font-medium">Verified Listing</span>
          )}
          <span className="font-bold text-[#2563EB] transition-transform group-hover:translate-x-0.5">
            View Store &rarr;
          </span>
        </div>
      </Card>
    </Link>
  );
};
