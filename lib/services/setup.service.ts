import { createClient as createBrowserlessClient } from '@supabase/supabase-js';

export type CheckStatus = 'ok' | 'missing' | 'error' | 'skipped';

export interface EnvCheck {
  key: string;
  present: boolean;
  required: boolean;
  public: boolean;
}

export interface TableCheck {
  table: string;
  status: CheckStatus;
  count: number | null;
  error?: string;
  latencyMs: number;
}

export interface SetupStatus {
  overall: 'ready' | 'needs_schema' | 'needs_env' | 'degraded';
  connected: boolean;
  latencyMs: number;
  projectUrl: string | null;
  env: EnvCheck[];
  tables: TableCheck[];
  nextSteps: string[];
  timestamp: string;
}

const REQUIRED_TABLES = [
  'cities',
  'areas',
  'roles',
  'profiles',
  'user_roles',
  'settings',
  'business_categories',
  'businesses',
  'job_categories',
  'companies',
  'jobs',
  'news_categories',
  'news',
] as const;

function getAnonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  return createBrowserlessClient(url, anon, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createBrowserlessClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export class SetupService {
  static getEnvChecks(): EnvCheck[] {
    const present = (key: string) => Boolean(process.env[key]?.trim());
    return [
      {
        key: 'NEXT_PUBLIC_SUPABASE_URL',
        present: present('NEXT_PUBLIC_SUPABASE_URL'),
        required: true,
        public: true,
      },
      {
        key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
        present: present('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
        required: true,
        public: true,
      },
      {
        key: 'SUPABASE_SERVICE_ROLE_KEY',
        present: present('SUPABASE_SERVICE_ROLE_KEY'),
        required: true,
        public: false,
      },
      {
        key: 'NEXT_PUBLIC_APP_NAME',
        present: present('NEXT_PUBLIC_APP_NAME'),
        required: false,
        public: true,
      },
    ];
  }

  static async getStatus(): Promise<SetupStatus> {
    const env = this.getEnvChecks();
    const missingRequired = env.filter((e) => e.required && !e.present);
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || null;
    const client = getAdminClient() || getAnonClient();

    const nextSteps: string[] = [];
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      nextSteps.push('Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env');
    }
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      nextSteps.push(
        'Add SUPABASE_SERVICE_ROLE_KEY from Supabase Dashboard → Project Settings → API (service_role)'
      );
    }

    if (!client) {
      return {
        overall: 'needs_env',
        connected: false,
        latencyMs: 0,
        projectUrl: url,
        env,
        tables: REQUIRED_TABLES.map((table) => ({
          table,
          status: 'skipped',
          count: null,
          latencyMs: 0,
        })),
        nextSteps,
        timestamp: new Date().toISOString(),
      };
    }

    const started = Date.now();
    const tables: TableCheck[] = [];

    for (const table of REQUIRED_TABLES) {
      const t0 = Date.now();
      const { data, error } = await client.from(table).select('id').limit(1);
      const latencyMs = Date.now() - t0;

      if (error) {
        const missing =
          error.code === 'PGRST205' ||
          /could not find the table/i.test(error.message) ||
          /schema cache/i.test(error.message);
        tables.push({
          table,
          status: missing ? 'missing' : 'error',
          count: null,
          error: error.message,
          latencyMs,
        });
      } else {
        // Accurate counts only when table exists
        const { count } = await client
          .from(table)
          .select('*', { count: 'exact', head: true });
        tables.push({
          table,
          status: 'ok',
          count: count ?? data?.length ?? 0,
          latencyMs,
        });
      }
    }

    const latencyMs = Date.now() - started;
    const missingTables = tables.filter((t) => t.status === 'missing');
    const errorTables = tables.filter((t) => t.status === 'error');
    const connected = tables.some((t) => t.status === 'ok') || missingTables.length > 0;

    if (missingTables.length > 0) {
      nextSteps.push(
        'Run supabase/bootstrap.sql in the Supabase SQL Editor (Dashboard → SQL → New query)'
      );
      nextSteps.push('Then run supabase/seed.sql in the same SQL Editor (or npm run db:seed)');
      nextSteps.push('Open /setup and click Recheck');
    } else if (tables.some((t) => t.status === 'ok' && (t.count ?? 0) === 0)) {
      nextSteps.push('Schema is present but empty — run supabase/seed.sql or npm run db:seed');
    }

    if (errorTables.length > 0 && missingTables.length === 0) {
      nextSteps.push('Some tables returned errors — check RLS policies and column compatibility');
    }

    let overall: SetupStatus['overall'] = 'ready';
    if (missingRequired.length > 0) overall = 'needs_env';
    else if (missingTables.length > 0) overall = 'needs_schema';
    else if (errorTables.length > 0) overall = 'degraded';

    if (overall === 'ready' && nextSteps.length === 0) {
      nextSteps.push('All checks passed — browse / and /api/v1/cities');
    }

    return {
      overall,
      connected,
      latencyMs,
      projectUrl: url,
      env,
      tables,
      nextSteps,
      timestamp: new Date().toISOString(),
    };
  }
}
