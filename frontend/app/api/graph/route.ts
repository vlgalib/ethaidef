// API route to proxy Graph requests and avoid CORS issues
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url, query } = await request.json();
    
    if (!url || !query) {
      return NextResponse.json({ error: 'URL and query are required' }, { status: 400 });
    }

    console.log('Proxying request to:', url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Graph proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from Graph API' },
      { status: 500 }
    );
  }
}