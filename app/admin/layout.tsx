import React from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute
      allowedRoles={['Super Admin', 'City Admin', 'Moderator', 'Marketing Executive']}
    >
      <DashboardShell variant="admin">{children}</DashboardShell>
    </ProtectedRoute>
  );
}
