import { createClient } from '@/lib/supabase/client';

export class AuthService {
  private static supabase = createClient();

  static async getSession() {
    const { data: { session }, error } = await this.supabase.auth.getSession();
    if (error) throw error;
    return session;
  }

  static async getCurrentUser() {
    const session = await this.getSession();
    return session?.user || null;
  }

  static async getUserProfile(userId: string) {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*, roles(name, permissions), cities(name, slug)')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async hasRole(userId: string, allowedRoles: string[]) {
    const profile = await this.getUserProfile(userId);
    const roleName = (profile?.roles as any)?.name || 'User';
    return allowedRoles.includes(roleName) || roleName === 'Super Admin';
  }

  static async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
    return true;
  }
}
