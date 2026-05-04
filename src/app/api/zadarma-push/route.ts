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

// Confirmed algorithm: base64(hex(hmac_sha1(method + paramString + md5(paramString))))
function signZadarma(method: string, paramString: string, secret: string): string {
  const md5Hex = crypto.createHash('md5').update(paramString).digest('hex')
  const toSign = method + paramString + md5Hex
  const hmacHex = crypto.createHmac('sha1', secret).update(toSign).digest('hex')
  return Buffer.from(hmacHex).toString('base64')
}

// ── Zadarma helpers ────────────────────────────────────────────

// Search for an existing Zadarma lead by phone or email
// NOTE: The /v1/zcrm/leads?search= endpoint does a NAME search, not phone/email
// Form-created leads appear in "uncategorized" bucket
// We fetch recent uncategorized leads and match by phone/email client-side
async function findExistingLead(
  phone: string | null,
  email: string | null,
  userKey: string,
  secret: string
): Promise<string | null> {
  try {
    const method = '/v1/zcrm/leads'
    // Fetch recent leads — uncategorized leads from form appear here
    const searchParams: Record<string, string> = {
      limit: '100',
      sort_attr: 'lead_created_at',
      sort_desc: '1',
    }
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
    console.log('ZADARMA_LEADS_FETCH: totalCount=', data?.data?.totalCount, 'uncategorizedCount=', data?.data?.uncategorizedCount)

    const leads: any[] = data?.data?.leads ?? []

    // Match by phone
    if (phone) {
      const normalizedPhone = phone.replace(/\s/g, '')
      for (const lead of leads) {
        const phones: any[] = lead.phones ?? []
        if (phones.some((p: any) => p.phone?.replace(/\s/g, '') === normalizedPhone)) {
          console.log(`ZADARMA_DUPLICATE_FOUND: phone match, lead ID ${lead.id}`)
          return String(lead.id)
        }
      }
    }

    // Match by email
    if (email) {
      const normalizedEmail = email.toLowerCase()
      for (const lead of leads) {
        const contacts: any[] = lead.contacts ?? []
        if (contacts.some((c: any) => c.value?.toLowerCase() === normalizedEmail && c.type?.includes('email'))) {
          console.log(`ZADARMA_DUPLICATE_FOUND: email match, lead ID ${lead.id}`)
          return String(lead.id)
        }
      }
    }

    console.log('ZADARMA_DUPLICATE: lead not found in recent 100 leads')
    return null
  } catch (err) {
    console.log('Duplicate search error (non-fatal):', String(err))
    return null
  }
}

