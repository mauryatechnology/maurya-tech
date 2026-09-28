import { renderOg, OG_SIZE } from '@/lib/seo/og';
import { defaultTools, localizeTool } from '@/data/tools';

export const alt = 'Free online calculator';
export const size = OG_SIZE;
export const contentType = 'image/png';

const NAMES = { in: 'India', us: 'United States', uk: 'United Kingdom' };

export default async function Image({ params }) {
  const { country, toolSlug } = await params;
  const tool = localizeTool(defaultTools.find((t) => t.slug === toolSlug), country);
  return renderOg({
    eyebrow: `Free calculator · ${NAMES[country] || 'Worldwide'}`,
    title: tool?.name || 'Free online calculator',
    subtitle: tool?.seo?.description?.slice(0, 120) || '',
  });
}
