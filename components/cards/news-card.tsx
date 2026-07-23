import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, ArrowUpRight } from 'lucide-react';

interface NewsCardProps {
  title: string;
  excerpt: string;
  category: string;
  timeAgo: string;
}

export const NewsCard: React.FC<NewsCardProps> = ({
  title,
  excerpt,
  category,
  timeAgo,
}) => {
  return (
    <Link href="/news" className="block group h-full">
      <Card className="h-full flex flex-col justify-between p-4 space-y-4 surface-card transition-all duration-200">
        {/* Photo Container - Fixed 180px */}
        <div className="w-full h-[180px] rounded-xl bg-[#F8FAFC] overflow-hidden relative shrink-0">
          <div className="w-full h-full bg-gradient-to-br from-[#2563EB]/10 to-slate-200/50 flex items-center justify-center text-xs text-[#6B7280] font-medium group-hover:scale-105 transition-transform duration-300">
            <span>Editorial Cover</span>
          </div>
        </div>

        {/* Flexible Body Content */}
        <div className="flex-1 flex flex-col justify-between space-y-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="bg-blue-50 text-[#2563EB] border border-blue-200 text-[10px] font-bold uppercase">
                {category}
              </Badge>
              <span className="text-[13px] text-[#6B7280] font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#2563EB]" /> {timeAgo}
              </span>
            </div>

            <h4 className="text-[18px] font-bold text-[#111827] group-hover:text-[#2563EB] transition-colors line-clamp-2 leading-snug">
              {title}
            </h4>

            <p className="text-[15px] text-[#6B7280] line-clamp-3 leading-relaxed">
              {excerpt}
            </p>
          </div>
        </div>

        {/* Pinned Footer */}
        <div className="mt-auto pt-3 border-t border-[#E5E7EB] flex items-center justify-end text-[13px] font-bold text-[#2563EB]">
          <span className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            Read Story <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </Card>
    </Link>
  );
};
