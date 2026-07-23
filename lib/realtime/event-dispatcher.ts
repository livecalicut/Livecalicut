// --------------------------------------------------------
// lib/realtime/event-dispatcher.ts
// Event Dispatcher — Validates, Queues & Broadcasts Events
// --------------------------------------------------------

import { createClient } from '@/lib/supabase/client';
import { PlatformEvent, PLATFORM_EVENTS, EVENT_PRIORITY } from './event-types';
import { ChannelManager } from './channel-manager';

const VALID_EVENT_TYPES = new Set(Object.values(PLATFORM_EVENTS));

export class EventDispatcher {
  private static supabase = createClient();

  /**
   * Validate, enqueue, broadcast, and archive a platform event.
   * This is the ONLY entry point for publishing realtime events.
   */
  static async dispatch(event: PlatformEvent, publisherId?: string): Promise<{ eventId: string }> {
    // Step 1: Validate event type
    if (!VALID_EVENT_TYPES.has(event.eventType as any)) {
      throw new Error(`Invalid event type: "${event.eventType}"`);
    }

    // Step 2: Validate payload is a non-empty object
    if (!event.payload || typeof event.payload !== 'object') {
      throw new Error('Event payload must be a non-empty object');
    }

    const priority = event.priority ?? EVENT_PRIORITY.NORMAL;
    const expiresAt = event.expiresInSeconds
      ? new Date(Date.now() + event.expiresInSeconds * 1000).toISOString()
      : null;

    // Step 3: Insert into event_queue (durable buffer)
    const { data: queued, error: queueError } = await this.supabase
      .from('event_queue')
      .insert({
        event_type: event.eventType,
        channel_name: event.channelName,
        payload: event.payload,
        publisher_id: publisherId || null,
        priority,
        status: 'pending',
        expires_at: expiresAt,
      } as any)
      .select('id')
      .single();

    if (queueError) throw new Error(`Event queue failed: ${queueError.message}`);
    const eventId = queued.id;

    // Step 4: Archive to event_history (immutable audit)
    await this.supabase.from('event_history').insert({
      event_type: event.eventType,
      channel_name: event.channelName,
      payload: event.payload,
      publisher_id: publisherId || null,
      entity_type: event.entityType || null,
      entity_id: event.entityId || null,
      city_slug: event.citySlug || 'calicut',
    } as any);

    // Step 5: Mark as dispatched (Supabase Realtime picks up from REPLICA IDENTITY FULL)
    await this.supabase
      .from('event_queue')
      .update({ status: 'dispatched', dispatched_at: new Date().toISOString(), attempts: 1 })
      .eq('id', eventId);

    return { eventId };
  }

  /**
   * Publish a notification event — wraps dispatch with notification channel routing
   */
  static async publishNotification(params: {
    recipientId: string;
    title: string;
    body: string;
    type: string;
    entityType?: string;
    entityId?: string;
    priority?: number;
    publisherId?: string;
    citySlug?: string;
  }): Promise<{ eventId: string }> {
    return this.dispatch(
      {
        eventType: 'notification.created' as any,
        channelName: `user.${params.recipientId}`,
        payload: {
          recipientId: params.recipientId,
          title: params.title,
          body: params.body,
          type: params.type,
          entityType: params.entityType,
          entityId: params.entityId,
        },
        entityType: params.entityType,
        entityId: params.entityId,
        priority: params.priority ?? EVENT_PRIORITY.NORMAL,
        citySlug: params.citySlug || 'calicut',
      },
      params.publisherId
    );
  }

  /**
   * Get paginated event history with optional filters
   */
  static async getHistory(filters: {
    channelName?: string;
    eventType?: string;
    citySlug?: string;
    entityType?: string;
    entityId?: string;
    page?: number;
    limit?: number;
  }) {
    const page = filters.page || 1;
    const limit = Math.min(filters.limit || 20, 100);
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = this.supabase
      .from('event_history')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (filters.channelName) query = query.eq('channel_name', filters.channelName);
    if (filters.eventType)  query = query.eq('event_type', filters.eventType);
    if (filters.citySlug)   query = query.eq('city_slug', filters.citySlug);
    if (filters.entityType) query = query.eq('entity_type', filters.entityType);
    if (filters.entityId)   query = query.eq('entity_id', filters.entityId);

    const { data, count, error } = await query;
    if (error) throw new Error(error.message);

    return { data: data || [], total: count || 0, page, limit };
  }
}
