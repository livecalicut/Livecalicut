'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore, type UserRole } from '@/src/store/useAuthStore';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, roleName, isLoading, initializeAuth } = useAuthStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    initializeAuth().finally(() => setInitialized(true));
  }, [initializeAuth]);

  const authenticated = Boolean(user);
  const permitted = !allowedRoles || allowedRoles.includes(roleName);
  const settled = initialized && !isLoading;

  useEffect(() => {
    if (!settled) return;

    if (!authenticated) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    if (!permitted) {
      router.replace('/unauthorized');
    }
  }, [settled, authenticated, permitted, router, pathname]);

  // Render nothing until the role is known and allowed. Failing closed here is
  // deliberate: an error or slow profile fetch must never expose the workspace.
  if (!settled || !authenticated || !permitted) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3" role="status">
        <Loader2 className="h-8 w-8 animate-spin text-[#2563EB]" aria-hidden="true" />
        <span className="text-xs font-bold text-[#6B7280]">
          Opening LiveCalicut Control Center...
        </span>
      </div>
    );
  }

  return <>{children}</>;
};
