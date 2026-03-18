import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/infrastructure/adapters/supabase/server';

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    // In a real app we would handle this with useActionState + a toast
    // but throwing here for simplicity to reach the error boundary or handle later
    redirect('/login?error=Invalid login credentials');
  }

  // Need to get user role to route them correctly
  const { data: { user } } = await supabase.auth.getUser();
  const role = user?.user_metadata?.role || 'client';

  revalidatePath('/', 'layout');
  
  if (role === 'nutritionist') {
    redirect('/clients'); // or whatever the dashboard root is
  } else {
    redirect('/my-plan');
  }
}
