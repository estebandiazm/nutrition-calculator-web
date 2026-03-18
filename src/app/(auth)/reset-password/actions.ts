import { createClient } from '@/infrastructure/adapters/supabase/server';
import { redirect } from 'next/navigation';

export async function resetPassword(formData: FormData) {
  const supabase = await createClient();
  const password = formData.get('password') as string;

  if (!password || password.length < 6) {
    redirect('/reset-password?error=Password must be at least 6 characters');
  }

  const { error } = await supabase.auth.updateUser({
    password: password
  });

  if (error) {
    redirect(`/reset-password?error=${encodeURIComponent(error.message)}`);
  }

  // Redirect to their dashboard after setting password
  // (In our case, since this is for clients, they go to /my-plan)
  redirect('/my-plan?success=Password updated successfully');
}
