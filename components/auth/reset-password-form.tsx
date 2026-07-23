'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, type ResetPasswordInput } from '@/lib/validations/auth';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Lock, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

export const ResetPasswordForm: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const { error: updateError } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (updateError) throw updateError;

      setSuccess('Your password has been updated successfully! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md w-full mx-auto p-6 shadow-xl border border-[#E5E7EB] bg-white rounded-3xl">
      <CardHeader className="text-center space-y-2 pb-2">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB] mx-auto">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <CardTitle className="text-2xl font-bold text-[#111827] font-sans">Reset Password</CardTitle>
        <CardDescription className="text-sm text-[#6B7280]">Enter your new password below</CardDescription>
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
              New Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#6B7280] pointer-events-none" />
              <Input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                className="pl-10 h-[44px] rounded-xl border-[#E5E7EB] text-[#111827]"
              />
            </div>
            {errors.password && <span className="text-xs text-rose-600">{errors.password.message}</span>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#111827] uppercase tracking-wider">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#6B7280] pointer-events-none" />
              <Input
                {...register('confirmPassword')}
                type="password"
                placeholder="••••••••"
                className="pl-10 h-[44px] rounded-xl border-[#E5E7EB] text-[#111827]"
              />
            </div>
            {errors.confirmPassword && (
              <span className="text-xs text-rose-600">{errors.confirmPassword.message}</span>
            )}
          </div>

          <Button type="submit" disabled={loading} className="w-full h-[44px] rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold">
            {loading ? 'Updating Password...' : 'Save New Password'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
