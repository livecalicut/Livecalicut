import { PageHeader } from '@/components/shared/page-header';
import { OrganizerCard } from '@/components/feed/organizer-card';
import { EventCard } from '@/components/cards/event-card';
import { ResponsiveGrid } from '@/components/layout/responsive-grid';
import { UserCheck } from 'lucide-react';

export default async function OrganizerProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const organizerName = slug ? slug.replace(/-/g, ' ').toUpperCase() : 'KOZHIKODE CULTURAL SOCIETY';

  return (
    <div className="space-y-8 py-4">
      <PageHeader
        title={organizerName}
        description="Official Event Host & Cultural Promoter in Kozhikode."
        icon={<UserCheck className="w-6 h-6" />}
        breadcrumbs={[
          { label: 'City Events', href: '/events' },
          { label: organizerName },
        ]}
      />

      <OrganizerCard name={organizerName} />

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Events Hosted by {organizerName}</h3>
        <ResponsiveGrid cols={3}>
          <EventCard
            title="Malabar Food & Culinary Expo 2026"
            date="Sat, 18 Jul • 5:00 PM"
            venue="Calicut Trade Centre, Swapnagari"
            category="Food & Culture"
          />
        </ResponsiveGrid>
      </div>
    </div>
  );
}
