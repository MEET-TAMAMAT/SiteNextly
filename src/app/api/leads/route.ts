import { NextRequest, NextResponse } from 'next/server'
import { contactApiSchema, validateContactForm } from '@/lib/validation/contact-form'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Comprehensive server-side validation
    const validation = contactApiSchema.safeParse(body)

    if (!validation.success) {
      const errorMessage = validation.error.issues.map(err =>
        `${err.path.join('.')}: ${err.message}`
      ).join(', ')

      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.error.format(),
          message: errorMessage
        },
        { status: 400 }
      )
    }

    // Use validated data (type-safe and cleaned)
    const validatedData = validation.data

    // Verify Cloudflare Turnstile token
    const turnstileToken = validatedData['cf-turnstile-response']

    if (!process.env.TURNSTILE_SECRET_KEY) {
      console.error('TURNSTILE_SECRET_KEY not configured')
      return NextResponse.json(
        { error: 'CAPTCHA verification not configured' },
        { status: 500 }
      )
    }

    const formData = new FormData()
    formData.append('secret', process.env.TURNSTILE_SECRET_KEY)
    formData.append('response', turnstileToken)
    formData.append('remoteip', request.ip || request.headers.get('x-forwarded-for') || 'unknown')

    const turnstileVerification = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    })

    const turnstileResult = await turnstileVerification.json()

    if (!turnstileResult.success) {
      console.error('Turnstile verification failed:', turnstileResult)
      return NextResponse.json(
        { error: 'CAPTCHA verification failed' },
        { status: 400 }
      )
    }

    // Transform website URL - add https:// if it's just a domain
    let transformedWebsite = validatedData.website?.trim() || '';
    if (transformedWebsite && !transformedWebsite.match(/^https?:\/\//i)) {
      transformedWebsite = `https://${transformedWebsite}`;
    }

    const {
      name, email, phone, company,
      leadType, messengerType, messengerHandle,
      country, message,
      utm_source, utm_medium, utm_campaign, utm_content, utm_term
    } = validatedData

    const website = transformedWebsite;

    // Check for duplicate phone number if phone is provided
    let isDuplicate = false;
    if (phone && phone.trim()) {
      try {
        const filterQuery = JSON.stringify({
          phone: { _eq: phone.trim() }
        });

        const duplicateCheckRes = await fetch(
          `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/items/leads?filter=${encodeURIComponent(filterQuery)}&fields=id&limit=1`,
          {
            headers: {
              'Authorization': `Bearer ${process.env.DIRECTUS_TOKEN}`,
            },
            cache: 'no-store',
          }
        );

        if (duplicateCheckRes.ok) {
          const duplicateResult = await duplicateCheckRes.json();
          isDuplicate = duplicateResult.data && duplicateResult.data.length > 0;
        }
      } catch (duplicateError) {
        console.error('Error checking for duplicate phone:', duplicateError);
        // Continue with normal flow even if duplicate check fails
      }
    }

    const directusRes = await fetch(
      `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/items/leads`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.DIRECTUS_TOKEN}`,
        },
        cache: 'no-store',
        body: JSON.stringify({
          status: 'new',
          name,
          email,
          phone:            phone            || null,
          company:          company          || null,
          lead_type:        leadType         || null,
          messenger_type:   messengerType    || null,
          messenger_handle: messengerHandle  || null,
          country:          country          || null,
          website:          website          || null,
          message:          message          || null,
          utm_source:       utm_source       || 'direct',
          utm_medium:       utm_medium       || 'none',
          utm_campaign:     utm_campaign     || 'none',
          utm_content:      utm_content      || 'none',
          utm_term:         utm_term         || 'none',
        }),
      }
    )

    if (!directusRes.ok) {
      const err = await directusRes.json()
      console.error('Directus error:', err)
      return NextResponse.json(
        { error: 'Failed to save lead' },
        { status: 500 }
      )
    }

    const lead = await directusRes.json()
    return NextResponse.json({
      success: true,
      id: lead.data.id,
      isDuplicate: isDuplicate
    })

  } catch (error) {
    console.error('Lead submission error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}