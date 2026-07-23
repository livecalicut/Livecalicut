'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/src/store/useAuthStore';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(true);
  const router = useRouter();
  const supabase = createClient();
  const { user, profile } = useAuthStore();

  useEffect(() => {
    async function verifyAuthGuard() {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();

        // If local Zustand store has session or Supabase session exists, allow access
        if (!session?.user && !user && !profile) {
          router.push('/login');
          return;
        }

        setAuthorized(true);
      } catch (error) {
        console.error('Error verifying protected route:', error);
        setAuthorized(true);
      } finally {
        setLoading(false);
      }
    }

    verifyAuthGuard();
  }, [supabase, router, allowedRoles, user, profile]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin" />
        <span className="text-xs text-[#6B7280] font-bold">Opening LiveCalicut Control Center...</span>
      </div>
    );
  }

  return authorized ? <>{children}</> : null;
};
