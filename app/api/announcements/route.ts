import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/supabase/require-auth';
import { CITY_AND_SUPER } from '@/lib/rbac/roles';
import { createAnnouncementSchema } from '@/lib/validations/notification';

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('announcement_queue')
    .select('*')
    .eq('is_broadcast', true)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(3);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data || [] });
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    // getUser() verifies the token with Supabase Auth; getSession() trusts the cookie
    const { data: { user: authUser } } = await supabase.auth.getUser();
    const session = authUser ? { user: authUser } : null;

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Broadcasts reach every user; only city/super admins may send them
    const staff = await requireRole([...CITY_AND_SUPER]);
    if (staff instanceof NextResponse) return staff;

    const body = await request.json();
    const validated = createAnnouncementSchema.parse(body);

    const { data, error } = await supabase
      .from('announcement_queue')
      .insert({
        title: validated.title,
        message: validated.message,
        target_role: validated.targetRole,
        is_broadcast: validated.isBroadcast,
        status: 'sent',
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
