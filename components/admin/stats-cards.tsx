import React from 'react';
import { Users, Store, Newspaper, Calendar, Briefcase, ShoppingBag, Building, Flag } from 'lucide-react';
import { StatTile, type StatTone } from '@/components/dashboard/stat-tile';

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
  const cards: { title: string; value: number; icon: typeof Users; tone: StatTone }[] = [
    { title: 'Total Citizens', value: metrics.totalUsers, icon: Users, tone: 'blue' },
    { title: 'Commercial Outlets', value: metrics.activeBusinesses, icon: Store, tone: 'cyan' },
    { title: 'Cyberpark IT Jobs', value: metrics.activeJobs, icon: Briefcase, tone: 'emerald' },
    { title: 'Pre-Owned Classifieds', value: metrics.marketplaceItems, icon: ShoppingBag, tone: 'purple' },
    { title: 'Real Estate Listings', value: metrics.activeProperties, icon: Building, tone: 'indigo' },
    { title: 'Published News', value: metrics.publishedNews, icon: Newspaper, tone: 'teal' },
    { title: 'Upcoming Events', value: metrics.upcomingEvents, icon: Calendar, tone: 'amber' },
    { title: 'Pending Flags', value: metrics.reportedContent, icon: Flag, tone: 'rose' },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <StatTile
          key={card.title}
          title={card.title}
          value={card.value}
          icon={card.icon}
          tone={card.tone}
        />
      ))}
    </div>
  );
};
