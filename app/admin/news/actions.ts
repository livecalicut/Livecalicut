'use server';

import { requireRole } from '@/lib/supabase/require-auth';
import { NextResponse } from 'next/server';
import { applyCreatorScope } from '@/lib/rbac/data-scope';
import { CONTENT_EDITORS } from '@/lib/rbac/roles';

export async function fetchAdminNewsAction() {
  try {
    const auth = await requireRole([...CONTENT_EDITORS]);
    if (auth instanceof NextResponse) throw new Error('Unauthorized');

    let query = auth.supabase
      .from('news')
      .select('*, news_categories(name), profiles(full_name)')
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
