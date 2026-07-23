import { NextResponse } from 'next/server';
import { PaymentService } from '@/lib/services/payment.service';

export async function GET() {
  try {
    const plans = await PaymentService.getPlans();
    return NextResponse.json({ data: plans });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
