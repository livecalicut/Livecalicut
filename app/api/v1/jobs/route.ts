import { ApiResponse } from '@/lib/api/response';
import { JobService } from '@/lib/services/job.service';
import { createJobSchema } from '@/lib/validations/job';
import { requireRole } from '@/lib/supabase/require-auth';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get('page') || 1));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit') || 9)));
    const keyword = searchParams.get('q') || searchParams.get('search') || undefined;
    const employmentType = searchParams.get('jobType') || searchParams.get('type') || undefined;

    const { data, total } = await JobService.getJobs({
      page,
      limit,
      keyword,
      employmentType: employmentType || undefined,
    });

    return ApiResponse.success(data, 'Jobs fetched successfully', {
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      hasMore: page * limit < total,
    });
  } catch (err: any) {
    return ApiResponse.error('FETCH_ERROR', err.message, [], 500);
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireRole(['Merchant', 'City Admin', 'Super Admin']);
    if (auth instanceof NextResponse) return auth;

    const body = await request.json();
    const validated = createJobSchema.parse(body);

    const job = await JobService.createJob({
      ...validated,
      user_id: auth.user.id,
    });

    return ApiResponse.success(job, 'Job vacancy posted successfully', {}, 201);
  } catch (err: any) {
    return ApiResponse.error('VALIDATION_ERROR', err.message, err.errors || [], 400);
  }
}
