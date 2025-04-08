import { NextResponse } from 'next/server';
import { getMetrics, resetMetrics } from '@/lib/monitoring';

// This endpoint is for admin use only
// It's protected by the middleware we created earlier

// Get current metrics
export async function GET() {
  try {
    const metrics = getMetrics();
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      metrics
    });
  } catch (error) {
    console.error('Error retrieving metrics:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve metrics' },
      { status: 500 }
    );
  }
}

// Reset metrics
export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    if (action === 'reset') {
      resetMetrics();
      return NextResponse.json({ success: true, message: 'Metrics reset successfully' });
    }
    
    return NextResponse.json(
      { error: 'Invalid action. Use ?action=reset to reset metrics' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error resetting metrics:', error);
    return NextResponse.json(
      { error: 'Failed to reset metrics' },
      { status: 500 }
    );
  }
} 