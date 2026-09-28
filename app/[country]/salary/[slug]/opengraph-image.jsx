import { renderOg, OG_SIZE } from '@/lib/seo/og';
import { buildSalaryPage, isValidSalaryPage } from '@/lib/programmatic/salary';

export const alt = 'Salary breakdown';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default async function Image({ params }) {
  const { country, slug } = await params;
  const value = isValidSalaryPage(country, slug);
  const page = value == null ? null : buildSalaryPage(country, value);
  return renderOg({
    eyebrow: 'Salary breakdown',
    title: page?.h1 || 'Salary breakdown',
    subtitle: page?.description?.slice(0, 120) || '',
  });
}
