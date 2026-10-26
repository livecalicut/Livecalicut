'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, IndianRupee, Briefcase, Heart } from 'lucide-react';

interface JobCardProps {
  id?: string;
  slug?: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  salary?: string;
  image?: string | null;
  experience?: string;
  timeAgo?: string;
}

export const JobCard: React.FC<JobCardProps> = ({
  id,
  slug,
  title,
  company,
  location,
  jobType,
  salary = '₹25,000 – ₹45,000 / mo',
  image,
  experience = '1-3 Years',
  timeAgo: _timeAgo,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const href = slug ? `/jobs/${slug}` : id ? `/jobs/${id}` : '/jobs';

  const toggleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <Link href={href} className="group block h-full">
      <Card className="surface-card flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs hover:shadow-md transition-all duration-200 hover:-translate-y-1">
        {/* Top Header: Logo + Job Type + Fav */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-[#2563EB] overflow-hidden">
              {image ? (
                <img src={image} alt={company} className="w-full h-full object-cover" />
              ) : (
                <Briefcase className="w-6 h-6" />
              )}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 line-clamp-1">{company || 'Calicut Enterprise'}</p>
              <h4 className="line-clamp-1 text-base font-bold text-slate-900 group-hover:text-[#2563EB] transition-colors">
                {title}
              </h4>
            </div>
          </div>

          <button
            onClick={toggleFav}
            className="w-7 h-7 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors cursor-pointer shrink-0"
            aria-label="Save job"
          >
            <Heart
              className={`w-3.5 h-3.5 transition-colors ${
                isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
              }`}
            />
          </button>
        </div>

        {/* Badges & Meta */}
        <div className="my-3 flex flex-wrap items-center gap-1.5 pt-1">
          <Badge className="border border-blue-200 bg-blue-50 text-[10px] font-bold text-[#2563EB]">
            {jobType || 'Full Time'}
          </Badge>
          {experience && (
            <Badge variant="outline" className="border-slate-200 text-[10px] font-semibold text-slate-600">
              {experience}
            </Badge>
          )}
        </div>

        {/* Salary Highlight */}
        <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/80 w-fit">
          <IndianRupee className="w-3.5 h-3.5" />
          <span>{salary}</span>
        </div>

        {/* Card Footer: Location + Apply */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
          <span className="flex items-center gap-1 truncate max-w-[140px]">
            <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{location || 'Calicut'}</span>
          </span>

          <span className="inline-flex items-center gap-1 font-bold text-[#2563EB] group-hover:translate-x-0.5 transition-transform">
            <span>Apply Now</span>
            <span>&rarr;</span>
          </span>
        </div>
      </Card>
    </Link>
  );
};

