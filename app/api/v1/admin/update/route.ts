import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/supabase/require-auth';
import { createAdminClient } from '@/lib/supabase/server';
import { ADMIN_ENTITIES, foldJsonFields, jsonColumnsOf, sanitizeEntityValues } from '@/lib/admin/entities';

export const dynamic = 'force-dynamic';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * POST /api/v1/admin/update
 * Body: { entityType, entityId, values }
 * Edits only the fields allow-listed in lib/admin/entities.ts.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const entityType = String(body.entityType || '');
    const entityId = String(body.entityId || '');
    const config = ADMIN_ENTITIES[entityType];

    if (!config) {
      return NextResponse.json({ success: false, error: 'Unknown entity type' }, { status: 400 });
    }
    if (!UUID.test(entityId)) {
      return NextResponse.json({ success: false, error: 'Invalid record id' }, { status: 400 });
    }

    const auth = await requireRole([...config.roles]);
    if (auth instanceof NextResponse) return auth;

    const result = sanitizeEntityValues(config, (body.values ?? {}) as Record<string, unknown>);
    if ('error' in result) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }
    if (Object.keys(result.values).length === 0) {
      return NextResponse.json({ success: false, error: 'No editable fields supplied' }, { status: 400 });
    }

    const admin = await createAdminClient();

    // Fields stored inside jsonb columns are merged into the current value
    const jsonCols = jsonColumnsOf(config);
    let current: Record<string, any> | null = null;
    if (jsonCols.length) {
      const { data: row } = await admin.from(config.table).select(jsonCols.join(',')).eq('id', entityId).maybeSingle();
      if (!row) return NextResponse.json({ success: false, error: 'Record not found' }, { status: 404 });
      current = row as Record<string, any>;
    }
    const update = foldJsonFields(config, result.values, current);

    const { data, error } = await admin
      .from(config.table)
      .update({ ...update, updated_at: new Date().toISOString() })
      .eq('id', entityId)
      .select()
      .maybeSingle();

    if (error) {
      const message = error.code === '23505' ? 'A record with that name already exists' : error.message;
      return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
    if (!data) {
      return NextResponse.json({ success: false, error: 'Record not found' }, { status: 404 });
    }

    // Audit trail is best-effort: the table may not exist yet in production
    await admin
      .from('audit_logs')
      .insert({
        admin_id: auth.user.id,
        action: 'update',
        target_entity: entityType,
        target_id: entityId,
        metadata: { fields: Object.keys(result.values) },
      })
      .then(() => undefined, () => undefined);

    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Update failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
