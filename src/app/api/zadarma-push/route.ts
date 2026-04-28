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

function signZadarma(method: string, paramString: string, secret: string): string {
  const md5Hex = crypto.createHash('md5').update(paramString).digest('hex')
  const toSign = method + paramString + md5Hex
  const hmacHex = crypto.createHmac('sha1', secret).update(toSign).digest('hex')
  return Buffer.from(hmacHex).toString('base64')
}

async function postTimelineNote(
  leadId: string,
  message: string,
  userKey: string,
  secret: string
): Promise<void> {
  try {
    const method = `/v1/zcrm/customers/${leadId}/feed`
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

    // Core fields
    if (lead.name)      params['lead[name]']      = lead.name
    if (lead.lead_type) params['lead[status]']    = lead.lead_type
    if (lead.country)   params['lead[country]']   = lead.country
    if (lead.website)   params['lead[website]']   = lead.website
    params['lead[lead_source]'] = 'form'

    // Phone
    if (lead.phone) {
      params['lead[phones][0][phone]'] = lead.phone
      params['lead[phones][0][type]']  = 'work'
    }

    // Email and native messengers
    let ci = 0
    if (lead.email) {
      params[`lead[contacts][${ci}][value]`] = lead.email
      params[`lead[contacts][${ci}][type]`]  = 'email_work'
      ci++
    }

    // Messenger mapping — native Zadarma types vs custom properties
    const nativeMessengers = ['whatsapp', 'telegram', 'viber', 'skype', 'facebook']
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
        const propId = customPropertyMap[lead.messenger_type]
        params[`lead[custom_properties][0][id]`]    = propId
        params[`lead[custom_properties][0][value]`] = lead.messenger_handle
      } else {
        // Fallback — send as 'other'
        params[`lead[contacts][${ci}][value]`] = lead.messenger_handle
        params[`lead[contacts][${ci}][type]`]  = 'other'
      }
    }

    // UTM params
    if (lead.utm_source   && lead.utm_source   !== 'direct') params['lead[utms][utm_source]']   = lead.utm_source
    if (lead.utm_medium   && lead.utm_medium   !== 'none')   params['lead[utms][utm_medium]']   = lead.utm_medium
    if (lead.utm_campaign && lead.utm_campaign !== 'none')   params['lead[utms][utm_campaign]'] = lead.utm_campaign
    if (lead.utm_content  && lead.utm_content  !== 'none')   params['lead[utms][utm_content]']  = lead.utm_content
    if (lead.utm_term     && lead.utm_term     !== 'none')   params['lead[utms][utm_term]']     = lead.utm_term

    // Label (tag) mapping — Teacher vs School
    const labelMap: Record<string, string> = {
      'person':  '349392', // Teacher tag
      'company': '337789', // School tag
    }
    if (lead.lead_type && labelMap[lead.lead_type]) {
      params['lead[labels][0]'] = labelMap[lead.lead_type]
    }

    // Source tag mapping — ad channel
    const sourceTagMap: Record<string, string> = {
      'facebook':  '120860',
      'google':    '120911',
      // Add remaining IDs here once confirmed:
      // 'instagram':       'ID',
      // 'linkedin':        'ID',
      // 'tiktok':          'ID',
      // 'youtube':         'ID',
      // 'x':               'ID',
      // 'google_organic':  'ID',
      // 'phone':           'ID',
      // 'direct':          'ID',
      // 'email':           'ID',
      // 'referral':        'ID',
    }
    if (lead.utm_source && sourceTagMap[lead.utm_source]) {
      params['lead[source_tag_id]'] = sourceTagMap[lead.utm_source]
    }

    // Build and sign
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

    if (!zadarmaRes.ok || zadarmaData.status !== 'success') {
      return NextResponse.json(
        { error: 'Zadarma API error', details: zadarmaData },
        { status: 500 }
      )
    }

    const zadarmaLeadId = String(
      zadarmaData.data?.id ?? zadarmaData.id ?? ''
    )

    if (lead.message?.trim() && zadarmaLeadId) {
      await postTimelineNote(zadarmaLeadId, lead.message, userKey, secret)
    }

    return NextResponse.json({ success: true, zadarma_lead_id: zadarmaLeadId })

  } catch (error) {
    console.log('ZADARMA_EXCEPTION:', String(error))
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}