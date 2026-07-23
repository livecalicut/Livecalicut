// --------------------------------------------------------
// lib/realtime/channel-manager.ts
// Channel Manager — Authorization & Access Control
// --------------------------------------------------------

import { createClient } from '@/lib/supabase/client';

const ROLE_HIERARCHY: Record<string, number> = {
  guest:      0,
  user:       1,
  merchant:   2,
  moderator:  3,
  city_admin: 4,
  admin:      5,
  super_admin: 6,
};

export interface ChannelInfo {
  id: string;
  name: string;
  channelType: string;
  requiresAuth: boolean;
  minRole: string | null;
  citySlug: string | null;
  isActive: boolean;
}

export class ChannelManager {
  private static supabase = createClient();

  /**
   * Authorize a user's access to a channel.
   * Returns true if the user is permitted, false otherwise.
   */
  static async authorize(params: {
    channelName: string;
    userId?: string;
    userRole?: string;
  }): Promise<{ authorized: boolean; reason?: string }> {
    const channel = await this.getChannel(params.channelName);

    if (!channel) {
      return { authorized: false, reason: `Channel "${params.channelName}" not found` };
    }

    if (!channel.isActive) {
      return { authorized: false, reason: `Channel "${params.channelName}" is inactive` };
    }

    // Public channels — no auth required
    if (!channel.requiresAuth) {
      return { authorized: true };
    }

    // Auth required — must have a user ID
    if (!params.userId) {
      return { authorized: false, reason: 'Authentication required for this channel' };
    }

    // Role check
    if (channel.minRole) {
      const requiredLevel = ROLE_HIERARCHY[channel.minRole] ?? 99;
      const userLevel = ROLE_HIERARCHY[params.userRole || 'user'] ?? 0;
      if (userLevel < requiredLevel) {
        return {
          authorized: false,
          reason: `Role "${params.userRole}" insufficient — requires "${channel.minRole}"`,
        };
      }
    }

    return { authorized: true };
  }

  /**
   * Get all active channels (optionally filtered by type)
   */
  static async listChannels(type?: string): Promise<ChannelInfo[]> {
    let query = this.supabase
      .from('realtime_channels')
      .select('*')
      .eq('is_active', true)
      .order('channel_type', { ascending: true });

    if (type) query = query.eq('channel_type', type);

    const { data } = await query;

    return (data || []).map((c) => ({
      id: c.id,
      name: c.name,
      channelType: c.channel_type,
      requiresAuth: c.requires_auth,
      minRole: c.min_role,
      citySlug: c.city_slug,
      isActive: c.is_active,
    }));
  }

  /**
   * Look up a single channel by name
   */
  static async getChannel(channelName: string): Promise<ChannelInfo | null> {
    const { data } = await this.supabase
      .from('realtime_channels')
      .select('*')
      .eq('name', channelName)
      .single();

    if (!data) return null;

    return {
      id: data.id,
      name: data.name,
      channelType: data.channel_type,
      requiresAuth: data.requires_auth,
      minRole: data.min_role,
      citySlug: data.city_slug,
      isActive: data.is_active,
    };
  }

  /**
   * Record a user subscription to a channel
   */
  static async subscribe(userId: string, channelName: string, filters?: Record<string, unknown>) {
    const { data, error } = await this.supabase
      .from('realtime_subscriptions')
      .upsert(
        {
          user_id: userId,
          channel_name: channelName,
          filters: filters || null,
          is_active: true,
          unsubscribed_at: null,
        },
        { onConflict: 'user_id,channel_name' }
      )
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  /**
   * Remove a user's subscription from a channel (soft)
   */
  static async unsubscribe(userId: string, channelName: string) {
    const { error } = await this.supabase
      .from('realtime_subscriptions')
      .update({ is_active: false, unsubscribed_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('channel_name', channelName);

    if (error) throw new Error(error.message);
  }
}
