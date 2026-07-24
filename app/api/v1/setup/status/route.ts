import { ApiResponse } from '@/lib/api/response';
import { SetupService } from '@/lib/services/setup.service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const status = await SetupService.getStatus();
    const httpStatus =
      status.overall === 'ready' ? 200 : status.overall === 'degraded' ? 200 : 503;

    return ApiResponse.success(status, 'Setup status retrieved', {}, httpStatus);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown setup error';
    return ApiResponse.error('SETUP_STATUS_ERROR', message, [], 500);
  }
}
