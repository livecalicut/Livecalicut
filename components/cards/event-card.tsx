import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin } from 'lucide-react';

interface EventCardProps {
  title: string;
  date: string;
  venue: string;
  category: string;
}

export const EventCard: React.FC<EventCardProps> = ({
  title,
  date,
  venue,
  category,
}) => {
  return (
    <Link href="/events" className="block group h-full">
      <Card className="h-full flex flex-col justify-between p-4 space-y-4 surface-card transition-all duration-200">
        {/* Photo Container - Fixed 180px */}
        <div className="w-full h-[180px] rounded-xl bg-[#F8FAFC] overflow-hidden relative shrink-0">
          <div className="w-full h-full bg-gradient-to-br from-[#2563EB]/10 to-slate-200/50 flex items-center justify-center text-xs text-[#6B7280] font-medium group-hover:scale-105 transition-transform duration-300">
            <span>Event Poster</span>
          </div>
          <Badge variant="secondary" className="absolute top-2.5 left-2.5 bg-slate-900/80 text-white border-none text-[10px] font-bold shadow-sm">
            {category}
          </Badge>
        </div>

        {/* Flexible Content */}
        <div className="flex-1 flex flex-col justify-between space-y-2">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 w-fit">
              <Calendar className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>{date}</span>
            </div>

            <h4 className="text-[18px] font-bold text-[#111827] group-hover:text-[#2563EB] transition-colors line-clamp-2 leading-snug">
              {title}
            </h4>
          </div>
        </div>

        {/* Pinned Footer */}
        <div className="mt-auto pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-[13px] text-[#6B7280]">
          <span className="flex items-center gap-1.5 font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
            <span className="truncate">{venue}</span>
          </span>
          <span className="font-bold text-[#2563EB] group-hover:translate-x-0.5 transition-transform">
            Book →
          </span>
        </div>
      </Card>
    </Link>
  );
};
