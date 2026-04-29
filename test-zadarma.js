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

// GET request to Zadarma API
async function getZadarma(method, params = {}) {
  const qs = buildParamString(params)
  const sig = sign(method, qs, SECRET)
  const url = `https://api.zadarma.com${method}${qs ? '?' + qs : ''}`
  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Authorization': `${USER_KEY}:${sig}`, 'User-Agent': 'NodeScript' }
  })
  return res.json()
}

// POST to localhost route (requires yarn dev running)
async function postLocalRoute(data) {
  const res = await fetch('http://localhost:3000/api/zadarma-push', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return res.json()
}

async function run() {

  // ════════════════════════════════════════════════════════════
  // SECTION 1: HEALTH CHECKS
  // ════════════════════════════════════════════════════════════

  console.log('\n=== HEALTH: Balance ===')
  const balance = await getZadarma('/v1/info/balance/')
  console.log('  Result:', JSON.stringify(balance))

  // ════════════════════════════════════════════════════════════
  // SECTION 2: ROUTE TESTS — full pipeline via localhost
  // Requires: yarn dev running on port 3000
  // Use fresh phone numbers each run (+380993XXX series)
  // ════════════════════════════════════════════════════════════

  // Test A: Teacher + WhatsApp + comment + Ukraine
  console.log('\n=== ROUTE A: Teacher + WhatsApp + comment ===')
  const rA = await postLocalRoute({
    name: 'Final Teacher Test',
    email: 'final-teacher@example.com',
    phone: '+380993001001',
    lead_type: 'person',
    messenger_type: 'whatsapp',
    messenger_handle: '+380993001001',
    country: 'UA',
    website: null,
    message: 'This is my final test message.',
    utm_source: 'direct',
    utm_medium: 'none',
    utm_campaign: 'none',
    utm_content: 'none',
    utm_term: 'none',
  })
  console.log('  Result:', JSON.stringify(rA))

  // Test B: School + Facebook source tag + Telegram
  console.log('\n=== ROUTE B: School + Facebook source tag + Telegram ===')
  const rB = await postLocalRoute({
    name: 'Final School FB Test',
    email: 'final-school-fb@example.com',
    phone: '+380993001002',
    lead_type: 'company',
    messenger_type: 'telegram',
    messenger_handle: '@finalschooltest',
    country: 'GB',
    website: 'https://testschool.com',
    message: 'Interested in school subscription.',
    utm_source: 'facebook',
    utm_medium: 'paid_social',
    utm_campaign: 'spring_2026',
    utm_content: 'none',
    utm_term: 'none',
  })
  console.log('  Result:', JSON.stringify(rB))

  // Test C: Teacher + Instagram custom property + Instagram source tag
  console.log('\n=== ROUTE C: Teacher + Instagram messenger + Instagram source tag ===')
  const rC = await postLocalRoute({
    name: 'Final Instagram Test',
    email: 'final-instagram@example.com',
    phone: '+380993001003',
    lead_type: 'person',
    messenger_type: 'instagram',
    messenger_handle: '@final_ig_test',
    country: 'DE',
    website: null,
    message: null,
    utm_source: 'instagram',
    utm_medium: 'paid_social',
    utm_campaign: 'ig_spring_2026',
    utm_content: 'none',
    utm_term: 'none',
  })
  console.log('  Result:', JSON.stringify(rC))

  // Test D: Google Ads source tag
  console.log('\n=== ROUTE D: Teacher + Google Ads source tag ===')
  const rD = await postLocalRoute({
    name: 'Final Google Test',
    email: 'final-google@example.com',
    phone: '+380993001004',
    lead_type: 'person',
    utm_source: 'google',
    utm_medium: 'cpc',
    utm_campaign: 'teachers_search',
    utm_content: 'none',
    utm_term: 'none',
  })
  console.log('  Result:', JSON.stringify(rD))

  // Test E: DUPLICATE — same phone as Test A
  console.log('\n=== ROUTE E: DUPLICATE — same phone as Test A ===')
  const rE = await postLocalRoute({
    name: 'Duplicate Submitter',
    email: 'duplicate@example.com',
    phone: '+380993001001', // same as Test A
    lead_type: 'person',
    message: 'Re-submitting because nobody called me back.',
    utm_source: 'direct',
    utm_medium: 'none',
    utm_campaign: 'none',
    utm_content: 'none',
    utm_term: 'none',
  })
  console.log('  Result:', JSON.stringify(rE))
  if (rE.duplicate) {
    console.log('  ✅ Duplicate correctly detected')
    if (rE.zadarma_lead_id) {
      console.log('  ✅ Existing lead ID found:', rE.zadarma_lead_id)
    } else {
      console.log('  ⚠️  Lead ID not found in search (may be in uncategorized bucket)')
    }
  }

  // Test F: All null optional fields
  console.log('\n=== ROUTE F: Minimal — only required fields ===')
  const rF = await postLocalRoute({
    name: 'Final Minimal Test',
    email: 'final-minimal@example.com',
    phone: '+380993001005',
    lead_type: null,
    messenger_type: null,
    messenger_handle: null,
    country: null,
    website: null,
    message: null,
    utm_source: 'direct',
    utm_medium: 'none',
    utm_campaign: 'none',
    utm_content: 'none',
    utm_term: 'none',
  })
  console.log('  Result:', JSON.stringify(rF))

  console.log('\n=== SUMMARY ===')
  const results = { A: rA, B: rB, C: rC, D: rD, E: rE, F: rF }
  for (const [key, val] of Object.entries(results)) {
    const ok = val.success || val.duplicate
    const id = val.zadarma_lead_id || (val.duplicate ? '(duplicate)' : '—')
    console.log(`  Test ${key}: ${ok ? '✅' : '❌'} ${id}`)
  }

  console.log('\ndone.')
}

run().catch(console.error)
