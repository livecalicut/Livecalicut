import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '20');

  const supabase = await createClient();
  let query = supabase
    .from('news')
    .select('*, news_categories(name, slug)')
    .eq('status', 'published')
    .is('deleted_at', null)
    .order('published_at', { ascending: false })
    .limit(limit);

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  try {
    const { requireRole } = await import('@/lib/supabase/require-auth');
    const { createAdminClient } = await import('@/lib/supabase/server');
    const auth = await requireRole(['Super Admin', 'City Admin', 'Moderator']);
    if (auth instanceof NextResponse) return auth;
    const supabase = await createAdminClient();

    const body = await request.json();
    const { title, summary, content, category, author, featured_image } = body;

    if (!title || !content) {
      return NextResponse.json({ success: false, message: 'Title and content are required' }, { status: 400 });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 6);

    // Resolve Category ID
    let categoryId: string | null = null;
    if (category) {
      const categorySlug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const { data: catData } = await supabase.from('news_categories').select('id').eq('slug', categorySlug).maybeSingle();
      if (catData) {
        categoryId = catData.id;
      } else {
        const { data: newCat, error: catError } = await supabase
          .from('news_categories')
          .insert({ name: category, slug: categorySlug, status: 'active', is_active: true })
          .select('id')
          .single();
        if (catError) throw catError;
        if (newCat) categoryId = newCat.id;
      }
    }

    const { data: city } = await supabase
      .from('cities')
      .select('id')
      .eq('slug', 'kozhikode')
      .is('deleted_at', null)
      .maybeSingle();

    if (!categoryId) {
      return NextResponse.json({ success: false, message: 'A news category is required' }, { status: 400 });
    }
    if (!city?.id) {
      return NextResponse.json({ success: false, message: 'Calicut city is not set up' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('news')
      .insert({
        title,
        slug,
        summary: summary || title,
        content,
        category_id: categoryId,
        city_id: city.id,
        author: author || 'LiveCalicut Editorial',
        created_by: auth.user.id,
        featured_image: featured_image || null,
        status: 'published',
        published_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
