'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/validations/auth';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { KeyRound, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordForm: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) throw resetError;

      setSuccess('Password reset link sent! Check your inbox to set a new password.');
    } catch (err: any) {
      setError(err.message || 'Failed to request password reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md w-full mx-auto p-6 shadow-xl border border-[#E5E7EB] bg-white rounded-3xl">
      <CardHeader className="text-center space-y-2 pb-2">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB] mx-auto">
          <KeyRound className="w-6 h-6" />
        </div>
        <CardTitle className="text-2xl font-bold text-[#111827] font-sans">Forgot Password?</CardTitle>
        <CardDescription className="text-sm text-[#6B7280]">Enter your registered email to receive a recovery link</CardDescription>
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
                placeholder="citizen@example.com"
                className="pl-10 h-[44px] rounded-xl border-[#E5E7EB] text-[#111827]"
              />
            </div>
            {errors.email && <span className="text-xs text-rose-600">{errors.email.message}</span>}
          </div>

          <Button type="submit" disabled={loading} className="w-full h-[44px] rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold">
            {loading ? 'Sending Recovery Link...' : 'Send Reset Link'}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center text-xs text-[#6B7280]">
        Remembered password?{' '}
        <Link href="/login" className="text-[#2563EB] font-bold hover:underline ml-1">
          Back to Login
        </Link>
      </CardFooter>
    </Card>
  );
};
