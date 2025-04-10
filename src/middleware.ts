import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const { pathname } = request.nextUrl;

  // Check if the pathname starts with /admin
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // Check if the user is authenticated by looking for the token
    const token = request.cookies.get('adminAuthToken')?.value;

    // If there is no token and the path is not the login page, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

// Only run middleware on admin routes
export const config = {
  matcher: '/admin/:path*',
}; 