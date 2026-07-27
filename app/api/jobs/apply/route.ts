import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/supabase/require-auth';
import { z } from 'zod';

const applyBodySchema = z.object({
  jobId: z.string().uuid().optional(),
  slug: z.string().min(1).optional(),
  resume_url: z.string().url('Valid resume URL is required').optional(),
  resumeUrl: z.string().url('Valid resume URL is required').optional(),
  cover_letter: z.string().optional(),
  coverLetter: z.string().optional(),
  phone: z.string().min(10, 'Valid mobile number required'),
  email: z.string().email('Valid email address required'),
  full_name: z.string().optional(),
});

/**
 * POST /api/jobs/apply
 * Submit a job application — authenticated users only.
 */
export async function POST(request: Request) {
  try {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const body = applyBodySchema.parse(await request.json());
    const resumeUrl = body.resume_url || body.resumeUrl;
    if (!resumeUrl) {
      return NextResponse.json({ error: 'Resume URL is required' }, { status: 400 });
    }

    let jobId = body.jobId || '';
    if (!jobId && body.slug) {
      const { data: job } = await auth.supabase
        .from('jobs')
        .select('id')
        .eq('slug', body.slug)
        .is('deleted_at', null)
        .maybeSingle();
      jobId = job?.id || '';
    }

    if (!jobId) {
      return NextResponse.json({ error: 'jobId or slug is required' }, { status: 400 });
    }

    const { data, error } = await auth.supabase
      .from('job_applications')
      .insert({
        job_id: jobId,
        applicant_id: auth.user.id,
        resume_url: resumeUrl,
        cover_letter: body.cover_letter || body.coverLetter || null,
        phone: body.phone,
        email: body.email,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to apply';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
