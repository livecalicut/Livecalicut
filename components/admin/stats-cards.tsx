import React from 'react';
import { StatTile, type StatIconName, type StatTone } from '@/components/dashboard/stat-tile';

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
  const cards: { title: string; value: number; icon: StatIconName; tone: StatTone }[] = [
    { title: 'Total Citizens', value: metrics.totalUsers, icon: 'users', tone: 'blue' },
    { title: 'Commercial Outlets', value: metrics.activeBusinesses, icon: 'store', tone: 'cyan' },
    { title: 'Cyberpark IT Jobs', value: metrics.activeJobs, icon: 'briefcase', tone: 'emerald' },
    {
      title: 'Pre-Owned Classifieds',
      value: metrics.marketplaceItems,
      icon: 'shopping-bag',
      tone: 'purple',
    },
    {
      title: 'Real Estate Listings',
      value: metrics.activeProperties,
      icon: 'building',
      tone: 'indigo',
    },
    { title: 'Published News', value: metrics.publishedNews, icon: 'newspaper', tone: 'teal' },
    { title: 'Upcoming Events', value: metrics.upcomingEvents, icon: 'calendar', tone: 'amber' },
    { title: 'Pending Flags', value: metrics.reportedContent, icon: 'flag', tone: 'rose' },
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
