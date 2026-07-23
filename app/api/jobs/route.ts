import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createJobSchema } from '@/lib/validations/job';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const employmentType = searchParams.get('type');
  const isUrgent = searchParams.get('urgent') === 'true';

  const supabase = await createClient();
  let query = supabase
    .from('jobs')
    .select('*, companies(name, slug, logo), job_categories(name, slug)')
    .eq('status', 'published')
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (employmentType) query = query.eq('employment_type', employmentType);
  if (isUrgent) query = query.eq('is_urgent', true);

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
    const { title, company, category, employment_type, experience, salary, description, requirements } = body;

    if (!title || !company || !category) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 6);

    // Resolve Category ID
    let categoryId: string | null = null;
    const categorySlug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const { data: categoryData } = await supabase.from('job_categories').select('id').eq('slug', categorySlug).single();
    if (categoryData) {
      categoryId = categoryData.id;
    } else {
      const { data: newCat } = await supabase.from('job_categories').insert({ name: category, slug: categorySlug }).select('id').single();
      if (newCat) categoryId = newCat.id;
    }

    // Resolve Company ID
    let companyId: string | null = null;
    const companySlug = company.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const { data: companyData } = await supabase.from('companies').select('id').eq('slug', companySlug).single();
    if (companyData) {
      companyId = companyData.id;
    } else {
      const { data: newComp } = await supabase.from('companies').insert({ 
        name: company, 
        slug: companySlug,
        owner_id: isStaffOrAdmin ? null : session.user.id,
        created_by: session.user.id
      }).select('id').single();
      if (newComp) companyId = newComp.id;
    }

    // Resolve City ID
    let cityId: string | null = null;
    const { data: cityData } = await supabase.from('cities').select('id').eq('slug', 'kozhikode').single();
    if (cityData) cityId = cityData.id;

    const { data, error } = await supabase
      .from('jobs')
      .insert({
        company_id: companyId,
        category_id: categoryId,
        city_id: cityId,
        created_by: session.user.id,
        title: title,
        slug: slug,
        description: description || title,
        requirements: requirements || [],
        experience: experience,
        salary: salary,
        employment_type: employment_type || 'full-time',
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
