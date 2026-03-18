import { resetPassword } from './actions';

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { error?: string, message?: string };
}) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Set New Password</h1>
        
        {searchParams.message && (
          <div className="bg-blue-50 text-blue-700 p-3 rounded mb-4 text-sm">
            {searchParams.message}
          </div>
        )}

        {searchParams.error && (
          <div className="bg-red-50 text-red-500 p-3 rounded mb-4 text-sm">
            {searchParams.error}
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
            <p className="mt-1 text-xs text-gray-500">Minimum 6 characters</p>
          </div>

          <button
            formAction={resetPassword}
            className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Save Password
          </button>
        </form>
      </div>
    </div>
  );
}
