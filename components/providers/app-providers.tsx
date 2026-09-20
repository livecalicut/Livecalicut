'use client';

import React, { useEffect } from 'react';
import { QueryProvider } from './query-provider';
import { Toaster } from '@/components/ui/toaster';
import { useAuthStore } from '@/store/useAuthStore';
import { PendingAuthActionRunner } from '@/components/auth/pending-auth-action-runner';
import { AuthPromptProvider } from '@/components/auth/auth-prompt-provider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);
  return (
    <QueryProvider>
      <AuthPromptProvider>
        {children}
        <PendingAuthActionRunner />
        <Toaster />
      </AuthPromptProvider>
    </QueryProvider>
  );
}
