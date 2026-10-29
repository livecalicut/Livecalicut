'use server';

import { requireRole } from '@/lib/supabase/require-auth';
import { NextResponse } from 'next/server';
import { CONTENT_EDITORS } from '@/lib/rbac/roles';

export async function fetchAdminPlacesAction() {
  try {
    const auth = await requireRole([...CONTENT_EDITORS]);
    if (auth instanceof NextResponse) throw new Error('Unauthorized');

    const { data, error } = await auth.supabase
      .from('places')
      .select('*, place_categories(name), areas(name)')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
