import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, MapPin, IndianRupee } from 'lucide-react';

interface JobCardProps {
  id?: string;
  slug?: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  salary?: string;
}

export const JobCard: React.FC<JobCardProps> = ({
  id,
  slug,
  title,
  company,
  location,
  jobType,
  salary = '₹25,000 - ₹45,000 / mo',
}) => {
  const href = slug ? `/jobs/${slug}` : id ? `/jobs/${id}` : '/jobs';

  return (
    <Link href={href} className="block group h-full">
      <Card className="h-full flex flex-col justify-between p-5 space-y-4 surface-card transition-all duration-200">
        {/* Top Branding Block - Fixed 180px */}
        <div className="w-full h-[180px] rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] p-4 flex flex-col justify-between shrink-0">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB] font-bold shadow-sm">
              <Building className="w-6 h-6" />
            </div>
            <Badge variant="secondary" className="bg-blue-50 text-[#2563EB] border border-blue-200 uppercase text-[10px] font-bold">
              {jobType || 'Full Time'}
            </Badge>
          </div>

          <div className="space-y-1">
            <p className="text-[13px] font-bold text-[#6B7280]">{company || 'Cyberpark Enterprise'}</p>
            <h4 className="text-[18px] font-bold text-[#111827] group-hover:text-[#2563EB] transition-colors line-clamp-2 leading-snug">
              {title}
            </h4>
          </div>
        </div>

        {/* Flexible Body Details */}
        <div className="flex-1 space-y-2">
          <p className="text-[15px] text-[#6B7280] line-clamp-2 leading-relaxed">
            Hiring qualified professionals for cyberpark IT and regional operations in Kozhikode.
          </p>
        </div>

        {/* Pinned Footer */}
        <div className="mt-auto pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-[13px] text-[#6B7280]">
          <span className="flex items-center gap-1 font-medium text-[#111827]">
            <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
            {location || 'Kozhikode'}
          </span>
          <span className="font-bold text-emerald-600 flex items-center gap-0.5 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <IndianRupee className="w-3 h-3" /> {salary}
          </span>
        </div>
      </Card>
    </Link>
  );
};
