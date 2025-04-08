import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define API URL patterns that should be cached
const MERCHANT_API_PATTERN = /^\/api\/merchants(\/.*)?$/;
const CACHE_CONTROL_HEADER = 'Cache-Control';

// Middleware to intercept API responses and add caching headers
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Only process merchant API routes
  if (MERCHANT_API_PATTERN.test(pathname)) {
    // Continue to the API
    const response = NextResponse.next();
    
    // If Redis isn't available, at least set appropriate cache headers
    if (!process.env.REDIS_URL) {
      // Set different cache times based on the specific route
      if (pathname.includes('/merchants/[username]')) {
        // Individual merchant data - longer cache
        response.headers.set(
          CACHE_CONTROL_HEADER,
          'public, s-maxage=300, stale-while-revalidate=3600'
        );
      } else {
        // Merchant lists - shorter cache 
        response.headers.set(
          CACHE_CONTROL_HEADER,
          'public, s-maxage=60, stale-while-revalidate=300'
        );
      }
    }
    
    return response;
  }
  
  return NextResponse.next();
}

// Only run middleware on API routes
export const config = {
  matcher: '/api/:path*',
}; 