/**
 * Blog posts as JSON.
 *
 * The page itself is server-rendered (api/blog-page.js); this exists for
 * anything that wants the posts as data — another surface, a feed, a check
 * that the document is reachable.
 */

import { loadPosts, DOC_ID } from './_doc.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ALLOW_ORIGIN || '*');
  res.setHeader(
    'Cache-Control',
    req.query?.refresh === '1'
      ? 'no-store'
      : 'public, s-maxage=60, stale-while-revalidate=600',
  );

  const docUrl = `https://docs.google.com/document/d/${DOC_ID}/edit`;

  try {
    const posts = await loadPosts();
    return res.status(200).json({
      ok: true,
      posts,
      count: posts.length,
      docUrl,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[blog] ', error.message);
    return res.status(error.status || 500).json({
      ok: false,
      error: error.message,
      hint: error.hint || null,
      docUrl,
    });
  }
}
