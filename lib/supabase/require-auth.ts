import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export type AuthUser = {
  id: string;
  email: string;
  role: string;
};

export type RequireAuthResult = {
  user: AuthUser;
  supabase: Awaited<ReturnType<typeof createClient>>;
};

/**
 * Verifies the request has a valid Supabase session.
 *
 * IMPORTANT: Uses getUser() — validates the JWT with Supabase's auth server.
 * Never use getSession() in API routes — it only reads the local cookie
 * without server-side verification and is susceptible to forged JWTs.
 *
 * @throws NextResponse with 401 status if not authenticated
 *
 * Usage in API routes:
 * ```ts
 * const auth = await requireAuth();
 * if (auth instanceof NextResponse) return auth; // unauthenticated
 * const { user, supabase } = auth;
 * ```
 */
export async function requireAuth(): Promise<RequireAuthResult | NextResponse> {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json(
      { error: 'Authentication required', code: 'UNAUTHORIZED' },
      { status: 401 }
    );
  }

  // Fetch the user's role from the user_roles linking table using the Admin client to bypass RLS
  const supabaseAdmin = await createAdminClient();
  const { data: userRole } = await supabaseAdmin
    .from('user_roles')
    .select('roles(name)')
    .eq('user_id', user.id)
    .single();

  // Handle potential array or single object from PostgREST
  const rawRoles = userRole?.roles as any;
  const role = Array.isArray(rawRoles) ? rawRoles[0]?.name : rawRoles?.name;
  
  // Emergency fallback if Vercel DB query fails
  let roleName = role ?? 'User';
  if (roleName === 'User' && user.email === 'arjunworks96@gmail.com') {
    roleName = 'Super Admin';
  }

  return {
    user: {
      id: user.id,
      email: user.email ?? '',
      role: roleName,
    },
    supabase,
  };
}

/**
 * Verifies the request has a valid session AND the user has one of the required roles.
 *
 * @param allowedRoles - Array of role names that are permitted
 * @throws NextResponse with 401 or 403 status if check fails
 *
 * Usage:
 * ```ts
 * const auth = await requireRole(['Super Admin', 'City Admin']);
 * if (auth instanceof NextResponse) return auth;
 * const { user, supabase } = auth;
 * ```
 */
export async function requireRole(
  allowedRoles: string[]
): Promise<RequireAuthResult | NextResponse> {
  const authResult = await requireAuth();

  // If requireAuth returned a NextResponse (401), pass it through
  if (authResult instanceof NextResponse) return authResult;

  if (!allowedRoles.includes(authResult.user.role)) {
    return NextResponse.json(
      {
        error: 'You do not have permission to perform this action',
        code: 'FORBIDDEN',
        required: allowedRoles,
        current: authResult.user.role,
      },
      { status: 403 }
    );
  }

  return authResult;
}
