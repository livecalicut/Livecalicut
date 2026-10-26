import { notFound } from 'next/navigation';
import { createPublicClient } from '@/lib/supabase/server';

export default async function MarketplaceDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createPublicClient();
  const { data } = await supabase
    .from('marketplace_items')
    .select('title, description, price')
    .eq('slug', slug)
    .is('deleted_at', null)
    .maybeSingle();

  if (!data) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-4 py-8">
      <h1 className="text-3xl font-bold text-[#111827]">{data.title}</h1>
      {data.price != null && <p className="text-lg font-semibold text-[#2563EB]">₹{data.price}</p>}
      <p className="whitespace-pre-wrap text-sm text-[#374151]">{data.description}</p>
    </div>
  );
}
