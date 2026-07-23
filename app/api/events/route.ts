import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('events')
    .select('*, event_categories(name, slug)')
    .eq('status', 'published')
    .is('deleted_at', null)
    .order('start_date', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, category, venue, start_date, end_date, registration_link, is_ticket_required } = body;

    if (!title || !start_date) {
      return NextResponse.json({ success: false, message: 'Event title and start date are required.' }, { status: 400 });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 6);

    // Resolve or create category
    let categoryId: string | null = null;
    if (category) {
      const catSlug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const { data: catData } = await supabase.from('event_categories').select('id').eq('slug', catSlug).single();
      if (catData) {
        categoryId = catData.id;
      } else {
        const { data: newCat } = await supabase.from('event_categories').insert({ name: category, slug: catSlug }).select('id').single();
        if (newCat) categoryId = newCat.id;
      }
    }

    const { data, error } = await supabase
      .from('events')
      .insert({
        title,
        slug,
        description: description || '',
        category_id: categoryId,
        venue: venue || '',
        start_date,
        end_date: end_date || null,
        registration_link: registration_link || null,
        is_ticket_required: is_ticket_required ?? false,
        created_by: session.user.id,
        status: 'published',
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
