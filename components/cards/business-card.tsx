import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Phone, CheckCircle2 } from 'lucide-react';

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
}

export const BusinessCard: React.FC<BusinessCardProps> = ({
  id,
  slug,
  name,
  category,
  location,
  rating,
  reviewCount,
  phone = '+91 98765 43210',
  isVerified = true,
}) => {
  const href = slug ? `/business/${slug}` : id ? `/business/${id}` : '/business';

  return (
    <Link href={href} className="block group h-full">
      <Card className="h-full flex flex-col justify-between p-4 space-y-4 surface-card transition-all duration-200">
        {/* Photo Container - Fixed 180px */}
        <div className="w-full h-[180px] rounded-xl bg-[#F8FAFC] overflow-hidden relative shrink-0">
          <div className="w-full h-full bg-gradient-to-br from-[#2563EB]/10 to-slate-200/50 flex items-center justify-center text-xs text-[#6B7280] font-medium group-hover:scale-105 transition-transform duration-300">
            <span>{category}</span>
          </div>
          {isVerified && (
            <Badge variant="success" className="absolute top-2.5 right-2.5 gap-1 shadow-sm text-[11px] font-bold">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
            </Badge>
          )}
        </div>

        {/* Flexible Body Content */}
        <div className="flex-1 flex flex-col justify-between space-y-2">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-[#2563EB] uppercase tracking-wider">
                {category}
              </span>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                <span>{rating > 0 ? rating.toFixed(1) : '4.8'}</span>
                <span className="text-[#6B7280] font-normal">({reviewCount})</span>
              </div>
            </div>

            {/* Title 18px max 2 lines */}
            <h4 className="text-[18px] font-bold text-[#111827] group-hover:text-[#2563EB] transition-colors line-clamp-2 leading-snug">
              {name}
            </h4>

            {/* Location 13px */}
            <div className="flex items-center gap-1.5 text-[13px] text-[#6B7280]">
              <MapPin className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
              <span className="truncate">{location}</span>
            </div>
          </div>
        </div>

        {/* Pinned Footer */}
        <div className="mt-auto pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-[13px] text-[#6B7280]">
          <span className="flex items-center gap-1 font-medium text-[#111827]">
            <Phone className="w-3.5 h-3.5 text-[#2563EB]" />
            {phone}
          </span>
          <span className="font-bold text-[#2563EB] group-hover:translate-x-0.5 transition-transform">
            View →
          </span>
        </div>
      </Card>
    </Link>
  );
};
