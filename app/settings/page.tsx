'use client';

import React, { useState } from 'react';
import { Container } from '@/components/layout/container';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Bell, Shield, Key, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function SettingsPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const supabase = createClient();

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const { error: updateErr } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateErr) throw updateErr;

      setSuccess('Password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-12 max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-[#111827] font-sans">Account Settings</h1>
        <p className="text-sm text-[#6B7280]">Manage your LiveCalicut authentication credentials and security preferences</p>
      </div>

      {/* Password Update Card */}
      <Card className="p-6 border border-[#E5E7EB] bg-white rounded-3xl shadow-xl space-y-6">
        <CardHeader className="p-0 space-y-1">
          <CardTitle className="text-xl font-bold text-[#111827] flex items-center gap-2">
            <Key className="w-5 h-5 text-[#2563EB]" />
            <span>Security & Password</span>
          </CardTitle>
          <CardDescription className="text-xs text-[#6B7280]">
            Update your authentication password
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0 space-y-4">
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

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#111827] uppercase tracking-wider">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#6B7280] pointer-events-none" />
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 h-[44px] rounded-xl border-[#E5E7EB] text-[#111827]"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#111827] uppercase tracking-wider">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#6B7280] pointer-events-none" />
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 h-[44px] rounded-xl border-[#E5E7EB] text-[#111827]"
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-[44px] rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Updating Password...' : 'Update Password'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Notifications Preferences */}
      <Card className="p-6 border border-[#E5E7EB] bg-white rounded-3xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB]">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#111827]">City Alerts & Notifications</h4>
              <p className="text-xs text-[#6B7280]">Receive emergency civic updates and daily Kozhikode highlights</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
            Enabled
          </span>
        </div>
      </Card>

      {/* Session Security */}
      <Card className="p-6 border border-[#E5E7EB] bg-white rounded-3xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#111827]">Session Security</h4>
              <p className="text-xs text-[#6B7280]">Supabase JWT session state active with auto refresh</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-blue-100 text-[#2563EB] text-xs font-bold">
            Protected
          </span>
        </div>
      </Card>
    </Container>
  );
}
