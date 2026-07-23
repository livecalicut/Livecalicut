import { ApiResponse } from '@/lib/api/response';
import { MediaDamService } from '@/lib/services/media-dam.service';
import { mediaUploadSchema } from '@/lib/validations/media';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return ApiResponse.error('UNAUTHORIZED', 'Authentication required to upload media', [], 401);
    }

    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file || typeof file === 'string') {
      return ApiResponse.error('VALIDATION_ERROR', 'A file must be provided in the "file" field', [], 400);
    }

    // Validate metadata fields from form
    const rawMeta = {
      module: formData.get('module') as string,
      entityType: formData.get('entityType') as string | undefined,
      entityId: formData.get('entityId') as string | undefined,
      altText: formData.get('altText') as string | undefined,
      caption: formData.get('caption') as string | undefined,
      isPublic: formData.get('isPublic') as string | undefined,
      tags: formData.get('tags') as string | undefined,
    };

    const validated = mediaUploadSchema.parse(rawMeta);

    // Delegate to DAM service
    const asset = await MediaDamService.uploadFile(file, session.user.id, validated);

    return ApiResponse.success(asset, 'Media asset uploaded and registered successfully', {
      assetId: asset.id,
      bucket: asset.storage_bucket,
      publicUrl: asset.public_url,
    });
  } catch (err: any) {
    return ApiResponse.error('UPLOAD_ERROR', err.message, err.errors || [], 400);
  }
}
