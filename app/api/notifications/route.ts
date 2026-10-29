import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { RealtimeNotificationService } from '@/lib/services/realtime-notification.service';

export async function GET() {
  try {
    const supabase = await createClient();
    // getUser() verifies the token with Supabase Auth; getSession() trusts the cookie
    const { data: { user: authUser } } = await supabase.auth.getUser();
    const session = authUser ? { user: authUser } : null;

    if (!session?.user) {
      return NextResponse.json({ data: [] });
    }

    const notifications = await RealtimeNotificationService.getUserNotifications(session.user.id);
    return NextResponse.json({ data: notifications });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
