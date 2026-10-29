import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { ApiResponse } from '@/lib/api/response';
import { MediaDamService } from '@/lib/services/media-dam.service';
import { mediaUploadSchema } from '@/lib/validations/media';
import { createAdminClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/supabase/require-auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) {
      return ApiResponse.error('UNAUTHORIZED', 'Authentication required to upload media', [], 401);
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return ApiResponse.error('VALIDATION_ERROR', 'A file must be provided in the "file" field', [], 400);
    }

    const validated = mediaUploadSchema.parse({
      module: formData.get('module'),
      entityType: formData.get('entityType'),
      entityId: formData.get('entityId'),
      altText: formData.get('altText'),
      caption: formData.get('caption'),
      isPublic: formData.get('isPublic'),
      tags: formData.get('tags'),
    });

    // Storage writes go through the service-role client: the user is already
    // verified above, and the bucket has no per-user RLS policies.
    const admin = await createAdminClient();
    const asset = await MediaDamService.uploadFile(admin, file, auth.user.id, validated);

    return ApiResponse.success(
      { ...asset, url: asset.public_url, media_id: asset.id },
      'Media asset uploaded successfully',
      { bucket: asset.storage_bucket }
    );
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      return ApiResponse.error('VALIDATION_ERROR', 'Invalid upload metadata', err.issues, 400);
    }
    const message = err instanceof Error ? err.message : 'Upload failed';
    return ApiResponse.error('UPLOAD_ERROR', message, [], 400);
  }
}
