import { NextResponse } from 'next/server';
import { createPublicClient } from '@/lib/supabase/server';

export const revalidate = 60;

/** Keeps only http(s) URL strings, capped at 20 images. */
function parseGallery(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((u): u is string => typeof u === 'string' && /^https?:\/\//.test(u.trim()))
    .map((u) => u.trim())
    .slice(0, 20);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const category = searchParams.get('category');
    const offset = Math.max(0, (page - 1) * limit);

    const supabase = createPublicClient();
    let query = supabase
      .from('news')
      .select('*, news_categories(name, slug)', { count: 'exact' })
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category) {
      query = query.or(`category.ilike.%${category}%,news_categories.slug.eq.${category}`);
    }

    const { data, count, error } = await query;

    if (!error && Array.isArray(data)) {
      const formatted = data.map((item) => ({
        id: item.id,
        title: item.title,
        slug: item.slug || item.id,
        summary: item.summary || item.content?.slice(0, 160) || '',
        content: item.content || '',
        category: item.news_categories?.name || item.category || 'City Updates',
        cover_image: item.cover_image || item.featured_image || item.image_url || '/heroes/city-market.jpg',
        published_at: item.published_at || item.created_at || new Date().toISOString(),
        author: item.author || 'LiveCalicut Editorial',
        views_count: item.views_count || 0,
      }));

      return NextResponse.json({
        success: true,
        data: formatted,
        meta: { page, limit, total: count || formatted.length },
      });
    }

    // Fallback: simple select without relational join if relationship issue occurs
    const fallback = await supabase
      .from('news')
      .select('*', { count: 'exact' })
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (!fallback.error && Array.isArray(fallback.data)) {
      const formatted = fallback.data.map((item) => ({
        id: item.id,
        title: item.title,
        slug: item.slug || item.id,
        summary: item.summary || item.content?.slice(0, 160) || '',
        content: item.content || '',
        category: item.category || 'City Updates',
        cover_image: item.cover_image || item.featured_image || item.image_url || '/heroes/city-market.jpg',
        published_at: item.published_at || item.created_at || new Date().toISOString(),
        author: item.author || 'LiveCalicut Editorial',
        views_count: item.views_count || 0,
      }));

      return NextResponse.json({
        success: true,
        data: formatted,
        meta: { page, limit, total: fallback.count || formatted.length },
      });
    }

    // If table has 0 rows or is not populated yet, return empty list gracefully
    return NextResponse.json({
      success: true,
      data: [],
      meta: { page, limit, total: 0 },
    });
  } catch {
    return NextResponse.json({
      success: true,
      data: [],
      meta: { page: 1, limit: 20, total: 0 },
    });
  }
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
    const gallery = parseGallery(body.gallery);

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
        gallery,
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
