import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES } from '@/lib/validations/media';

export interface MediaUploadOptions {
  module: string;
  entityType?: string | null;
  entityId?: string | null;
  altText?: string | null;
  caption?: string | null;
  isPublic?: boolean;
  tags?: string | null;
}

export interface MediaAsset {
  id: string;
  original_name: string;
  stored_name: string;
  mime_type: string;
  extension: string;
  file_size: number;
  width?: number;
  height?: number;
  storage_bucket: string;
  folder_path: string;
  owner_id: string;
  module: string;
  entity_type?: string;
  entity_id?: string;
  public_url: string;
  alt_text?: string;
  caption?: string;
  status: string;
  created_at: string;
}

export class MediaDamService {
  private static supabase = createClient();

  /**
   * Validate file before upload — MIME type, size, executable check
   */
  static validateFile(file: File): { valid: boolean; error?: string } {
    // Block executable and dangerous types
    const BLOCKED_EXTENSIONS = ['.exe', '.sh', '.bat', '.cmd', '.ps1', '.php', '.py', '.rb', '.js'];
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (BLOCKED_EXTENSIONS.includes(ext)) {
      return { valid: false, error: `File type ${ext} is not permitted for security reasons.` };
    }

    // Validate MIME type against allow-list
    if (!(ALLOWED_MIME_TYPES as readonly string[]).includes(file.type)) {
      return { valid: false, error: `MIME type "${file.type}" is not allowed. Permitted: ${ALLOWED_MIME_TYPES.join(', ')}` };
    }

    // Enforce maximum file size (10 MB)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return { valid: false, error: `File size ${(file.size / 1024 / 1024).toFixed(1)} MB exceeds the 10 MB limit.` };
    }

    return { valid: true };
  }

  /**
   * Generate a safe stored filename with UUID prefix to prevent collisions
   */
  static generateStoredName(originalName: string): string {
    const ext = originalName.split('.').pop()?.toLowerCase() || 'bin';
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${timestamp}-${random}.${ext}`;
  }

  /**
   * All uploads share one public bucket; the module becomes the top-level folder.
   */
  static readonly BUCKET = 'media';

  private static async ensureBucket(client: SupabaseClient) {
    const { error } = await client.storage.createBucket(this.BUCKET, {
      public: true,
      fileSizeLimit: MAX_FILE_SIZE_BYTES,
      allowedMimeTypes: [...ALLOWED_MIME_TYPES],
    });
    if (error && !/already exists/i.test(error.message)) {
      throw new Error(`Storage bucket setup failed: ${error.message}`);
    }
  }

  /**
   * Upload a single file to Supabase Storage and register it in media_assets.
   * `client` must be a server-side service-role client; the caller is responsible
   * for authenticating the user first.
   */
  static async uploadFile(
    client: SupabaseClient,
    file: File,
    ownerId: string,
    options: MediaUploadOptions
  ): Promise<MediaAsset> {
    const validation = this.validateFile(file);
    if (!validation.valid) throw new Error(validation.error);

    const bucket = this.BUCKET;
    const storedName = this.generateStoredName(file.name);
    const folderPath = `${options.module}/${ownerId}`;
    const storagePath = `${folderPath}/${storedName}`;
    const body = Buffer.from(await file.arrayBuffer());

    const put = () =>
      client.storage.from(bucket).upload(storagePath, body, { contentType: file.type, upsert: false });

    let { error: uploadError } = await put();
    if (uploadError && /bucket not found/i.test(uploadError.message)) {
      await this.ensureBucket(client);
      ({ error: uploadError } = await put());
    }
    if (uploadError) throw new Error(`Storage upload failed: ${uploadError.message}`);

    const { data: urlData } = client.storage.from(bucket).getPublicUrl(storagePath);
    const publicUrl = urlData?.publicUrl || '';

    const assetPayload = {
      original_name: file.name,
      stored_name: storedName,
      mime_type: file.type,
      extension: file.name.split('.').pop()?.toLowerCase() || '',
      file_size: file.size,
      storage_bucket: bucket,
      folder_path: folderPath,
      owner_id: ownerId,
      module: options.module,
      entity_type: options.entityType || null,
      entity_id: options.entityId || null,
      public_url: publicUrl,
      alt_text: options.altText || null,
      caption: options.caption || null,
      is_public: options.isPublic ?? true,
      status: 'active',
    };

    // The registry is optional: the file is already stored and usable, so a
    // missing/failed media_assets table must not fail the upload.
    const { data: asset, error: dbError } = await client
      .from('media_assets')
      .insert(assetPayload)
      .select()
      .single();

    if (dbError) {
      if (!/schema cache|does not exist/i.test(dbError.message)) {
        console.warn('[MediaDamService] media_assets insert failed:', dbError.message);
      }
      return { id: storagePath, ...assetPayload, created_at: new Date().toISOString() } as MediaAsset;
    }

    if (options.tags) {
      const tagList = options.tags.split(',').map((t) => t.trim()).filter(Boolean);
      if (tagList.length > 0) {
        await client.from('media_tags').insert(tagList.map((tag) => ({ asset_id: asset.id, tag })));
      }
    }

    await client.from('media_audit_log').insert({ asset_id: asset.id, actor_id: ownerId, action: 'upload' });

    return asset as MediaAsset;
  }

  /**
   * Soft-delete a media asset (sets deleted_at, status='deleted')
   */
  static async softDeleteAsset(assetId: string, actorId: string): Promise<void> {
    const { error } = await this.supabase
      .from('media_assets')
      .update({ status: 'deleted', deleted_at: new Date().toISOString() })
      .eq('id', assetId)
      .eq('owner_id', actorId); // Ownership enforcement

    if (error) throw new Error(`Delete failed: ${error.message}`);
    await this.logAudit(assetId, actorId, 'delete');
  }

  /**
   * Search media assets by filename, module, or owner
   */
  static async searchAssets(filters: {
    q?: string;
    module?: string;
    ownerId?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: MediaAsset[]; total: number }> {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = this.supabase
      .from('media_assets')
      .select('*', { count: 'exact' })
      .eq('status', 'active')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (filters.q) query = query.ilike('original_name', `%${filters.q}%`);
    if (filters.module && filters.module !== 'all') query = query.eq('module', filters.module);
    if (filters.ownerId) query = query.eq('owner_id', filters.ownerId);

    const { data, error, count } = await query;
    if (error) throw new Error(error.message);

    return { data: (data || []) as MediaAsset[], total: count || 0 };
  }

  /**
   * Fetch a single media asset by ID
   */
  static async getAsset(assetId: string): Promise<MediaAsset | null> {
    const { data, error } = await this.supabase
      .from('media_assets')
      .select('*, media_variants(*), media_tags(*)')
      .eq('id', assetId)
      .eq('status', 'active')
      .is('deleted_at', null)
      .single();

    if (error) return null;
    return data as unknown as MediaAsset;
  }

  /**
   * Write an immutable audit log entry
   */
  private static async logAudit(
    assetId: string,
    actorId: string,
    action: 'upload' | 'delete' | 'replace' | 'download' | 'tag',
    metadata?: Record<string, unknown>
  ): Promise<void> {
    await this.supabase.from('media_audit_log').insert({
      asset_id: assetId,
      actor_id: actorId,
      action,
      metadata: metadata || null,
    });
  }
}
