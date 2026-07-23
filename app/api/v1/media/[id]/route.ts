import { ApiResponse } from '@/lib/api/response';
import { MediaDamService } from '@/lib/services/media-dam.service';
import { createClient } from '@/lib/supabase/server';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const asset = await MediaDamService.getAsset(id);

    if (!asset) {
      return ApiResponse.error('NOT_FOUND', `Media asset ${id} not found or has been deleted`, [], 404);
    }

    return ApiResponse.success(asset, 'Media asset metadata retrieved successfully');
  } catch (err: any) {
    return ApiResponse.error('FETCH_ERROR', err.message, [], 500);
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return ApiResponse.error('UNAUTHORIZED', 'Authentication required to delete media', [], 401);
    }

    const { id } = await params;
    await MediaDamService.softDeleteAsset(id, session.user.id);

    return ApiResponse.success({ id }, 'Media asset soft-deleted successfully');
  } catch (err: any) {
    return ApiResponse.error('DELETE_ERROR', err.message, [], 400);
  }
}
