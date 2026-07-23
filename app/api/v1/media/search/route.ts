import { ApiResponse } from '@/lib/api/response';
import { MediaDamService } from '@/lib/services/media-dam.service';
import { mediaSearchSchema } from '@/lib/validations/media';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return ApiResponse.error('UNAUTHORIZED', 'Authentication required to search media library', [], 401);
    }

    const { searchParams } = new URL(request.url);
    const rawQuery = {
      q: searchParams.get('q') || undefined,
      module: searchParams.get('module') || 'all',
      ownerId: searchParams.get('ownerId') || undefined,
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '20',
    };

    const validated = mediaSearchSchema.parse(rawQuery);
    const { data, total } = await MediaDamService.searchAssets(validated);

    return ApiResponse.success(data, 'Media library search completed', {
      page: validated.page,
      limit: validated.limit,
      total,
    });
  } catch (err: any) {
    return ApiResponse.error('SEARCH_ERROR', err.message, [], 400);
  }
}
