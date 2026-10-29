import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/supabase/require-auth';
import { createAdminClient } from '@/lib/supabase/server';
import { USER_MANAGERS, assignableRolesFor } from '@/lib/rbac/roles';
import { generatePassword, passwordProblem } from '@/lib/admin/password';
import { createPasswordSetupLink } from '@/lib/admin/setup-link';

export async function POST(req: Request) {
  try {
    const auth = await requireRole([...USER_MANAGERS]);
    if (auth instanceof NextResponse) return auth;

    const body = await req.json();
    const fullName = String(body.fullName ?? '').trim();
    const email = String(body.email ?? '').trim().toLowerCase();
    const roleName = String(body.roleName ?? '');
    // Optional: when omitted the user gets a one-time setup link instead
    const password = typeof body.password === 'string' && body.password !== '' ? body.password : null;

    if (!fullName || !email || !roleName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Enter a valid email address' }, { status: 400 });
    }
    const weakness = password ? passwordProblem(password) : null;
    if (weakness) {
      return NextResponse.json({ error: weakness }, { status: 400 });
    }

    // Super Admin is bootstrap-only — never creatable from the staff UI.
    const allowed = assignableRolesFor(auth.user.role);
    if (!allowed.includes(roleName)) {
      return NextResponse.json(
        {
          error: `You can only assign: ${allowed.join(', ') || 'none'}. Super Admin is reserved.`,
        },
        { status: 403 }
      );
    }

    const supabaseAdmin = await createAdminClient();

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: { full_name: fullName, created_by: auth.user.id },
      password: password ?? generatePassword(20),
    });

    if (authError) {
      if (/already (been )?registered|already exists/i.test(authError.message)) {
        return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
      }
      throw authError;
    }
    const userId = authData.user.id;

    // Link new profile to the creating staff member (creator hierarchy)
    const { error: profileError } = await supabaseAdmin.from('profiles').upsert({
      id: userId,
      full_name: fullName,
      email: email,
      account_status: 'active',
      created_by: auth.user.id,
    });

    if (profileError) {
      console.warn('Profile upsert warning:', profileError);
    }

    const { data: roleData, error: roleLookupError } = await supabaseAdmin
      .from('roles')
      .select('id')
      .eq('name', roleName)
      .single();

    if (roleLookupError) throw roleLookupError;

    const { error: roleAssignError } = await supabaseAdmin
      .from('user_roles')
      .insert({ user_id: userId, role_id: roleData.id });

    if (roleAssignError) throw roleAssignError;

    const setupLink = password ? undefined : await createPasswordSetupLink(supabaseAdmin, email, req.url);

    return NextResponse.json({
      success: true,
      user: { id: userId, email },
      created_by: auth.user.id,
      setupLink,
    });
  } catch (error: any) {
    console.error('Create staff error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
