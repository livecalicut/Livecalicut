import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { markNotificationReadSchema } from '@/lib/validations/notification';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = markNotificationReadSchema.parse(body);

    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', validated.notificationId)
      .eq('user_id', session.user.id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
