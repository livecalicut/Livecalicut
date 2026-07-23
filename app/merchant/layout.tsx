import React from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';

export default function MerchantLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['Merchant', 'City Admin', 'Super Admin']}>
      {children}
    </ProtectedRoute>
  );
}
