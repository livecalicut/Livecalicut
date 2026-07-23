import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createPropertySchema } from '@/lib/validations/property';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const listingType = searchParams.get('type');
  const keyword = searchParams.get('search');

  const supabase = await createClient();
  let query = supabase
    .from('properties')
    .select('*, property_categories(name, slug), property_agencies(name, logo)')
    .eq('status', 'published')
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (listingType) query = query.eq('listing_type', listingType);
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
      return NextResponse.json({ success: false, message: 'Unauthorized authentication required' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    const role = profile?.role || 'user';
    const isStaffOrAdmin = ['super_admin', 'marketing_executive'].includes(role);

    const body = await request.json();
    const { title, listing_type, price, bedrooms, bathrooms, area_sqft, description, images } = body;

    if (!title || !listing_type || !price || !area_sqft) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 6);

    // Resolve Category ID (Real Estate as fallback category if missing)
    let categoryId: string | null = null;
    const { data: catData } = await supabase.from('property_categories').select('id').eq('slug', 'residential').single();
    if (catData) categoryId = catData.id;

    // Resolve City ID
    let cityId: string | null = null;
    const { data: cityData } = await supabase.from('cities').select('id').eq('slug', 'kozhikode').single();
    if (cityData) cityId = cityData.id;

    const coverImage = images && images.length > 0 ? images[0] : null;

    const { data, error } = await supabase
      .from('properties')
      .insert({
        owner_id: isStaffOrAdmin ? null : session.user.id,
        created_by: session.user.id,
        category_id: categoryId,
        city_id: cityId,
        listing_type: listing_type,
        title: title,
        slug: slug,
        description: description || title,
        price: price,
        bedrooms: bedrooms || 0,
        bathrooms: bathrooms || 0,
        area_sqft: area_sqft || 0,
        cover_image: coverImage,
        status: 'published',
      })
      .select()
      .single();

    if (error) throw error;
    
    // Save all images if provided
    if (images && images.length > 0) {
      const imageInserts = images.map((img: string) => ({
        property_id: data.id,
        url: img,
        created_by: session.user.id
      }));
      await supabase.from('property_images').insert(imageInserts);
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
