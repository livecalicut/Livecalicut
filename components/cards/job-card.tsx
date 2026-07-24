import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, IndianRupee } from 'lucide-react';
import { CoverImage } from '@/components/shared/cover-image';

interface JobCardProps {
  id?: string;
  slug?: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  salary?: string;
  image?: string | null;
}

export const JobCard: React.FC<JobCardProps> = ({
  id,
  slug,
  title,
  company,
  location,
  jobType,
  salary = '₹25,000 - ₹45,000 / mo',
  image,
}) => {
  const href = slug ? `/jobs/${slug}` : id ? `/jobs/${id}` : '/jobs';

  return (
    <Link href={href} className="group block h-full">
      <Card className="surface-card flex h-full flex-col justify-between space-y-4 p-5 transition-all duration-200">
        <div className="relative h-[180px] w-full shrink-0 overflow-hidden rounded-xl border border-[#E5E7EB]">
          <CoverImage src={image} alt={company || title} />
          <Badge className="absolute right-2.5 top-2.5 border border-blue-200 bg-blue-50 text-[10px] font-bold uppercase text-[#2563EB]">
            {jobType || 'Full Time'}
          </Badge>
        </div>

        <div className="flex-1 space-y-2">
          <p className="text-[13px] font-bold text-[#6B7280]">{company || 'Cyberpark Enterprise'}</p>
          <h4 className="line-clamp-2 text-[18px] font-bold leading-snug text-[#111827] transition-colors group-hover:text-[#2563EB]">
            {title}
          </h4>
          <p className="line-clamp-2 text-[15px] leading-relaxed text-[#6B7280]">
            Hiring qualified professionals for cyberpark IT and regional operations in Kozhikode.
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-[#E5E7EB] pt-3 text-[13px] text-[#6B7280]">
          <span className="flex items-center gap-1 font-medium text-[#111827]">
            <MapPin className="h-3.5 w-3.5 text-[#2563EB]" />
            {location || 'Kozhikode'}
          </span>
          <span className="flex items-center gap-0.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-bold text-emerald-600">
            <IndianRupee className="h-3 w-3" /> {salary}
          </span>
        </div>
      </Card>
    </Link>
  );
};
