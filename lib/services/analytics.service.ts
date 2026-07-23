import { createClient } from '@/lib/supabase/client';

export class AnalyticsService {
  private static supabase = createClient();

  static async logEvent(eventType: string, entityType: string, entityId?: string, metadata: Record<string, any> = {}) {
    const { error } = await this.supabase
      .from('analytics_events')
      .insert({
        event_type: eventType,
        entity_type: entityType,
        entity_id: entityId || null,
        metadata,
      });

    if (error) console.error('Failed to record telemetry event:', error.message);
  }

  static async getPlatformMetrics() {
    const { data, error } = await this.supabase
      .from('platform_metrics')
      .select('*');

    if (error) return [];
    return data || [];
  }

  static async getMerchantInsights(merchantId: string) {
    const { data, error } = await this.supabase
      .from('merchant_insights')
      .select('*')
      .eq('merchant_id', merchantId)
      .order('created_at', { ascending: false });

    if (error) return [];
    return data || [];
  }

  static async getDailyAggregates() {
    const { data, error } = await this.supabase
      .from('analytics_daily')
      .select('*')
      .order('date', { ascending: false })
      .limit(30);

    if (error) return [];
    return data || [];
  }
}
