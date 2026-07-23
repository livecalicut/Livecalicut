'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterInput } from '@/lib/validations/auth';
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
import { UserPlus, Mail, Lock, User, Phone, AlertCircle, CheckCircle2 } from 'lucide-react';

export const RegisterForm: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            phone: data.phone,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) {
        // Show the real error from Supabase — never silently bypass
        setError(authError.message);
        return;
      }

      if (authData.user && !authData.session) {
        // Email confirmation required (default Supabase setting)
        setSuccess(
          'Account created! Please check your email to verify your address before signing in.'
        );
        return;
      }

      if (authData.session) {
        // Email confirmation disabled — redirect immediately
        setSuccess('Account created successfully — redirecting...');
        setTimeout(() => {
          window.location.href = '/';
        }, 800);
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md w-full mx-auto p-6 shadow-xl border border-[#E5E7EB] bg-white rounded-3xl">
      <CardHeader className="text-center space-y-2 pb-2">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB] mx-auto">
          <UserPlus className="w-6 h-6" />
        </div>
        <CardTitle className="text-2xl font-bold text-[#111827] font-sans">Create Account</CardTitle>
        <CardDescription className="text-sm text-[#6B7280]">
          Join LiveCalicut — Kozhikode&apos;s hyperlocal portal
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
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-3.5 text-[#6B7280] pointer-events-none" />
              <Input
                {...register('fullName')}
                placeholder="Arjun Nair"
                autoComplete="name"
                className="pl-10 h-[44px] rounded-xl border-[#E5E7EB] focus:border-[#2563EB] text-[#111827]"
              />
            </div>
            {errors.fullName && (
              <span className="text-xs text-rose-600">{errors.fullName.message}</span>
            )}
          </div>

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
            <label className="text-xs font-bold text-[#111827] uppercase tracking-wider">
              Mobile Phone <span className="text-[#9CA3AF] font-normal normal-case">(optional)</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-[#6B7280] pointer-events-none" />
              <Input
                {...register('phone')}
                type="tel"
                placeholder="9876543210"
                autoComplete="tel"
                className="pl-10 h-[44px] rounded-xl border-[#E5E7EB] focus:border-[#2563EB] text-[#111827]"
              />
            </div>
            {errors.phone && (
              <span className="text-xs text-rose-600">{errors.phone.message}</span>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#111827] uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#6B7280] pointer-events-none" />
              <Input
                {...register('password')}
                type="password"
                placeholder="Min. 8 characters"
                autoComplete="new-password"
                className="pl-10 h-[44px] rounded-xl border-[#E5E7EB] focus:border-[#2563EB] text-[#111827]"
              />
            </div>
            {errors.password && (
              <span className="text-xs text-rose-600">{errors.password.message}</span>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#111827] uppercase tracking-wider">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#6B7280] pointer-events-none" />
              <Input
                {...register('confirmPassword')}
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                className="pl-10 h-[44px] rounded-xl border-[#E5E7EB] focus:border-[#2563EB] text-[#111827]"
              />
            </div>
            {errors.confirmPassword && (
              <span className="text-xs text-rose-600">{errors.confirmPassword.message}</span>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-[44px] rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold mt-2"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center text-xs text-[#6B7280]">
        Already have an account?{' '}
        <Link href="/login" className="text-[#2563EB] font-bold hover:underline ml-1">
          Sign In here
        </Link>
      </CardFooter>
    </Card>
  );
};
