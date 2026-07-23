import { createClient } from '@/lib/supabase/client';

export class MediaService {
  private static supabase = createClient();

  static async getPublicUrl(bucketName: string, path: string): Promise<string> {
    const { data } = this.supabase.storage.from(bucketName).getPublicUrl(path);
    return data.publicUrl;
  }

  static async uploadFile(
    bucketName: string,
    path: string,
    file: File | Blob,
    options: { contentType?: string } = {}
  ): Promise<{ path: string; publicUrl: string }> {
    const { data, error } = await this.supabase.storage
      .from(bucketName)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: options.contentType,
      });

    if (error) throw error;

    const publicUrl = await this.getPublicUrl(bucketName, data.path);
    return { path: data.path, publicUrl };
  }
}
