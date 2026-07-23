import { ApiResponse } from '@/lib/api/response';

export async function GET() {
  return ApiResponse.success(
    {
      version: 'v1',
      status: 'operational',
      timestamp: new Date().toISOString(),
    },
    'LiveCalicut Enterprise v1 Backend Services Healthy'
  );
}
