import { notFound } from 'next/navigation';
import { createPublicClient } from '@/lib/supabase/server';

export default async function EventDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createPublicClient();
  const { data } = await supabase
    .from('events')
    .select('title, description, venue, start_date')
    .eq('slug', slug)
    .is('deleted_at', null)
    .maybeSingle();

  if (!data) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-4 py-8">
      <h1 className="text-3xl font-bold text-[#111827]">{data.title}</h1>
      <p className="text-sm text-[#6B7280]">{data.venue}</p>
      {data.start_date && (
        <p className="text-sm font-semibold text-[#111827]">
          {new Date(data.start_date).toLocaleString('en-IN')}
        </p>
      )}
      <p className="whitespace-pre-wrap text-sm text-[#374151]">{data.description}</p>
    </div>
  );
}
