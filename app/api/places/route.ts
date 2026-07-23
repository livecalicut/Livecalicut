import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '50');
  const category = searchParams.get('category');

  const supabase = await createClient();
  let query = supabase
    .from('places')
    .select('*, place_categories(name, slug)')
    .eq('status', 'active')
    .is('deleted_at', null)
    .order('rating_avg', { ascending: false })
    .limit(limit);

  if (category) {
    query = query.eq('place_categories.slug', category);
  }

  const { data, error } = await query;
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
    const { name, description, category, location, address, open_hours, entry_fee, website, phone, best_time_to_visit, tips } = body;

    if (!name || !location) {
      return NextResponse.json({ success: false, message: 'Place name and location are required.' }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 6);

    // Resolve or create category
    let categoryId: string | null = null;
    if (category) {
      const catSlug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const { data: catData } = await supabase.from('place_categories').select('id').eq('slug', catSlug).single();
      if (catData) {
        categoryId = catData.id;
      } else {
        const { data: newCat } = await supabase.from('place_categories').insert({ name: category, slug: catSlug }).select('id').single();
        if (newCat) categoryId = newCat.id;
      }
    }

    const { data, error } = await supabase
      .from('places')
      .insert({
        name,
        slug,
        description: description || '',
        category_id: categoryId,
        location,
        address: address || '',
        open_hours: open_hours || '',
        entry_fee: entry_fee || '',
        website: website || null,
        phone: phone || null,
        best_time_to_visit: best_time_to_visit || '',
        tips: tips || '',
        created_by: session.user.id,
        status: 'active',
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}

