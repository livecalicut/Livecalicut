'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { AvatarUpload } from './avatar-upload';
import { RoleBadge } from './role-badge';
import { User, Mail, Phone, MapPin, LogOut, Save, AlertCircle, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';

export const ProfileForm: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [roleName, setRoleName] = useState<string>('User');
  const [cityName, setCityName] = useState<string>('Kozhikode (Calicut)');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadUserProfile() {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          router.push('/login');
          return;
        }

        const response = await fetch('/api/auth/me');
        
        if (!response.ok) {
          throw new Error('Failed to load profile');
        }

        const { profile, roleName } = await response.json();

        if (profile) {
          setProfile(profile);
          setFullName(profile.full_name || '');
          setPhone(profile.phone || '');
          setAvatarUrl(profile.avatar_url || profile.avatar || '');
          
          if (roleName) setRoleName(roleName);
          if (profile.city) setCityName(profile.city);
        } else {
          setFullName(session.user.user_metadata?.full_name || 'Resident User');
        }
      } catch (err: any) {
        setError(err.message || 'Error fetching user profile');
      } finally {
        setLoading(false);
      }
    }

    loadUserProfile();
  }, [supabase, router]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { error: updateErr } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          phone,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', session.user.id);

      if (updateErr) throw updateErr;

      setSuccess('Profile updated successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to save profile modifications');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin" />
        <span className="text-xs font-semibold text-[#6B7280]">Loading user profile details...</span>
      </div>
    );
  }

  return (
    <Card className="max-w-xl w-full mx-auto p-6 shadow-xl border border-[#E5E7EB] bg-white rounded-3xl space-y-6">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-[#E5E7EB]">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-bold text-[#111827] font-sans flex items-center gap-2">
            <span>User Profile</span>
            <RoleBadge roleName={roleName} />
          </CardTitle>
          <CardDescription className="flex items-center gap-1 text-[#6B7280]">
            <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Assigned Location: {cityName}</span>
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-1 border-[#E5E7EB] hover:bg-rose-50 hover:text-rose-600 text-[#6B7280] rounded-xl font-bold">
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </CardHeader>

      <CardContent className="space-y-6">
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

        <AvatarUpload url={avatarUrl} onUploadComplete={(url) => setAvatarUrl(url)} />

        <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#111827] uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-3.5 text-[#6B7280] pointer-events-none" />
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Arjun Nair"
                className="pl-10 h-[44px] rounded-xl border-[#E5E7EB] text-[#111827]"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#111827] uppercase tracking-wider">
              Email Address (Read Only)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-[#6B7280] pointer-events-none" />
              <Input
                value={profile?.email || ''}
                readOnly
                disabled
                className="pl-10 h-[44px] rounded-xl bg-slate-50 text-[#6B7280] cursor-not-allowed border-[#E5E7EB]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#111827] uppercase tracking-wider">
              Mobile Phone
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-[#6B7280] pointer-events-none" />
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
                className="pl-10 h-[44px] rounded-xl border-[#E5E7EB] text-[#111827]"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#2563EB]" />
              <div>
                <h5 className="text-xs font-bold text-[#111827]">Account Status</h5>
                <p className="text-[12px] text-[#6B7280]">Active • Ward Verified Citizen</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-bold">
              Verified
            </span>
          </div>

          <Button type="submit" disabled={saving} className="w-full h-[44px] rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold gap-2 mt-4">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving Changes...' : 'Save Profile Changes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
