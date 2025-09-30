#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import url from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const envPath = path.join(projectRoot, '.env');

dotenv.config({ path: envPath });

const config = {
  GROQ_API_KEY: process.env.GROQ_API_KEY || '',
  GROQ_API_URL: process.env.GROQ_API_URL || 'https://api.groq.com/openai/v1/chat/completions',
  GROQ_MODEL: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
  CHATBOT_PROXY_URL: process.env.CHATBOT_PROXY_URL || ''
};

const output = `window.__CHATBOT_CONFIG__ = ${JSON.stringify(config, null, 2)};\n`;

const destination = path.join(projectRoot, 'creds.js');

fs.writeFileSync(destination, output, { encoding: 'utf8' });

console.log('✅ creds.js generated successfully.');
