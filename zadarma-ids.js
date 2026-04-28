const crypto = require('crypto')

const USER_KEY = '4834f629119e881ff982'
const SECRET = '821fadcf62c76e7c4440'

function sign(method, paramString, secret) {
  const md5Hex = crypto.createHash('md5').update(paramString).digest('hex')
  const toSign = method + paramString + md5Hex
  const hmacHex = crypto.createHmac('sha1', secret).update(toSign).digest('hex')
  return Buffer.from(hmacHex).toString('base64')
}

async function get(method) {
  const sig = sign(method, '', SECRET)
  const res = await fetch(`https://api.zadarma.com${method}`, {
    method: 'GET',
    headers: { 'Authorization': `${USER_KEY}:${sig}`, 'User-Agent': 'NodeScript' }
  })
  return res.json()
}

async function run() {
  console.log('\n========================================')
  console.log('ZADARMA IDs REFERENCE')
  console.log('========================================')

  // 1. Custom Properties
  console.log('\n--- CUSTOM PROPERTIES ---')
  const cp = await get('/v1/zcrm/customers/custom-properties')
  if (cp.data?.length) {
    cp.data.forEach(p => console.log(`  ID: ${p.id} | Name: ${p.name} | Type: ${p.type}`))
  } else {
    console.log('  None found:', JSON.stringify(cp))
  }

  // 2. Labels (Tags)
  console.log('\n--- LABELS / TAGS ---')
  const labels = await get('/v1/zcrm/customers/labels')
  if (labels.data?.length) {
    labels.data.forEach(l => console.log(`  ID: ${l.id} | Name: ${l.name}`))
  } else {
    console.log('  None found:', JSON.stringify(labels))
  }

  // 3. Source Tags
  console.log('\n--- SOURCE TAGS ---')
  const sources = await get('/v1/zcrm/customers/source-tags')
  if (sources.data?.length) {
    sources.data.forEach(s => console.log(`  ID: ${s.id} | Name: ${s.name}`))
  } else {
    console.log('  None found:', JSON.stringify(sources))
  }

  // 4. Pipelines
  console.log('\n--- PIPELINES ---')
  const pipelines = await get('/v1/zcrm/deals/funnels')
  if (pipelines.data?.length) {
    pipelines.data.forEach(p => {
      console.log(`  Pipeline ID: ${p.id} | Name: ${p.name}`)
      if (p.stages?.length) {
        p.stages.forEach(s => console.log(`    Stage ID: ${s.id} | Name: ${s.name}`))
      }
    })
  } else {
    console.log('  None found:', JSON.stringify(pipelines))
  }

  console.log('\n========================================')
}

run().catch(console.error)