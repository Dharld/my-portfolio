/**
 * Reading and parsing the Google Doc that backs the blog.
 *
 * Shared by the JSON API and the server-rendered page. Named with a leading
 * underscore so Vercel treats it as a module, not a route.
 *
 * Write in the doc, the site follows. Each Heading 1 starts a new post; the
 * line under it is read as the date if it looks like one. A post whose title
 * ends with [draft] is skipped, so unfinished writing can live in the same doc.
 *
 * Fetching uses the doc's plain HTML export, which needs link sharing set to
 * "Anyone with the link · Viewer". If you would rather keep the doc private,
 * set GOOGLE_SERVICE_ACCOUNT_JSON and this falls back to the Docs API — see
 * fetchViaServiceAccount below.
 */

export const DOC_ID = process.env.BLOG_DOC_ID || '1ZrfOCDgMxeYIR4HM6UKhIkYd6nLGaggImcnZDb6zzHo';
const EXPORT_URL = (id) => `https://docs.google.com/document/d/${id}/export?format=html`;

// ── Fetching ────────────────────────────────────────────────────────────────

export async function fetchDocHtml(docId) {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    return fetchViaServiceAccount(docId);
  }

  const response = await fetch(EXPORT_URL(docId), { redirect: 'follow' });

  // Google answers 401 with a sign-in page rather than an error body, so the
  // status is the only honest signal here.
  if (response.status === 401 || response.status === 403) {
    const err = new Error('The Google Doc is not readable without signing in.');
    err.status = 502;
    err.hint =
      'Open the doc → Share → General access → "Anyone with the link" as Viewer. ' +
      'The blog only reads it; nobody can edit through this link.';
    throw err;
  }
  if (!response.ok) {
    const err = new Error(`Google returned ${response.status} for the doc export.`);
    err.status = 502;
    throw err;
  }

  const body = await response.text();
  if (!body.includes('</body>')) {
    const err = new Error('Google returned a page that is not the document export.');
    err.status = 502;
    err.hint = 'This usually means the doc is still private.';
    throw err;
  }
  return body;
}

/**
 * Keeps the doc private at the cost of a GCP service account.
 *
 * Create one, share the doc with its client_email as Viewer, and put the whole
 * JSON key in GOOGLE_SERVICE_ACCOUNT_JSON. Exporting through Drive returns the
 * same HTML the public path uses, so nothing downstream changes.
 */
async function fetchViaServiceAccount(docId) {
  const creds = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  const token = await googleAccessToken(creds, 'https://www.googleapis.com/auth/drive.readonly');
  const url = `https://www.googleapis.com/drive/v3/files/${docId}/export?mimeType=text/html`;
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });

  if (!response.ok) {
    const err = new Error(`Drive export failed (${response.status}).`);
    err.status = 502;
    err.hint = `Share the doc with ${creds.client_email} as Viewer.`;
    throw err;
  }
  return response.text();
}

/** Signs a JWT with the service account key and trades it for an access token. */
async function googleAccessToken(creds, scope) {
  const { createSign } = await import('node:crypto');
  const now = Math.floor(Date.now() / 1000);
  const b64 = (obj) =>
    Buffer.from(JSON.stringify(obj)).toString('base64url');

  const unsigned =
    b64({ alg: 'RS256', typ: 'JWT' }) +
    '.' +
    b64({
      iss: creds.client_email,
      scope,
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    });

  const signer = createSign('RSA-SHA256');
  signer.update(unsigned);
  const jwt = `${unsigned}.${signer.sign(creds.private_key, 'base64url')}`;

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });
  if (!response.ok) {
    const err = new Error('Could not get a Google access token.');
    err.status = 500;
    throw err;
  }
  return (await response.json()).access_token;
}

// ── Parsing ─────────────────────────────────────────────────────────────────

/**
 * Google's export expresses bold and italic as CSS classes, not tags, so the
 * stylesheet has to be read before the markup means anything.
 */
function styleClassMap(html) {
  const styles = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i)?.[1] || '';
  const bold = new Set();
  const italic = new Set();

  for (const rule of styles.matchAll(/\.([a-z0-9_-]+)\s*\{([^}]*)\}/gi)) {
    const [, name, body] = rule;
    if (/font-weight\s*:\s*(700|bold)/i.test(body)) bold.add(name);
    if (/font-style\s*:\s*italic/i.test(body)) italic.add(name);
  }
  return { bold, italic };
}

/** Google wraps every outbound link in a redirect; readers deserve the real one. */
function unwrapGoogleLink(href) {
  const decoded = href.replace(/&amp;/g, '&');
  const match = decoded.match(/[?&]q=([^&]+)/);
  if (decoded.includes('google.com/url') && match) {
    try {
      return decodeURIComponent(match[1]);
    } catch {
      return match[1];
    }
  }
  return decoded;
}

