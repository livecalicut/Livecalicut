import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/supabase/require-auth';

/**
 * POST /api/jobs/save
 * Toggle saved_jobs for the authenticated user.
 * Body: { jobId?: uuid, slug?: string }
 */
export async function POST(request: Request) {
  try {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const body = await request.json().catch(() => ({}));
    let jobId = typeof body.jobId === 'string' ? body.jobId : '';
    const slug = typeof body.slug === 'string' ? body.slug.trim() : '';

    if (!jobId && slug) {
      const { data: job } = await auth.supabase
        .from('jobs')
        .select('id')
        .eq('slug', slug)
        .is('deleted_at', null)
        .maybeSingle();
      jobId = job?.id || '';
    }

    if (!jobId) {
      return NextResponse.json({ error: 'jobId or slug is required' }, { status: 400 });
    }

    const { data: existing } = await auth.supabase
      .from('saved_jobs')
      .select('id')
      .eq('user_id', auth.user.id)
      .eq('job_id', jobId)
      .maybeSingle();

    if (existing) {
      await auth.supabase.from('saved_jobs').delete().eq('id', existing.id);
      return NextResponse.json({ saved: false, favorited: false });
    }

    const { error } = await auth.supabase.from('saved_jobs').insert({
      user_id: auth.user.id,
      job_id: jobId,
    });
    if (error) throw error;

    return NextResponse.json({ saved: true, favorited: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to save job';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
