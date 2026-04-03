import type { AuthProvider, AuthSession, AuthUser, Role } from '@/infrastructure/ports/AuthProvider';
import { createClient } from './server';

export class SupabaseAuthProvider implements AuthProvider {
  /**
   * Retrieves the current authenticated session
   */
  async getSession(): Promise<AuthSession | null> {
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
      return null;
    }

    // Attempt to extract role from user metadata
    // Defaulting to 'client' if not found, though we should enforce this in signup
    const rawRole = session.user.user_metadata?.role;
    const role: Role = (rawRole === 'coach' || rawRole === 'client') ? rawRole : 'client';

    const authUser: AuthUser = {
      id: session.user.id,
      email: session.user.email || '',
      role: role,
    };

    return {
      user: authUser,
      expiresAt: session.expires_at || 0,
    };
  }

  /**
   * Signs out the current user
   */
  async signOut(): Promise<void> {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }

  /**
   * Invites a client to the platform.
   * Supabase's admin.inviteUserByEmail requires the SERVICE_ROLE_KEY.
   * This MUST be called from a secure server context (e.g. Server Action).
   * @param email The client's email address
   */
  async inviteUser(email: string): Promise<{ id: string } | null> {
    // Note: We need a client initialized with the SERVICE_ROLE_KEY to bypass RLS and use admin features.
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable. Cannot invite user.');
      // Fallback for development if not configured yet
      return null;
    }

    // We dynamically import to avoid loading this client logic in public contexts
    const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
    
    const adminAuthClient = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        }
    );

    const { data, error } = await adminAuthClient.auth.admin.inviteUserByEmail(email, {
        data: { role: 'client' } // Inject the role into user_metadata
    });

    if (error) {
      console.error('Error inviting user via Supabase Admin API:', error.message);
      return null;
    }

    return {
      id: data.user.id
    };
  }
}
