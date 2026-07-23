'use server';

import { createClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/supabase/require-auth';
import { NextResponse } from 'next/server';

const ADMIN_ROLES = ['Super Admin', 'City Admin', 'Moderator'];

export async function fetchAdminMarketplaceAction() {
  try {
    const auth = await requireRole(ADMIN_ROLES);
    if (auth instanceof NextResponse) throw new Error('Unauthorized');

    const { data, error } = await auth.supabase
      .from('marketplace_items')
      .select('*, seller_profiles(full_name), marketplace_categories(name), areas(name)')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
