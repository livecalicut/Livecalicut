import { createClient } from '@/lib/supabase/client';
import crypto from 'crypto';

export class PaymentService {
  private static supabase = createClient();

  static async getPlans() {
    const { data, error } = await this.supabase
      .from('subscription_plans')
      .select('*')
      .is('deleted_at', null)
      .order('monthly_price', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async getMerchantSubscription(merchantId: string) {
    const { data, error } = await this.supabase
      .from('subscriptions')
      .select('*, subscription_plans(*)')
      .eq('merchant_id', merchantId)
      .eq('status', 'active')
      .is('deleted_at', null)
      .single();

    if (error) return null;
    return data;
  }

  /**
   * Verifies a Razorpay payment signature.
   *
   * There is deliberately no development bypass and no default secret: the
   * previous version returned true for any signature outside production, which
   * meant a forged callback was accepted in every non-production environment.
   */
  static verifyRazorpaySignature(
    orderId: string,
    paymentId: string,
    signature: string,
    secret: string = process.env.RAZORPAY_KEY_SECRET ?? ''
  ): boolean {
    if (!secret) {
      console.error('[PaymentService] RAZORPAY_KEY_SECRET is not configured; rejecting payment.');
      return false;
    }
    if (!orderId || !paymentId || !signature) return false;

    const expected = crypto
      .createHmac('sha256', secret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    const expectedBuffer = Buffer.from(expected, 'utf8');
    const providedBuffer = Buffer.from(signature, 'utf8');

    // Length must match before timingSafeEqual, which throws on a mismatch.
    if (expectedBuffer.length !== providedBuffer.length) return false;

    return crypto.timingSafeEqual(expectedBuffer, providedBuffer);
  }

  static async getInvoices(merchantId: string) {
    const { data, error } = await this.supabase
      .from('invoices')
      .select('*, payments(*)')
      .eq('merchant_id', merchantId)
      .order('issued_at', { ascending: false });

    if (error) return [];
    return data || [];
  }
}
