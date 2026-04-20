import { updateSession } from '@/infrastructure/adapters/supabase/middleware'
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Update the session cookie
  const response = await updateSession(request)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const role = user?.user_metadata?.role

  // RBAC Routing Logic
  const { pathname } = request.nextUrl;
  const isRoot = pathname === '/';
  const isLoginPage = pathname.startsWith('/login');
  const isAuthCallback = pathname.startsWith('/auth/callback');
  const isUpdatePasswordPage = pathname.startsWith('/update-password');

  // Root redirect: always send "/" to the correct destination
  if (isRoot) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (role === 'client') return NextResponse.redirect(new URL('/dashboard', request.url));
    if (role === 'coach') return NextResponse.redirect(new URL('/clients', request.url));
    return NextResponse.redirect(new URL('/login?error=Unknown+role.+Contact+your+administrator.', request.url));
  }

  if (!user && !isLoginPage && !isAuthCallback) {
    // Unauthenticated users trying to access protected routes
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (user && isLoginPage) {
    // Unknown role — let them stay on login with the error
    if (role !== 'coach' && role !== 'client') return response;
    // Authenticated users with a valid role — redirect to their home
    return NextResponse.redirect(new URL(role === 'coach' ? '/clients' : '/dashboard', request.url))
  }

  // If they are on the update-password page, let them stay there
  if (user && isUpdatePasswordPage) {
    return response;
  }

  // Prevent clients from accessing dashboard
  if (user && role === 'client' && request.nextUrl.pathname.startsWith('/clients')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Prevent coaches from accessing client portal
  if (user && role === 'coach' && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/clients', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
