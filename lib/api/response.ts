import { NextResponse } from 'next/server';

export interface ApiSuccessPayload<T> {
  success: true;
  message: string;
  data: T;
  meta?: Record<string, any>;
}

export interface ApiErrorPayload {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any[];
  };
}

export class ApiResponse {
  static success<T>(
    data: T,
    message: string = 'Operation completed successfully',
    meta: Record<string, any> = {},
    status: number = 200
  ): NextResponse<ApiSuccessPayload<T>> {
    return NextResponse.json(
      {
        success: true,
        message,
        data,
        meta,
      },
      { status }
    );
  }

  static error(
    code: string,
    message: string,
    details: any[] = [],
    status: number = 400
  ): NextResponse<ApiErrorPayload> {
    return NextResponse.json(
      {
        success: false,
        error: {
          code,
          message,
          details,
        },
      },
      { status }
    );
  }
}
