import { PageHeader } from '@/components/shared/page-header';
import { ActivityTimelineCard } from '@/components/notifications/activity-timeline-card';
import { Activity } from 'lucide-react';

export default function ActivityTimelinePage() {
  const activities = [
    {
      actorName: 'Arjun K. Varma',
      actionType: 'Listing Created',
      description: 'Posted pre-owned MacBook Pro M2 in Buy & Sell Marketplace.',
      timestamp: '5 mins ago',
    },
    {
      actorName: 'Cyberpark Software Solutions',
      actionType: 'Job Vacancy',
      description: 'Published opening for Senior React & Fullstack Engineer.',
      timestamp: '20 mins ago',
    },
    {
      actorName: 'Nitin Varma',
      actionType: 'Review Posted',
      description: 'Rated Paragon Restaurant 5.0 ★ for Malabar Mutton Biryani.',
      timestamp: '1 hour ago',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <PageHeader
        title="Live Ecosystem Activity Stream"
        description="Realtime feed of new business listings, candidate job applications & community reviews."
        icon={<Activity className="w-6 h-6" />}
        breadcrumbs={[{ label: 'Activity Feed' }]}
      />

      <div className="space-y-3">
        {activities.map((act, idx) => (
          <ActivityTimelineCard
            key={idx}
            actorName={act.actorName}
            actionType={act.actionType}
            description={act.description}
            timestamp={act.timestamp}
          />
        ))}
      </div>
    </div>
  );
}
