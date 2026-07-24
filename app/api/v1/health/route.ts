import { ApiResponse } from '@/lib/api/response';
import { SetupService } from '@/lib/services/setup.service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const status = await SetupService.getStatus();
    const cities = status.tables.find((t) => t.table === 'cities');
    const dbOk = cities?.status === 'ok';

    return ApiResponse.success(
      {
        version: 'v1',
        status: dbOk ? 'operational' : status.overall,
        connected: status.connected,
        database: {
          status: cities?.status ?? 'error',
          count: cities?.count ?? null,
          latencyMs: cities?.latencyMs ?? status.latencyMs,
          error: cities?.error,
        },
        env: {
          supabaseUrl: status.env.find((e) => e.key === 'NEXT_PUBLIC_SUPABASE_URL')?.present,
          anonKey: status.env.find((e) => e.key === 'NEXT_PUBLIC_SUPABASE_ANON_KEY')?.present,
          serviceRole: status.env.find((e) => e.key === 'SUPABASE_SERVICE_ROLE_KEY')?.present,
        },
        timestamp: status.timestamp,
        setupPath: '/setup',
      },
      dbOk
        ? 'LiveCalicut v1 backend healthy'
        : 'LiveCalicut v1 backend needs setup — open /setup',
      {},
      dbOk ? 200 : 503
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Health check failed';
    return ApiResponse.error('HEALTH_ERROR', message, [], 500);
  }
}
