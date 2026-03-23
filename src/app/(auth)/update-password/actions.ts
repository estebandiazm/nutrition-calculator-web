'use server';

import { createClient } from '@/infrastructure/adapters/supabase/server';
import { redirect } from 'next/navigation';

export async function updatePassword(formData: FormData) {
  const currentPassword = formData.get('currentPassword') as string | null;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (password !== confirmPassword) {
    redirect('/update-password?error=Las contraseñas no coinciden');
  }

  if (password.length < 6) {
    redirect('/update-password?error=La contraseña debe tener al menos 6 caracteres');
  }

  const supabase = await createClient();

  // If manual update mode (currentPassword provided), strictly verify it first
  if (currentPassword) {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user?.email) {
      redirect('/update-password?error=Error de sesión. Por favor inicia sesión nuevamente.');
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (signInError) {
      redirect('/update-password?error=La contraseña actual es incorrecta');
    }
  }

  const { error } = await supabase.auth.updateUser({
    password: password
  });

  if (error) {
    redirect(`/update-password?error=${encodeURIComponent(error.message)}`);
  }

  // Redirect to success route or directly back to portal with a success signal
  redirect('/my-plan?success=Contraseña actualizada correctamente');
}
