import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // TODO: Replace with your actual Zadarma API credentials
    const ZADARMA_API_KEY = process.env.ZADARMA_API_KEY;
    const ZADARMA_SECRET = process.env.ZADARMA_SECRET;

    if (!ZADARMA_API_KEY || !ZADARMA_SECRET) {
      console.error('Missing Zadarma API credentials');
      return NextResponse.json(
        { message: 'API configuration error' },
        { status: 500 }
      );
    }

    // Validate request body
    const { leadId, content } = body;

    if (!leadId || !content) {
      return NextResponse.json(
        { message: 'Missing lead ID or content' },
        { status: 400 }
      );
    }

    // Prepare the request to Zadarma API
    const zadarmaUrl = `https://api.zadarma.com/v1/zcrm/customers/${leadId}/feed`;

    // Create signature for Zadarma API authentication
    const method = 'POST';
    const apiPath = `/v1/zcrm/customers/${leadId}/feed`;
    const requestBody = JSON.stringify({ content });
    const timestamp = Math.floor(Date.now() / 1000).toString();

    // Generate signature (using the same function as in lead route)
    const signature = generateZadarmaSignature(method, apiPath, requestBody, timestamp, ZADARMA_SECRET);

    console.log('Adding timeline note to Zadarma lead:', {
      leadId,
      contentLength: content.length
    });

    // Make request to Zadarma API
    const zadarmaResponse = await fetch(zadarmaUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': ZADARMA_API_KEY,
        'X-Timestamp': timestamp,
        'X-Signature': signature
      },
      body: requestBody
    });

    if (!zadarmaResponse.ok) {
      const errorText = await zadarmaResponse.text();
      console.error('Zadarma feed API error:', errorText);

      return NextResponse.json(
        { message: 'Failed to add timeline note to Zadarma CRM' },
        { status: zadarmaResponse.status }
      );
    }

    const zadarmaResult = await zadarmaResponse.json();
    console.log('Zadarma feed API success:', zadarmaResult);

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Timeline note added successfully',
      data: zadarmaResult
    });

  } catch (error) {
    console.error('Error in Zadarma feed API:', error);

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Same signature function as in lead route
function generateZadarmaSignature(
  method: string,
  path: string,
  body: string,
  timestamp: string,
  secret: string
): string {
  // This is a placeholder - you need to implement Zadarma's specific signature algorithm
  // Usually involves HMAC-SHA1 or similar with specific string formatting
  // See: https://zadarma.com/en/support/api/#auth

  const crypto = require('crypto');
  const stringToSign = `${method}|${path}|${body}|${timestamp}`;

  return crypto
    .createHmac('sha1', secret)
    .update(stringToSign)
    .digest('hex');
}