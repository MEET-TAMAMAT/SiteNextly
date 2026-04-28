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
  // Test 1: Balance (no params, GET)
  console.log('\n=== BALANCE ===')
  const balanceSig = sign('/v1/info/balance/', '', SECRET)
  const r = await fetch('https://api.zadarma.com/v1/info/balance/', {
    method: 'GET',
    headers: { 'Authorization': `${USER_KEY}:${balanceSig}`, 'User-Agent': 'NodeScript' }
  })
  console.log(JSON.stringify(await r.json()))

  // Test 2: Exact params from Zadarma support example
  console.log('\n=== EXACT ZADARMA EXAMPLE ===')
  const exactParamString = 'lead%5Bname%5D=John+Doe&lead%5Bcountry%5D=US'
  const exactSig = sign('/v1/zcrm/leads', exactParamString, SECRET)
  const r2 = await fetch('https://api.zadarma.com/v1/zcrm/leads', {
    method: 'POST',
    headers: {
      'Authorization': `${USER_KEY}:${exactSig}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'NodeScript'
    },
    body: exactParamString
  })
  console.log(JSON.stringify(await r2.json()))

  // Test 3: Dynamic params
  console.log('\n=== DYNAMIC PARAMS ===')
  const r3 = await callZadarma('/v1/zcrm/leads', {
    'lead[name]': 'Test Node',
    'lead[lead_source]': 'form',
    'lead[phones][0][phone]': '+380935225757',
    'lead[phones][0][type]': 'mobile',
  })
  console.log(JSON.stringify(r3))
}

run().catch(console.error)