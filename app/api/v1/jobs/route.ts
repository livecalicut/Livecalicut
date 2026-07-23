import { ApiResponse } from '@/lib/api/response';
import { JobService } from '@/lib/services/job.service';
import { createJobSchema } from '@/lib/validations/job';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const jobs = await JobService.getJobs();
    return ApiResponse.success(jobs, 'Jobs fetched successfully');
  } catch (err: any) {
    return ApiResponse.error('FETCH_ERROR', err.message, [], 500);
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return ApiResponse.error('UNAUTHORIZED', 'Authentication token required', [], 401);
    }

    const body = await request.json();
    const validated = createJobSchema.parse(body);

    const job = await JobService.createJob({
      ...validated,
      user_id: session.user.id,
    });

    return ApiResponse.success(job, 'Job vacancy posted successfully', {}, 201);
  } catch (err: any) {
    return ApiResponse.error('VALIDATION_ERROR', err.message, err.errors || [], 400);
  }
}
