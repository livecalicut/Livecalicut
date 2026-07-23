import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const cityId = searchParams.get('city');
  
  let query = supabase
    .from('areas')
    .select('*, cities(name)')
    .order('name', { ascending: true });

  if (cityId) {
    query = query.eq('city_id', cityId);
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
    const { name, city_id } = body;

    if (!name) {
      return NextResponse.json({ success: false, message: 'Location name is required.' }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    // Default to Kozhikode city if not provided
    let finalCityId = city_id;
    if (!finalCityId) {
      const { data: cityData } = await supabase.from('cities').select('id').eq('slug', 'kozhikode').single();
      if (cityData) {
        finalCityId = cityData.id;
      } else {
        const { data: newCity } = await supabase.from('cities').insert({ name: 'Kozhikode', slug: 'kozhikode' }).select('id').single();
        finalCityId = newCity!.id;
      }
    }

    const { data, error } = await supabase
      .from('areas')
      .insert({
        name,
        slug,
        city_id: finalCityId,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ success: false, message: 'Location already exists.' }, { status: 400 });
      }
      throw error;
    }
    
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
