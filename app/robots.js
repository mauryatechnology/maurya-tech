export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://maurya-tech.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/admin/*',
          '/api/',
          '/api/*',
          // Never block /_next/: Bing and other crawlers need its CSS/JS to render pages.
          '/_not-found',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/admin/*',
          '/api/',
          '/api/*',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
