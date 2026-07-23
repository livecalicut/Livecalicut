import { PageHeader } from '@/components/shared/page-header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreditCard, Download, CheckCircle } from 'lucide-react';

export default function BillingHistoryPage() {
  const invoices = [
    {
      id: '1',
      invoiceNumber: 'INV-LC-2026-0042',
      date: 'July 13, 2026',
      amount: '₹999.00',
      status: 'paid',
      planName: 'Professional Suite (Monthly)',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <PageHeader
        title="Billing History & GST Invoices"
        description="Download tax invoices and view complete subscription transaction logs."
        icon={<CreditCard className="w-6 h-6" />}
        breadcrumbs={[
          { label: 'Merchant', href: '/merchant' },
          { label: 'Billing History' },
        ]}
      />

      <div className="space-y-4">
        {invoices.map((inv) => (
          <Card key={inv.id} className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 surface-card space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-slate-400">{inv.invoiceNumber}</span>
                  <Badge variant="success">PAID</Badge>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">{inv.planName}</h4>
              </div>
              <span className="text-lg font-black text-cyan-600 dark:text-cyan-400">{inv.amount}</span>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>Paid on {inv.date} via Razorpay UPI</span>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <Download className="w-3.5 h-3.5" /> Download Tax Invoice (PDF)
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