function cleanInline(fragment, classes) {
  let out = fragment;

  // Spans carry the formatting; turn the meaningful ones into real tags and
  // drop the rest rather than shipping Google's class soup to the browser.
  out = out.replace(/<span class="([^"]*)"[^>]*>([\s\S]*?)<\/span>/gi, (_, cls, inner) => {
    const names = cls.split(/\s+/);
    const isBold = names.some((n) => classes.bold.has(n));
    const isItalic = names.some((n) => classes.italic.has(n));
    let text = inner;
    if (isBold) text = `<strong>${text}</strong>`;
    if (isItalic) text = `<em>${text}</em>`;
    return text;
  });
  out = out.replace(/<\/?span[^>]*>/gi, '');

  out = out.replace(/<a([^>]*)href="([^"]*)"([^>]*)>/gi, (_, pre, href) => {
    const real = unwrapGoogleLink(href);
    const external = /^https?:\/\//i.test(real);
    return `<a href="${real}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>`;
  });

  out = out.replace(/<img([^>]*?)src="([^"]*)"([^>]*?)>/gi, (_, __, src) => {
    return `<img src="${src}" loading="lazy" alt="">`;
  });

  // Everything else keeps its tag but loses Google's attributes.
  out = out.replace(/<(\/?)(p|h[1-6]|ul|ol|li|strong|em|b|i|blockquote|br|hr|code|pre)[^>]*>/gi,
    (_, slash, tag) => `<${slash}${tag.toLowerCase()}>`);

  return out.replace(/<p>\s*<\/p>/gi, '').trim();
}

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function stripTags(html) {
  return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
}

/** A short, honest preview: the first real sentence or two, never mid-word. */
function excerpt(bodyHtml, limit = 180) {
  const text = stripTags(bodyHtml).replace(/\s+/g, ' ').trim();
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit);
  return cut.slice(0, cut.lastIndexOf(' ')) + '…';
}

const DATE_PATTERNS = [
  /^\d{4}-\d{2}-\d{2}$/,
  /^\d{1,2}\/\d{1,2}\/\d{4}$/,
  /^[A-Z][a-z]+ \d{1,2},? \d{4}$/,
  /^\d{1,2} [A-Z][a-z]+ \d{4}$/,
];

function looksLikeDate(text) {
  const t = text.trim();
  return DATE_PATTERNS.some((re) => re.test(t));
}

export function parsePosts(html) {
  const classes = styleClassMap(html);
  const body = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] || html;

  // Split on Heading 1: each one begins a post.
  const parts = body.split(/(?=<h1[\s>])/i).filter((p) => /<h1[\s>]/i.test(p));

  const posts = [];
  for (const part of parts) {
    const titleRaw = part.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || '';
    const title = stripTags(cleanInline(titleRaw, classes));
    if (!title) continue;

    // A draft stays in the doc but off the site.
    if (/\[draft\]\s*$/i.test(title)) continue;

    let rest = part.replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, '');

    // If the first paragraph is a date, it belongs to the post, not the body.
    let date = null;
    const firstP = rest.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    if (firstP && looksLikeDate(stripTags(firstP[1]))) {
      date = stripTags(firstP[1]).trim();
      rest = rest.replace(firstP[0], '');
    }

    // Google demotes real headings inside a post; keep them below the title.
    const contentHtml = cleanInline(rest, classes)
      .replace(/<h2>/gi, '<h3>')
      .replace(/<\/h2>/gi, '</h3>');

    if (!stripTags(contentHtml)) continue;

    posts.push({
      title,
      slug: slugify(title),
      date,
      excerpt: excerpt(contentHtml),
      html: contentHtml,
      readingMinutes: Math.max(1, Math.round(stripTags(contentHtml).split(/\s+/).length / 220)),
    });
  }

  return posts;
}

/** Tags the site is willing to render from the document. */
const ALLOWED = new Set([
  'p','h3','h4','ul','ol','li','strong','em','b','i','a','img','br','hr',
  'blockquote','code','pre','table','thead','tbody','tr','td','th',
]);

/**
 * Last line of defence before document HTML reaches a page.
 *
 * The parser already rewrites the tags it knows about, but a document can
 * contain anything; drop unknown tags (keeping their text) and any event
 * handler that survived.
 */
export function sanitize(html) {
  return html
    .replace(/<\/?([a-z0-9]+)([^>]*)>/gi, (tag, name, attrs) => {
      if (!ALLOWED.has(name.toLowerCase())) return '';
      const safe = attrs.replace(/\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');
      return tag.startsWith('</') ? `</${name.toLowerCase()}>` : `<${name.toLowerCase()}${safe}>`;
    })
    .replace(/javascript:/gi, '');
}

/** Reads the doc and returns finished posts. */
export async function loadPosts() {
  const html = await fetchDocHtml(DOC_ID);
  return parsePosts(html).map((p) => ({ ...p, html: sanitize(p.html) }));
}
