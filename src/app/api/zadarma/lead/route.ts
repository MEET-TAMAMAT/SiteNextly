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
    const { lead, utms } = body;

    if (!lead || !lead.name || !lead.contacts || !lead.phones) {
      return NextResponse.json(
        { message: 'Missing required lead data' },
        { status: 400 }
      );
    }

    // Prepare the request to Zadarma API
    const zadarmaUrl = 'https://api.zadarma.com/v1/zcrm/customers';

    // Create signature for Zadarma API authentication
    const method = 'POST';
    const apiPath = '/v1/zcrm/customers';
    const requestBody = JSON.stringify(body);
    const timestamp = Math.floor(Date.now() / 1000).toString();

    // Note: You'll need to implement Zadarma's signature generation
    // This is a placeholder - see Zadarma docs for exact signature algorithm
    const signature = generateZadarmaSignature(method, apiPath, requestBody, timestamp, ZADARMA_SECRET);

    console.log('Sending lead to Zadarma:', {
      url: zadarmaUrl,
      lead: lead.name,
      email: lead.contacts[0]?.value,
      phone: lead.phones[0]?.phone,
      utms
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
      console.error('Zadarma API error:', errorText);

      return NextResponse.json(
        { message: 'Failed to create lead in Zadarma CRM' },
        { status: zadarmaResponse.status }
      );
    }

    const zadarmaResult = await zadarmaResponse.json();
    console.log('Zadarma API success:', zadarmaResult);

    // Return success response with lead ID
    return NextResponse.json({
      success: true,
      leadId: zadarmaResult.id || zadarmaResult.customer_id,
      message: 'Lead created successfully',
      data: zadarmaResult
    });

  } catch (error) {
    console.error('Error in Zadarma lead API:', error);

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Placeholder function for Zadarma signature generation
// TODO: Implement the actual signature algorithm from Zadarma documentation
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