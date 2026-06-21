const GROQ_API = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama3-8b-8192'

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  const apiKey = process.env.bhram007GROQkeyformodelsinchat
  if (!apiKey) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'GROQ_API_KEY not configured' }) }
  }

  let body
  try {
    body = JSON.parse(event.body)
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) }
  }

  const message = (body.message || '').trim()
  if (!message) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Message is required' }) }
  }

  try {
    const res = await fetch(GROQ_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: 'You are a helpful, friendly assistant. Keep responses concise and natural.' },
          { role: 'user', content: message },
        ],
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      return { statusCode: res.status, headers, body: JSON.stringify({ error: data.error?.message || 'API error' }) }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ reply: data.choices[0].message.content }),
    }
  } catch (err) {
    return { statusCode: 502, headers, body: JSON.stringify({ error: 'Upstream request failed' }) }
  }
}
