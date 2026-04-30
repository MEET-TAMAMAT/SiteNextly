// test-local.mjs
const res = await fetch('http://localhost:3000/api/zadarma-push', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Local Test Teacher',
    email: 'localtest@example.com',
    phone: null,
    lead_type: 'person',       // ← change to 'company' to test School
    country: 'UA',
    website: null,
    message: 'Local label test',
    messenger_type: null,
    messenger_handle: null,
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    utm_content: null,
    utm_term: null,
  }),
})

const data = await res.json()
console.log('Response:', JSON.stringify(data, null, 2))