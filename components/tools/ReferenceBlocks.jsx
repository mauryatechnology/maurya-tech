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
  US_FILING_STATUS,
  calcUsPaycheck,
  IN_OLD_REGIME,
  compareIndiaRegimes,
} from '@/lib/tax';
import { salaryPathIfExists } from '@/lib/programmatic/salary';
import { MORTGAGE_RULES, monthlyPayment, ukStampDuty } from '@/lib/finance/mortgage';
import { SAVINGS_RULES, fdMaturity, ppfMaturity, sipFutureValue } from '@/lib/finance/savings';
import { US_401K, employeeLimit, project401k } from '@/lib/finance/retirement';
import { UK_STUDENT_LOANS, studentLoanRepayment } from '@/lib/finance/studentLoan';
import { CONSUMPTION_TAX_RULES, US_STATE_SALES_TAX, applyTax } from '@/lib/finance/salesTax';

const gbp2 = (n) => `£${Number(n || 0).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const inr2 = (n) => `₹${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

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

  'us-filing-status-table': () => {
    const statuses = Object.values(US_FILING_STATUS);
    const rows = US_FILING_STATUS.single.brackets.map((b, i) => [
      formatPct(b.rate, 0),
      ...statuses.map((s) => band(s.brackets[i].min, s.brackets[i].max, formatUSD)),
    ]);
    rows.push(['Standard deduction', ...statuses.map((s) => formatUSD(s.standardDeduction))]);
    return <Table caption="2026 federal brackets by filing status (taxable income)" headers={['Rate', ...statuses.map((s) => s.label)]} rows={rows} />;
  },

  'us-paycheck-examples': () => {
    const values = [40000, 60000, 75000, 100000, 150000];
    return (
      <Table
        caption="Bi-weekly take-home by salary (single, no state tax, no deductions)"
        headers={['Salary', 'Gross per paycheck', 'Federal tax', 'FICA', 'Take-home per paycheck']}
        rows={values.map((g) => {
          const r = calcUsPaycheck({ grossAnnual: g, periods: 26 });
          return [
            linked(salaryPathIfExists('us', g, 'us-annual'), formatUSD(g)),
            formatUSD(r.perPeriod.gross),
            formatUSD(r.perPeriod.federalTax),
            formatUSD(r.perPeriod.socialSecurity + r.perPeriod.medicare),
            formatUSD(r.perPeriod.net),
          ];
        })}
      />
    );
  },

  'in-old-slab-table': () => (
    <Table
      caption={`Old regime slabs — ${IN_OLD_REGIME.label}`}
      headers={['Taxable income', 'Rate']}
      rows={IN_OLD_REGIME.slabs.map((s) => [band(s.min, s.max, formatINR), s.rate === 0 ? 'Nil' : formatPct(s.rate, 0)])}
    />
  ),

  'in-regime-examples': () => {
    const values = [800000, 1200000, 1500000, 2000000, 3000000];
    const typical = { hra: 200000, sec80C: 150000, sec80DSelf: 25000, professionalTax: 2400 };
    const heavy = { ...typical, sec24b: 200000, sec80CCD1B: 50000 };
    return (
      <Table
        caption="Annual tax by gross salary: new regime vs old regime with different deductions"
        headers={['Gross salary', 'New regime', 'Old: no deductions', 'Old: HRA ₹2L + 80C + 80D', 'Old: + home loan ₹2L + NPS ₹50k']}
        rows={values.map((g) => [
          formatINR(g),
          formatINR(compareIndiaRegimes({ grossSalary: g }).new.tax.total),
          formatINR(compareIndiaRegimes({ grossSalary: g }).old.tax.total),
          formatINR(compareIndiaRegimes({ grossSalary: g, deductions: typical }).old.tax.total),
          formatINR(compareIndiaRegimes({ grossSalary: g, deductions: heavy }).old.tax.total),
        ])}
      />
    );
  },

  'us-mortgage-examples': () => {
    const prices = [250000, 350000, 450000, 600000];
    return (
      <Table
        caption="Monthly principal & interest on a 30-year fixed loan with 20% down"
        headers={['Home price', 'Loan', 'At 5.5%', 'At 6.5%', 'At 7.5%']}
        rows={prices.map((p) => {
          const loan = p * 0.8;
          return [formatUSD(p), formatUSD(loan), ...[5.5, 6.5, 7.5].map((r) => formatUSD(monthlyPayment(loan, r, 30)))];
        })}
      />
    );
  },

  'us-mortgage-term-compare': () => {
    const loan = 320000;
    return (
      <Table
        caption={`15 vs 20 vs 30 years on a ${formatUSD(loan)} loan at 6.5%`}
        headers={['Term', 'Monthly P&I', 'Total interest']}
        rows={[15, 20, 30].map((y) => {
          const m = monthlyPayment(loan, 6.5, y);
          return [`${y} years`, formatUSD(m), formatUSD(m * y * 12 - loan)];
        })}
      />
    );
  },

  'uk-mortgage-examples': () => {
    const loans = [150000, 200000, 250000, 300000, 400000];
    return (
      <Table
        caption="Monthly repayment on a 25-year repayment mortgage"
        headers={['Mortgage', 'At 4%', 'At 4.5%', 'At 5%', 'At 5.5%']}
        rows={loans.map((l) => [formatGBP(l), ...[4, 4.5, 5, 5.5].map((r) => formatGBP(monthlyPayment(l, r, 25)))])}
      />
    );
  },

  'uk-stamp-duty-table': () => (
    <Table
      caption="Stamp Duty Land Tax (England & NI, main residence, from 1 April 2025)"
      headers={['Property price', 'Standard', 'First-time buyer']}
      rows={[200000, 250000, 300000, 400000, 500000, 600000, 1000000].map((p) => [
        formatGBP(p),
        formatGBP(ukStampDuty(p, false)),
        p > MORTGAGE_RULES.UK.firstTimeBuyerPriceCap ? `${formatGBP(ukStampDuty(p, true))} (no relief)` : formatGBP(ukStampDuty(p, true)),
      ])}
    />
  ),

  'sip-examples': () => (
    <Table
      caption="SIP value at 12% a year (monthly compounding, no step-up)"
      headers={['Monthly SIP', '5 years', '10 years', '15 years', '20 years']}
      rows={[2000, 5000, 10000, 25000].map((m) => [
        formatINR(m),
        ...[5, 10, 15, 20].map((y) => formatINR(sipFutureValue({ monthly: m, ratePct: 12, years: y }).value)),
      ])}
    />
  ),

  'sip-rate-compare': () => (
    <Table
      caption="₹10,000 a month for 15 years at different returns"
      headers={['Return', 'Invested', 'Value', 'Returns']}
      rows={[8, 10, 12, 14].map((r) => {
        const s = sipFutureValue({ monthly: 10000, ratePct: r, years: 15 });
        return [`${r}%`, formatINR(s.invested), formatINR(s.value), formatINR(s.gains)];
      })}
    />
  ),

  'fd-examples': () => (
    <Table
      caption="Maturity of ₹1,00,000 with quarterly compounding"
      headers={['Rate', '1 year', '3 years', '5 years']}
      rows={[6, 6.5, 7, 7.5].map((r) => [`${r}%`, ...[1, 3, 5].map((y) => formatINR(fdMaturity({ principal: 100000, ratePct: r, years: y }).maturity))])}
    />
  ),

  'ppf-examples': () => (
    <Table
      caption={`PPF maturity at ${SAVINGS_RULES.ppf.ratePct}% (deposit before 5 April each year)`}
      headers={['Yearly deposit', '15 years', '20 years', '25 years']}
      rows={[25000, 50000, 100000, 150000].map((d) => [formatINR(d), ...[15, 20, 25].map((y) => formatINR(ppfMaturity({ yearly: d, years: y }).maturity))])}
    />
  ),

  '401k-limits-table': () => (
    <Table
      caption={`401(k) employee contribution limits for ${US_401K.year}`}
      headers={['Your age in the year', 'Elective deferral', 'Catch-up', 'Total you can defer']}
      rows={[
        ['Under 50', formatUSD(US_401K.electiveLimit), '—', formatUSD(employeeLimit(40))],
        ['50–59 or 64+', formatUSD(US_401K.electiveLimit), formatUSD(US_401K.catchUp50), formatUSD(employeeLimit(55))],
        ['60–63', formatUSD(US_401K.electiveLimit), formatUSD(US_401K.catchUp60to63), formatUSD(employeeLimit(61))],
      ]}
    />
  ),

  '401k-growth-examples': () => (
    <Table
      caption="Balance at 65 contributing 10% total (you + employer) of a salary rising 3% a year, 7% return, starting from $0"
      headers={['Starting salary', 'Start at 25', 'Start at 35', 'Start at 45']}
      rows={[50000, 75000, 100000].map((s) => [
        formatUSD(s),
        ...[25, 35, 45].map((a) => formatUSD(project401k({ age: a, retireAge: 65, salary: s, contribPct: 10, returnPct: 7, raisePct: 3 }).balance)),
      ])}
    />
  ),

  'uk-student-loan-thresholds': () => (
    <Table
      caption={`Student loan repayment thresholds ${UK_STUDENT_LOANS.taxYear}`}
      headers={['Plan', 'Who', 'Yearly threshold', 'Rate', 'Written off after']}
      rows={Object.values(UK_STUDENT_LOANS.plans).map((p) => [p.label, p.who, formatGBP(p.threshold), formatPct(p.rate, 0), `${p.writeOffYears} years`])}
    />
  ),

  'uk-student-loan-examples': () => (
    <Table
      caption={`Monthly repayment by salary (${UK_STUDENT_LOANS.taxYear})`}
      headers={['Salary', 'Plan 1', 'Plan 2', 'Plan 4', 'Plan 5', 'Postgraduate']}
      rows={[25000, 30000, 35000, 40000, 50000, 60000].map((s) => [
        formatGBP(s),
        ...['plan1', 'plan2', 'plan4', 'plan5', 'postgrad'].map((p) => formatGBP(studentLoanRepayment(s, p) / 12)),
      ])}
    />
  ),

  'gst-rate-table': () => (
    <Table
      caption="GST slabs after GST 2.0 (from 22 September 2025)"
      headers={['Rate', 'Typical goods and services', 'GST on ₹10,000']}
      rows={CONSUMPTION_TAX_RULES.IN.rates.map((x) => [x.label, x.examples, formatINR(applyTax(10000, x.rate).tax)])}
    />
  ),

  'gst-examples': () => (
    <Table
      caption="Removing GST from an inclusive price"
      headers={['Price incl. GST', 'At 5%: GST / taxable value', 'At 18%: GST / taxable value', 'At 40%: GST / taxable value']}
      rows={[1000, 11800, 50000, 100000].map((p) => [
        formatINR(p),
        ...[5, 18, 40].map((r) => {
          const t = applyTax(p, r, 'remove');
          return `${inr2(t.tax)} / ${inr2(t.net)}`;
        }),
      ])}
    />
  ),

  'us-sales-tax-table': () => (
    <Table
      caption={`State sales tax rates as of ${CONSUMPTION_TAX_RULES.US.asOf} (local rates are added on top)`}
      headers={['State', 'State rate', 'Tax on $100']}
      rows={US_STATE_SALES_TAX.map(([, name, rate]) => [name, `${rate}%`, formatUSD(applyTax(100, rate).tax, 2)])}
    />
  ),

  'vat-examples': () => (
    <Table
      caption="Adding and removing 20% VAT"
      headers={['Amount', 'Add VAT: gross', 'Remove VAT: net', 'Remove VAT: VAT']}
      rows={[10, 100, 250, 1000, 5000].map((a) => {
        const rem = applyTax(a, 20, 'remove');
        return [gbp2(a), gbp2(applyTax(a, 20).gross), gbp2(rem.net), gbp2(rem.tax)];
      })}
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

