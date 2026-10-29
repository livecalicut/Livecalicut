import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin: requestOrigin } = new URL(request.url);
  // Behind nginx request.url is the internal host (localhost:3000); use the public URL
  const origin = process.env.NEXT_PUBLIC_APP_URL || requestOrigin;
  const code = searchParams.get('code');
  const nextParam = searchParams.get('next') ?? '/profile';
  // Only same-site relative paths; "@evil.com" or "//evil.com" would leave the site
  const next = nextParam.startsWith('/') && !nextParam.startsWith('//') ? nextParam : '/profile';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=Could%20not%20authenticate%20OAuth%20user`);
}
