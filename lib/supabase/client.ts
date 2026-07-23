import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '[LiveCalicut] Missing Supabase environment variables.\n' +
    'Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
  );
}

/**
 * Browser (client-side) Supabase client.
 * Uses the anon key — subject to RLS policies.
 * Call this only in Client Components or browser-only code.
 */
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
