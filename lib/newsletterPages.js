/**
 * Minimal HTML pages for the newsletter confirm/unsubscribe links.
 *
 * The emailed links only render a button (GET); the state change happens on POST.
 * Mail security scanners (Outlook Safe Links, corporate gateways) fetch every link in
 * an email, so a GET that changed state would confirm — and then unsubscribe — every
 * address on its own.
 */

export const TOKEN_RE = /^[a-f0-9]{48}$/;

export function htmlPage(title, body, { action, button, token } = {}) {
  const form = action
    ? `<form method="post" action="${action}"><input type="hidden" name="token" value="${token}"><button type="submit" style="background:#0A2540;color:#fff;border:0;padding:12px 20px;border-radius:8px;font-size:15px;cursor:pointer">${button}</button></form>`
    : '<p><a href="/tools">Back to the calculators</a></p>';
  return new Response(
    `<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><body style="font-family:Arial,sans-serif;max-width:520px;margin:15vh auto;padding:0 16px;color:#0f172a"><h1 style="font-size:22px">${title}</h1><p>${body}</p>${form}</body>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } }
  );
}

/** Reads the token from a form POST (or the query string as a fallback). */
export async function tokenFromPost(req) {
  try {
    const form = await req.formData();
    const t = form.get('token');
    if (typeof t === 'string') return t;
  } catch {
    // not a form body
  }
  return new URL(req.url).searchParams.get('token') || '';
}
