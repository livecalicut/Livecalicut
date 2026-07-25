import React from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';

export default function MerchantLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['Merchant', 'City Admin', 'Super Admin']}>
      <DashboardShell variant="merchant">{children}</DashboardShell>
    </ProtectedRoute>
  );
}
