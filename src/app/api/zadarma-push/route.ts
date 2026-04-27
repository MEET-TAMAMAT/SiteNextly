import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

function signZadarma(
  method: string,
  params: Record<string, string>,
  secret: string
): string {
  const sortedKeys = Object.keys(params).sort()
  const queryString = sortedKeys.map(k => `${k}=${params[k]}`).join('&')
  const md5Hash = crypto.createHash('md5').update(queryString).digest('hex')
  const toSign = method + queryString + md5Hash
  return crypto.createHmac('sha1', secret).update(toSign).digest('base64')
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
    const sortedKeys = Object.keys(params).sort()
    const queryString = sortedKeys.map(k => `${k}=${params[k]}`).join('&')
    const md5Hash = crypto.createHash('md5').update(queryString).digest('hex')
    const toSign = method + queryString + md5Hash
    const signature = crypto.createHmac('sha1', secret).update(toSign).digest('base64')
    const formBody = sortedKeys
      .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
      .join('&')
    await fetch(`https://api.zadarma.com${method}`, {
      method: 'POST',
      headers: {
        'Authorization': `${userKey}:${signature}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formBody,
    })
  } catch (err) {
    console.error('Timeline note failed (non-fatal):', err)
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

    // Build Zadarma params
    const params: Record<string, string> = {}

    if (lead.name)      params['lead[name]']      = lead.name
    if (lead.lead_type) params['lead[status]']    = lead.lead_type
    if (lead.country)   params['lead[country]']   = lead.country
    if (lead.website)   params['lead[website]']   = lead.website
    params['lead[lead_source]'] = 'form'

    if (lead.phone) {
      params['lead[phones][0][phone]'] = lead.phone
      params['lead[phones][0][type]']  = 'mobile'
    }

    let ci = 0
    if (lead.email) {
      params[`lead[contacts][${ci}][value]`] = lead.email
      params[`lead[contacts][${ci}][type]`]  = 'email_work'
      ci++
    }
    if (lead.messenger_handle && lead.messenger_type) {
      params[`lead[contacts][${ci}][value]`] = lead.messenger_handle
      params[`lead[contacts][${ci}][type]`]  = lead.messenger_type
    }

    if (lead.utm_source   && lead.utm_source   !== 'direct') params['lead[utms][utm_source]']   = lead.utm_source
    if (lead.utm_medium   && lead.utm_medium   !== 'none')   params['lead[utms][utm_medium]']   = lead.utm_medium
    if (lead.utm_campaign && lead.utm_campaign !== 'none')   params['lead[utms][utm_campaign]'] = lead.utm_campaign
    if (lead.utm_content  && lead.utm_content  !== 'none')   params['lead[utms][utm_content]']  = lead.utm_content
    if (lead.utm_term     && lead.utm_term     !== 'none')   params['lead[utms][utm_term]']     = lead.utm_term

    const method = '/v1/zcrm/leads'
    const signature = signZadarma(method, params, secret)

    const sortedKeys = Object.keys(params).sort()
    const formBody = sortedKeys
      .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
      .join('&')

    const zadarmaRes = await fetch('https://api.zadarma.com/v1/zcrm/leads', {
      method: 'POST',
      headers: {
        'Authorization': `${userKey}:${signature}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formBody,
    })

    const zadarmaData = await zadarmaRes.json()

    if (!zadarmaRes.ok || zadarmaData.status !== 'success') {
      console.log('ZADARMA_ERROR:', JSON.stringify(zadarmaData))
      return NextResponse.json(
        { error: 'Zadarma API error', details: zadarmaData },
        { status: 500 }
      )
    }

    const zadarmaLeadId = String(
      zadarmaData.id ?? zadarmaData.crmid ?? zadarmaData.data?.id ?? ''
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