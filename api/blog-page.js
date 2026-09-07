/**
 * The writing page, rendered on the server.
 *
 * Posts are HTML in the response body rather than fetched by the browser, so
 * crawlers, link previews and readers without JavaScript all see the articles.
 *
 * The page shows the articles and nothing else — no source, no status, no
 * controls. Where the words come from is not the reader's concern.
 */

import { loadPosts } from './_doc.js';

const SITE_NAME = 'Yann Djoumessi';

const escapeHtml = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export default async function handler(req, res) {
  const wantsFresh = req.query?.refresh === '1';

  // Taken from the request rather than hardcoded: this site is reachable on
  // its own domain and on Vercel preview URLs, and a canonical pointing at
  // the wrong one is worse than none.
  const host = req.headers['x-forwarded-host'] || req.headers.host || '';
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const origin = host ? `${proto}://${host}` : '';

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader(
    'Cache-Control',
    wantsFresh ? 'no-store' : 'public, s-maxage=60, stale-while-revalidate=600',
  );

  let posts = [];
  try {
    posts = await loadPosts();
  } catch (error) {
    // A reader gets a quiet empty page; the detail belongs in the logs.
    console.error('[blog] ', error.message, error.hint || '');
  }

  return res.status(200).send(page({ posts, origin }));
}

// ── Rendering ───────────────────────────────────────────────────────────────

function article(post) {
  const meta = [
    post.date ? `<span>${escapeHtml(post.date)}</span><span aria-hidden="true">·</span>` : '',
    `<span>${post.readingMinutes} min read</span>`,
  ].join('');

  return `
        <article class="post" id="${escapeHtml(post.slug)}">
          <div class="post__meta">${meta}</div>
          <h2 class="post__title">${escapeHtml(post.title)}</h2>
          <div class="post__body">${post.html}</div>
        </article>`;
}

function page({ posts, origin }) {
  const description = posts[0] ? posts[0].excerpt : `Writing by ${SITE_NAME}.`;

  // Structured data so search results and link previews carry real titles.
  const jsonLd = posts.length
    ? `<script type="application/ld+json">${JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: `Writing — ${SITE_NAME}`,
        blogPost: posts.map((p) => ({
          '@type': 'BlogPosting',
          headline: p.title,
          ...(p.date ? { datePublished: p.date } : {}),
          description: p.excerpt,
          author: { '@type': 'Person', name: SITE_NAME },
        })),
      }).replace(/</g, '\\u003c')}</script>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Writing — ${SITE_NAME}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    ${origin ? `<link rel="canonical" href="${origin}/blog" />` : ''}
    ${origin ? `<meta property="og:url" content="${origin}/blog" />` : ''}

    <meta property="og:type" content="website" />
    <meta property="og:title" content="Writing — ${SITE_NAME}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Writing — ${SITE_NAME}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />

    <link rel="icon" type="image/png" href="/assets/img/favicon-32x32.png" />
    <link rel="stylesheet" href="/assets/css/style.css" />
    ${jsonLd}
    <style>
      .blog { min-height: 100vh; padding: 4rem 0 6rem; }
      .blog__container { max-width: 760px; margin: 0 auto; padding: 0 1.5rem; }

      .blog__back {
        display: inline-flex; align-items: center; gap: 0.4rem;
        color: var(--text-color); font-size: var(--small-font-size);
        margin-bottom: 2.5rem; transition: color 0.3s;
      }
      .blog__back:hover { color: var(--skin-color); }

      .blog__title {
        font-size: var(--biggest-font-size); color: var(--title-color);
        font-weight: var(--font-bold); line-height: 1.1; margin-bottom: 0.75rem;
      }
      .blog__subtitle {
        color: var(--text-color); font-size: var(--normal-font-size);
        max-width: 52ch; margin-bottom: 1.75rem;
      }

        80%, 100% { transform: scale(2.6); opacity: 0; }
      }

      .posts { display: flex; flex-direction: column; gap: 2.5rem; }
      .post { border-bottom: 1px solid rgba(255,255,255,0.07); padding-bottom: 2.5rem; }
      .post:last-child { border-bottom: none; }
      .post__meta {
        display: flex; gap: 0.75rem; align-items: center;
        font-size: var(--smaller-font-size); color: var(--text-color);
        opacity: 0.75; margin-bottom: 0.55rem;
      }
      .post__title {
        font-size: var(--h1-font-size); color: var(--title-color);
        font-weight: var(--font-bold); line-height: 1.2; margin-bottom: 0.9rem;
      }
      .post__body { color: var(--text-color); line-height: 1.75; }
      .post__body p { margin-bottom: 1.1rem; }
      .post__body h3, .post__body h4 {
        color: var(--title-color); font-size: var(--h3-font-size);
        font-weight: var(--font-medium); margin: 2rem 0 0.75rem;
      }
      .post__body ul, .post__body ol { margin: 0 0 1.1rem 1.25rem; }
      .post__body li { margin-bottom: 0.5rem; }
      .post__body a { color: var(--skin-color); text-underline-offset: 2px; }
      .post__body img { max-width: 100%; height: auto; border-radius: 0.5rem; margin: 1.25rem 0; }
      .post__body blockquote {
        border-left: 2px solid var(--skin-color); padding-left: 1rem;
        margin: 0 0 1.1rem; opacity: 0.9;
      }
      .post__body table { width: 100%; border-collapse: collapse; margin-bottom: 1.1rem; }
      .post__body td, .post__body th {
        border: 1px solid rgba(255,255,255,0.1); padding: 0.5rem 0.7rem; text-align: left;
      }

      @media screen and (max-width: 576px) {
        .blog { padding: 2.5rem 0 4rem; }
        }
    </style>
  </head>

  <body>
    <main class="blog">
      <div class="blog__container">
        <a href="/" class="blog__back">← Back to portfolio</a>

        <h1 class="blog__title">Writing</h1>

        ${
          posts.length
            ? `<div class="posts">${posts.map(article).join('')}</div>`
            : `<p class="empty">Nothing published yet.</p>`
        }
      </div>
    </main>
  </body>
</html>`;
}
