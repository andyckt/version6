import { NextResponse } from 'next/server';
import { JSDOM } from 'jsdom';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  
  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }
  
  try {
    // Fetch the page content
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://yourproductionurl.com' 
      : 'http://localhost:3000';
    
    const fullUrl = url.startsWith('/') ? `${baseUrl}${url}` : url;
    const response = await fetch(fullUrl);
    
    if (!response.ok) {
      return NextResponse.json({ 
        error: `Failed to fetch page: ${response.status} ${response.statusText}` 
      }, { status: 500 });
    }
    
    const html = await response.text();
    
    // Parse the HTML with jsdom
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    // Get all text content
    const bodyText = document.body.textContent;
    
    // Try to find OPEN/CLOSED status
    const openStatus = bodyText?.includes('OPEN') ? 'OPEN' : (bodyText?.includes('CLOSED') ? 'CLOSED' : 'Not found');
    
    return NextResponse.json({
      url: fullUrl,
      pageTitle: document.title,
      openStatus,
      bodyTextSnippet: bodyText?.slice(0, 500) + '...'
    });
  } catch (error) {
    console.error('Error testing merchant page:', error);
    return NextResponse.json({ 
      error: 'Failed to test merchant page', 
      details: (error as Error).message 
    }, { status: 500 });
  }
} 