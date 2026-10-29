import { createAdminClient } from '@/lib/supabase/server';

export type SettingKey = 'system' | 'app' | 'seo' | 'email' | 'notification' | 'ai' | 'cms' | 'live_updates';

/**
 * Server-only settings access. Writes need the service role (RLS blocks
 * anon/session writes), so callers must check the user's role first.
 */
export class SettingsService {
  static async getSetting(key: SettingKey) {
    const supabase = await createAdminClient();
    const { data, error } = await supabase.from('settings').select('*').eq('key', key).maybeSingle();

    if (error) throw error;
    return data?.value || {};
  }

  static async updateSetting(key: SettingKey, value: Record<string, any>, description?: string) {
    const supabase = await createAdminClient();
    const row = { value, description, updated_at: new Date().toISOString() };

    // Primary key is id, not key, so a plain upsert would insert duplicates
    const { data: existing } = await supabase.from('settings').select('id').eq('key', key).maybeSingle();
    const { data, error } = existing
      ? await supabase.from('settings').update(row).eq('id', existing.id).select().single()
      : await supabase.from('settings').insert({ key, ...row }).select().single();

    if (error) throw error;
    return data;
  }
}
