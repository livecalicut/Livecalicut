import { isMissingTable } from '@/lib/api/errors';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('marketplace_categories')
    .select('*')
    .is('deleted_at', null)
    .order('display_order', { ascending: true });

  if (error) {
    if (isMissingTable(error)) return NextResponse.json({ data: [] });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
