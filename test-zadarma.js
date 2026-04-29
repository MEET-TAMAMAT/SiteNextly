const crypto = require('crypto')

const USER_KEY = '4834f629119e881ff982'
const SECRET = '821fadcf62c76e7c4440'

// PHP-compatible URL encoding (spaces → +, brackets encoded)
function phpEncode(str) {
  return encodeURIComponent(String(str))
    .replace(/%20/g, '+')
    .replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase())
    .replace(/%2B/g, '+')
}

// Build sorted, encoded query string from params object
function buildParamString(params) {
  return Object.keys(params)
    .sort()
    .map(k => `${phpEncode(k)}=${phpEncode(params[k])}`)
    .join('&')
}

// Zadarma signing: base64(hex(hmac_sha1(method + paramString + md5(paramString))))
function sign(method, paramString, secret) {
  const md5Hex = crypto.createHash('md5').update(paramString).digest('hex')
  const toSign = method + paramString + md5Hex
  const hmacHex = crypto.createHmac('sha1', secret).update(toSign).digest('hex')
  return Buffer.from(hmacHex).toString('base64')
}

// POST to Zadarma API using our encoder
async function postEncoded(method, params) {
  const qs = buildParamString(params)
  console.log('  Param string:', qs)
  const sig = sign(method, qs, SECRET)
  const res = await fetch('https://api.zadarma.com' + method, {
    method: 'POST',
    headers: {
      'Authorization': `${USER_KEY}:${sig}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'NodeScript'
    },
    body: qs
  })
  return res.json()
}

// GET request to Zadarma API
async function getZadarma(method, params = {}) {
  const qs = buildParamString(params)
  const sig = sign(method, qs, SECRET)
  const url = `https://api.zadarma.com${method}${qs ? '?' + qs : ''}`
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `${USER_KEY}:${sig}`,
      'User-Agent': 'NodeScript'
    }
  })
  return res.json()
}

// POST to localhost route
async function postLocalRoute(data) {
  const res = await fetch('http://localhost:3000/api/zadarma-push', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return res.json()
}

async function run() {
  const method = '/v1/zcrm/leads'

  // ════════════════════════════════════════════════════════════
  // SECTION 1: SOURCE TAG DIAGNOSTIC
  // Isolate which source_tag format Zadarma accepts
  // ════════════════════════════════════════════════════════════

  // Control: no source tag — confirm base still works
  console.log('\n=== SOURCE TAG TEST 0: Control (no source tag) ===')
  const r0 = await postEncoded(method, {
    'lead[name]': 'Test SourceTag Control',
    'lead[lead_source]': 'form',
    'lead[phones][0][phone]': '+380991888001',
    'lead[phones][0][type]': 'work',
  })
  console.log('  Result:', JSON.stringify(r0))

  // Format A: lead[source_tag_id] — current format (known failing)
  console.log('\n=== SOURCE TAG TEST A: lead[source_tag_id] ===')
  const rA = await postEncoded(method, {
    'lead[name]': 'Test SourceTag A',
    'lead[lead_source]': 'form',
    'lead[phones][0][phone]': '+380991888002',
    'lead[phones][0][type]': 'work',
    'lead[source_tag_id]': '120860',
  })
  console.log('  Result:', JSON.stringify(rA))

  // Format B: source_tag_id without lead[] wrapper
  console.log('\n=== SOURCE TAG TEST B: source_tag_id (no lead wrapper) ===')
  const rB = await postEncoded(method, {
    'lead[name]': 'Test SourceTag B',
    'lead[lead_source]': 'form',
    'lead[phones][0][phone]': '+380991888003',
    'lead[phones][0][type]': 'work',
    'source_tag_id': '120860',
  })
  console.log('  Result:', JSON.stringify(rB))

  // Format C: lead[source_tags][] — array append notation
  console.log('\n=== SOURCE TAG TEST C: lead[source_tags][] ===')
  const rC = await postEncoded(method, {
    'lead[name]': 'Test SourceTag C',
    'lead[lead_source]': 'form',
    'lead[phones][0][phone]': '+380991888004',
    'lead[phones][0][type]': 'work',
    'lead[source_tags][]': '120860',
  })
  console.log('  Result:', JSON.stringify(rC))

  // Format D: UTMs only, no source_tag — confirm UTMs work standalone
  console.log('\n=== SOURCE TAG TEST D: UTMs only (no source_tag) ===')
  const rD = await postEncoded(method, {
    'lead[name]': 'Test UTMs Only',
    'lead[lead_source]': 'form',
    'lead[phones][0][phone]': '+380991888005',
    'lead[phones][0][type]': 'work',
    'lead[utms][utm_source]': 'facebook',
    'lead[utms][utm_medium]': 'paid_social',
    'lead[utms][utm_campaign]': 'test_2026',
  })
  console.log('  Result:', JSON.stringify(rD))

  // ════════════════════════════════════════════════════════════
  // SECTION 2: DUPLICATE SEARCH DIAGNOSTIC
  // Zadarma has separate leads and customers endpoints
  // Our current code searches /customers but leads may only
  // appear in /leads endpoint
  // ════════════════════════════════════════════════════════════

  // Search leads endpoint (not customers) by phone
  console.log('\n=== DUPLICATE SEARCH TEST A: GET /v1/zcrm/leads?search=phone ===')
  const ds1 = await getZadarma('/v1/zcrm/leads', { search: '+380991777101' })
  console.log('  Result:', JSON.stringify(ds1))

  // Search leads endpoint by email
  console.log('\n=== DUPLICATE SEARCH TEST B: GET /v1/zcrm/leads?search=email ===')
  const ds2 = await getZadarma('/v1/zcrm/leads', { search: 'test-route-teacher@example.com' })
  console.log('  Result:', JSON.stringify(ds2))

  // Search customers endpoint by phone (previous approach — known to return empty for leads)
  console.log('\n=== DUPLICATE SEARCH TEST C: GET /v1/zcrm/customers?search=phone (previous approach) ===')
  const ds3 = await getZadarma('/v1/zcrm/customers', { search: '+380991777101' })
  console.log('  Result:', JSON.stringify(ds3))

  // ════════════════════════════════════════════════════════════
  // SECTION 3: CUSTOM PROPERTY ISOLATED TEST
  // Test custom property WITHOUT source_tag_id to confirm
  // custom properties work fine on their own
  // ════════════════════════════════════════════════════════════

  console.log('\n=== CUSTOM PROPERTY TEST: Instagram without source_tag ===')
  const cp1 = await postEncoded(method, {
    'lead[name]': 'Test Custom Prop Instagram',
    'lead[lead_source]': 'form',
    'lead[phones][0][phone]': '+380991888006',
    'lead[phones][0][type]': 'work',
    'lead[contacts][0][value]': 'test-cp-ig@example.com',
    'lead[contacts][0][type]': 'email_work',
    'lead[custom_properties][0][id]': '12646',
    'lead[custom_properties][0][value]': '@test_instagram_handle',
  })
  console.log('  Result:', JSON.stringify(cp1))

  console.log('\ndone.')
}

run().catch(console.error)
