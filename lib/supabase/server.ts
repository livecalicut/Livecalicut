import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Server-side Supabase client.
 * Uses cookie-based session — respects RLS policies for the authenticated user.
 * Call this only in Server Components, API Route Handlers, and Server Actions.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — cookies can't be set.
            // This is expected; session refresh is handled by the proxy.
          }
        },
      },
    }
  );
}

/**
 * Server-side Supabase Admin client.
 * Bypasses RLS policies.
 * Call this ONLY in secure Server Components, API Route Handlers, and Server Actions where bypassing RLS is explicitly required (e.g., fetching user roles).
 */
export async function createAdminClient() {
  // Use pure supabase-js client for admin tasks to avoid JWT injection from cookies,
  // which would otherwise re-enable RLS based on the user's session.
  const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
  
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}
