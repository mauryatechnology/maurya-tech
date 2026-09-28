import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getMarketProfile } from '@/lib/market/getMarketProfile';
import { getToolBySlug } from '@/lib/market/getTool';
import { CALCULATOR_COMPONENTS } from '@/components/tools/registry';
import { ToolPageProvider } from '@/components/tools/ToolPageContext';
import { Ad } from '@/components/ads/Ad';
import { AnswerBox, Breadcrumbs, FaqSection, JsonLd, RelatedLinks, ReviewBox } from '@/components/seo/PageParts';
import { buildSalaryPage, isValidSalaryPage, neighbours, salaryParams, SALARY_SETS, salaryPagePath } from '@/lib/programmatic/salary';
import { relatedGuides, relatedTools, SALARY_TOOL_FOR_COUNTRY } from '@/lib/seo/related';
import { absoluteUrl, breadcrumbSchema, faqSchema } from '@/lib/seo/schema';
import { TAX_RULES } from '@/lib/tax';

export const dynamicParams = false;

export function generateStaticParams() {
  return salaryParams();
}

const LOCALE = { in: 'en_IN', us: 'en_US', uk: 'en_GB' };

export async function generateMetadata({ params }) {
  const { country, slug } = await params;
  const value = isValidSalaryPage(country, slug);
  if (value == null) return {};
  const page = buildSalaryPage(country, value);
  const url = absoluteUrl(salaryPagePath(country, value));
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: url },
    openGraph: { title: page.title, description: page.description, url, type: 'article', locale: LOCALE[country], siteName: 'Maurya Technologies' },
    twitter: { card: 'summary_large_image', title: page.title, description: page.description },
  };
}

function DataTable({ headers, rows, caption }) {
  return (
    <figure>
      {caption && <figcaption className="text-sm font-semibold text-slate-800 mb-2">{caption}</figcaption>}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-sm text-left">
          {headers && (
            <thead className="bg-slate-50 text-slate-600">
              <tr>{headers.map((h, i) => <th key={i} scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">{h}</th>)}</tr>
            </thead>
          )}
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {rows.map((r, i) => (
              <tr key={i} className={i === rows.length - 1 ? 'font-semibold bg-slate-50/60' : ''}>
                {r.map((c, j) => (j === 0 ? <th key={j} scope="row" className="px-4 py-3 font-medium whitespace-nowrap">{c}</th> : <td key={j} className="px-4 py-3 whitespace-nowrap">{c}</td>))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}

export default async function SalaryValuePage({ params }) {
  const { country, slug } = await params;
  const value = isValidSalaryPage(country, slug);
  if (value == null) notFound();

  const market = await getMarketProfile(country);
  const page = buildSalaryPage(country, value);
  const set = SALARY_SETS[country];
  const path = salaryPagePath(country, value);
  const toolSlug = SALARY_TOOL_FOR_COUNTRY[country];
  const tool = await getToolBySlug(toolSlug, country);
  const Calculator = tool ? CALCULATOR_COMPONENTS[tool.slug] : null;
  const rules = TAX_RULES[country.toUpperCase()];

  const crumbs = [
    { name: market.name, href: `/${country}` },
    { name: 'Salary breakdowns', href: `/${country}/salary` },
    { name: set.label(value), href: path },
  ];
  const nearby = neighbours(country, value, 5).map((v) => ({ name: set.label(v), href: salaryPagePath(country, v) }));
  const initialProps =
    country === 'in' ? { initialCtc: value * 100000 } : country === 'us' ? { initialHourlyRate: value } : { initialCtc: value };

  return (
    <div className="bg-slate-50 pb-20">
      <JsonLd data={[breadcrumbSchema(crumbs), faqSchema(page.faqs)]} />
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Breadcrumbs items={crumbs} />
        <header className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">{page.h1}</h1>
          <p className="text-xs text-slate-500">{rules.label}</p>
        </header>

        <AnswerBox>{page.answer}</AnswerBox>

        {country === 'in' ? (
          <DataTable caption="Full breakdown (annual)" rows={page.rows} />
        ) : (
          <DataTable caption="Pay breakdown" headers={page.rowHeaders} rows={page.rows} />
        )}

        {country === 'in' && <DataTable caption="Take-home by period" rows={page.periods} />}

        <Ad market={market} placement="article" minHeight={280} />

        {page.taxRows && <DataTable caption="Tax breakdown: W-2 employee vs 1099 contractor (2026, single)" headers={page.taxHeaders} rows={page.taxRows} />}
        {page.schedules && <DataTable caption="Annual pay on other schedules" headers={['Schedule', 'Annual gross']} rows={page.schedules} />}

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">What this means</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm sm:text-[15px] leading-relaxed text-slate-700">
            {page.facts.map((f) => <li key={f}>{f}</li>)}
          </ul>
        </section>

        {Calculator && (
          <section className="space-y-3 -mx-4 sm:-mx-6 lg:-mx-8">
            <ToolPageProvider embedded>
              <Calculator country={country} countryName={market.name} tool={tool} {...initialProps} />
            </ToolPageProvider>
          </section>
        )}

        <Ad market={market} placement="toolMid" minHeight={280} />

        <FaqSection faqs={page.faqs} />

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">Nearby amounts</h2>
          <div className="flex flex-wrap gap-2">
            {nearby.map((n) => (
              <Link key={n.href} href={n.href} className="min-h-[40px] inline-flex items-center rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:border-cyan-400 hover:text-cyan-800">
                {n.name}
              </Link>
            ))}
            <Link href={`/${country}/salary`} className="min-h-[40px] inline-flex items-center rounded-full bg-slate-900 px-4 text-sm font-semibold text-white">
              All amounts
            </Link>
          </div>
        </section>

        <ReviewBox authorSlug="kuldeep-maurya" reviewerSlug="editorial-team" lastReviewed={rules.lastReviewed} sources={rules.sources} />

        <RelatedLinks tools={relatedTools(toolSlug, country, 4)} guides={relatedGuides({ country, toolSlug, limit: 2 })} />
      </article>
    </div>
  );
}
