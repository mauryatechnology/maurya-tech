import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getMarketProfile } from '@/lib/market/getMarketProfile';
import { Breadcrumbs, JsonLd, RelatedLinks } from '@/components/seo/PageParts';
import { SALARY_SETS, salaryPagePath } from '@/lib/programmatic/salary';
import { relatedGuides, relatedTools, SALARY_TOOL_FOR_COUNTRY, toolPath } from '@/lib/seo/related';
import { absoluteUrl, breadcrumbSchema } from '@/lib/seo/schema';
import { TAX_RULES, calcIndiaSalary, calcUsTakeHome, calcUkTakeHome, formatINR, formatUSD, formatGBP } from '@/lib/tax';

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(SALARY_SETS).map((country) => ({ country }));
}

const COPY = {
  in: {
    title: 'In-Hand Salary by CTC (4–25 LPA) — New Tax Regime FY 2025-26',
    h1: 'In-hand salary for every CTC',
    intro: 'Pick your CTC to see monthly in-hand pay, income tax, PF and professional tax under the new tax regime. Every page shows the full calculation, not just the final number.',
    cols: ['CTC', 'Monthly in-hand', 'Income tax / year'],
  },
  us: {
    title: 'Hourly to Annual Salary Table: $10 to $60 an Hour (2026)',
    h1: 'Hourly wage to annual salary',
    intro: 'Pick an hourly rate to see yearly, monthly, bi-weekly and weekly pay, plus estimated take-home after 2026 federal tax and FICA for W-2 employees and 1099 contractors.',
    cols: ['Hourly', 'Annual (2,080 hrs)', 'Take-home / month (W-2)'],
  },
  uk: {
    title: 'UK Salary After Tax Table: £20,000 to £70,000 (2026/27)',
    h1: 'UK take-home pay for every salary',
    intro: 'Pick a salary to see take-home pay per year, month and week after 2026/27 Income Tax and National Insurance.',
    cols: ['Salary', 'Monthly take-home', 'Income Tax + NI / year'],
  },
};

export async function generateMetadata({ params }) {
  const { country } = await params;
  const copy = COPY[country];
  if (!copy) return {};
  return {
    title: copy.title,
    description: copy.intro,
    alternates: { canonical: absoluteUrl(`/${country}/salary`) },
  };
}

function rowFor(country, v) {
  if (country === 'in') {
    const r = calcIndiaSalary({ ctc: v * 100000 });
    return [`₹${v} LPA`, formatINR(r.monthlyInHand), formatINR(r.tax.total)];
  }
  if (country === 'us') {
    const gross = v * TAX_RULES.US.fullTimeHours;
    return [`$${v}/hr`, formatUSD(gross), formatUSD(calcUsTakeHome({ gross }).netMonthly)];
  }
  const r = calcUkTakeHome({ gross: v });
  return [formatGBP(v), formatGBP(r.netMonthly), formatGBP(r.totalTax)];
}

export default async function SalaryHubPage({ params }) {
  const { country } = await params;
  const set = SALARY_SETS[country];
  const copy = COPY[country];
  if (!set || !copy) notFound();

  const market = await getMarketProfile(country);
  const crumbs = [
    { name: market.name, href: `/${country}` },
    { name: 'Salary breakdowns', href: `/${country}/salary` },
  ];
  const toolSlug = SALARY_TOOL_FOR_COUNTRY[country];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <Breadcrumbs items={crumbs} />
      <header className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">{copy.h1}</h1>
        <p className="text-slate-600 max-w-2xl">{copy.intro}</p>
        <p className="text-xs text-slate-500">{TAX_RULES[country.toUpperCase()].label}</p>
      </header>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600">
            <tr>{copy.cols.map((c) => <th key={c} scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">{c}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {set.values.map((v) => {
              const [label, a, b] = rowFor(country, v);
              return (
                <tr key={v}>
                  <th scope="row" className="px-4 py-3 font-semibold">
                    <Link href={salaryPagePath(country, v)} className="text-cyan-700 hover:underline">{label}</Link>
                  </th>
                  <td className="px-4 py-3 whitespace-nowrap">{a}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{b}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-slate-600">
        Need a different amount? Use the{' '}
        <Link href={toolPath(toolSlug, country)} className="font-semibold text-cyan-700 hover:underline">interactive calculator</Link>.
      </p>

      <RelatedLinks tools={relatedTools(toolSlug, country, 4)} guides={relatedGuides({ country, toolSlug, limit: 3 })} />
    </div>
  );
}
