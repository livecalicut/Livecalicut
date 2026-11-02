import { PageHeader } from '@/components/shared/page-header';
import { AgentCard } from '@/components/property/agent-card';
import { UserCheck } from 'lucide-react';

export default async function AgentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-6 sm:py-10">
      <PageHeader
        title="Real Estate Broker Profile"
        description="Verified Real Estate Agent in Calicut."
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
