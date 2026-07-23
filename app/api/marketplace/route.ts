import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createMarketplaceItemSchema } from '@/lib/validations/marketplace';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const condition = searchParams.get('condition');
  const keyword = searchParams.get('search');

  const supabase = await createClient();
  let query = supabase
    .from('marketplace_items')
    .select('*, marketplace_categories(name, slug), seller_profiles(full_name, phone, avatar)')
    .eq('status', 'active')
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (condition) query = query.eq('condition', condition);
  if (keyword) query = query.ilike('title', `%${keyword}%`);

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

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    const role = profile?.role || 'user';
    const isStaffOrAdmin = ['super_admin', 'marketing_executive'].includes(role);

    const body = await request.json();
    const { title, category, price, condition, description, images } = body;

    if (!title || !category || !price || !condition) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 6);

    // Resolve Category ID
    let categoryId: string;
    const categorySlug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const { data: categoryData } = await supabase.from('marketplace_categories').select('id').eq('slug', categorySlug).single();
    if (categoryData) {
      categoryId = categoryData.id;
    } else {
      const { data: newCat } = await supabase.from('marketplace_categories').insert({ name: category, slug: categorySlug }).select('id').single();
      categoryId = newCat!.id;
    }

    const coverImage = images && images.length > 0 ? images[0] : null;

    const { data, error } = await supabase
      .from('marketplace_items')
      .insert({
        seller_id: isStaffOrAdmin ? null : session.user.id,
        created_by: session.user.id,
        category_id: categoryId,
        title: title,
        slug: slug,
        description: description || title,
        price: price,
        price_type: 'fixed',
        is_negotiable: true,
        condition: condition,
        cover_image: coverImage,
        status: 'active',
      })
      .select()
      .single();

    if (error) throw error;
    
    // Save images if any
    if (images && images.length > 0) {
      const imageInserts = images.map((img: string) => ({
        item_id: data.id,
        url: img,
        created_by: session.user.id
      }));
      await supabase.from('marketplace_images').insert(imageInserts);
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
