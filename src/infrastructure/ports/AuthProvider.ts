export type Role = 'coach' | 'client';

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
}

export interface AuthSession {
  user: AuthUser;
  expiresAt: number;
}

export interface AuthProvider {
  /**
   * Retrieves the current authenticated session
   */
  getSession(): Promise<AuthSession | null>;

  /**
   * Signs out the current user
   */
  signOut(): Promise<void>;

  /**
   * Invites a user to the platform.
   * Typically generates an email with a magic link or temporary password.
   * @param email The user's email address
   * @param role The role to assign to the invited user (defaults to 'client')
   */
  inviteUser(email: string, role?: Role): Promise<{ id: string } | null>;
}
