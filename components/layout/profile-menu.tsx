'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { RoleBadge } from '@/components/auth/role-badge';
import { User, LogOut, Settings, ShieldCheck, ChevronDown } from 'lucide-react';

export const ProfileMenu: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*, user_roles(roles(name))')
          .eq('id', session.user.id)
          .single();
        if (profileData) setProfile(profileData);
      }
    }
    loadSession();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setIsOpen(false);
    router.push('/login');
    router.refresh();
  };

  if (!user) {
    return (
      <Link href="/login">
        <Button variant="default" size="sm">
          Sign In
        </Button>
      </Link>
    );
  }

  // Extract all role names from the user_roles array safely
  const roleNames = profile?.user_roles?.map((ur: any) => ur?.roles?.name).filter(Boolean) || ['User'];
  const highestRole = roleNames.includes('Super Admin') ? 'Super Admin' 
    : roleNames.includes('City Admin') ? 'City Admin' 
    : roleNames.includes('Moderator') ? 'Moderator' 
    : roleNames.includes('Marketing Executive') ? 'Marketing Executive'
    : roleNames.includes('Merchant') ? 'Merchant'
    : 'User';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-cyan-500/40 transition-all cursor-pointer"
      >
        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-bold text-xs overflow-hidden">
          {profile?.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <User className="w-4 h-4" />
          )}
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 space-y-1">
          <div className="p-3 border-b border-slate-100 dark:border-slate-800">
            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {profile?.full_name || user.email}
            </p>
            <div className="mt-1">
              <RoleBadge roleName={highestRole} />
            </div>
          </div>

          <Link
            href="/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <User className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            My Account Profile
          </Link>

          {(roleNames.includes('Super Admin') || roleNames.includes('City Admin') || roleNames.includes('Moderator') || roleNames.includes('Marketing Executive')) && (
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30 rounded-xl transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              Admin Console
            </Link>
          )}

          {(roleNames.includes('Merchant') && !roleNames.includes('Super Admin')) && (
            <Link
              href="/merchant"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-xl transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              Merchant Dashboard
            </Link>
          )}

          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};
