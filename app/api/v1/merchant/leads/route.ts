import { ApiResponse } from '@/lib/api/response';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    // getUser() verifies the token with Supabase Auth; getSession() trusts the cookie
    const { data: { user: authUser } } = await supabase.auth.getUser();
    const session = authUser ? { user: authUser } : null;

    if (!session?.user) {
      return ApiResponse.error('UNAUTHORIZED', 'Merchant authentication required', [], 401);
    }

    const { data, error } = await supabase
      .from('property_inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return ApiResponse.success(data || [], 'Customer inquiry leads retrieved successfully');
  } catch (err: any) {
    return ApiResponse.error('FETCH_ERROR', err.message, [], 500);
  }
}
