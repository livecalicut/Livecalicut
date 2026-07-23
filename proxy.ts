import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Routes that require any authenticated user
const AUTH_REQUIRED_ROUTES = ['/dashboard', '/profile', '/settings', '/bookmarks', '/notifications'];
// Routes that require Merchant, City Admin, or Super Admin
const MERCHANT_ROUTES = ['/merchant'];
// Routes that require Moderator, City Admin, or Super Admin
const ADMIN_ROUTES = ['/admin'];
// Routes that should redirect authenticated users away (login/register pages)
const AUTH_REDIRECT_ROUTES = ['/login', '/register'];

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const pathname = request.nextUrl.pathname;

  // ─── Create server Supabase client ───────────────────────────────────────
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // ─── Verify session server-side ──────────────────────────────────────────
  // IMPORTANT: Always use getUser() — it validates with Supabase's auth server.
  // Never use getSession() here — it only reads the local JWT without verification.
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  // Log auth errors (e.g. expired token) but don't crash
  if (authError && authError.status !== 400) {
    console.error('[proxy] Auth error:', authError.message);
  }

  // ─── Redirect already-authenticated users away from login/register ────────
  const isAuthRoute = AUTH_REDIRECT_ROUTES.some((r) => pathname.startsWith(r));
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // ─── Guard: route requires authentication ─────────────────────────────────
  const isProtected =
    AUTH_REQUIRED_ROUTES.some((r) => pathname.startsWith(r)) ||
    MERCHANT_ROUTES.some((r) => pathname.startsWith(r)) ||
    ADMIN_ROUTES.some((r) => pathname.startsWith(r));

  if (isProtected && !user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ─── Role-based access control ────────────────────────────────────────────
  if (user) {
    // Fetch role via the user_roles linking table using Service Role Key to bypass RLS on roles table
    const supabaseAdmin = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll() { return []; },
          setAll() {},
        },
      }
    );

    const { data: userRoles, error: roleError } = await supabaseAdmin
      .from('user_roles')
      .select('roles(name)')
      .eq('user_id', user.id);

    if (roleError) {
      console.error('[proxy] Role fetch error:', roleError.message);
    }

    // Safely extract all role names — default to ['User'] if no roles assigned
    const roleNames = userRoles && userRoles.length > 0 
      ? userRoles.map(ur => (ur.roles as any)?.name).filter(Boolean)
      : ['User'];

    // Merchant routes: Merchant, City Admin, Super Admin
    if (MERCHANT_ROUTES.some((r) => pathname.startsWith(r))) {
      const allowed = ['Merchant', 'City Admin', 'Super Admin'].some(r => roleNames.includes(r));
      if (!allowed) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }

    // Admin routes: Moderator, City Admin, Super Admin, Marketing Executive
    if (ADMIN_ROUTES.some((r) => pathname.startsWith(r))) {
      const allowed = ['Moderator', 'City Admin', 'Super Admin', 'Marketing Executive'].some(r => roleNames.includes(r));
      if (!allowed) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - image files
     * - API routes (handled by their own auth via requireAuth helper)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
