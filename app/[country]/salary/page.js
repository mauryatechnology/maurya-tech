import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getMarketProfile } from '@/lib/market/getMarketProfile';
import { Breadcrumbs, JsonLd, RelatedLinks } from '@/components/seo/PageParts';
import { SALARY_SETS, salaryPagePath, setsForCountry } from '@/lib/programmatic/salary';
import { relatedGuides, relatedTools, SALARY_TOOL_FOR_COUNTRY, toolPath } from '@/lib/seo/related';
import { absoluteUrl, breadcrumbSchema } from '@/lib/seo/schema';
import { TAX_RULES, calcIndiaSalary, calcUsTakeHome, calcUkTakeHome, formatINR, formatUSD, formatGBP } from '@/lib/tax';

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(SALARY_SETS).map((country) => ({ country }));
}

const COPY = {
  in: {
    title: 'In-Hand Salary by CTC (4–25 LPA): New Regime FY 2026-27',
    h1: 'In-hand salary for every CTC',
    description: 'Monthly in-hand salary for every CTC from 4 to 25 LPA under the new tax regime (FY 2026-27), with income tax, PF and professional tax shown.',
    intro: 'Pick your CTC to see monthly in-hand pay, income tax, PF and professional tax under the new tax regime. Every page shows the full calculation, not just the final number.',
  },
  us: {
    title: 'Salary to Hourly & Hourly to Salary Tables (2026)',
    h1: 'US salary and hourly wage breakdowns',
    description: 'Hourly wage to yearly salary and salary to hourly tables for 2026, with take-home pay after federal tax and FICA by state and filing status.',
    intro: 'Convert an hourly wage to a yearly salary or a salary to an hourly rate, with take-home pay after 2026 federal tax and FICA — plus state and filing-status comparisons on every page.',
  },
  uk: {
    title: 'UK Salary After Tax Table: £15,000 to £100,000 (2026/27)',
    h1: 'UK take-home pay for every salary',
    description: 'UK take-home pay for every salary from £15,000 to £100,000 after 2026/27 Income Tax and National Insurance — yearly, monthly and weekly.',
    intro: 'Pick a salary to see take-home pay per year, month and week after 2026/27 Income Tax and National Insurance.',
  },
};

// Column definitions per programmatic set
const TABLES = {
  'in-lpa': {
    heading: 'CTC to in-hand salary',
    cols: ['CTC', 'Monthly in-hand', 'Income tax / year'],
    row: (v) => {
      const r = calcIndiaSalary({ ctc: v * 100000 });
      return [`₹${v} LPA`, formatINR(r.monthlyInHand), formatINR(r.tax.total)];
    },
  },
  'us-hourly': {
    heading: 'Hourly wage to yearly salary',
    cols: ['Hourly', 'Annual (2,080 hrs)', 'Take-home / month (W-2)'],
    row: (v) => {
      const gross = v * TAX_RULES.US.fullTimeHours;
      return [`$${v}/hr`, formatUSD(gross), formatUSD(calcUsTakeHome({ gross }).netMonthly)];
    },
  },
  'us-annual': {
    heading: 'Yearly salary to hourly wage',
    cols: ['Salary', 'Hourly (2,080 hrs)', 'Take-home / month (single)'],
    row: (v) => [formatUSD(v), formatUSD(v / TAX_RULES.US.fullTimeHours, 2), formatUSD(calcUsTakeHome({ gross: v }).netMonthly)],
  },
  'uk-annual': {
    heading: 'Salary after tax',
    cols: ['Salary', 'Monthly take-home', 'Income Tax + NI / year'],
    row: (v) => {
      const r = calcUkTakeHome({ gross: v });
      return [formatGBP(v), formatGBP(r.netMonthly), formatGBP(r.totalTax)];
    },
  },
};

export async function generateMetadata({ params }) {
  const { country } = await params;
  const copy = COPY[country];
  if (!copy) return {};
  return {
    title: copy.title,
    description: copy.description,
    alternates: { canonical: absoluteUrl(`/${country}/salary`) },
    openGraph: { title: copy.title, description: copy.description, url: absoluteUrl(`/${country}/salary`), type: 'website', siteName: 'Maurya Technologies' },
  };
}

export default async function SalaryHubPage({ params }) {
  const { country } = await params;
  const copy = COPY[country];
  const sets = setsForCountry(country);
  if (!copy || !sets.length) notFound();

  const market = await getMarketProfile(country);
  const crumbs = [
    { name: market.name, href: `/${country}` },
    { name: 'Salary breakdowns', href: `/${country}/salary` },
  ];
  const toolSlug = SALARY_TOOL_FOR_COUNTRY[country];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <Breadcrumbs items={crumbs} />
      <header className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">{copy.h1}</h1>
        <p className="text-slate-600 max-w-2xl">{copy.intro}</p>
        <p className="text-xs text-slate-500">{TAX_RULES[country.toUpperCase()].label}</p>
      </header>

      {sets.map((set) => {
        const t = TABLES[set.id];
        return (
          <section key={set.id} className="space-y-3">
            {sets.length > 1 && <h2 className="text-xl font-bold text-slate-900">{t.heading}</h2>}
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>{t.cols.map((c) => <th key={c} scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">{c}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {set.values.map((v) => {
                    const [label, a, b] = t.row(v);
                    return (
                      <tr key={v}>
                        <th scope="row" className="px-4 py-3 font-semibold">
                          <Link href={salaryPagePath(country, v, set.id)} className="text-cyan-700 hover:underline">{label}</Link>
                        </th>
                        <td className="px-4 py-3 whitespace-nowrap">{a}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{b}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}

      <p className="text-sm text-slate-600">
        Need a different amount? Use the{' '}
        <Link href={toolPath(toolSlug, country)} className="font-semibold text-cyan-700 hover:underline">interactive calculator</Link>
        {country === 'us' && (
          <>
            {' '}or the <Link href="/us/tools/us-paycheck-calculator" className="font-semibold text-cyan-700 hover:underline">paycheck calculator</Link> with your state and filing status
          </>
        )}
        .
      </p>

      <RelatedLinks tools={relatedTools(toolSlug, country, 4)} guides={relatedGuides({ country, toolSlug, limit: 3 })} />
    </div>
  );
}
