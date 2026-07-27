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
    const auth = await requireRole(['Super Admin', 'City Admin', 'Moderator']);
    if (auth instanceof NextResponse) return auth;

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
      const { data: catData } = await auth.supabase.from('news_categories').select('id').eq('slug', categorySlug).single();
      if (catData) {
        categoryId = catData.id;
      } else {
        const { data: newCat } = await auth.supabase.from('news_categories').insert({ name: category, slug: categorySlug }).select('id').single();
        if (newCat) categoryId = newCat.id;
      }
    }

    const { data, error } = await auth.supabase
      .from('news')
      .insert({
        title,
        slug,
        summary: summary || '',
        content,
        category_id: categoryId,
        author: author || null,
        author_id: auth.user.id,
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
