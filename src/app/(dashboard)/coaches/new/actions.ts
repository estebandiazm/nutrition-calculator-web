'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { authProvider } from '@/lib/registry';
import { createCoach } from '@/app/actions/coachActions';

export async function inviteCoach(formData: FormData) {
  const email = formData.get('email') as string;
  const name = formData.get('name') as string;

  if (!email || !name) {
    redirect('/coaches/new?error=Missing required fields');
  }

  // 1. Verify current user is a coach (admin guard)
  const session = await authProvider.getSession();
  if (!session || session.user.role !== 'coach') {
    redirect('/login');
  }

  // 2. Ask AuthProvider (Supabase) to send invite with coach role
  const authUser = await authProvider.inviteUser(email, 'coach');

  if (!authUser) {
    redirect('/coaches/new?error=Failed to invite coach via Auth Provider');
  }

  // 3. Save the new Coach entity to our DB repository
  await createCoach({
    name,
    email,
    authId: authUser.id,
  });

  // 4. Success
  revalidatePath('/coaches');
  redirect('/clients?success=Coach invited successfully');
}
