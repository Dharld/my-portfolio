/**
 * The blog page, rendered on the server.
 *
 * Posts arrive as HTML in the response body rather than being fetched by the
 * browser, so a crawler, a link preview and a reader with JavaScript disabled
 * all see the writing. Each post also gets real metadata — that is what makes
 * a shared link show a title and summary instead of a bare URL.
 */

import { loadPosts, DOC_ID } from './_doc.js';

const DOC_URL = `https://docs.google.com/document/d/${DOC_ID}/edit`;
const SITE_NAME = 'Yann Djoumessi';

const escapeHtml = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export default async function handler(req, res) {
  const wantsFresh = req.query?.refresh === '1';

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader(
    'Cache-Control',
    wantsFresh ? 'no-store' : 'public, s-maxage=60, stale-while-revalidate=600',
  );

  try {
    const posts = await loadPosts();
    return res.status(200).send(page({ posts, fetchedAt: new Date() }));
  } catch (error) {
    console.error('[blog-page] ', error.message);
    return res.status(200).send(page({ posts: [], error, fetchedAt: new Date() }));
  }
}

// ── Rendering ───────────────────────────────────────────────────────────────

function postArticle(post) {
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

function emptyState() {
  return `
        <div class="state">
          <h2>The document is connected — it just has no posts yet</h2>
          <p>Give a line the <b>Heading 1</b> style in the doc and it becomes a post
             title. Write underneath it, and put a date on the line directly below
             the title (<code>2026-09-07</code>) to show a date.</p>
          <p>End a title with <code>[draft]</code> to keep something in the doc but
             off the site.</p>
          <p><a href="${DOC_URL}" target="_blank" rel="noopener">Open the document →</a></p>
        </div>`;
}

function errorState(error) {
  const sharing = /signing in|private/i.test(error.message || '');
  return `
        <div class="state">
          <h2>${escapeHtml(error.message || 'The document could not be read')}</h2>
          ${
            sharing
              ? `<p>The site reads the document anonymously, so it needs link access.
                    Nobody gains the ability to edit:</p>
                 <ol>
                   <li>Open <a href="${DOC_URL}" target="_blank" rel="noopener">the document</a></li>
                   <li><b>Share</b> → <b>General access</b></li>
                   <li>Set <b>Anyone with the link</b>, role <b>Viewer</b></li>
                   <li>Reload this page</li>
                 </ol>`
              : `<p>${escapeHtml(error.hint || 'Try again in a moment.')}</p>`
          }
        </div>`;
}

function page({ posts, error, fetchedAt }) {
  const lead = posts[0];
  const description = lead
    ? lead.excerpt
    : 'Writing by Yann Djoumessi — notes on building TrendSpot, agents, and systems.';

  const status = error
    ? '<b>Not synced</b> — the document could not be read'
    : `Synced from <a class="sync__link" href="${DOC_URL}" target="_blank" rel="noopener">Google Docs</a>` +
      ` · <b>${posts.length}</b> post${posts.length === 1 ? '' : 's'}` +
      ` · read <time datetime="${fetchedAt.toISOString()}" id="sync-time">just now</time>`;

  const body = error
    ? errorState(error)
    : posts.length
      ? `<div class="posts">${posts.map(postArticle).join('')}</div>`
      : emptyState();

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
    <link rel="canonical" href="https://yanndjoumessi.com/blog" />

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

      .sync {
        display: flex; flex-wrap: wrap; align-items: center; gap: 0.65rem 1rem;
        padding: 0.85rem 1.1rem; border: 1px solid rgba(255,255,255,0.08);
        border-radius: 0.6rem; background: var(--box-color); margin-bottom: 3rem;
        font-size: var(--smaller-font-size); color: var(--text-color);
      }
      .sync__dot {
        width: 8px; height: 8px; border-radius: 50%;
        background: var(--skin-color); flex-shrink: 0; position: relative;
      }
      .sync__dot::after {
        content: ""; position: absolute; inset: 0; border-radius: 50%;
        background: var(--skin-color); animation: sync-ping 2s ease-out infinite;
      }
      .sync__dot.is-error, .sync__dot.is-error::after { background: #f2555a; animation: none; }
      @keyframes sync-ping {
        0% { transform: scale(1); opacity: 0.55; }
        80%, 100% { transform: scale(2.6); opacity: 0; }
      }
      @media (prefers-reduced-motion: reduce) { .sync__dot::after { animation: none; opacity: 0; } }

      .sync__text b { color: var(--title-color); font-weight: var(--font-medium); }
      .sync__link { color: var(--skin-color); }
      .sync__actions { margin-left: auto; }
      .sync__btn {
        display: inline-block; background: none;
        border: 1px solid rgba(255,255,255,0.14); color: var(--text-color);
        border-radius: 0.4rem; padding: 0.35rem 0.75rem;
        font-family: var(--body-font); font-size: var(--smaller-font-size);
        cursor: pointer; transition: border-color 0.25s, color 0.25s;
      }
      .sync__btn:hover { border-color: var(--skin-color); color: var(--skin-color); }

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

      .state {
        border: 1px solid rgba(255,255,255,0.08); background: var(--box-color);
        border-radius: 0.6rem; padding: 1.75rem; color: var(--text-color);
      }
      .state h2 { color: var(--title-color); font-size: var(--h3-font-size); margin-bottom: 0.6rem; }
      .state p { margin-bottom: 0.75rem; line-height: 1.7; }
      .state ol { margin: 0 0 0 1.15rem; line-height: 1.9; }
      .state a { color: var(--skin-color); }
      .state code {
        background: rgba(255,255,255,0.07); padding: 0.1rem 0.35rem;
        border-radius: 0.25rem; font-family: "JetBrains Mono", monospace; font-size: 0.85em;
      }

      @media screen and (max-width: 576px) {
        .blog { padding: 2.5rem 0 4rem; }
        .sync__actions { margin-left: 0; width: 100%; }
      }
    </style>
  </head>

  <body>
    <main class="blog">
      <div class="blog__container">
        <a href="/" class="blog__back">← Back to portfolio</a>

        <h1 class="blog__title">Writing</h1>
        <p class="blog__subtitle">
          Written in a Google Doc and published here automatically. Edit the doc,
          reload, and the change is live.
        </p>

        <div class="sync">
          <span class="sync__dot${error ? ' is-error' : ''}"></span>
          <span class="sync__text">${status}</span>
          <span class="sync__actions">
            <a class="sync__btn" href="/blog?refresh=1">Sync now</a>
          </span>
        </div>

        ${body}
      </div>
    </main>

    <script>
      // The page is already complete; this only keeps the timestamp honest and
      // re-reads the document when you come back from editing it.
      (function () {
        var el = document.getElementById('sync-time');
        if (el) {
          var at = new Date(el.getAttribute('datetime'));
          setInterval(function () {
            var s = Math.round((Date.now() - at) / 1000);
            el.textContent =
              s < 45 ? 'just now'
              : s < 90 ? 'a minute ago'
              : s < 3600 ? Math.round(s / 60) + ' minutes ago'
              : Math.round(s / 3600) + ' hours ago';
          }, 15000);
        }

        var returned = false;
        document.addEventListener('visibilitychange', function () {
          if (document.visibilityState === 'visible' && !returned) {
            returned = true;
            location.replace('/blog?refresh=1');
          }
        });
      })();
    </script>
  </body>
</html>`;
}
