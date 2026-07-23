import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
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
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
