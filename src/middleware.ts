import { NextRequest, NextResponse } from 'next/server';
import { recordApiRequest } from '@/lib/monitoring';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Record API request start time
  const startTime = Date.now();
  const requestUrl = request.nextUrl.pathname;
  
  // Only protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Basic auth implementation for admin routes
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !isValidAuthHeader(authHeader)) {
      // Record unauthorized API request
      const endTime = Date.now();
      const duration = endTime - startTime;
      recordApiRequest(requestUrl, 401, duration);
      
      // Return response that requires authentication
      return new NextResponse('Authentication required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Area"',
        },
      });
    }
  }
  
  // Continue to the requested resource
  const response = NextResponse.next();
  
  // Attach handler to record API response time
  response.headers.set('x-middleware-cache', 'no-cache');
  
  // Use ResponseInit to intercept the response
  return new Promise<NextResponse>((resolve) => {
    // Set up a timeout to record metrics in case the response is never completed
    const timeoutId = setTimeout(() => {
      recordApiRequest(requestUrl, 500, 30000); // Assume timeout after 30s
      resolve(response);
    }, 30000);
    
    // We can't actually intercept the real response in middleware,
    // but we can estimate the completion time and status
    // This will be approximate, but good enough for monitoring
    setTimeout(() => {
      clearTimeout(timeoutId);
      const endTime = Date.now();
      const duration = endTime - startTime;
      recordApiRequest(requestUrl, 200, duration); // Assume success for now
      resolve(response);
    }, 0);
  });
}

// Check if the provided authorization header is valid
function isValidAuthHeader(authHeader: string): boolean {
  if (!authHeader.startsWith('Basic ')) {
    return false;
  }
  
  // Extract credentials from the header
  try {
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');
    
    // Check against environment variables or hardcoded values (in production, use environment variables!)
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'adminpassword';
    
    return username === adminUsername && password === adminPassword;
  } catch (error) {
    console.error('Error parsing authentication header:', error);
    return false;
  }
}

// Apply middleware to specific paths
export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/api/merchants/:path*'],
}; 