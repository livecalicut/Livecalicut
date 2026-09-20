import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Routes that require any authenticated user
const AUTH_REQUIRED_ROUTES = [
  '/dashboard',
  '/account',
  '/profile',
  '/settings',
  '/bookmarks',
  '/notifications',
  '/applications',
  '/jobs/saved',
  '/jobs/apply',
  '/marketplace/saved',
  '/properties/saved',
  '/explore/saved',
];

// Create / post flows — merchant or admin only (UI also hides Post CTAs for guests)
const MERCHANT_ROUTES = ['/merchant', '/marketplace/create', '/properties/create', '/business/create'];

// Routes that require Moderator, City Admin, or Super Admin
const ADMIN_ROUTES = ['/admin'];

// Routes that should redirect authenticated users away (login/register pages)
const AUTH_REDIRECT_ROUTES = ['/login', '/register'];

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const pathname = request.nextUrl.pathname;

  const isAuthRoute = AUTH_REDIRECT_ROUTES.some((r) => pathname.startsWith(r));
  const isProtected =
    AUTH_REQUIRED_ROUTES.some((r) => pathname.startsWith(r)) ||
    MERCHANT_ROUTES.some((r) => pathname.startsWith(r)) ||
    ADMIN_ROUTES.some((r) => pathname.startsWith(r));

  const hasAuthCookie = request.cookies
    .getAll()
    .some((cookie) => cookie.name.startsWith('sb-') && Boolean(cookie.value));

  // Public pages (and login/register with no session) should not wait on Supabase.
  if (!isProtected && !(isAuthRoute && hasAuthCookie)) {
    return supabaseResponse;
  }

  if (isProtected && !hasAuthCookie) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse;
  }

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
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
    });

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser().catch(() => ({ data: { user: null }, error: null }));

    if (authError && authError.status !== 400) {
      console.warn('[proxy] Auth check:', authError.message);
    }

    if (isAuthRoute && user) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    if (isProtected && !user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (user && (MERCHANT_ROUTES.some((r) => pathname.startsWith(r)) || ADMIN_ROUTES.some((r) => pathname.startsWith(r)))) {
      const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

      const supabaseAdmin = createServerClient(supabaseUrl, serviceRoleKey, {
        cookies: {
          getAll() {
            return [];
          },
          setAll() {},
        },
      });

      const { data: userRoles } = await supabaseAdmin
        .from('user_roles')
        .select('roles(name)')
        .eq('user_id', user.id);

      const roleNames =
        userRoles && userRoles.length > 0
          ? userRoles.map((ur: any) => ur.roles?.name).filter(Boolean)
          : ['User'];

      if (MERCHANT_ROUTES.some((r) => pathname.startsWith(r))) {
        const allowed = ['Merchant', 'City Admin', 'Super Admin', 'Marketing Executive'].some((r) =>
          roleNames.includes(r)
        );
        if (!allowed) {
          return NextResponse.redirect(new URL('/unauthorized', request.url));
        }
      }

      if (ADMIN_ROUTES.some((r) => pathname.startsWith(r))) {
        const allowed = ['Moderator', 'City Admin', 'Super Admin', 'Marketing Executive'].some((r) =>
          roleNames.includes(r)
        );
        if (!allowed) {
          return NextResponse.redirect(new URL('/unauthorized', request.url));
        }
      }
    }
  } catch (error) {
    console.error('[proxy] Handled middleware error:', error);
    return supabaseResponse;
  }

  return supabaseResponse;
}

export { proxy as middleware };

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
