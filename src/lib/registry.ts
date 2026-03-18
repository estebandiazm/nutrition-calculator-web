import { SupabaseAuthProvider } from '@/infrastructure/adapters/supabase/SupabaseAuthProvider';
import type { AuthProvider } from '@/infrastructure/ports/AuthProvider';

export const authProvider: AuthProvider = new SupabaseAuthProvider();
