import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

function phpEncode(str: string): string {
  return encodeURIComponent(String(str))
    .replace(/%20/g, '+')
    .replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase())
}

function buildParamString(params: Record<string, string>): string {
  return Object.keys(params)
    .sort()
    .map(k => `${phpEncode(k)}=${phpEncode(params[k])}`)
    .join('&')
}

// Zadarma signing: base64(hex(hmac_sha1(method + paramString + md5(paramString))))
function signZadarma(method: string, paramString: string, secret: string): string {
  const md5Hex = crypto.createHash('md5').update(paramString).digest('hex')
  const toSign = method + paramString + md5Hex
  const hmacHex = crypto.createHmac('sha1', secret).update(toSign).digest('hex')
  return Buffer.from(hmacHex).toString('base64')
}

// Search Zadarma for an existing customer by phone or email
// Returns the customer ID string, or null if not found
async function findExistingCustomer(
  searchTerm: string,
  userKey: string,
  secret: string
): Promise<string | null> {
  try {
    const method = '/v1/zcrm/customers'
    const searchParams: Record<string, string> = { search: searchTerm }
    const searchParamString = buildParamString(searchParams)
    const sig = signZadarma(method, searchParamString, secret)
    const res = await fetch(
      `https://api.zadarma.com${method}?${searchParamString}`,
      {
        method: 'GET',
        headers: { 'Authorization': `${userKey}:${sig}`, 'User-Agent': 'NodeScript' }
      }
    )
    const data = await res.json()
    console.log(`ZADARMA_SEARCH (${searchTerm}):`, JSON.stringify(data))
    const id = data?.data?.customers?.[0]?.id
    return id ? String(id) : null
  } catch (err) {
    console.log('Search error (non-fatal):', String(err))
    return null
  }
}

