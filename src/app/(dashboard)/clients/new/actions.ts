'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient as createSupabaseClient } from '@/infrastructure/adapters/supabase/server';
import { authProvider } from '@/lib/registry';
import { createClient as createDbClient } from '@/app/actions/clientActions';

export async function inviteClient(formData: FormData) {
  const email = formData.get('email') as string;
  const name = formData.get('name') as string;
  
  if (!email || !name) {
    redirect('/clients/new?error=Missing required fields');
  }

  // 1. Ask AuthProvider (Supabase) to send invite
  const authUser = await authProvider.inviteUser(email);

  if (!authUser) {
     redirect('/clients/new?error=Failed to invite user via Auth Provider');
  }

  // 2. Save the new Client entity to our DB repository
  const defaultCoachId = process.env.NEXT_PUBLIC_DEFAULT_COACH_ID;
  if (!defaultCoachId) {
    console.error('Missing NEXT_PUBLIC_DEFAULT_COACH_ID');
    redirect('/clients/new?error=System configuration error');
  }

  await createDbClient({
    name,
    authId: authUser.id,
    coachId: defaultCoachId,
  });

  // 3. Success
  revalidatePath('/clients');
  redirect('/clients?success=Client invited successfully');
}
