'use server';

import { createClient } from '@/infrastructure/adapters/supabase/server';
import { redirect } from 'next/navigation';

export async function updatePassword(formData: FormData) {
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (password !== confirmPassword) {
    redirect('/update-password?error=Passwords do not match');
  }

  if (password.length < 6) {
    redirect('/update-password?error=Password must be at least 6 characters');
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: password
  });

  if (error) {
    redirect(`/update-password?error=${encodeURIComponent(error.message)}`);
  }

  // The client port/UI exists, redirect them to the portal
  redirect('/my-plan');
}
