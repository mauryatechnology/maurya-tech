import { notFound, permanentRedirect } from 'next/navigation';
import { getMarketProfile } from '@/lib/market/getMarketProfile';
import { getToolBySlug, getToolsForCountry } from '@/lib/market/getTool';
import { CALCULATOR_COMPONENTS } from '@/components/tools/registry';
import { ToolPage } from '@/components/tools/ToolPage';
import { GLOBAL_TOOL_SLUGS } from '@/lib/seo/related';
import { absoluteUrl } from '@/lib/seo/schema';

const SUPPORTED_COUNTRIES = ['in', 'us', 'uk'];
const LOCALE = { in: 'en_IN', us: 'en_US', uk: 'en_GB' };
const HREFLANG = { IN: 'en-IN', US: 'en-US', UK: 'en-GB' };

export async function generateStaticParams() {
  const params = [];
  for (const country of SUPPORTED_COUNTRIES) {
    const tools = await getToolsForCountry(country);
    for (const tool of tools) {
      if (GLOBAL_TOOL_SLUGS.includes(tool.slug) || !CALCULATOR_COMPONENTS[tool.slug]) continue;
      params.push({ country, toolSlug: tool.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }) {
  const { country, toolSlug } = await params;
  const normalizedCountry = (country || '').toLowerCase();
  if (!SUPPORTED_COUNTRIES.includes(normalizedCountry)) return {};

  const market = await getMarketProfile(normalizedCountry);
  const tool = await getToolBySlug(toolSlug, normalizedCountry);
  if (!tool) return {};

  const languages = {};
  for (const c of tool.countries || []) {
    const code = c.toUpperCase();
    if (HREFLANG[code]) languages[HREFLANG[code]] = absoluteUrl(`/${code.toLowerCase()}/tools/${tool.slug}`);
  }
  if (Object.keys(languages).length > 1) {
    languages['x-default'] = languages['en-US'] || languages['en-IN'] || Object.values(languages)[0];
  }

  const title = tool.seo?.title || `${tool.name} for ${market.name}`;
  const description = tool.seo?.description || `Free online ${tool.name} for ${market.name}.`;
  const url = absoluteUrl(`/${normalizedCountry}/tools/${tool.slug}`);

  return {
    title,
    description,
    alternates: { canonical: url, languages },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Maurya Technologies',
      locale: LOCALE[normalizedCountry],
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function CountryToolPage({ params }) {
  const { country, toolSlug } = await params;
  const normalizedCountry = (country || '').toLowerCase();
  if (!SUPPORTED_COUNTRIES.includes(normalizedCountry)) notFound();
  if (GLOBAL_TOOL_SLUGS.includes(toolSlug)) permanentRedirect(`/tools/${toolSlug}`);

  const market = await getMarketProfile(normalizedCountry);
  const tool = await getToolBySlug(toolSlug, normalizedCountry);
  if (!tool || !CALCULATOR_COMPONENTS[tool.slug]) notFound();

  const path = `/${normalizedCountry}/tools/${tool.slug}`;
  const breadcrumbs = [
    { name: market.name, href: `/${normalizedCountry}` },
    { name: 'Tools', href: `/${normalizedCountry}/tools` },
    { name: tool.name, href: path },
  ];

  return <ToolPage tool={tool} market={market} country={normalizedCountry} path={path} breadcrumbs={breadcrumbs} />;
}
