import { ApiResponse } from '@/lib/api/response';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

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
