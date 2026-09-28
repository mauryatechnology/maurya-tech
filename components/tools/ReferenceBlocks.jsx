import Link from 'next/link';
import {
  TAX_RULES,
  calcIndiaSalary,
  calcUsTakeHome,
  calcUkTakeHome,
  formatINR,
  formatUSD,
  formatGBP,
  formatPct,
} from '@/lib/tax';
import { salaryPathIfExists } from '@/lib/programmatic/salary';

/**
 * Server-rendered reference tables and worked examples. All figures are computed from
 * lib/tax, so they always agree with the interactive calculator on the same page.
 */

function Table({ caption, headers, rows }) {
  return (
    <figure className="my-6">
      {caption && <figcaption className="text-sm font-semibold text-slate-800 mb-2">{caption}</figcaption>}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              {headers.map((h) => (
                <th key={h} scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {rows.map((r, i) => (
              <tr key={i}>
                {r.map((c, j) => (
                  <td key={j} className="px-4 py-3 whitespace-nowrap">{c}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}


function band(min, max, fmt) {
  if (max === Infinity) return `Above ${fmt(min)}`;
  return `${fmt(min)} – ${fmt(max)}`;
}

const linked = (href, text) => (href ? <Link href={href} className="text-cyan-700 font-semibold hover:underline">{text}</Link> : text);

const BLOCKS = {
  'in-slab-table': () => (
    <Table
      caption={`Income tax slabs — ${TAX_RULES.IN.label}`}
      headers={['Taxable income', 'Rate']}
      rows={TAX_RULES.IN.slabs.map((s) => [band(s.min, s.max, formatINR), s.rate === 0 ? 'Nil' : formatPct(s.rate, 0)])}
    />
  ),

  'in-ctc-examples': () => {
    const values = [6, 8, 10, 12, 15, 18, 20, 25];
    return (
      <Table
        caption="In-hand salary by CTC (basic 50%, PF capped, ₹2,400 professional tax)"
        headers={['CTC', 'Income tax / year', 'Monthly in-hand']}
        rows={values.map((lpa) => {
          const r = calcIndiaSalary({ ctc: lpa * 100000 });
          return [linked(salaryPathIfExists('in', lpa), `₹${lpa} LPA`), formatINR(r.tax.total), formatINR(r.monthlyInHand)];
        })}
      />
    );
  },

  'us-bracket-table': () => (
    <Table
      caption={`Federal income tax brackets — ${TAX_RULES.US.label} (standard deduction ${formatUSD(TAX_RULES.US.standardDeduction)})`}
      headers={['Taxable income', 'Rate']}
      rows={TAX_RULES.US.brackets.map((b) => [band(b.min, b.max, formatUSD), formatPct(b.rate, 0)])}
    />
  ),

  'us-hourly-examples': () => {
    const values = [15, 20, 25, 30, 35, 40, 50, 60];
    return (
      <Table
        caption="Hourly wage → annual pay and estimated take-home (W-2, single, before state tax)"
        headers={['Hourly', 'Annual gross', 'Monthly gross', 'Take-home / year']}
        rows={values.map((h) => {
          const gross = h * TAX_RULES.US.fullTimeHours;
          const r = calcUsTakeHome({ gross });
          return [linked(salaryPathIfExists('us', h), `$${h}/hr`), formatUSD(gross), formatUSD(gross / 12), formatUSD(r.net)];
        })}
      />
    );
  },

  'uk-band-table': () => (
    <Table
      caption={`Income Tax bands — ${TAX_RULES.UK.label}`}
      headers={['Band', 'Taxable income above allowance', 'Rate']}
      rows={[
        ['Personal Allowance', `Up to ${formatGBP(TAX_RULES.UK.personalAllowance)} of income`, '0%'],
        ...TAX_RULES.UK.bands.map((b) => [b.name, band(b.min, b.max, formatGBP), formatPct(b.rate, 0)]),
        ['National Insurance (employee)', `${formatGBP(TAX_RULES.UK.niPrimaryThreshold)} – ${formatGBP(TAX_RULES.UK.niUpperEarningsLimit)} / above`, '8% / 2%'],
      ]}
    />
  ),

  'uk-salary-examples': () => {
    const values = [20000, 25000, 30000, 35000, 40000, 50000, 60000, 70000];
    return (
      <Table
        caption="Take-home pay by salary (1257L, no pension or student loan)"
        headers={['Salary', 'Income Tax', 'National Insurance', 'Monthly take-home']}
        rows={values.map((g) => {
          const r = calcUkTakeHome({ gross: g });
          return [linked(salaryPathIfExists('uk', g), formatGBP(g)), formatGBP(r.incomeTax), formatGBP(r.nationalInsurance), formatGBP(r.netMonthly)];
        })}
      />
    );
  },

  'emi-examples': () => {
    const emi = (p, rate, years) => {
      const r = rate / 12 / 100;
      const n = years * 12;
      return (p * r * (1 + r) ** n) / ((1 + r) ** n - 1);
    };
    const rows = [
      [2000000, 20],
      [3000000, 20],
      [5000000, 20],
      [5000000, 25],
      [5000000, 30],
      [7500000, 20],
    ].map(([p, y]) => {
      const e = emi(p, 8.5, y);
      return [formatINR(p), `${y} years`, formatINR(e), formatINR(e * y * 12 - p)];
    });
    return <Table caption="Home-loan EMI at 8.5% interest" headers={['Loan amount', 'Tenure', 'Monthly EMI', 'Total interest']} rows={rows} />;
  },

  'percentage-examples': () => (
    <Table
      caption="Worked examples"
      headers={['Question', 'Working', 'Answer']}
      rows={[
        ['20% of 250', '250 × 20 ÷ 100', '50'],
        ['432 out of 500 as %', '432 ÷ 500 × 100', '86.4%'],
        ['Increase from 80 to 100', '(100 − 80) ÷ 80 × 100', '+25%'],
        ['Price ₹1,000 + 18% GST', '1,000 × 1.18', '₹1,180'],
        ['Original price before 25% off (sale 750)', '750 ÷ 0.75', '1,000'],
        ['20% off, then 10% off', '0.8 × 0.9 = 0.72', '28% total discount'],
      ]}
    />
  ),

  'unit-reference': () => (
    <Table
      caption="Exact conversion factors"
      headers={['From', 'To', 'Multiply by']}
      rows={[
        ['inch', 'centimetre', '2.54 (exact)'],
        ['foot', 'metre', '0.3048 (exact)'],
        ['mile', 'kilometre', '1.609344 (exact)'],
        ['pound', 'kilogram', '0.45359237 (exact)'],
        ['kilogram', 'pound', '≈ 2.20462'],
        ['GB (decimal)', 'bytes', '1,000,000,000'],
        ['GiB (binary)', 'bytes', '1,073,741,824'],
      ]}
    />
  ),

  'cgpa-table': () => (
    <Table
      caption="CGPA to percentage (CBSE formula: CGPA × 9.5)"
      headers={['CGPA', 'Percentage']}
      rows={[10, 9.5, 9, 8.5, 8, 7.5, 7, 6.5, 6].map((c) => [c.toFixed(1), `${(c * 9.5).toFixed(1)}%`])}
    />
  ),
};

export function ReferenceBlocks({ blocks = [] }) {
  const rendered = blocks.map((key) => BLOCKS[key]).filter(Boolean);
  if (!rendered.length) return null;
  return (
    <section aria-labelledby="reference-heading" className="space-y-2">
      <h2 id="reference-heading" className="text-xl font-bold text-slate-900 tracking-tight">Reference tables &amp; worked examples</h2>
      {rendered.map((Block, i) => (
        <Block key={i} />
      ))}
    </section>
  );
}

