import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/supabase/require-auth';
import { createAdminClient } from '@/lib/supabase/server';
import { AdminService } from '@/lib/services/admin.service';

const ADMIN_ROLES = ['Super Admin', 'City Admin', 'Moderator', 'Marketing Executive'];

export async function POST(req: Request) {
  try {
    const auth = await requireRole(ADMIN_ROLES);
    if (auth instanceof NextResponse) return auth;

    const body = await req.json();
    const { entityType, entityId, hardDelete } = body;

    if (!entityType || !entityId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { user } = auth;
    // The signed-in client only has public SELECT policies, so deletes matched
    // zero rows and looked successful. Service role runs after the role check.
    const admin = await createAdminClient();
    await AdminService.deleteEntity(admin, user.id, entityType, entityId, Boolean(hardDelete));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Admin delete error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
