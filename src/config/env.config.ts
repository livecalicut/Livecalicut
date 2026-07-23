import { z } from 'zod';

/**
 * Server-side environment variable validation.
 * All keys use the Next.js NEXT_PUBLIC_* convention so they are
 * safely accessible in both Server and Client components.
 *
 * Note: SUPABASE_SERVICE_ROLE_KEY is NOT listed here because it
 * must never be prefixed NEXT_PUBLIC_ and is only used in
 * lib/supabase/admin.ts via process.env directly.
 */
const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url({
    message: 'NEXT_PUBLIC_SUPABASE_URL must be a valid URL (e.g. https://xxxx.supabase.co)',
  }),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(10, {
    message: 'NEXT_PUBLIC_SUPABASE_ANON_KEY is missing or too short',
  }),
  NEXT_PUBLIC_APP_NAME: z.string().default('LiveCalicut Hyperlocal Portal'),
  NEXT_PUBLIC_APP_DEFAULT_CITY: z.string().default('Kozhikode (Calicut)'),
  NEXT_PUBLIC_APP_DEFAULT_LAT: z.coerce.number().default(11.2588),
  NEXT_PUBLIC_APP_DEFAULT_LNG: z.coerce.number().default(75.7804),
  NEXT_PUBLIC_ENABLE_MARKETPLACE: z.preprocess(
    (v) => v === 'true' || v === true,
    z.boolean().default(true)
  ),
  NEXT_PUBLIC_ENABLE_JOBS: z.preprocess(
    (v) => v === 'true' || v === true,
    z.boolean().default(true)
  ),
  NEXT_PUBLIC_ENABLE_REALTIME: z.preprocess(
    (v) => v === 'true' || v === true,
    z.boolean().default(true)
  ),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_APP_DEFAULT_CITY: process.env.NEXT_PUBLIC_APP_DEFAULT_CITY,
  NEXT_PUBLIC_APP_DEFAULT_LAT: process.env.NEXT_PUBLIC_APP_DEFAULT_LAT,
  NEXT_PUBLIC_APP_DEFAULT_LNG: process.env.NEXT_PUBLIC_APP_DEFAULT_LNG,
  NEXT_PUBLIC_ENABLE_MARKETPLACE: process.env.NEXT_PUBLIC_ENABLE_MARKETPLACE,
  NEXT_PUBLIC_ENABLE_JOBS: process.env.NEXT_PUBLIC_ENABLE_JOBS,
  NEXT_PUBLIC_ENABLE_REALTIME: process.env.NEXT_PUBLIC_ENABLE_REALTIME,
});

export type Env = z.infer<typeof envSchema>;
