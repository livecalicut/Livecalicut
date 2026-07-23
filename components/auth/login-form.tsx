'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '@/lib/validations/auth';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { LogIn, Mail, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';

export const LoginForm: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const { error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        // Show the real error from Supabase — never silently bypass
        setError(authError.message);
        return;
      }

      setSuccess('Login successful — redirecting...');

      // Redirect to the originally requested page, or admin dashboard
      const next = new URLSearchParams(window.location.search).get('next') || '/admin';
      router.push(next);
      router.refresh(); // Refresh to update server-side session state
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (oauthError) throw oauthError;
    } catch (err: any) {
      setError(err?.message || 'Failed to initialize Google login');
    }
  };

  return (
    <Card className="max-w-md w-full mx-auto p-6 shadow-xl border border-[#E5E7EB] bg-white rounded-3xl">
      <CardHeader className="text-center space-y-2 pb-2">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB] mx-auto">
          <LogIn className="w-6 h-6" />
        </div>
        <CardTitle className="text-2xl font-bold text-[#111827] font-sans">Welcome Back</CardTitle>
        <CardDescription className="text-sm text-[#6B7280]">
          Sign in to your LiveCalicut account
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-600 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-600 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#111827] uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-[#6B7280] pointer-events-none" />
              <Input
                {...register('email')}
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                className="pl-10 h-[44px] rounded-xl border-[#E5E7EB] focus:border-[#2563EB] text-[#111827]"
              />
            </div>
            {errors.email && (
              <span className="text-xs text-rose-600">{errors.email.message}</span>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#111827] uppercase tracking-wider">
                Password
              </label>
              <Link href="/forgot-password" className="text-xs text-[#2563EB] font-bold hover:underline">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#6B7280] pointer-events-none" />
              <Input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                className="pl-10 h-[44px] rounded-xl border-[#E5E7EB] focus:border-[#2563EB] text-[#111827]"
              />
            </div>
            {errors.password && (
              <span className="text-xs text-rose-600">{errors.password.message}</span>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-[44px] rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="relative my-4 flex items-center justify-center">
          <div className="border-t border-[#E5E7EB] w-full" />
          <span className="bg-white px-3 text-[11px] text-[#6B7280] font-bold uppercase tracking-widest absolute">
            OR
          </span>
        </div>

        <Button
          variant="outline"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full h-[44px] rounded-xl border-[#E5E7EB] hover:bg-slate-50 text-[#111827] font-semibold gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.7 1 4 3.5 2.2 7.1l3.6 2.8C6.7 7.3 9.1 5.4 12 5.4z" />
            <path fill="#4285F4" d="M22.6 12.3c0-.8-.1-1.5-.2-2.3H12v4.3h5.9c-.3 1.4-1 2.5-2.2 3.3v2.8h3.6c2.1-1.9 3.3-4.7 3.3-8.1z" />
            <path fill="#FBBC05" d="M5.8 14.1c-.2-.7-.3-1.4-.3-2.1s.1-1.4.3-2.1V7.1H2.2C1.4 8.6 1 10.2 1 12s.4 3.4 1.2 4.9l3.6-2.8z" />
            <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.8c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.2v2.8C4 20.5 7.7 23 12 23z" />
          </svg>
          Continue with Google
        </Button>
      </CardContent>

      <CardFooter className="justify-center text-xs text-[#6B7280]">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-[#2563EB] font-bold hover:underline ml-1">
          Register here
        </Link>
      </CardFooter>
    </Card>
  );
};
