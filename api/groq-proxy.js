export default async function handler(req, res) {
  const allowOrigin = process.env.CORS_ALLOW_ORIGIN || '*';
  res.setHeader('Access-Control-Allow-Origin', allowOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: 'GROQ_API_KEY is not configured on the server.' });
  }

  let payload = {};
  try {
    payload = await readJsonBody(req);
  } catch (error) {
    console.error('[groq-proxy] Failed to parse request body', error);
    return res.status(400).json({ error: 'Invalid JSON payload.' });
  }

  const {
    model = 'llama-3.1-8b-instant',
    messages,
    max_tokens = 700,
    temperature = 0.7,
    top_p = 0.9
  } = payload || {};

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Payload must include a non-empty "messages" array.' });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens,
        temperature,
        top_p
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[groq-proxy] Groq API error', response.status, errorText);
      return res.status(response.status).json({ error: 'Groq API request failed.', details: errorText });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('[groq-proxy] Unexpected failure', error);
    return res.status(500).json({ error: 'Proxy failed to contact Groq.' });
  }
}

async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  if (chunks.length === 0) {
    return {};
  }

  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}
