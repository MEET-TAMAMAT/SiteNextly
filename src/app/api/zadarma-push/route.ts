import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// ── Encoding helpers ───────────────────────────────────────────

// PHP-compatible URL encoding (spaces → +, brackets encoded)
function phpEncode(str: string): string {
  return encodeURIComponent(String(str))
    .replace(/%20/g, '+')
    .replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase())
}

// Build sorted, encoded query string from params object
function buildParamString(params: Record<string, string>): string {
  return Object.keys(params)
    .sort()
    .map(k => `${phpEncode(k)}=${phpEncode(params[k])}`)
    .join('&')
}

// Safely extract a string value — treats "null", "undefined", "" as empty
// Needed because Directus Flow templates render null as the string "null"
function safe(val: unknown): string | null {
  if (val === null || val === undefined) return null
  const str = String(val).trim()
  if (str === '' || str === 'null' || str === 'undefined') return null
  return str
}

// ── Zadarma signing ────────────────────────────────────────────

// Signing algorithm: base64(hex(hmac_sha1(method + paramString + md5(paramString))))
// Confirmed correct by Zadarma support
function signZadarma(method: string, paramString: string, secret: string): string {
  const md5Hex = crypto.createHash('md5').update(paramString).digest('hex')
  const toSign = method + paramString + md5Hex
  const hmacHex = crypto.createHmac('sha1', secret).update(toSign).digest('hex')
  return Buffer.from(hmacHex).toString('base64')
}

// ── Zadarma helpers ────────────────────────────────────────────

// Search for an existing Zadarma customer by phone or email
// Returns the customer ID as a string, or null if not found
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
        headers: {
          'Authorization': `${userKey}:${sig}`,
          'User-Agent': 'NodeScript',
        }
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

// Post a note to the activity timeline of an existing Zadarma customer
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

