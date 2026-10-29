import { NextResponse } from 'next/server';
import { createAdminClient, createPublicClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/supabase/require-auth';
import { CONTENT_EDITORS } from '@/lib/rbac/roles';

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export async function GET() {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('events')
    .select('*, event_categories(name, slug)')
    .eq('status', 'published')
    .is('deleted_at', null)
    .order('start_date', { ascending: true });

  if (error) {
    return NextResponse.json({ data: [] });
  }

  return NextResponse.json({ data: data || [] });
}

export async function POST(request: Request) {
  try {
    const auth = await requireRole([...CONTENT_EDITORS]);
    if (auth instanceof NextResponse) return auth;
    const supabase = await createAdminClient();

    const body = await request.json();
    const { title, description, category, venue, start_date, end_date, registration_link, is_ticket_required } = body;

    if (!title || !start_date) {
      return NextResponse.json({ success: false, message: 'Event title and start date are required.' }, { status: 400 });
    }

    const slug = slugify(title) + '-' + Math.random().toString(36).substring(2, 6);

    // events.category_id is NOT NULL, so fall back to a generic category
    const categoryName = String(category || 'General').trim() || 'General';
    const catSlug = slugify(categoryName);
    let categoryId: string | null = null;
    const { data: catData } = await supabase.from('event_categories').select('id').eq('slug', catSlug).maybeSingle();
    if (catData) {
      categoryId = catData.id;
    } else {
      const { data: newCat, error: catError } = await supabase
        .from('event_categories')
        .insert({ name: categoryName, slug: catSlug })
        .select('id')
        .single();
      if (catError) throw catError;
      categoryId = newCat.id;
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
        // end_date is NOT NULL; single-day events end on their start date
        end_date: end_date || start_date,
        registration_link: registration_link || null,
        is_ticket_required: is_ticket_required ?? false,
        created_by: auth.user.id,
        status: 'published',
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : (err as { message?: string })?.message || 'Failed to create event';
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}
