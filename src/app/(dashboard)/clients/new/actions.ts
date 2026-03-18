import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { authProvider } from '@/lib/registry';

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

  // 2. Here we would theoretically save the new Client entity to our DB repository
  // const newClient = { name, authId: authUser.id, nutritionistId: currentSession.user.id, ... }
  // await clientRepository.save(newClient)

  // 3. Success
  revalidatePath('/clients');
  redirect('/clients?success=Client invited successfully');
}
