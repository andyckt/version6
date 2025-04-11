import { NextRequest, NextResponse } from 'next/server';
import { runMediaCleanupTasks } from '@/lib/db/cleanup';

/**
 * API endpoint to trigger media cleanup tasks
 * - Deletes original variants older than 60 days
 * - Cleans up unused media
 * 
 * POST /api/media/cleanup
 * 
 * Note: In production, this should be secured with proper authentication
 * and typically triggered by a CRON job or admin action
 */
export async function POST(request: NextRequest) {
  try {
    // In a real application, validate authentication/authorization here
    // Only admins or the system itself should be able to trigger this
    const authHeader = request.headers.get('authorization');
    
    // Simple API key check for demo purposes
    // In production, use a proper authentication system
    if (!validateApiKey(authHeader)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Run the cleanup tasks
    const result = await runMediaCleanupTasks();
    
    return NextResponse.json({
      success: true,
      message: 'Media cleanup tasks completed',
      result
    });
  } catch (error) {
    console.error('Media cleanup error:', error);
    
    return NextResponse.json(
      { error: 'Failed to run media cleanup tasks' },
      { status: 500 }
    );
  }
}

/**
 * Validate the API key from the Authorization header
 * This is a simple example - in production use proper authentication
 */
function validateApiKey(authHeader: string | null): boolean {
  // Simple validation - in production use environment variables and secure comparison
  const expectedApiKey = process.env.MEDIA_CLEANUP_API_KEY || 'media-cleanup-secret-key';
  
  if (!authHeader) {
    return false;
  }
  
  // Check if it's a Bearer token with our API key
  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return false;
  }
  
  return token === expectedApiKey;
} 