// Post a note to the timeline of an existing Zadarma customer/lead
async function postTimelineNote(
  customerId: string,
  message: string,
  userKey: string,
  secret: string
): Promise<void> {
  try {
    const method = `/v1/zcrm/customers/${customerId}/feed`
    const params: Record<string, string> = { content: message }
    const paramString = buildParamString(params)
    const signature = signZadarma(method, paramString, secret)
    await fetch(`https://api.zadarma.com${method}`, {
      method: 'POST',
      headers: {
        'Authorization': `${userKey}:${signature}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'NodeScript',
      },
      body: paramString,
    })
  } catch (err) {
    console.log('Timeline note failed (non-fatal):', String(err))
  }
}

export async function POST(request: NextRequest) {
  try {
    const lead = await request.json()

    const userKey = process.env.ZADARMA_USER_KEY!
    const secret = process.env.ZADARMA_SECRET_KEY!

    if (!userKey || !secret) {
      return NextResponse.json(
        { error: 'Zadarma credentials not configured' },
        { status: 500 }
      )
    }

    const params: Record<string, string> = {}

    // ── Core fields ───────────────────────────────────────────────
    if (lead.name)    params['lead[name]']    = lead.name
    if (lead.country) params['lead[country]'] = lead.country
    if (lead.website) params['lead[website]'] = lead.website
    params['lead[lead_source]'] = 'form'

    // Coach and Teacher are both individuals → 'person' in Zadarma
    if (lead.lead_type) {
      params['lead[status]'] = lead.lead_type === 'company' ? 'company' : 'person'
    }

    // ── Phone ─────────────────────────────────────────────────────
    if (lead.phone) {
      params['lead[phones][0][phone]'] = lead.phone
      params['lead[phones][0][type]']  = 'work'
    }

    // ── Email ─────────────────────────────────────────────────────
    let ci = 0
    if (lead.email) {
      params[`lead[contacts][${ci}][value]`] = lead.email
      params[`lead[contacts][${ci}][type]`]  = 'email_work'
      ci++
    }

    // ── Messenger mapping ─────────────────────────────────────────
    // Native Zadarma contact types
    const nativeMessengers = ['whatsapp', 'telegram', 'viber', 'skype', 'facebook']

    // Custom property IDs from Teamsale Settings → Custom Properties
    const customPropertyMap: Record<string, string> = {
      'instagram': '12646',
      'youtube':   '12647',
      'tiktok':    '12648',
      'linkedin':  '12649',
      'signal':    '12937',
      'line':      '12938',
      'wechat':    '12939',
    }

    if (lead.messenger_handle && lead.messenger_type) {
      if (nativeMessengers.includes(lead.messenger_type)) {
        // Send as native Zadarma contact type
        params[`lead[contacts][${ci}][value]`] = lead.messenger_handle
        params[`lead[contacts][${ci}][type]`]  = lead.messenger_type
      } else if (customPropertyMap[lead.messenger_type]) {
        // Send as custom property
        params['lead[custom_properties][0][id]']    = customPropertyMap[lead.messenger_type]
        params['lead[custom_properties][0][value]'] = lead.messenger_handle
      }
      // 'other' type — stored in Directus only, not sent to Zadarma
    }

    // ── Comment / Message ─────────────────────────────────────────
    // Sent directly in lead payload — appears in Comment field in Teamsale
    // NOTE: do NOT also post via postTimelineNote after creation — would duplicate it
    if (lead.message?.trim()) {
      params['lead[comment]'] = lead.message.trim()
    }

    // ── UTM params ────────────────────────────────────────────────
    if (lead.utm_source   && lead.utm_source   !== 'direct') params['lead[utms][utm_source]']   = lead.utm_source
    if (lead.utm_medium   && lead.utm_medium   !== 'none')   params['lead[utms][utm_medium]']   = lead.utm_medium
    if (lead.utm_campaign && lead.utm_campaign !== 'none')   params['lead[utms][utm_campaign]'] = lead.utm_campaign
    if (lead.utm_content  && lead.utm_content  !== 'none')   params['lead[utms][utm_content]']  = lead.utm_content
    if (lead.utm_term     && lead.utm_term     !== 'none')   params['lead[utms][utm_term]']     = lead.utm_term

    // ── Source tag mapping ────────────────────────────────────────
    const sourceTagMap: Record<string, string> = {
      'facebook':       '120860',
      'instagram':      '126195',
      'linkedin':       '126196',
      'tiktok':         '126197',
      'youtube':        '126198',
      'x':              '126199',
      'phone':          '126201',
      'google':         '126203', // Google Ads
      'google_ads':     '126203', // Google Ads (alias)
      'google_organic': '126204',
      'referral':       '126205',
      'email':          '126206',
      'direct':         '126207',
    }
    if (lead.utm_source && sourceTagMap[lead.utm_source]) {
      params['lead[source_tag_id]'] = sourceTagMap[lead.utm_source]
    }

    // ── Labels: REMOVED ──────────────────────────────────────────
    // lead[labels][] notation breaks HMAC signature — pending Zadarma support resolution
    // Labels can be set manually in Teamsale until resolved

    // ── Sign and send to Zadarma ──────────────────────────────────
    const method = '/v1/zcrm/leads'
    const paramString = buildParamString(params)
    const signature = signZadarma(method, paramString, secret)

    const zadarmaRes = await fetch('https://api.zadarma.com/v1/zcrm/leads', {
      method: 'POST',
      headers: {
        'Authorization': `${userKey}:${signature}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'NodeScript',
      },
      body: paramString,
    })

    const zadarmaData = await zadarmaRes.json()
    console.log('ZADARMA_RESPONSE:', JSON.stringify(zadarmaData))

    // ── Duplicate handling ────────────────────────────────────────
    // Only triggered when Zadarma rejects with "Already used" validation errors
    // This runs AFTER the create attempt fails — not before (avoids unnecessary API calls)
    const phoneAlreadyUsed = zadarmaData?.data?.validation_errors?.phones?.includes('Already used')
    const contactAlreadyUsed = zadarmaData?.data?.validation_errors?.contacts?.includes('Already used')
    const isDuplicate = phoneAlreadyUsed || contactAlreadyUsed

    if (isDuplicate) {
      console.log('ZADARMA_DUPLICATE: searching for existing customer')
      let existingId: string | null = null

      // Search by phone first, then email as fallback
      if (lead.phone) existingId = await findExistingCustomer(lead.phone, userKey, secret)
      if (!existingId && lead.email) existingId = await findExistingCustomer(lead.email, userKey, secret)

      if (existingId) {
        const date = new Date().toISOString().split('T')[0]
        const note = `Re-submitted contact form on ${date} — not yet contacted.${lead.message?.trim() ? ' Message: ' + lead.message.trim() : ''}`
        await postTimelineNote(existingId, note, userKey, secret)
        console.log(`ZADARMA_DUPLICATE: note added to customer ${existingId}`)
        return NextResponse.json({ success: true, duplicate: true, zadarma_lead_id: existingId })
      }

      // Duplicate detected but customer not found in search — return duplicate signal anyway
      return NextResponse.json({ success: true, duplicate: true, zadarma_lead_id: '' })
    }

    // ── Handle other Zadarma errors ───────────────────────────────
    if (!zadarmaRes.ok || zadarmaData.status !== 'success') {
      console.log('ZADARMA_ERROR:', JSON.stringify(zadarmaData))
      return NextResponse.json(
        { error: 'Zadarma API error', details: zadarmaData },
        { status: 500 }
      )
    }

    // ── Success ───────────────────────────────────────────────────
    const zadarmaLeadId = String(
      zadarmaData.data?.id ?? zadarmaData.id ?? ''
    )

    return NextResponse.json({ success: true, zadarma_lead_id: zadarmaLeadId })

  } catch (error) {
    console.log('ZADARMA_EXCEPTION:', String(error))
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}