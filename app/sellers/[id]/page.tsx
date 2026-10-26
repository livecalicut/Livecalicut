import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/shared/page-header';
import { SellerCard } from '@/components/marketplace/seller-card';
import { UserCheck } from 'lucide-react';
import { createPublicClient } from '@/lib/supabase/server';

export default async function SellerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createPublicClient();
  const { data } = await supabase
    .from('profiles')
    .select('full_name, phone')
    .eq('id', id)
    .is('deleted_at', null)
    .maybeSingle();

  if (!data) notFound();

  return (
    <div className="space-y-8 py-4">
      <PageHeader
        title="Seller Profile"
        description="Verified local seller in Calicut."
        icon={<UserCheck className="w-6 h-6" />}
        breadcrumbs={[
          { label: 'Marketplace', href: '/marketplace' },
          { label: 'Seller Profile' },
        ]}
      />

      <SellerCard
        fullName={data.full_name}
        phone={data.phone || ''}
        whatsapp={data.phone || ''}
        isVerified={true}
      />

      <p className="text-sm font-semibold text-[#6B7280]">This seller has no public listings yet.</p>
    </div>
  );
}
