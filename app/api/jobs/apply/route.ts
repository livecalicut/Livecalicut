import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { applyJobSchema } from '@/lib/validations/job';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required to apply for jobs' }, { status: 401 });
    }

    const body = await request.json();
    const validated = applyJobSchema.parse(body);

    const { data, error } = await supabase
      .from('job_applications')
      .insert({
        job_id: validated.jobId,
        applicant_id: session.user.id,
        resume_url: validated.resumeUrl,
        cover_letter: validated.coverLetter,
        phone: validated.phone,
        email: validated.email,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
