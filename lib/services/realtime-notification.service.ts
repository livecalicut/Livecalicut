import { createClient } from '@/lib/supabase/client';

export class RealtimeNotificationService {
  private static supabase = createClient();

  static async getUserNotifications(userId: string) {
    const { data, error } = await this.supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async markAsRead(notificationId: string, userId: string) {
    const { data, error } = await this.supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async markAllAsRead(userId: string) {
    const { data, error } = await this.supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) throw error;
    return data;
  }

  static async getActivityFeed() {
    const { data, error } = await this.supabase
      .from('activity_feed')
      .select('*, profiles(full_name, avatar)')
      .order('created_at', { ascending: false })
      .limit(30);

    if (error) throw error;
    return data || [];
  }

  static async getActiveAnnouncements() {
    const { data, error } = await this.supabase
      .from('announcement_queue')
      .select('*')
      .eq('is_broadcast', true)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(3);

    if (error) return [];
    return data || [];
  }
}
