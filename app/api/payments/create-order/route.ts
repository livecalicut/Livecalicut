import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createOrderSchema } from '@/lib/validations/payment';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = createOrderSchema.parse(body);

    const orderId = `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const { data, error } = await supabase
      .from('payments')
      .insert({
        merchant_id: session.user.id,
        amount: validated.billingCycle === 'yearly' ? 9990 : 999,
        currency: 'INR',
        payment_gateway: 'razorpay',
        gateway_order_id: orderId,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      orderId: data.gateway_order_id,
      amount: data.amount,
      currency: data.currency,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_mock_key',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