// Post a note to the activity timeline of an existing Zadarma customer/lead
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
    console.log(`ZADARMA_TIMELINE_NOTE: added to lead ${customerId}`)
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
    const company         = safe(lead.company)
    const leadType        = safe(lead.lead_type)
    const country         = safe(lead.country)
    const website         = safe(lead.website)
    const message         = safe(lead.message)
    const messengerType   = safe(lead.messenger_type)
    const messengerHandle = safe(lead.messenger_handle)
    const utmSource       = safe(lead.utm_source)

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
      // Clean and format phone number for Zadarma
      // Remove all non-digit characters except leading +
      let formattedPhone = phone.trim()

      // If it starts with +, keep the +, otherwise clean everything
      if (formattedPhone.startsWith('+')) {
        formattedPhone = '+' + formattedPhone.slice(1).replace(/\D/g, '')
      } else {
        formattedPhone = formattedPhone.replace(/\D/g, '')
        // Add + if it's a complete international number (10+ digits)
        if (formattedPhone.length >= 10) {
          formattedPhone = '+' + formattedPhone
        }
      }

      // Only send if we have a valid-looking phone number
      if (formattedPhone.length >= 8) {  // Minimum reasonable phone length
        params['lead[phones][0][phone]'] = formattedPhone
        params['lead[phones][0][type]']  = 'work'
      }
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
      'company':   '12948',  // School/Company field
    }

    if (messengerHandle && messengerType) {
      if (nativeMessengers.includes(messengerType)) {
        // Send as native Zadarma contact type
        params[`lead[contacts][${ci}][value]`] = messengerHandle
        params[`lead[contacts][${ci}][type]`]  = messengerType
      } else if (customPropertyMap[messengerType]) {
        // Send as Teamsale custom property (use field ID as slot)
        const fieldId = customPropertyMap[messengerType]
        params[`lead[custom_properties][${fieldId}][id]`]    = fieldId
        params[`lead[custom_properties][${fieldId}][value]`] = messengerHandle
      }
      // 'other' type: stored in Directus only, not forwarded to Zadarma
    }

    // ── School/Company Name ───────────────────────────────────────
    // Send company name as custom property for school leads (same pattern as messenger fields)
    console.log('COMPANY_DEBUG_DETAILED:', {
      company: company,
      leadType: leadType,
      condition: !!(company && leadType === 'company'),
      customPropertyMap: customPropertyMap['company']
    })

    if (company && leadType === 'company') {
      const fieldId = customPropertyMap['company']  // '12948'
      console.log('ADDING_COMPANY_FIELD:', { fieldId, company })
      params[`lead[custom_properties][${fieldId}][id]`]    = fieldId
      params[`lead[custom_properties][${fieldId}][value]`] = company
    }

    // ── Comment / Message ─────────────────────────────────────────
    // Sent in the lead creation payload → appears in Comment field in Teamsale
    if (message) {
      params['lead[comment]'] = message
    }

    // ── Source tag mapping ────────────────────────────────────────
    // Maps utm_source values to Zadarma source tag IDs
    // Confirmed working format: lead[source_tag_id]
    // NOTE: lead[utms][utm_source] etc. cause PHP errors — permanently removed
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

    // ── Lead type label mapping: Teacher / School ─────────────────
    // Confirmed via Teamsale Network tab (leads:updateLead payload):
    // Zadarma requires labels as full objects with id, label, and count —
    // NOT just a bare ID. Sending only the ID is silently ignored.
    //
    // Confirmed label IDs and names from Teamsale → Settings → Labels:
    //   Teacher = 349392
    //   School  = 337789
    //
    // Format mirrors what Teamsale's own frontend sends on save:
    //   lead[labels][0][id]    = <id>
    //   lead[labels][0][label] = <name>
    //   lead[labels][0][count] = <count>  (current usage count — sent as-is)
    const leadTypeLabelMap: Record<string, { id: string; label: string; count: string }> = {
      'person':  { id: '349392', label: 'Teacher', count: '0'  },
      'company': { id: '337789', label: 'School',  count: '36' },
    }

    const labelEntry = leadType ? leadTypeLabelMap[leadType] : null
    if (labelEntry) {
      params['lead[labels][0][id]']    = labelEntry.id
      params['lead[labels][0][label]'] = labelEntry.label
      params['lead[labels][0][count]'] = labelEntry.count
    }

    // ── UTMs: REMOVED ────────────────────────────────────────────
    // lead[utms][utm_source] etc. cause PHP error "Cannot access offset of type string on string"
    // Confirmed via isolated testing — source_tag_id above covers the key utm_source use case
    // Full UTM data is still stored in Directus leads collection for internal analytics

    // ── Sign and send to Zadarma ──────────────────────────────────
    const method      = '/v1/zcrm/leads'
    const paramString = buildParamString(params)

    // Temporary troubleshooting logs — remove after label field is confirmed working.
    console.log('ZADARMA_PARAMS:', params)
    console.log('ZADARMA_PARAM_STRING:', paramString)

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
      console.log('ZADARMA_DUPLICATE: detected, searching for existing lead...')

      // Fetch recent leads and match by phone/email client-side
      // (search endpoint only does name/text search, not phone/email)
      const existingId = await findExistingLead(phone, email, userKey, secret)

      if (existingId) {
        const date = new Date().toISOString().split('T')[0]
        const note = `Re-submitted contact form on ${date} — not yet contacted.${message ? ' Message: ' + message : ''}`
        await postTimelineNote(existingId, note, userKey, secret)
        return NextResponse.json({ success: true, duplicate: true, zadarma_lead_id: existingId })
      }

      // Duplicate detected but not found in recent leads
      console.log('ZADARMA_DUPLICATE: lead not found in recent 100 — marked as duplicate without ID')
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
