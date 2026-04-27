const crypto = require('crypto')

const USER_KEY = '4834f629119e881ff982'
const SECRET = '821fadcf62c76e7c4440'


function sign(method, params, secret) {
  const sortedKeys = Object.keys(params).sort()
  const queryString = sortedKeys.map(k => `${k}=${params[k]}`).join('&')
  const md5 = crypto.createHash('md5').update(queryString).digest('hex')
  const toSign = method + queryString + md5
  return {
    signature: crypto.createHmac('sha1', secret).update(toSign).digest('base64'),
    queryString
  }
}

async function test(label, method, params, url) {
  const { signature } = sign(method, params, SECRET)
  const sortedKeys = Object.keys(params).sort()
  const body = sortedKeys.map(k => `${k}=${encodeURIComponent(params[k])}`).join('&')
  console.log(`\n--- ${label} ---`)
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `${USER_KEY}:${signature}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  })
  const data = await res.json()
  console.log('Status:', res.status)
  console.log('Result:', JSON.stringify(data, null, 2))
}

async function run() {
  // Test 1: Account balance - simplest possible API call, no CRM needed
  const balanceMethod = '/v1/info/balance'
  const balanceSig = sign(balanceMethod, {}, SECRET)
  console.log('\n--- BALANCE (no params) ---')
  const r = await fetch('https://api.zadarma.com/v1/info/balance', {
    method: 'GET',
    headers: { 'Authorization': `${USER_KEY}:${balanceSig.signature}` }
  })
  console.log('Status:', r.status)
  console.log('Result:', JSON.stringify(await r.json(), null, 2))

  // Test 2: CRM leads list - GET request, no params needed
  const listMethod = '/v1/zcrm/leads'
  const listSig = sign(listMethod, {}, SECRET)
  console.log('\n--- GET CRM LEADS LIST ---')
  const r2 = await fetch('https://api.zadarma.com/v1/zcrm/leads', {
    method: 'GET',
    headers: { 'Authorization': `${USER_KEY}:${listSig.signature}` }
  })
  console.log('Status:', r2.status)
  console.log('Result:', JSON.stringify(await r2.json(), null, 2))
}

run().catch(console.error)