import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/supabase/require-auth';
import { createClient } from '@supabase/supabase-js';
import { USER_MANAGERS, assignableRolesFor } from '@/lib/rbac/roles';

export async function POST(req: Request) {
  try {
    const auth = await requireRole([...USER_MANAGERS]);
    if (auth instanceof NextResponse) return auth;

    const body = await req.json();
    const { fullName, email, roleName } = body;

    if (!fullName || !email || !roleName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
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

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: { full_name: fullName, created_by: auth.user.id },
      password: Math.random().toString(36).slice(-10) + 'A1!',
    });

    if (authError) throw authError;
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

    await supabaseAdmin.auth.resetPasswordForEmail(email);

    return NextResponse.json({
      success: true,
      user: authData.user,
      created_by: auth.user.id,
    });
  } catch (error: any) {
    console.error('Create staff error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
