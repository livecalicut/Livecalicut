import { PageHeader } from '@/components/shared/page-header';
import { AgentCard } from '@/components/property/agent-card';
import { UserCheck } from 'lucide-react';

export default async function AgentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="space-y-8 py-4">
      <PageHeader
        title="Real Estate Broker Profile"
        description="Verified Real Estate Agent in Kozhikode."
        icon={<UserCheck className="w-6 h-6" />}
        breadcrumbs={[
          { label: 'Properties', href: '/properties' },
          { label: 'Agent Profile' },
        ]}
      />

      <AgentCard name="Muhammed Shamir" phone="+91 98471 22334" />
    </div>
  );
}
