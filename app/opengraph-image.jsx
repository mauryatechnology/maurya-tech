import { renderOg, OG_SIZE } from '@/lib/seo/og';

export const alt = 'Maurya Technologies — software development and free calculators';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return renderOg({
    eyebrow: 'Maurya Technologies',
    title: 'Scalable software, built right',
    subtitle: 'Web & mobile apps, SaaS, cloud and AI — plus free salary and tax calculators.',
  });
}
