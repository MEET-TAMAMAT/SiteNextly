import crypto from 'crypto'

const userKey = '4834f629119e881ff982'
const secret  = '821fadcf62c76e7c4440'

function phpEncode(str) {
  return encodeURIComponent(String(str))
    .replace(/%20/g, '+')
    .replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase())
}

function buildParamString(params) {
  return Object.keys(params).sort()
    .map(k => `${phpEncode(k)}=${phpEncode(params[k])}`).join('&')
}

function sign(method, paramString) {
  const md5Hex = crypto.createHash('md5').update(paramString).digest('hex')
  const hmacHex = crypto.createHmac('sha1', secret).update(method + paramString + md5Hex).digest('hex')
  return Buffer.from(hmacHex).toString('base64')
}

async function createLead(extraParams, testName) {
  const method = '/v1/zcrm/leads'
  const params = {
    'lead[name]':        testName,
    'lead[lead_source]': 'form',
    ...extraParams,
  }
  const ps  = buildParamString(params)
  const sig = sign(method, ps)
  const res = await fetch(`https://api.zadarma.com${method}`, {
    method: 'POST',
    headers: {
      'Authorization': `${userKey}:${sig}`,
      'Content-Type':  'application/x-www-form-urlencoded',
      'User-Agent':    'NodeScript',
    },
    body: ps,
  })
  const data = await res.json()
  const firstParam = Object.keys(extraParams)[0]
  console.log(`\n[${firstParam}]`)
  console.log(`  Lead: ${testName}`)
  console.log(`  ID  : ${data?.data?.id ?? 'FAILED'}`)
  console.log(`  Res : ${JSON.stringify(data)}`)
}

// Teamsale frontend sends labels as full objects with id, label, and count.
// Testing Teacher label (id=349392) using the exact format captured from Network tab.

// Test 1: Full object format — what Teamsale's own frontend sends on update
await createLead({
  'lead[labels][0][id]':    '349392',
  'lead[labels][0][label]': 'Teacher',
  'lead[labels][0][count]': '0',
}, 'TEST full-object Teacher — DELETE ME')

// Test 2: Full object format with School label
await createLead({
  'lead[labels][0][id]':    '337789',
  'lead[labels][0][label]': 'School',
  'lead[labels][0][count]': '36',
}, 'TEST full-object School — DELETE ME')

// Test 3: id-only inside the object (in case label+count aren't needed)
await createLead({
  'lead[labels][0][id]': '349392',
}, 'TEST id-only inside object Teacher — DELETE ME')

console.log('\nDone. Check each lead in Teamsale for the Teacher/School label:')
console.log('https://tam.teamsale.com/leads/')
