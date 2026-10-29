import { NextResponse } from 'next/server';
import { businessCover, businessImages } from '@/lib/business/images';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/supabase/require-auth';
import { createBusinessSchema } from '@/lib/validations/business';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categorySlug = searchParams.get('category');
  const keyword = searchParams.get('search');
  const isFeatured = searchParams.get('featured') === 'true';

  const supabase = await createClient();
  let query = supabase
    .from('businesses')
    .select('*, business_categories(name, slug), areas(name, slug), social_media')
    .is('deleted_at', null)
    .eq('status', 'active');

  if (isFeatured) query = query.eq('is_featured', true);
  if (keyword) query = query.ilike('name', `%${keyword}%`);

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const mapped = (data || []).map((b: any) => ({
    ...b,
    category: b.business_categories?.name || b.category,
    location: b.areas?.name || b.location,
    area: b.areas?.name,
    rating: b.rating_avg ?? b.rating ?? 0,
    cover_image: businessCover(b),
        images: businessImages(b),
  }));

  return NextResponse.json({ data: mapped });
}

export async function POST(request: Request) {
  try {
    const auth = await requireRole(['Merchant', 'City Admin', 'Super Admin', 'Marketing Executive', 'Moderator']);
    if (auth instanceof NextResponse) return auth;

    const isStaffOrAdmin = ['Super Admin', 'City Admin', 'Marketing Executive', 'Moderator'].includes(
      auth.user.role
    );
    // Writes must bypass RLS. The session client can read public rows only.
    const supabase = await createAdminClient();

    const body = await request.json();
    const { name, category, phone, location, description, cover_image, ownerEmail } = body;
    const text = (v: unknown, max = 200) => (typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : null);
    const httpUrl = (v: unknown) => (typeof v === 'string' && /^https?:\/\//.test(v.trim()) ? v.trim() : null);
    const gallery = Array.from(
      new Set([...(Array.isArray(body.gallery) ? body.gallery : []), cover_image].map(httpUrl).filter(Boolean))
    ).slice(0, 12) as string[];
    const amenities = Array.isArray(body.amenities)
      ? body.amenities.filter((a: unknown) => typeof a === 'string').map((a: string) => a.slice(0, 40)).slice(0, 20)
      : [];
    const websiteInput = text(body.website, 300);
    const website = websiteInput ? httpUrl(/^https?:/i.test(websiteInput) ? websiteInput : `https://${websiteInput}`) : null;

    if (!name || !category || !phone || !location) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    // Generate Slug
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 6);

    // 1. Resolve City ID (defaulting to Calicut for now as per frontend)
    let cityId: string;
    const { data: cityData } = await supabase.from('cities').select('id').eq('slug', 'kozhikode').single();
    if (cityData) {
      cityId = cityData.id;
    } else {
      // Fallback: create city if missing
      const { data: newCity } = await supabase.from('cities').insert({ name: 'Calicut', slug: 'kozhikode' }).select('id').single();
      cityId = newCity!.id;
    }

    // 2. Resolve Category ID
    let categoryId: string;
    const categorySlug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const { data: categoryData } = await supabase.from('business_categories').select('id').eq('slug', categorySlug).single();
    if (categoryData) {
      categoryId = categoryData.id;
    } else {
      const { data: newCat } = await supabase.from('business_categories').insert({ name: category, slug: categorySlug }).select('id').single();
      categoryId = newCat!.id;
    }

    // Resolve ownerId based on staff status and optional ownerEmail
    let ownerId = null;
    if (isStaffOrAdmin) {
      if (ownerEmail) {
        const trimmedEmail = ownerEmail.trim().toLowerCase();
        const supabaseAdmin = await createAdminClient();

        // 1. Check if profile with email exists
        const { data: existingProfile } = await supabaseAdmin
          .from('profiles')
          .select('id')
          .eq('email', trimmedEmail)
          .maybeSingle();

        if (existingProfile) {
          ownerId = existingProfile.id;

          // Check if they already have Merchant role
          const { data: existingRoles } = await supabaseAdmin
            .from('user_roles')
            .select('roles(name)')
            .eq('user_id', ownerId);

          const currentRoles = existingRoles?.map((ur: any) => ur.roles?.name).filter(Boolean) || [];
          if (!currentRoles.includes('Merchant')) {
            const { data: merchantRole } = await supabaseAdmin
              .from('roles')
              .select('id')
              .eq('name', 'Merchant')
              .single();

            if (merchantRole) {
              await supabaseAdmin
                .from('user_roles')
                .insert({ user_id: ownerId, role_id: merchantRole.id });
            }
          }
        } else {
          // 2. User does not exist, send Supabase invitation
          const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(trimmedEmail);
          
          if (inviteError) {
            throw inviteError;
          }

          ownerId = inviteData.user.id;

          // Assign Merchant role
          const { data: merchantRole } = await supabaseAdmin
            .from('roles')
            .select('id')
            .eq('name', 'Merchant')
            .single();

          if (merchantRole) {
            await supabaseAdmin
              .from('user_roles')
              .insert({ user_id: ownerId, role_id: merchantRole.id });
          }
        }
      }
    } else {
      ownerId = auth.user.id;
    }

    // Link the typed area name to a known area when one matches
    let areaId: string | null = null;
    const areaName = text(body.area, 120);
    if (areaName) {
      const { data: areaRow } = await supabase
        .from('areas')
        .select('id')
        .eq('city_id', cityId)
        .ilike('name', areaName.replace(/[%_]/g, ''))
        .is('deleted_at', null)
        .limit(1)
        .maybeSingle();
      areaId = areaRow?.id ?? null;
    }

    // Insert Business
    const { data, error } = await supabase
      .from('businesses')
      .insert({
        owner_id: ownerId,
        created_by: auth.user.id, // For tracking who created it (e.g. marketing staff)
        category_id: categoryId,
        city_id: cityId,
        name: name,
        slug: slug,
        description: description || name,
        phone: phone,
        whatsapp: text(body.whatsapp, 30),
        email: text(body.email, 200),
        website,
        area_id: areaId,
        short_description: location,
        // No image/hours columns in production: photos, hours and amenities live here
        social_media: {
          ...(gallery[0] ? { cover_image: gallery[0], gallery } : {}),
          ...(text(body.opening_hours) ? { opening_hours: text(body.opening_hours) } : {}),
          ...(amenities.length ? { amenities } : {}),
          ...(text(body.gst_number, 30) ? { gst_number: text(body.gst_number, 30) } : {}),
        },
        verification_status: isStaffOrAdmin ? 'approved' : 'pending',
        is_verified: isStaffOrAdmin,
        // Merchant submissions wait for staff approval before going public
        status: isStaffOrAdmin ? 'active' : 'pending',
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || 'Internal server error' }, { status: 400 });
  }
}
