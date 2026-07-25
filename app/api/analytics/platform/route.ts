import { NextResponse } from 'next/server';
import { AnalyticsService } from '@/lib/services/analytics.service';
import { requireRole } from '@/lib/supabase/require-auth';

export async function GET() {
  // Platform-wide metrics are admin-only; this route previously had no auth
  // check at all and served them to anonymous callers.
  const auth = await requireRole(['Super Admin', 'City Admin']);
  if (auth instanceof NextResponse) return auth;

  const metrics = await AnalyticsService.getPlatformMetrics();
  return NextResponse.json({ data: metrics });
}
