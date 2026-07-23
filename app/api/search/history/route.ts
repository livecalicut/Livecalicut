import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { saveSearchSchema as saveSearchHistorySchema } from '@/lib/validations/search';


export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ success: true, logged: false });
    }

    const body = await request.json();
    const validated = saveSearchHistorySchema.parse(body);

    await supabase.from('search_history').insert({
      user_id: session.user.id,
      query: validated.query,
      module: validated.module,
    });


    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE() {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await supabase.from('search_history').delete().eq('user_id', session.user.id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
