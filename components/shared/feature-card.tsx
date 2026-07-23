import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface FeatureCardProps {
  title: string;
  category?: string;
  tag?: string;
  imagePlaceholder?: string;
  children?: React.ReactNode;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  category = 'Directory',
  tag = 'Featured',
  children,
}) => {
  return (
    <Card className="h-full flex flex-col justify-between p-4 space-y-4 surface-card transition-all duration-200">
      {/* Photo Container - Fixed 180px */}
      <div className="w-full h-[180px] rounded-xl bg-[#F8FAFC] overflow-hidden relative shrink-0">
        <div className="w-full h-full bg-gradient-to-br from-[#2563EB]/10 to-slate-200/50 flex items-center justify-center text-xs text-[#6B7280] font-medium">
          <span>{title}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between space-y-2">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold uppercase text-[11px] text-[#2563EB] tracking-wider">
              {category}
            </span>
            <Badge variant="secondary" className="bg-blue-50 text-[#2563EB] text-[10px] font-bold border border-blue-200">
              {tag}
            </Badge>
          </div>

          <h4 className="text-[18px] font-bold text-[#111827] line-clamp-2 leading-snug">{title}</h4>
        </div>

        {children}
      </div>
    </Card>
  );
};
