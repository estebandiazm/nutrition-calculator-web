import { redirect } from 'next/navigation';
import { createClient } from '@/infrastructure/adapters/supabase/server';
import { getClientByAuthId } from '@/app/actions/clientActions';

export default async function MyPlanPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Look up the client in our DB using the Supabase Auth ID
  const client = await getClientByAuthId(user.id);

  if (!client) {
    // If the client wasn't found in the DB, show an error fallback
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 text-center text-gray-800">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Account Not Linked</h1>
          <p className="mb-4">We couldn't find a client profile associated with your account.</p>
          <p className="text-sm text-gray-500">Please contact your nutritionist for assistance or ask them to re-invite you.</p>
        </div>
      </div>
    );
  }

  // Correlate and redirect to the viewer with the internal client ID
  redirect(`/viewer?clientId=${client.id}`);
}
