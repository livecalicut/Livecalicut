import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/supabase/require-auth';

export async function GET() {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  const { data, error } = await auth.supabase
    .from('job_applications')
    .select(
      'id, status, created_at, jobs(title, slug, salary_min, salary_max, businesses(name))'
    )
    .eq('applicant_id', auth.user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data || [] });
}
