import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyPaymentSchema } from '@/lib/validations/payment';
import { PaymentService } from '@/lib/services/payment.service';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = verifyPaymentSchema.parse(body);

    const isValid = PaymentService.verifyRazorpaySignature(
      validated.orderId,
      validated.paymentId,
      validated.signature
    );

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    // 1. Update Payment record to Captured
    await supabase
      .from('payments')
      .update({
        gateway_payment_id: validated.paymentId,
        gateway_signature: validated.signature,
        status: 'captured',
      })
      .eq('gateway_order_id', validated.orderId);

    // 2. Provision / Renew Subscription
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    const { data: subscription } = await supabase
      .from('subscriptions')
      .insert({
        merchant_id: session.user.id,
        plan_id: validated.planId,
        billing_cycle: 'monthly',
        starts_at: new Date().toISOString(),
        ends_at: endDate.toISOString(),
        status: 'active',
      })
      .select()
      .single();

    // 3. Issue GST Invoice
    const invoiceNum = `INV-LC-${Date.now()}`;
    await supabase.from('invoices').insert({
      merchant_id: session.user.id,
      payment_id: subscription.id,
      invoice_number: invoiceNum,
      total_amount: 999,
      tax_amount: 179.82,
      status: 'paid',
    });

    return NextResponse.json({ success: true, subscriptionId: subscription.id, invoiceNumber: invoiceNum });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
