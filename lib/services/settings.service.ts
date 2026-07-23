import { createClient } from '@/lib/supabase/client';

export type SettingKey = 'system' | 'app' | 'seo' | 'email' | 'notification' | 'ai' | 'cms';

export class SettingsService {
  private static supabase = createClient();

  static async getSetting(key: SettingKey) {
    const { data, error } = await this.supabase
      .from('settings')
      .select('*')
      .eq('key', key)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data?.value || {};
  }

  static async updateSetting(key: SettingKey, value: Record<string, any>, description?: string) {
    const { data, error } = await this.supabase
      .from('settings')
      .upsert({
        key,
        value,
        description,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
