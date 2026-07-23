import { NextResponse } from 'next/server';
import { AnalyticsService } from '@/lib/services/analytics.service';

export async function GET() {
  try {
    const metrics = await AnalyticsService.getPlatformMetrics();
    const daily = await AnalyticsService.getDailyAggregates();

    return NextResponse.json({
      metrics,
      daily,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
