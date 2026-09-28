import { ADSENSE_CLIENT, publisherId } from '@/lib/ads/config';

// ads.txt authorises sellers of this site's ad inventory. Served from env so the
// publisher ID lives in one place; extra network lines (Ezoic, Mediavine, …) can be
// appended via ADS_TXT_EXTRA (newline-separated) when those networks are added.
export function GET() {
  const lines = [];
  if (/^ca-pub-\d{10,20}$/.test(ADSENSE_CLIENT)) {
    lines.push(`google.com, ${publisherId()}, DIRECT, f08c47fec0942fa0`);
  }
  if (process.env.ADS_TXT_EXTRA) {
    lines.push(...process.env.ADS_TXT_EXTRA.split(/\\n|\n/).map((l) => l.trim()).filter(Boolean));
  }

  if (!lines.length) {
    return new Response('# No ad sellers configured yet.\n', {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  return new Response(`${lines.join('\n')}\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
