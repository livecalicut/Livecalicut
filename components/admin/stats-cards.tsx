import React from 'react';
import { Card } from '@/components/ui/card';
import { Users, Store, Newspaper, Calendar, Briefcase, ShoppingBag, Building, Flag } from 'lucide-react';

interface StatsCardsProps {
  metrics: {
    totalUsers: number;
    activeBusinesses: number;
    publishedNews: number;
    upcomingEvents: number;
    activeJobs: number;
    marketplaceItems: number;
    activeProperties: number;
    reportedContent: number;
  };
}

export const StatsCards: React.FC<StatsCardsProps> = ({ metrics }) => {
  const cards = [
    { title: 'Total Citizens', value: metrics.totalUsers, icon: Users, color: 'text-[#2563EB]', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
    { title: 'Commercial Outlets', value: metrics.activeBusinesses, icon: Store, color: 'text-cyan-600', bgColor: 'bg-cyan-50', borderColor: 'border-cyan-200' },
    { title: 'Cyberpark IT Jobs', value: metrics.activeJobs, icon: Briefcase, color: 'text-emerald-600', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200' },
    { title: 'Pre-Owned Classifieds', value: metrics.marketplaceItems, icon: ShoppingBag, color: 'text-purple-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
    { title: 'Real Estate Listings', value: metrics.activeProperties, icon: Building, color: 'text-indigo-600', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-200' },
    { title: 'Published News', value: metrics.publishedNews, icon: Newspaper, color: 'text-teal-600', bgColor: 'bg-teal-50', borderColor: 'border-teal-200' },
    { title: 'Upcoming Events', value: metrics.upcomingEvents, icon: Calendar, color: 'text-amber-600', bgColor: 'bg-amber-50', borderColor: 'border-amber-200' },
    { title: 'Pending Flags', value: metrics.reportedContent, icon: Flag, color: 'text-rose-600', bgColor: 'bg-rose-50', borderColor: 'border-rose-200' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <Card key={c.title} className="p-5 border border-[#E5E7EB] bg-white rounded-2xl shadow-xs space-y-3 hover:border-blue-200 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#6B7280] font-sans">{c.title}</span>
              <div className={`w-9 h-9 rounded-xl ${c.bgColor} border ${c.borderColor} flex items-center justify-center ${c.color}`}>
                <Icon className="w-4.5 h-4.5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-[#111827] font-sans tracking-tight">
              {c.value.toLocaleString()}
            </p>
          </Card>
        );
      })}
    </div>
  );
};
