const crypto = require('crypto')

const USER_KEY = '4834f629119e881ff982'
const SECRET = '821fadcf62c76e7c4440'

// Exact PHP urlencode equivalent
function phpEncode(str) {
  return encodeURIComponent(String(str))
    .replace(/%20/g, '+')
    .replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase())
    .replace(/%2B/g, '+')
}

function buildParamString(params) {
  return Object.keys(params)
    .sort()
    .map(k => `${phpEncode(k)}=${phpEncode(params[k])}`)
    .join('&')
}

// Zadarma signing: base64(hex(hmac_sha1))
function sign(method, paramString, secret) {
  const md5Hex = crypto.createHash('md5').update(paramString).digest('hex')
  const toSign = method + paramString + md5Hex
  const hmacHex = crypto.createHmac('sha1', secret).update(toSign).digest('hex')
  return Buffer.from(hmacHex).toString('base64')
}

async function callZadarma(method, params, apiMethod = 'POST') {
  const paramString = buildParamString(params)
  const signature = sign(method, paramString, SECRET)
  console.log('Param string:', paramString)
  console.log('Signature:', signature)
  const res = await fetch('https://api.zadarma.com' + method, {
    method: apiMethod,
    headers: {
      'Authorization': `${USER_KEY}:${signature}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'NodeScript'
    },
    body: apiMethod === 'POST' ? paramString : undefined,
  })
  return res.json()
}

async function run() {
  // Test: lead[labels][] notation + lead[comment]
  console.log('\n=== TEST: labels[] notation + comment ===')
  const params = {
    'lead[name]': 'Test Labels Array',
    'lead[lead_source]': 'form',
    'lead[phones][0][phone]': '+380991000097',
    'lead[phones][0][type]': 'work',
    'lead[comment]': 'Test comment from form.',
    'lead[labels][]': '337789',
  }
  const method = '/v1/zcrm/leads'
  const sorted = Object.keys(params).sort()
  const qs = sorted.map(k => `${phpEncode(k)}=${phpEncode(params[k])}`).join('&')
  const md5 = crypto.createHash('md5').update(qs).digest('hex')
  const sig = Buffer.from(
    crypto.createHmac('sha1', SECRET).update(method + qs + md5).digest('hex')
  ).toString('base64')
  console.log('Param string:', qs)
  const r = await fetch('https://api.zadarma.com/v1/zcrm/leads', {
    method: 'POST',
    headers: {
      'Authorization': `${USER_KEY}:${sig}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'NodeScript'
    },
    body: qs
  })
  console.log('Result:', JSON.stringify(await r.json(), null, 2))

  console.log('\n=== TEST: labels via localhost route ===')
  const r3 = await fetch('http://localhost:3000/api/zadarma-push', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test Label School Local',
      email: 'test-label-local@example.com',
      phone: '+380991000070',
      lead_type: 'company',
      message: 'Testing school label via localhost.',
    })
  })
  console.log('Result:', JSON.stringify(await r3.json(), null, 2))
}

run().catch(console.error)