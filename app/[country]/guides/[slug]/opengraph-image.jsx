import { renderOg, OG_SIZE } from '@/lib/seo/og';
import { defaultGuides } from '@/data/guides';

export const alt = 'Guide';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default async function Image({ params }) {
  const { slug } = await params;
  const guide = defaultGuides.find((g) => g.slug === slug);
  return renderOg({
    eyebrow: guide?.category || 'Guide',
    title: guide?.title || 'Maurya Tech guide',
  });
}
