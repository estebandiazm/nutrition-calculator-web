import { updatePassword } from './actions';
import { createClient } from '@/infrastructure/adapters/supabase/server';
import { redirect } from 'next/navigation';

export default async function UpdatePasswordPage(props: {
  searchParams: Promise<{ error?: string, success?: string }>;
}) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?error=Please log in to update your password');
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Welcome to NutriPlan</h1>
        <p className="text-gray-600 text-center mb-6">
          Please set your new password to complete your account setup.
        </p>
        
        {searchParams.error && (
          <div className="bg-red-50 text-red-500 p-3 rounded mb-4 text-sm">
            {searchParams.error}
          </div>
        )}

        {searchParams.success && (
          <div className="bg-green-50 text-green-600 p-3 rounded mb-4 text-sm">
            {searchParams.success}
          </div>
        )}

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
              New Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              minLength={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            formAction={updatePassword}
            className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Save Password
          </button>
        </form>
      </div>
    </div>
  );
}
