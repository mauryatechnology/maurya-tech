import { renderOg, OG_SIZE } from '@/lib/seo/og';
import { defaultTools } from '@/data/tools';

export const alt = 'Free online calculator';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default async function Image({ params }) {
  const { toolSlug } = await params;
  const tool = defaultTools.find((t) => t.slug === toolSlug);
  return renderOg({
    eyebrow: 'Free calculator',
    title: tool?.name || 'Free online calculator',
    subtitle: tool?.seo?.description?.slice(0, 120) || '',
  });
}
