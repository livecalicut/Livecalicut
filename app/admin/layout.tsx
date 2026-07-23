import React from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['Super Admin', 'Platform Admin', 'City Admin', 'Moderator', 'Marketing Executive']}>
      {children}
    </ProtectedRoute>
  );
}
