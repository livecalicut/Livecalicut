import { createClient } from '@/lib/supabase/client';

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'ROLE_CHANGE';

export class LoggingService {
  private static supabase = createClient();

  static async logAudit(params: {
    userId?: string;
    action: AuditAction;
    entityName: string;
    entityId?: string;
    oldValues?: Record<string, any>;
    newValues?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
  }) {
    const { data, error } = await this.supabase
      .from('audit_logs')
      .insert({
        user_id: params.userId,
        action: params.action,
        entity_name: params.entityName,
        entity_id: params.entityId,
        old_values: params.oldValues,
        new_values: params.newValues,
        ip_address: params.ipAddress,
        user_agent: params.userAgent,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async logActivity(params: {
    userId?: string;
    activityType: 'VIEW' | 'SEARCH' | 'BOOKMARK' | 'CLICK' | 'SHARE';
    targetEntity: string;
    targetId?: string;
    metadata?: Record<string, any>;
  }) {
    const { data, error } = await this.supabase
      .from('activity_logs')
      .insert({
        user_id: params.userId,
        activity_type: params.activityType,
        target_entity: params.targetEntity,
        target_id: params.targetId,
        metadata: params.metadata || {},
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
