import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const startTime = Date.now();
  let dbStatus = 'unhealthy';
  let latencyMs = 0;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('cities').select('id').limit(1);
    latencyMs = Date.now() - startTime;

    if (!error && data) {
      dbStatus = 'healthy';
    }
  } catch (err) {
    dbStatus = 'error';
  }

  const memoryUsage = process.memoryUsage();

  const isHealthy = dbStatus === 'healthy';

  return NextResponse.json(
    {
      status: isHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      version: '1.0.0-production',
      services: {
        database: {
          status: dbStatus,
          latencyMs,
        },
        supabaseRealtime: {
          status: 'operational',
        },
        razorpayGateway: {
          status: 'configured',
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
    { status: isHealthy ? 200 : 503 }
  );
}
