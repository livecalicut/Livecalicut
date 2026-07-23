import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/supabase/require-auth';
import { approveRejectSchema } from '@/lib/validations/admin';

const ADMIN_ROLES = ['Moderator', 'City Admin', 'Super Admin'];

const MODULE_TABLE_MAP: Record<string, string> = {
  business: 'businesses',
  job: 'jobs',
  news: 'news',
  event: 'events',
  marketplace: 'marketplace_items',
  property: 'properties',
};

const MODULE_STATUS_MAP: Record<string, string> = {
  business: 'active',
  marketplace: 'active',
};

export async function PUT(request: Request) {
  try {
    // Only admins and moderators can approve/reject content
    const auth = await requireRole(ADMIN_ROLES);
    if (auth instanceof NextResponse) return auth;

    const body = await request.json();
    const validated = approveRejectSchema.parse(body);

    const tableName = MODULE_TABLE_MAP[validated.targetModule];
    if (!tableName) {
      return NextResponse.json(
        { error: `Unknown module: ${validated.targetModule}` },
        { status: 400 }
      );
    }

    const statusValue = MODULE_STATUS_MAP[validated.targetModule] ?? 'published';
    const updatePayload: Record<string, unknown> = {
      status: statusValue,
      updated_at: new Date().toISOString(),
    };

    if (validated.action === 'feature') updatePayload.is_featured = true;
    if (validated.action === 'reject') {
      updatePayload.status = 'rejected';
      delete updatePayload.is_featured;
    }

    const { data, error } = await auth.supabase
      .from(tableName as any)
      .update(updatePayload)
      .eq('id', validated.targetId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('[admin/approve] Error:', err.message);
    return NextResponse.json({ error: err.message || 'Operation failed' }, { status: 400 });
  }
}
