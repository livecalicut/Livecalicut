import { NextResponse } from 'next/server';
import { AnalyticsService } from '@/lib/services/analytics.service';

export async function GET() {
  const metrics = await AnalyticsService.getPlatformMetrics();
  return NextResponse.json({ data: metrics });
}
