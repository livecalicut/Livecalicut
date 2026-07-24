import { NextResponse } from 'next/server';
import { SetupService } from '@/lib/services/setup.service';

export const dynamic = 'force-dynamic';

export async function GET() {
  const status = await SetupService.getStatus();
  const cities = status.tables.find((t) => t.table === 'cities');
  const dbHealthy = cities?.status === 'ok';
  const memoryUsage = process.memoryUsage();

  return NextResponse.json(
    {
      status: dbHealthy ? 'healthy' : status.overall === 'degraded' ? 'degraded' : 'unhealthy',
      timestamp: status.timestamp,
      version: '1.0.0-production',
      setup: {
        overall: status.overall,
        path: '/setup',
        nextSteps: status.nextSteps,
      },
      services: {
        database: {
          status: cities?.status === 'ok' ? 'healthy' : cities?.status ?? 'unhealthy',
          latencyMs: cities?.latencyMs ?? status.latencyMs,
          rowCount: cities?.count,
          error: cities?.error,
        },
        env: {
          status: status.env.every((e) => !e.required || e.present) ? 'ok' : 'incomplete',
          serviceRoleConfigured: Boolean(
            status.env.find((e) => e.key === 'SUPABASE_SERVICE_ROLE_KEY')?.present
          ),
        },
      },
      system: {
        uptimeSeconds: Math.floor(process.uptime()),
        memory: {
          rssMb: Math.round(memoryUsage.rss / (1024 * 1024)),
          heapUsedMb: Math.round(memoryUsage.heapUsed / (1024 * 1024)),
        },
      },
    },
    { status: dbHealthy ? 200 : 503 }
  );
}
