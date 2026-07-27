'use client';

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { AuthLoginDialog, type AuthPromptState } from '@/components/auth/auth-login-dialog';

type PromptOptions = {
  message?: string;
  next?: string;
};

type AuthPromptContextValue = {
  promptLogin: (options?: PromptOptions) => void;
  closePrompt: () => void;
};

const AuthPromptContext = createContext<AuthPromptContextValue | null>(null);

const DEFAULT: AuthPromptState = {
  open: false,
  message: '',
  next: '/',
};

export function AuthPromptProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthPromptState>(DEFAULT);

  const promptLogin = useCallback((options?: PromptOptions) => {
    setState({
      open: true,
      message:
        options?.message ||
        'Sign in to save favourites, write reviews, apply for jobs, and manage your account.',
      next: options?.next || (typeof window !== 'undefined' ? window.location.pathname : '/'),
    });
  }, []);

  const closePrompt = useCallback(() => {
    setState((prev) => ({ ...prev, open: false }));
  }, []);

  const value = useMemo(() => ({ promptLogin, closePrompt }), [promptLogin, closePrompt]);

  return (
    <AuthPromptContext.Provider value={value}>
      {children}
      <AuthLoginDialog state={state} onClose={closePrompt} />
    </AuthPromptContext.Provider>
  );
}

export function useAuthPrompt() {
  const ctx = useContext(AuthPromptContext);
  if (!ctx) {
    return {
      promptLogin: (options?: PromptOptions) => {
        if (typeof window !== 'undefined') {
          const next = encodeURIComponent(options?.next || window.location.pathname || '/');
          window.location.href = `/login?next=${next}`;
        }
      },
      closePrompt: () => undefined,
    };
  }
  return ctx;
}
