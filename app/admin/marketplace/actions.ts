'use server';

import { requireRole } from '@/lib/supabase/require-auth';
import { NextResponse } from 'next/server';
import { applyCreatorScope } from '@/lib/rbac/data-scope';
import { LISTING_STAFF } from '@/lib/rbac/roles';

export async function fetchAdminMarketplaceAction() {
  try {
    const auth = await requireRole([...LISTING_STAFF]);
    if (auth instanceof NextResponse) throw new Error('Unauthorized');

    let query = auth.supabase
      .from('marketplace_items')
      .select('*, seller_profiles(full_name), marketplace_categories(name), areas(name)')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    query = applyCreatorScope(query, auth.user.role, auth.user.id);

    const { data, error } = await query;
    if (error) throw error;
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
