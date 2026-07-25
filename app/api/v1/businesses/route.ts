import { NextResponse } from 'next/server';
import { ApiResponse } from '@/lib/api/response';
import { BusinessService } from '@/lib/services/business.service';
import { createBusinessSchema } from '@/lib/validations/business';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const keyword = searchParams.get('q') || undefined;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10) || 20));

    const { data, total } = await BusinessService.getBusinesses({
      categorySlug: category,
      keyword,
      page,
      limit,
    });

    return ApiResponse.success(data, 'Businesses fetched successfully', {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    });
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
    const validated = createBusinessSchema.parse(body);

    const business = await BusinessService.createBusiness({
      ...validated,
      owner_id: session.user.id,
    });

    return ApiResponse.success(business, 'Business listing created successfully', {}, 201);
  } catch (err: any) {
    return ApiResponse.error('VALIDATION_ERROR', err.message, err.errors || [], 400);
  }
}
