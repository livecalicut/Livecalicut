'use client';

import React, { useState } from 'react';
import {
  DataTable,
  RecordDrawer,
  StatusBadge,
  formatDate,
  type Column,
  type TableFilter,
} from '@/components/admin/data-table';
import type { PaymentRow } from './actions';

const STATUS_TONE: Record<string, 'green' | 'amber' | 'red' | 'gray'> = {
  captured: 'green',
  pending: 'amber',
  failed: 'red',
  refunded: 'gray',
};

function formatCurrency(amount: number, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

const statusBadge = (p: PaymentRow) => <StatusBadge status={p.status} tone={STATUS_TONE[p.status] ?? 'gray'} />;
const mono = (v: string | null) => (v ? <span className="font-mono text-xs">{v}</span> : null);
const label = (s: string) => s.replace(/[_-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const columns: Column<PaymentRow>[] = [
  {
    key: 'merchant',
    header: 'Merchant',
    sortValue: (p) => p.merchant.toLowerCase(),
    cell: (p) => (
      <div className="min-w-0">
        <p className="truncate font-semibold text-[#111827]">{p.merchant}</p>
        {p.merchant_email && p.merchant_email !== p.merchant && (
          <p className="truncate text-[11px] text-[#6B7280]">{p.merchant_email}</p>
        )}
      </div>
    ),
  },
  {
    key: 'amount',
    header: 'Amount',
    sortValue: (p) => p.amount,
    cell: (p) => <span className="font-bold tabular-nums text-[#111827]">{formatCurrency(p.amount, p.currency)}</span>,
  },
  { key: 'gateway', header: 'Gateway', hideOnMobile: true, sortValue: (p) => p.gateway, cell: (p) => label(p.gateway) },
  { key: 'status', header: 'Status', sortValue: (p) => p.status, cell: statusBadge },
  {
    key: 'created_at',
    header: 'Date',
    hideOnMobile: true,
    sortValue: (p) => p.created_at,
    cell: (p) => <span className="whitespace-nowrap">{formatDate(p.created_at)}</span>,
  },
];

export function PaymentsTable({ payments }: { payments: PaymentRow[] }) {
  const [viewing, setViewing] = useState<PaymentRow | null>(null);

  const gateways = Array.from(new Set(payments.map((p) => p.gateway))).sort();
  const filters: TableFilter<PaymentRow>[] = [
    {
      key: 'status',
      label: 'Statuses',
      options: ['captured', 'pending', 'failed', 'refunded'].map((v) => ({ value: v, label: label(v) })),
      match: (p, v) => p.status === v,
    },
    ...(gateways.length > 1
      ? [
          {
            key: 'gateway',
            label: 'Gateways',
            options: gateways.map((v) => ({ value: v, label: label(v) })),
            match: (p: PaymentRow, v: string) => p.gateway === v,
          },
        ]
      : []),
  ];

  return (
    <>
      <DataTable<PaymentRow>
        rows={payments}
        columns={columns}
        getRowId={(p) => p.id}
        filters={filters}
        searchText={(p) =>
          `${p.merchant} ${p.merchant_email ?? ''} ${p.gateway_order_id ?? ''} ${p.gateway_payment_id ?? ''}`
        }
        searchPlaceholder="Search merchant, order or payment ID…"
        emptyMessage="No payments have been processed yet."
        onView={setViewing}
      />

      <RecordDrawer
        open={viewing !== null}
        title={viewing ? formatCurrency(viewing.amount, viewing.currency) : ''}
        subtitle={viewing && statusBadge(viewing)}
        fields={
          viewing
            ? [
                { label: 'Merchant', value: viewing.merchant },
                { label: 'Merchant email', value: viewing.merchant_email },
                { label: 'Gateway', value: label(viewing.gateway) },
                { label: 'Currency', value: viewing.currency },
                { label: 'Order ID', value: mono(viewing.gateway_order_id), wide: true },
                { label: 'Payment ID', value: mono(viewing.gateway_payment_id), wide: true },
                { label: 'Subscription', value: mono(viewing.subscription_id), wide: true },
                { label: 'Created', value: formatDate(viewing.created_at, true) },
                { label: 'Updated', value: formatDate(viewing.updated_at, true) },
                { label: 'Record ID', value: mono(viewing.id), wide: true },
              ]
            : []
        }
        onClose={() => setViewing(null)}
      />
    </>
  );
}
