import { createClient } from '@/lib/supabase/client';

export class NotificationService {
  private static supabase = createClient();

  static async sendNotification(params: {
    userId: string;
    title: string;
    message: string;
    type?: 'info' | 'warning' | 'success' | 'system';
    link?: string;
  }) {
    const { data, error } = await this.supabase
      .from('notifications')
      .insert({
        user_id: params.userId,
        title: params.title,
        message: params.message,
        type: params.type || 'info',
        link: params.link,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getUserNotifications(userId: string) {
    const { data, error } = await this.supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async markAsRead(notificationId: string) {
    const { data, error } = await this.supabase
      .from('notifications')
      .update({ is_read: true, updated_at: new Date().toISOString() })
      .eq('id', notificationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
