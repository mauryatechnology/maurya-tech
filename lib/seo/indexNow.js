/**
 * IndexNow: tells Bing, Yandex, Seznam, Naver (and via Bing, Copilot/ChatGPT search)
 * that URLs changed, so they are recrawled within minutes instead of days. Free.
 *
 * Setup: set INDEXNOW_KEY to a random 32+ char hex string. The key is served at
 * /indexnow-key.txt (see app/indexnow-key.txt/route.js).
 * Fire-and-forget — never blocks or fails the request that triggered it.
 */
import { SITE_URL } from '@/lib/seo/schema';

export async function pingIndexNow(paths = []) {
  const key = process.env.INDEXNOW_KEY;
  if (!key || process.env.NODE_ENV !== 'production' || !paths.length) return;

  const host = new URL(SITE_URL).host;
  try {
    await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host,
        key,
        keyLocation: `${SITE_URL}/indexnow-key.txt`,
        urlList: paths.map((p) => (p.startsWith('http') ? p : `${SITE_URL}${p}`)),
      }),
      signal: AbortSignal.timeout(5000),
    });
  } catch (err) {
    console.warn('IndexNow ping failed:', err.message);
  }
}
