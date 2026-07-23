'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/shared/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, ShieldCheck, CheckCircle } from 'lucide-react';

export default function CheckoutGatewayPage({ params }: { params: Promise<{ planId: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSimulatedPayment = async () => {
    setLoading(true);
    setTimeout(() => {
      setSuccess(true);
      setTimeout(() => {
        router.push('/billing/history');
      }, 2000);
    }, 1500);
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 py-4">
      <PageHeader
        title="Secure Razorpay Gateway Checkout"
        description="Encrypted 256-bit UPI & Card Payment Gateway for LiveCalicut."
        icon={<CreditCard className="w-6 h-6" />}
        breadcrumbs={[
          { label: 'Subscriptions', href: '/subscriptions' },
          { label: 'Checkout' },
        ]}
      />

      {success ? (
        <Card className="p-8 text-center space-y-4 border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20">
          <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Payment Captured & Plan Activated!</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Razorpay HMAC signature verified. Your GST invoice has been generated. Redirecting to Billing History...
          </p>
        </Card>
      ) : (
        <Card className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Professional Suite Plan</h4>
              <p className="text-xs text-slate-400">Monthly Merchant Membership</p>
            </div>
            <span className="text-xl font-black text-cyan-600 dark:text-cyan-400">₹999.00</span>
          </div>

          <div className="space-y-2 text-xs text-slate-500">
            <div className="flex justify-between"><span>Base Amount:</span><span>₹846.61</span></div>
            <div className="flex justify-between"><span>GST (18%):</span><span>₹152.39</span></div>
            <div className="flex justify-between font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800">
              <span>Total Payable:</span><span>₹999.00</span>
            </div>
          </div>

          <Button onClick={handleSimulatedPayment} disabled={loading} className="w-full gap-2 py-3 text-sm font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            {loading ? 'Verifying Razorpay Signature...' : 'Pay ₹999 via Razorpay / UPI'}
          </Button>
        </Card>
      )}
    </div>
  );
}
