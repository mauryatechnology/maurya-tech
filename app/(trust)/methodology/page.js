import Link from 'next/link';
import { Breadcrumbs, JsonLd } from '@/components/seo/PageParts';
import { absoluteUrl, breadcrumbSchema } from '@/lib/seo/schema';
import { TAX_RULES } from '@/lib/tax';

export const metadata = {
  title: 'How Our Calculators Work — Methodology & Sources',
  description:
    'The rules, assumptions and official sources behind every Maurya Tech salary, tax and loan calculator, and how we keep them up to date each tax year.',
  alternates: { canonical: absoluteUrl('/methodology') },
};

export default function MethodologyPage() {
  const crumbs = [{ name: 'Home', href: '/' }, { name: 'Methodology', href: '/methodology' }];
  const markets = [
    { code: 'IN', name: 'India', notes: ['Gross salary = CTC − employer PF (and gratuity if included in CTC).', 'Taxable income = gross − ₹75,000 standard deduction; no HRA/80C under the new regime.', 'Section 87A rebate up to ₹60,000 for taxable income ≤ ₹12 lakh, with marginal relief just above it; 4% cess; surcharge above ₹50 lakh.', 'Default assumptions: basic = 50% of CTC, PF capped at ₹1,800/month, ₹2,400 professional tax.', 'Old regime (comparison calculator): ₹50,000 standard deduction; HRA exemption = least of HRA received, rent − 10% of basic, 50%/40% of basic; 80C ≤ ₹1.5 lakh, 80CCD(1B) ≤ ₹50,000, 80D ≤ ₹25,000 + ₹50,000 (parents 60+), 24(b) ≤ ₹2 lakh, professional tax ≤ ₹2,500; 87A rebate up to ₹12,500 for taxable income ≤ ₹5 lakh; individuals below 60.', 'Surcharge (both regimes) includes marginal relief: tax plus surcharge never exceeds the tax at ₹50 lakh, ₹1 crore, ₹2 crore or ₹5 crore plus the income above that threshold.', 'From 1 April 2026 the Income-tax Act, 2025 replaces the Income-tax Act, 1961 and renumbers its sections. The Union Budget 2026-27 kept the slabs, standard deduction and rebate above unchanged for FY 2026-27; we still quote the familiar 1961 section numbers (87A, 80C, 10(13A)) because payslips, Form 16 and most guidance use them.'] },
    { code: 'US', name: 'United States', notes: [
      'Federal income tax on (gross − pre-tax deductions − standard deduction) using the 2026 brackets for single, married filing jointly or head of household.',
      'W-2: 6.2% Social Security up to the wage base + 1.45% Medicare, plus 0.9% Additional Medicare Tax above $200,000 (single/head of household) or $250,000 (joint).',
      'Traditional 401(k) reduces income-tax wages but not FICA wages; Section 125 health premiums reduce both.',
      '1099: self-employment tax on 92.35% of net earnings, half of it deducted before income tax.',
      'State income tax (paycheck calculator): Arizona, California, Colorado, Georgia, Illinois, Massachusetts, Michigan, New Jersey, New York, North Carolina, Ohio, Pennsylvania and Virginia use each state’s published brackets, deduction/exemption and credits — the table year is shown next to the state and may lag the federal year. Texas, Florida, Washington, Nevada and Tennessee do not tax wages. Head-of-household filers use single brackets for California and Illinois. Pennsylvania taxes employee 401(k) contributions, so they are not deducted from Pennsylvania wages; Pennsylvania local earned income taxes, Michigan and Ohio city income taxes and Ohio school district taxes are not included; Ohio’s small personal exemption is not applied. Arizona and Colorado follow the federal standard deduction, because both states start from federal income.',
      'Not included: city/local taxes (e.g. NYC), state disability and paid-leave payroll premiums (CA SDI, NY SDI/PFL, WA Cares/PFML), and extra W-4 withholding.',
    ] },
    { code: 'UK', name: 'United Kingdom', notes: ['Personal Allowance of £12,570, tapered by £1 for every £2 above £100,000.', 'Income Tax bands for England, Wales and Northern Ireland; Scottish rates are not applied.', 'Employee Class 1 National Insurance: 8% between £12,570 and £50,270, 2% above.', 'Assumes a 1257L tax code and no pension, student loan or benefits in kind.'] },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <Breadcrumbs items={crumbs} />
      <header className="space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">How our calculators work</h1>
        <p className="text-slate-600">
          Every salary and tax figure on this site — in the calculators, the reference tables and the salary breakdown pages — comes from a single calculation engine, so the same inputs always give the same answer everywhere.
        </p>
      </header>

      {markets.map((m) => {
        const r = TAX_RULES[m.code];
        return (
          <section key={m.code} className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">{m.name}: {r.label}</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700">{m.notes.map((n) => <li key={n}>{n}</li>)}</ul>
            <p className="text-sm text-slate-600">
              Official sources:{' '}
              {r.sources.map((s, i) => (
                <span key={s.url}>
                  {i > 0 && ' · '}
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-cyan-700 hover:underline">{s.name}</a>
                </span>
              ))}
            </p>
            <p className="text-xs text-slate-500">Rates last reviewed: {r.lastReviewed}</p>
          </section>
        );
      })}

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">How we keep numbers current</h2>
        <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
          <li>India: rates are re-checked after the Union Budget (1 February) and at the start of each financial year (1 April).</li>
          <li>United States: rates are updated when the IRS publishes the next year&apos;s inflation adjustments (usually October–November) and the SSA announces the new wage base.</li>
          <li>United Kingdom: rates are re-checked after the Budget and before the tax year starts on 6 April.</li>
          <li>Every change is tested against hand-worked examples before it is published.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">Privacy</h2>
        <p className="text-slate-700">
          Calculations run in your browser. The numbers you enter are not sent to or stored on our servers.
        </p>
      </section>

      <p className="text-sm text-slate-500">
        Found an error? <Link href="/contact" className="text-cyan-700 hover:underline">Tell us</Link> — corrections are reviewed within a few working days. See also our{' '}
        <Link href="/editorial-policy" className="text-cyan-700 hover:underline">editorial policy</Link>.
      </p>
    </div>
  );
}
