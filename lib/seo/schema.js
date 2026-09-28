/** JSON-LD builders. Only emit schema that describes content actually visible on the page. */

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://maurya-tech.com').replace(/\/$/, '');

export const absoluteUrl = (path = '/') => (path.startsWith('http') ? path : `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`);

export function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      ...(item.href ? { item: absoluteUrl(item.href) } : {}),
    })),
  };
}

export function faqSchema(faqs = []) {
  if (!faqs.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

export function personSchema(author) {
  return {
    '@type': 'Person',
    name: author.name,
    url: absoluteUrl(`/authors/${author.slug}`),
    jobTitle: author.role,
    ...(author.sameAs?.length ? { sameAs: author.sameAs } : {}),
  };
}

export function softwareAppSchema({ name, description, url, category, currency = 'USD', dateModified }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    description,
    url: absoluteUrl(url),
    applicationCategory: category === 'salary' || category === 'finance' ? 'FinanceApplication' : 'UtilitiesApplication',
    operatingSystem: 'Any (web browser)',
    browserRequirements: 'Requires JavaScript',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: currency },
    ...(dateModified ? { dateModified } : {}),
    publisher: { '@type': 'Organization', name: 'Maurya Technologies', url: SITE_URL },
  };
}

export function articleSchema({ headline, description, url, datePublished, dateModified, author, reviewer, image }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    mainEntityOfPage: absoluteUrl(url),
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    ...(author ? { author: personSchema(author) } : {}),
    ...(reviewer ? { reviewedBy: personSchema(reviewer) } : {}),
    ...(image ? { image: absoluteUrl(image) } : {}),
    publisher: {
      '@type': 'Organization',
      name: 'Maurya Technologies',
      logo: { '@type': 'ImageObject', url: absoluteUrl('/logo.png') },
    },
  };
}
