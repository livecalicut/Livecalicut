import { create } from 'zustand';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

export type UserRole = 'Guest' | 'User' | 'Merchant' | 'Marketing Executive' | 'Moderator' | 'City Admin' | 'Super Admin';

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  city?: string;
  area?: string;
  bio?: string;
  account_status?: 'active' | 'suspended' | 'deactivated';
  verification_status?: 'unverified' | 'pending' | 'verified';
  created_at?: string;
  updated_at?: string;
  role?: UserRole;
  roles?: { name: UserRole };
}

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  roleName: UserRole;
  permissions: string[];
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  initializeAuth: () => Promise<void>;
  signOut: () => Promise<void>;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  hasPermission: (permissionCode: string) => boolean;
  isAdmin: () => boolean;
  isMerchant: () => boolean;
  isModerator: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  roleName: 'Guest',
  permissions: [],
  isLoading: true,

  setUser: (user) => set({ user }),
  setProfile: (profile) => {
    const roleName: UserRole = (profile?.roles?.name as UserRole) || profile?.role || (profile ? 'User' : 'Guest');
    set({ profile, roleName });
  },

  initializeAuth: async () => {
    try {
      set({ isLoading: true });
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        set({ user: session.user });

        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const { profile, roleName } = await response.json();
          if (profile) {
            set({ profile, roleName });
          } else {
            set({
              profile: {
                id: session.user.id,
                email: session.user.email || '',
                full_name: session.user.user_metadata?.full_name || 'User',
                role: 'User',
              },
              roleName: 'User',
            });
          }
        } else {
          set({
            profile: {
              id: session.user.id,
              email: session.user.email || '',
              full_name: session.user.user_metadata?.full_name || 'User',
              role: 'User',
            },
            roleName: 'User',
          });
        }
      } else {
        set({ user: null, profile: null, roleName: 'Guest', permissions: [] });
      }

      supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          set({ user: session.user });
          const response = await fetch('/api/auth/me');
          if (response.ok) {
            const { profile, roleName } = await response.json();
            set({ profile: profile || null, roleName: roleName || 'User' });
          } else {
            set({ profile: null, roleName: 'User' });
          }
        } else {
          set({ user: null, profile: null, roleName: 'Guest', permissions: [] });
        }
        set({ isLoading: false });
      });
    } catch (error) {
      console.error('Error initializing auth session:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Signout error:', err);
    } finally {
      set({ user: null, profile: null, roleName: 'Guest', permissions: [] });
    }
  },

  hasRole: (targetRoles) => {
    const currentRole = get().roleName;
    if (Array.isArray(targetRoles)) {
      return targetRoles.includes(currentRole);
    }
    return currentRole === targetRoles;
  },

  hasPermission: (permissionCode) => {
    const currentRole = get().roleName;
    if (currentRole === 'Super Admin') return true;
    return get().permissions.includes(permissionCode);
  },

  isAdmin: () => {
    const role = get().roleName;
    return role === 'Super Admin' || role === 'City Admin';
  },

  isMerchant: () => {
    const role = get().roleName;
    return role === 'Merchant' || role === 'Super Admin' || role === 'City Admin';
  },

  isModerator: () => {
    const role = get().roleName;
    return role === 'Moderator' || role === 'Super Admin' || role === 'City Admin';
  },
}));
