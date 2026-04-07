'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { authProvider } from '@/lib/registry';
import { createClient as createDbClient } from '@/app/actions/clientActions';
import { getCoachByAuthId } from '@/app/actions/coachActions';

export async function inviteClient(formData: FormData) {
  const email = formData.get('email') as string;
  const name = formData.get('name') as string;

  if (!email || !name) {
    redirect('/clients/new?error=Missing required fields');
  }

  // 1. Get current session to determine the coach
  const session = await authProvider.getSession();
  if (!session) {
    redirect('/login');
  }

  const coach = await getCoachByAuthId(session.user.id);
  if (!coach) {
    redirect('/clients/new?error=Coach profile not found');
  }

  // 2. Ask AuthProvider (Supabase) to send invite
  const authUser = await authProvider.inviteUser(email, 'client');

  if (!authUser) {
    redirect('/clients/new?error=Failed to invite user via Auth Provider');
  }

  // 3. Save the new Client entity to our DB repository
  await createDbClient({
    name,
    authId: authUser.id,
    coachId: coach.id,
  });

  // 4. Success
  revalidatePath('/clients');
  redirect('/clients?success=Client invited successfully');
}
