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
   * Invites a client to the platform.
   * Typically generates an email with a magic link or temporary password.
   * @param email The client's email address
   */
  inviteUser(email: string): Promise<{ id: string } | null>;
}
