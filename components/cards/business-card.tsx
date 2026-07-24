import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Phone, CheckCircle2 } from 'lucide-react';
import { CoverImage } from '@/components/shared/cover-image';

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
  phone = '+91 98765 43210',
  isVerified = true,
  image,
}) => {
  const href = slug ? `/business/${slug}` : id ? `/business/${id}` : '/business';

  return (
    <Link href={href} className="group block h-full">
      <Card className="surface-card flex h-full flex-col justify-between space-y-4 p-4 transition-all duration-200">
        <div className="relative h-[180px] w-full shrink-0 overflow-hidden rounded-xl">
          <CoverImage src={image} alt={name} />
          {isVerified && (
            <Badge
              variant="success"
              className="absolute right-2.5 top-2.5 gap-1 text-[11px] font-bold shadow-sm"
            >
              <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Verified
            </Badge>
          )}
        </div>

        <div className="flex flex-1 flex-col justify-between space-y-2">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#2563EB]">
                {category}
              </span>
              <div className="flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-600">
                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                <span>{rating > 0 ? rating.toFixed(1) : '4.8'}</span>
                <span className="font-normal text-[#6B7280]">({reviewCount})</span>
              </div>
            </div>

            <h4 className="line-clamp-2 text-[18px] font-bold leading-snug text-[#111827] transition-colors group-hover:text-[#2563EB]">
              {name}
            </h4>

            <div className="flex items-center gap-1.5 text-[13px] text-[#6B7280]">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-[#2563EB]" />
              <span className="truncate">{location}</span>
            </div>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-[#E5E7EB] pt-3 text-[13px] text-[#6B7280]">
          <span className="flex items-center gap-1 font-medium text-[#111827]">
            <Phone className="h-3.5 w-3.5 text-[#2563EB]" />
            {phone}
          </span>
          <span className="font-bold text-[#2563EB] transition-transform group-hover:translate-x-0.5">
            View →
          </span>
        </div>
      </Card>
    </Link>
  );
};