// ── Main handler ───────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const lead = await request.json()

    const userKey = process.env.ZADARMA_USER_KEY!
    const secret  = process.env.ZADARMA_SECRET_KEY!

    if (!userKey || !secret) {
      return NextResponse.json(
        { error: 'Zadarma credentials not configured' },
        { status: 500 }
      )
    }

    // ── Safely extract all lead fields ───────────────────────────
    // safe() handles null, "null", undefined, "" from Directus Flow templates
    const name            = safe(lead.name)
    const email           = safe(lead.email)
    const phone           = safe(lead.phone)
    const leadType        = safe(lead.lead_type)
    const country         = safe(lead.country)
    const website         = safe(lead.website)
    const message         = safe(lead.message)
    const messengerType   = safe(lead.messenger_type)
    const messengerHandle = safe(lead.messenger_handle)
    const utmSource       = safe(lead.utm_source)
    const utmMedium       = safe(lead.utm_medium)
    const utmCampaign     = safe(lead.utm_campaign)
    const utmContent      = safe(lead.utm_content)
    const utmTerm         = safe(lead.utm_term)

    const params: Record<string, string> = {}

    // ── Core fields ───────────────────────────────────────────────
    if (name)    params['lead[name]']    = name
    if (country) params['lead[country]'] = country
    if (website) params['lead[website]'] = website
    params['lead[lead_source]'] = 'form'

    // Coach and Teacher are both individuals → 'person' in Zadarma
    if (leadType) {
      params['lead[status]'] = leadType === 'company' ? 'company' : 'person'
    }

    // ── Phone ─────────────────────────────────────────────────────
    if (phone) {
      params['lead[phones][0][phone]'] = phone
      params['lead[phones][0][type]']  = 'work'
    }

    // ── Email ─────────────────────────────────────────────────────
    let ci = 0
    if (email) {
      params[`lead[contacts][${ci}][value]`] = email
      params[`lead[contacts][${ci}][type]`]  = 'email_work'
      ci++
    }

    // ── Messenger mapping ─────────────────────────────────────────
    // Native Zadarma contact types
    const nativeMessengers = ['whatsapp', 'telegram', 'viber', 'skype', 'facebook']

    // Custom property IDs defined in Teamsale → Settings → Custom Properties
    const customPropertyMap: Record<string, string> = {
      'instagram': '12646',
      'youtube':   '12647',
      'tiktok':    '12648',
      'linkedin':  '12649',
      'signal':    '12937',
      'line':      '12938',
      'wechat':    '12939',
    }

    if (messengerHandle && messengerType) {
      if (nativeMessengers.includes(messengerType)) {
        // Send as native Zadarma contact type
        params[`lead[contacts][${ci}][value]`] = messengerHandle
        params[`lead[contacts][${ci}][type]`]  = messengerType
      } else if (customPropertyMap[messengerType]) {
        // Send as Teamsale custom property
        params['lead[custom_properties][0][id]']    = customPropertyMap[messengerType]
        params['lead[custom_properties][0][value]'] = messengerHandle
      }
      // 'other' type: stored in Directus only, not forwarded to Zadarma
    }

    // ── Comment / Message ─────────────────────────────────────────
    // Sent in the lead creation payload → appears in Comment field in Teamsale
    // NOTE: do NOT also call postTimelineNote for new leads — that would duplicate the message
    if (message) {
      params['lead[comment]'] = message
    }

    // ── UTM params ────────────────────────────────────────────────
    if (utmSource   && utmSource   !== 'direct') params['lead[utms][utm_source]']   = utmSource
    if (utmMedium   && utmMedium   !== 'none')   params['lead[utms][utm_medium]']   = utmMedium
    if (utmCampaign && utmCampaign !== 'none')   params['lead[utms][utm_campaign]'] = utmCampaign
    if (utmContent  && utmContent  !== 'none')   params['lead[utms][utm_content]']  = utmContent
    if (utmTerm     && utmTerm     !== 'none')   params['lead[utms][utm_term]']     = utmTerm

    // ── Source tag mapping ────────────────────────────────────────
    // Maps utm_source values to Zadarma source tag IDs (created in Teamsale)
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
    if (utmSource && sourceTagMap[utmSource]) {
      params['lead[source_tag_id]'] = sourceTagMap[utmSource]
    }

    // ── Labels: REMOVED ──────────────────────────────────────────
    // lead[labels][] notation breaks HMAC signature due to empty bracket encoding
    // Pending resolution with Zadarma support
    // Labels (Teacher/School/Coach tags) must be set manually in Teamsale for now

    // ── Sign and send to Zadarma ──────────────────────────────────
    const method      = '/v1/zcrm/leads'
    const paramString = buildParamString(params)
    const signature   = signZadarma(method, paramString, secret)

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
    // Triggered ONLY when Zadarma rejects with "Already used" validation errors
    // Correct order: try CREATE first → if duplicate error → search + add timeline note
    const phoneAlreadyUsed   = zadarmaData?.data?.validation_errors?.phones?.includes('Already used')
    const contactAlreadyUsed = zadarmaData?.data?.validation_errors?.contacts?.includes('Already used')
    const isDuplicate        = phoneAlreadyUsed || contactAlreadyUsed

    if (isDuplicate) {
      console.log('ZADARMA_DUPLICATE: existing contact detected, searching...')
      let existingId: string | null = null

      // Search by phone first, then email as fallback
      if (phone) existingId = await findExistingCustomer(phone, userKey, secret)
      if (!existingId && email) existingId = await findExistingCustomer(email, userKey, secret)

      if (existingId) {
        const date = new Date().toISOString().split('T')[0]
        const note = `Re-submitted contact form on ${date} — not yet contacted.${message ? ' Message: ' + message : ''}`
        await postTimelineNote(existingId, note, userKey, secret)
        console.log(`ZADARMA_DUPLICATE: timeline note added to customer ${existingId}`)
        return NextResponse.json({ success: true, duplicate: true, zadarma_lead_id: existingId })
      }

      console.log('ZADARMA_DUPLICATE: contact not found via search')
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

    console.log('ZADARMA_SUCCESS: lead created with ID', zadarmaLeadId)
    return NextResponse.json({ success: true, zadarma_lead_id: zadarmaLeadId })

  } catch (error) {
    console.log('ZADARMA_EXCEPTION:', String(error))
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
