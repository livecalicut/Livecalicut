import { PageHeader } from '@/components/shared/page-header';
import { Activity } from 'lucide-react';

export default function ActivityTimelinePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <PageHeader
        title="Live Ecosystem Activity Stream"
        description="Realtime feed of new business listings, candidate job applications and community reviews."
        icon={<Activity className="w-6 h-6" />}
        breadcrumbs={[{ label: 'Activity Feed' }]}
      />

      <div className="rounded-2xl border border-[#E5E7EB] bg-white px-6 py-14 text-center">
        <p className="text-sm font-semibold text-[#6B7280]">No activity yet.</p>
      </div>
    </div>
  );
}
