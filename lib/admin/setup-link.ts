// lib/admin/setup-link.ts
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * One-time link that signs the user in and opens /reset-password so they can
 * choose a password. Built from a recovery token hash and verified server-side
 * by /auth/confirm, so it works in any browser (unlike PKCE email links).
 */
export async function createPasswordSetupLink(admin: SupabaseClient, email: string, requestUrl: string) {
  const { data, error } = await admin.auth.admin.generateLink({ type: 'recovery', email });
  if (error) throw error;

  const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(requestUrl).origin;
  const link = new URL('/auth/confirm', origin);
  link.searchParams.set('token_hash', data.properties.hashed_token);
  link.searchParams.set('type', 'recovery');
  link.searchParams.set('next', '/reset-password');
  return link.toString();
}
