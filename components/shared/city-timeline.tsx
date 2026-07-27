'use client';

import React, { useState, useEffect } from 'react';
import { Newspaper, Calendar, MapPin, ArrowRight, Loader2, Radio } from 'lucide-react';
import Link from 'next/link';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  slug: string;
  published_at: string;
  news_categories?: { name: string; slug: string };
}

export const CityTimeline: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestNews();
  }, []);

  const fetchLatestNews = async () => {
    try {
      const res = await fetch('/api/news?limit=3');
      const json = await res.json();
      if (json.data && json.data.length > 0) {
        setNews(json.data.slice(0, 3));
      }
    } catch (err) {
      console.error('Failed to fetch city timeline news', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
      return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' Today';
    }
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 gap-3 text-[#6B7280]">
        <Loader2 className="w-5 h-5 animate-spin text-[#2563EB]" />
        <span className="text-sm font-medium">Loading latest city news...</span>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="rounded-3xl border border-[#E5E7EB] bg-white px-6 py-12 text-center shadow-xs">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50">
          <Newspaper className="h-7 w-7 text-[#2563EB]" />
        </div>
        <h3 className="mt-4 text-lg font-bold text-[#111827]">No city updates yet</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-[#6B7280]">
          Editorial posts will appear here as soon as news is published. Meanwhile, explore what’s on today.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 rounded-full border border-[#E5E7EB] bg-[#F8FAFC] px-3.5 py-1.5 text-xs font-bold text-[#111827] hover:border-[#2563EB]"
          >
            <Calendar className="h-3.5 w-3.5 text-[#2563EB]" />
            Events today
          </Link>
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 rounded-full border border-[#E5E7EB] bg-[#F8FAFC] px-3.5 py-1.5 text-xs font-bold text-[#111827] hover:border-[#2563EB]"
          >
            <Newspaper className="h-3.5 w-3.5 text-[#2563EB]" />
            News page
          </Link>
          <Link
            href="/business"
            className="inline-flex items-center gap-1.5 rounded-full border border-[#E5E7EB] bg-[#F8FAFC] px-3.5 py-1.5 text-xs font-bold text-[#111827] hover:border-[#2563EB]"
          >
            <MapPin className="h-3.5 w-3.5 text-[#2563EB]" />
            Local businesses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Live indicator */}
      <div className="flex items-center gap-2 text-xs text-[#6B7280] font-semibold mb-2">
        <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
        <span>Live — Auto-refreshes every 60 seconds</span>
      </div>

      <div className="relative border-l-2 border-blue-200 ml-4 lg:ml-8 pl-6 lg:pl-10 space-y-8">
        {news.map((item, index) => {
          const icons = [Newspaper, Calendar, MapPin];
          const Icon = icons[index % icons.length];

          return (
            <div key={item.id} className="relative group">
              {/* Timeline Indicator Dot */}
              <div className="absolute -left-[31px] lg:-left-[47px] top-1.5 w-6 h-6 rounded-full bg-white border-2 border-[#2563EB] flex items-center justify-center shadow-xs">
                <div className="w-2 h-2 rounded-full bg-[#2563EB]" />
              </div>

              <div className="surface-card p-6 space-y-3 transition-all duration-200 group-hover:-translate-y-1">
                <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                  <span className="font-bold text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                    {formatTime(item.published_at)}
                  </span>
                  <span className="text-[11px] font-extrabold text-[#6B7280] uppercase tracking-wider">
                    {item.news_categories?.name || 'News Editorial'}
                  </span>
                </div>

                <h4 className="text-[20px] font-bold text-[#111827] group-hover:text-[#2563EB] transition-colors font-sans">
                  {item.title}
                </h4>

                {item.summary && (
                  <p className="text-[15px] text-[#6B7280] leading-relaxed font-normal line-clamp-2">
                    {item.summary}
                  </p>
                )}

                <div className="pt-2 flex items-center justify-end">
                  <Link
                    href={`/news/${item.slug}`}
                    className="inline-flex items-center gap-1 text-[13px] font-bold text-[#2563EB] hover:underline"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
