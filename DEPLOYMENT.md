# Deployment Playbook for the Chatbot

Shipping the portfolio with a live chatbot requires two priorities:

1. **Keep secrets off the client.** Never ship the Groq API key (or any provider key) inside a readable file such as `creds.js`.
2. **Provide a secure runtime** that the browser can call without exposing credentials.

The sections below outline a production-ready approach and alternative fallbacks.

---

## 1. Recommended Architecture

| Layer | Responsibility | Where to host |
| --- | --- | --- |
| Static front-end | Portfolio HTML/CSS/JS bundle | Netlify, GitHub Pages, Vercel static, Cloudflare Pages, S3 + CloudFront |
| Secure proxy | Receives chatbot prompts, signs Groq requests with the secret key, returns Groq responses | Vercel/Netlify serverless, Cloudflare Workers, Fly.io, Render, your own Node server |
| Groq API | Large language model | Groq Cloud |

**Flow:** Browser → `CHATBOT_PROXY_URL` → proxy (injects `GROQ_API_KEY`) → Groq → proxy → Browser.

### Why this matters
- The generated `creds.js` is served to the browser. If it contains an API key, everyone gets the key.
- A proxy keeps the key server-side, enforces rate limits, and lets you instrument logging/abuse detection.

---

## 2. Implementing the Secure Proxy

Below are two drop-in templates. Pick the platform you already use, paste the code, and set the environment variable `GROQ_API_KEY` in that platform's dashboard.

### Option A — Vercel Function (`api/groq-proxy.js`)
```javascript
export default async function handler(request, response) {
  if (request.method === 'OPTIONS') {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return response.status(204).end();
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const chunks = [];
    for await (const chunk of request) {
      chunks.push(chunk);
    }
    const payload = chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {};
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: payload.model ?? 'llama-3.1-8b-instant',
        messages: payload.messages,
        max_tokens: payload.max_tokens ?? 700,
        temperature: payload.temperature ?? 0.7,
        top_p: payload.top_p ?? 0.9
      })
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      return response.status(groqResponse.status).json({ error: errorText });
    }

    const data = await groqResponse.json();
    response.setHeader('Access-Control-Allow-Origin', '*');
    return response.status(200).json(data);
  } catch (error) {
    console.error('[groq-proxy] Failure:', error);
    return response.status(500).json({ error: 'Proxy failed to contact Groq.' });
  }
}
```

Deploy steps:
1. Create a Vercel project pointing to this repo (or a separate proxy repo).
2. Add the file above at `api/groq-proxy.js`.
3. Set `GROQ_API_KEY` in **Project Settings → Environment Variables**.
4. Deploy (Vercel auto-builds on push).
5. Note the deployed endpoint, e.g. `https://your-app.vercel.app/api/groq-proxy`.

### Option B — Netlify Function (`netlify/functions/groq-proxy.js`)
```javascript
export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const payload = JSON.parse(event.body ?? '{}');
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: payload.model ?? 'llama-3.1-8b-instant',
        messages: payload.messages,
        max_tokens: payload.max_tokens ?? 700,
        temperature: payload.temperature ?? 0.7,
        top_p: payload.top_p ?? 0.9
      })
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      return { statusCode: groqResponse.status, body: JSON.stringify({ error: errorText }) };
    }

    const data = await groqResponse.json();
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('[groq-proxy] Failure:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Proxy failed to contact Groq.' })
    };
  }
};
```

Deploy steps:
1. Enable Netlify Functions (add `netlify.toml` pointing `functions = "netlify/functions"`).
2. Place the file above at `netlify/functions/groq-proxy.js`.
3. Set the `GROQ_API_KEY` environment variable in **Netlify → Site Settings → Build & Deploy → Environment**.
4. Deploy. Netlify exposes the function at `/.netlify/functions/groq-proxy`.

> **Other platforms** (Cloudflare Workers, Fly.io, Render, AWS Lambda) can use the same logic: accept POST, call Groq with the server-side key, return JSON.

---

## 3. Wiring the Front-End

1. Add the proxy URL to `.env` (or set it directly in your build pipeline):
   ```bash
   CHATBOT_PROXY_URL=https://your-domain.com/api/groq-proxy
   GROQ_MODEL=llama-3.1-8b-instant
   ```
   Leave `GROQ_API_KEY` empty—only the proxy needs it.
  *Tip:* The frontend will also accept `/api/groq-proxy` or `my-proxy.example.com/api/groq-proxy`; it automatically normalises relative paths and hostnames without a scheme.
2. Run `npm run generate:creds` to refresh `creds.js` with the proxy URL.
3. Deploy the static site. The chatbot now sends requests to the proxy and never sees the API key.

### Build pipelines
- **Vercel / Netlify / Cloudflare Pages**: Add an install + build step (e.g. `npm install` then `npm run generate:creds`). Because the command outputs `creds.js`, ensure that file is included in the build output.
- **GitHub Pages / S3**: Run the command locally before pushing the compiled assets.

---

## 4. Hardening Tips

- **Rate limiting**: Add simple quota checks inside the proxy (per IP, per token) to avoid abuse.
- **Logging**: Log prompt metadata (without personal data) to monitor usage and catch spikes.
- **Error handling**: The front-end already falls back to canned answers if the proxy fails; keep that behaviour when extending the proxy.
- **CORS**: The sample code sets `Access-Control-Allow-Origin: *`. Lock this down to your production domain once DNS is finalised.

---

## 5. Contingency Plan (No Proxy)

If you cannot deploy a proxy yet:
- Temporarily set `LLM_CONFIG.USE_LLM = false` in `chatbot.js` (or leave the API key blank). The chatbot will rely on the curated fallback responses.
- Re-enable live LLM responses once a proxy is available.

---

## 6. Quick Checklist Before Launch

- [ ] Proxy deployed with valid `GROQ_API_KEY` (server-side only).
- [ ] `CHATBOT_PROXY_URL` set in production environment and `creds.js` regenerated.
- [ ] Front-end build uploaded with the latest `creds.js` (no secrets inside).
- [ ] CORS allows the production domain.
- [ ] Optional: rate limiting + basic logging active on the proxy.

With this architecture you can safely ship the chatbot, keep compliance reviewers happy, and still enjoy real-time Groq answers on the live portfolio. Happy launching!
