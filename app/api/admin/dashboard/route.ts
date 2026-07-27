import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/supabase/require-auth';
import { AdminService } from '@/lib/services/admin.service';

const ADMIN_ROLES = ['Moderator', 'City Admin', 'Super Admin', 'Marketing Executive'];

export async function GET() {
  try {
    // Verify authentication + admin role before returning ANY data
    const auth = await requireRole(ADMIN_ROLES);
    if (auth instanceof NextResponse) return auth;

    const metrics = await AdminService.getDashboardMetrics(auth.supabase, {
      userId: auth.user.id,
      role: auth.user.role,
    });
    return NextResponse.json({ data: metrics });
  } catch (err: any) {
    console.error('[admin/dashboard] Error:', err.message);
    return NextResponse.json({ error: 'Failed to load dashboard metrics' }, { status: 500 });
  }
}
