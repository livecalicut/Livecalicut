// --------------------------------------------------------
// lib/services/realtime-gateway.service.ts
// Realtime Gateway Service — Central Orchestrator
// --------------------------------------------------------

import { createClient } from '@/lib/supabase/client';
import { EventDispatcher } from '@/lib/realtime/event-dispatcher';
import { ChannelManager } from '@/lib/realtime/channel-manager';
import { PlatformEvent, CHANNELS } from '@/lib/realtime/event-types';

export class RealtimeGatewayService {
  private static supabase = createClient();

  /**
   * Publish a platform event through the full dispatch pipeline.
   * Use this as the ONLY way to broadcast events platform-wide.
   */
  static async publish(event: PlatformEvent, publisherId?: string) {
    return EventDispatcher.dispatch(event, publisherId);
  }

  /**
   * Publish a user notification (targeted delivery)
   */
  static async notifyUser(params: {
    recipientId: string;
    title: string;
    body: string;
    type: string;
    entityType?: string;
    entityId?: string;
    publisherId?: string;
  }) {
    return EventDispatcher.publishNotification(params);
  }

  /**
   * Subscribe user to a channel (with authorization check)
   */
  static async subscribe(params: {
    userId: string;
    userRole: string;
    channelName: string;
    filters?: Record<string, unknown>;
  }) {
    const { authorized, reason } = await ChannelManager.authorize({
      channelName: params.channelName,
      userId: params.userId,
      userRole: params.userRole,
    });

    if (!authorized) throw new Error(reason || 'Channel access denied');

    return ChannelManager.subscribe(params.userId, params.channelName, params.filters);
  }

  /**
   * Unsubscribe user from a channel
   */
  static async unsubscribe(userId: string, channelName: string) {
    return ChannelManager.unsubscribe(userId, channelName);
  }

  /**
   * Get paginated event history (for admin audit or merchant view)
   */
  static async getEventHistory(filters: {
    channelName?: string;
    eventType?: string;
    citySlug?: string;
    entityType?: string;
    entityId?: string;
    page?: number;
    limit?: number;
  }) {
    return EventDispatcher.getHistory(filters);
  }

  /**
   * Get live notification feed for a user — recent unread notifications
   */
  static async getLiveNotifications(userId: string, limit: number = 20) {
    const { data, error } = await this.supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .eq('is_read', false)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      // Graceful fallback if notifications table schema differs
      return { notifications: [], unreadCount: 0 };
    }

    return {
      notifications: data || [],
      unreadCount: (data || []).length,
    };
  }

  /**
   * Get all active channels visible to a role
   */
  static async listChannels(userRole?: string) {
    const channels = await ChannelManager.listChannels();

    // Filter out channels requiring higher roles than the user has
    const roleLevel: Record<string, number> = {
      guest: 0, user: 1, merchant: 2, moderator: 3, city_admin: 4, admin: 5, super_admin: 6,
    };

    return channels.filter((c) => {
      if (!c.requiresAuth) return true;
      if (!userRole) return false;
      if (!c.minRole) return true;
      return (roleLevel[userRole] ?? 0) >= (roleLevel[c.minRole] ?? 99);
    });
  }
}
