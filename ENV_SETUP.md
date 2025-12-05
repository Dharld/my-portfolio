# Environment Setup for Chatbot Secrets

The chatbot now reads its credentials from a generated `creds.js` file so you can keep API keys out of source control.

## Steps

1. Install dependencies (only needed once):
   ```bash
   npm install
   ```
2. Copy the example env file and fill in your private key:
   ```bash
   cp .env.example .env
   # open .env and set GROQ_API_KEY=your_real_key
   ```
3. Generate `creds.js` (this file is git-ignored):
   ```bash
   npm run generate:creds
   ```

Re-run the generate command anytime you change the `.env` file. The resulting `creds.js` defines a global `window.__CHATBOT_CONFIG__` object that the chatbot code consumes at runtime.

> ⚠️ Never commit your `.env` file or the generated `creds.js`. Both are already listed in `.gitignore`.

## Deploying?

Hosting guidance—including how to keep the Groq key out of the browser in production—is documented in [`DEPLOYMENT.md`](./DEPLOYMENT.md). Start there once you're ready to ship the site.
