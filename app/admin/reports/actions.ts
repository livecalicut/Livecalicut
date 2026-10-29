'use server';

import { createAdminClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/supabase/require-auth';
import { NextResponse } from 'next/server';

const ADMIN_ROLES = ['Super Admin', 'City Admin', 'Moderator'];

export async function fetchAdminReportsAction() {
  try {
    const auth = await requireRole(ADMIN_ROLES);
    if (auth instanceof NextResponse) throw new Error('Unauthorized');

    // RLS limits signed-in users to their own reports; read all after the role check
    const admin = await createAdminClient();
    const { data, error } = await admin
      .from('reports')
      .select('*, reporter:profiles!reports_reporter_id_fkey(full_name)')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

const RESOLUTIONS = ['pending', 'investigating', 'resolved', 'dismissed'] as const;

export async function resolveReportAction(id: string, resolution: (typeof RESOLUTIONS)[number]) {
  try {
    const auth = await requireRole(ADMIN_ROLES);
    if (auth instanceof NextResponse) throw new Error('Unauthorized');
    if (!RESOLUTIONS.includes(resolution)) throw new Error('Unknown resolution');

    // Signed-in clients only have SELECT policies on reports; write after the role check
    const admin = await createAdminClient();
    const { data, error } = await admin
      .from('reports')
      .update({ resolution_status: resolution, updated_by: auth.user.id, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('id')
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error('Report not found');

    await admin
      .from('audit_logs')
      .insert({
        admin_id: auth.user.id,
        action: `report_${resolution}`,
        target_entity: 'report',
        target_id: id,
        metadata: {},
      })
      .then(() => undefined, () => undefined);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message as string };
  }
}
