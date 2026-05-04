import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      name, email, phone, company,
      lead_type, messenger_type, messenger_handle,
      country, website, message,
      utm_source, utm_medium, utm_campaign, utm_content, utm_term
    } = body

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
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
          lead_type:        lead_type        || null,
          messenger_type:   messenger_type   || null,
          messenger_handle: messenger_handle || null,
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
    return NextResponse.json({ success: true, id: lead.data.id })

  } catch (error) {
    console.error('Lead submission error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}