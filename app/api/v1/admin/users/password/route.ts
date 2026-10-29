import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireRole } from '@/lib/supabase/require-auth';
import { createAdminClient } from '@/lib/supabase/server';
import { USER_MANAGERS } from '@/lib/rbac/roles';
import { staffPasswordSchema } from '@/lib/admin/password';
import { loadManageableUser } from '@/lib/admin/user-access';
import { createPasswordSetupLink } from '@/lib/admin/setup-link';

const bodySchema = z.discriminatedUnion('mode', [
  z.object({ userId: z.string().uuid(), mode: z.literal('set'), password: staffPasswordSchema }),
  z.object({ userId: z.string().uuid(), mode: z.literal('link') }),
]);

/**
 * POST /api/v1/admin/users/password
 * mode "set":  admin sets a new password directly
 * mode "link": returns a one-time setup link the admin shares with the user
 */
export async function POST(request: Request) {
  try {
    const auth = await requireRole([...USER_MANAGERS]);
    if (auth instanceof NextResponse) return auth;

    const parsed = bodySchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 });
    }
    const body = parsed.data;

    const admin = await createAdminClient();
    const target = await loadManageableUser(admin, auth.user, body.userId);
    if ('error' in target) {
      return NextResponse.json({ success: false, error: target.error }, { status: target.status });
    }

    let link: string | undefined;
    if (body.mode === 'set') {
      const { error } = await admin.auth.admin.updateUserById(body.userId, { password: body.password });
      if (error) throw error;
    } else {
      if (!target.user.email) {
        return NextResponse.json({ success: false, error: 'This user has no email address' }, { status: 400 });
      }
      link = await createPasswordSetupLink(admin, target.user.email, request.url);
    }

    await admin
      .from('audit_logs')
      .insert({
        admin_id: auth.user.id,
        action: body.mode === 'set' ? 'user_password_set' : 'user_password_link',
        target_entity: 'user',
        target_id: body.userId,
        metadata: {},
      })
      .then(() => undefined, () => undefined);

    return NextResponse.json({ success: true, link });
  } catch (err: any) {
    console.error('Admin password action failed:', err?.message);
    return NextResponse.json({ success: false, error: err?.message || 'Password was not changed' }, { status: 500 });
  }
}
