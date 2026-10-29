import { NextResponse } from 'next/server';
import type { EmailOtpType } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';

const ALLOWED_TYPES: EmailOtpType[] = ['recovery', 'invite', 'magiclink', 'email', 'signup'];

/** Verifies a token-hash link (e.g. an admin-issued password setup link) and signs the user in. */
export async function GET(request: Request) {
  const { searchParams, origin: requestOrigin } = new URL(request.url);
  // Behind nginx request.url is the internal host (localhost:3000); use the public URL
  const origin = process.env.NEXT_PUBLIC_APP_URL || requestOrigin;
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const nextParam = searchParams.get('next') ?? '/reset-password';
  // Only same-site relative paths, never "//host" or absolute URLs
  const next = nextParam.startsWith('/') && !nextParam.startsWith('//') ? nextParam : '/reset-password';

  if (tokenHash && type && ALLOWED_TYPES.includes(type)) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }

  return NextResponse.redirect(
    `${origin}/login?error=${encodeURIComponent('This link is invalid or has expired. Ask your admin for a new one.')}`
  );
}
