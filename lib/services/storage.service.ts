import { createClient } from '@/lib/supabase/client';

export type BucketName =
  | 'avatars'
  | 'businesses'
  | 'events'
  | 'news'
  | 'properties'
  | 'marketplace'
  | 'tourism'
  | 'documents'
  | 'community';

export class StorageService {
  private static supabase = createClient();

  static async uploadFile(bucket: BucketName, path: string, file: File) {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: true });

    if (error) throw error;

    const { data: publicData } = this.supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return { path: data.path, publicUrl: publicData.publicUrl };
  }

  static getPublicUrl(bucket: BucketName, path: string) {
    const { data } = this.supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  static async deleteFile(bucket: BucketName, path: string) {
    const { error } = await this.supabase.storage.from(bucket).remove([path]);
    if (error) throw error;
    return true;
  }
}
