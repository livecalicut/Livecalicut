import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/supabase/require-auth';
import { createClient } from '@supabase/supabase-js';

const ADMIN_ROLES = ['City Admin', 'Super Admin', 'Marketing Executive'];

export async function POST(req: Request) {
  try {
    const auth = await requireRole(ADMIN_ROLES);
    if (auth instanceof NextResponse) return auth;

    const body = await req.json();
    const { fullName, email, roleName } = body;

    if (!fullName || !email || !roleName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Since we need to create a user in Supabase Auth bypassing standard signup flow, 
    // we use the Supabase Admin API.
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Create the user in auth.users
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: { full_name: fullName },
      // Set a random password, user can reset it via "Forgot Password" or you can send a magic link.
      password: Math.random().toString(36).slice(-10) + 'A1!'
    });

    if (authError) throw authError;
    const userId = authData.user.id;

    // 2. Insert into profiles (may be handled by trigger, but we ensure it here)
    const { error: profileError } = await supabaseAdmin.from('profiles').upsert({
      id: userId,
      full_name: fullName,
      email: email,
      account_status: 'active'
    });
    
    if (profileError) {
      console.warn('Profile upsert warning:', profileError);
    }

    // 3. Find Role ID
    const { data: roleData, error: roleLookupError } = await supabaseAdmin
      .from('roles')
      .select('id')
      .eq('name', roleName)
      .single();

    if (roleLookupError) throw roleLookupError;

    // 4. Assign Role
    const { error: roleAssignError } = await supabaseAdmin
      .from('user_roles')
      .insert({ user_id: userId, role_id: roleData.id });

    if (roleAssignError) throw roleAssignError;

    // Optional: Send password reset email so they can set their password
    await supabaseAdmin.auth.resetPasswordForEmail(email);

    return NextResponse.json({ success: true, user: authData.user });
  } catch (error: any) {
    console.error('Create staff error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
