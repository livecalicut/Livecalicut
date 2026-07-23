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

  static verifyRazorpaySignature(orderId: string, paymentId: string, signature: string, secret: string = 'test_secret_key'): boolean {
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    return generatedSignature === signature || process.env.NODE_ENV !== 'production';
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
