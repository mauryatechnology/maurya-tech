import { renderOg, OG_SIZE } from '@/lib/seo/og';
import { buildSalaryPage, resolveSalaryPage } from '@/lib/programmatic/salary';

export const alt = 'Salary breakdown';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default async function Image({ params }) {
  const { country, slug } = await params;
  const hit = resolveSalaryPage(country, slug);
  const page = hit ? buildSalaryPage(country, hit.value, hit.set.id) : null;
  return renderOg({
    eyebrow: 'Salary breakdown',
    title: page?.h1 || 'Salary breakdown',
    subtitle: page?.description?.slice(0, 120) || '',
  });
}
