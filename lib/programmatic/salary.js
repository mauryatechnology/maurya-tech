/**
 * Programmatic long-tail salary pages (plan §5.3). Each value produces a page with its
 * own computed breakdown, so pages are genuinely different — not a template with one
 * number swapped. Batches are kept small on purpose; add values only after the
 * previous batch is mostly indexed in Search Console.
 */
import {
  calcIndiaSalary,
  calcUsTakeHome,
  calcUkTakeHome,
  calcUsPaycheck,
  US_FILING_STATUS,
  TAX_RULES,
  formatINR,
  formatUSD,
  formatGBP,
} from '@/lib/tax';

const range = (from, to, step = 1) => {
  const out = [];
  for (let v = from; v <= to + 1e-9; v += step) out.push(Math.round(v * 100) / 100);
  return out;
};

const matcher = (re) => (slug) => {
  const m = re.exec(slug);
  return m ? Number(m[1]) : null;
};

/**
 * Every programmatic set. A country can have several sets (e.g. US hourly→annual and
 * annual→hourly); `primary` marks the set used when only a country is given.
 * `toolSlug` + `initialProps` decide which calculator is embedded, pre-filled.
 */
export const SALARY_SET_LIST = [
  {
    id: 'in-lpa',
    country: 'in',
    primary: true,
    values: range(4, 25, 1), // LPA
    slug: (v) => `${v}-lpa-in-hand-salary`,
    parse: matcher(/^(\d+(?:\.\d+)?)-lpa-in-hand-salary$/),
    label: (v) => `₹${v} LPA`,
    toolSlug: 'ctc-calculator',
    initialProps: (v) => ({ initialCtc: v * 100000 }),
  },
  {
    id: 'us-hourly',
    country: 'us',
    primary: true,
    values: [...range(10, 40, 1), 45, 50, 55, 60], // $ per hour
    slug: (v) => `${v}-an-hour-is-how-much-a-year`,
    parse: matcher(/^(\d+(?:\.\d+)?)-an-hour-is-how-much-a-year$/),
    label: (v) => `$${v}/hour`,
    toolSlug: 'hourly-to-annual-salary',
    initialProps: (v) => ({ initialHourlyRate: v }),
  },
  {
    id: 'us-annual',
    country: 'us',
    values: range(30000, 200000, 5000), // $ per year
    slug: (v) => `${v / 1000}k-a-year-is-how-much-an-hour`,
    parse: (slug) => {
      const m = /^(\d+)k-a-year-is-how-much-an-hour$/.exec(slug);
      return m ? Number(m[1]) * 1000 : null;
    },
    label: (v) => `$${v / 1000}k/year`,
    toolSlug: 'us-paycheck-calculator',
    initialProps: (v) => ({ initialAnnual: v }),
  },
  {
    id: 'uk-annual',
    country: 'uk',
    primary: true,
    values: [...range(15000, 50000, 2500), ...range(55000, 100000, 5000)], // £ per year
    slug: (v) => `${v}-after-tax`,
    parse: matcher(/^(\d+)-after-tax$/),
    label: (v) => formatGBP(v),
    toolSlug: 'ctc-calculator',
    initialProps: (v) => ({ initialCtc: v }),
  },
];

const SET_BY_ID = Object.fromEntries(SALARY_SET_LIST.map((s) => [s.id, s]));

/** Primary set per country (kept for callers that only know the country). */
export const SALARY_SETS = Object.fromEntries(SALARY_SET_LIST.filter((s) => s.primary).map((s) => [s.country, s]));

export const setsForCountry = (country) => SALARY_SET_LIST.filter((s) => s.country === country);

const pickSet = (country, setId) => (setId ? SET_BY_ID[setId] : SALARY_SETS[country]);

export function salaryParams() {
  return SALARY_SET_LIST.flatMap((set) => set.values.map((v) => ({ country: set.country, slug: set.slug(v) })));
}

/** Resolves a /[country]/salary/[slug] URL to its set and value (or null → 404). */
export function resolveSalaryPage(country, slug) {
  for (const set of setsForCountry(country)) {
    const v = set.parse(slug);
    if (v != null && set.values.includes(v)) return { set, value: v };
  }
  return null;
}

export function isValidSalaryPage(country, slug) {
  return resolveSalaryPage(country, slug)?.value ?? null;
}

export function salaryPagePath(country, value, setId) {
  const set = pickSet(country, setId);
  return set ? `/${set.country}/salary/${set.slug(value)}` : null;
}

/** Link to a programmatic page if one exists for this exact value. */
export function salaryPathIfExists(country, value, setId) {
  const set = pickSet(country, setId);
  return set && set.values.includes(value) ? salaryPagePath(country, value, set.id) : null;
}

export function neighbours(country, value, n = 4, setId) {
  const vals = pickSet(country, setId)?.values || [];
  const i = vals.indexOf(value);
  if (i === -1) return [];
  return vals.slice(Math.max(0, i - n), i).concat(vals.slice(i + 1, i + 1 + n));
}

/* ------------------------------------------------------------ page models */

export function buildIndiaPage(lpa) {
  const ctc = Math.round(lpa * 100000);
  const r = calcIndiaSalary({ ctc });
  const monthly = r.monthlyInHand;
  return {
    country: 'in',
    value: lpa,
    title: `${lpa} LPA In-Hand Salary: ${formatINR(monthly)}/month (FY 2026-27)`,
    h1: `₹${lpa} LPA in-hand salary per month`,
    description: `₹${lpa} LPA CTC = about ${formatINR(monthly)}/month in-hand under the new regime (FY 2026-27), after PF, professional tax and ${r.tax.total ? `${formatINR(r.tax.total)} tax` : 'zero income tax'}. Full breakdown.`,
    answer: `On a CTC of ₹${lpa} lakh (${formatINR(ctc)} a year), your estimated in-hand salary is ${formatINR(monthly)} per month, or ${formatINR(r.annualInHand)} a year, under the new tax regime for FY 2026-27. This assumes basic pay of 50% of CTC, PF capped at ₹1,800 a month and ₹2,400 professional tax.`,
    result: r,
    rows: [
      ['Annual CTC', formatINR(r.ctc)],
      ['Employer PF (inside CTC)', `− ${formatINR(r.employerPf)}`],
      ['Gross salary', formatINR(r.grossSalary)],
      ['Standard deduction', `− ${formatINR(r.standardDeduction)}`],
      ['Taxable income', formatINR(r.taxableIncome)],
      ['Income tax (slab tax)', formatINR(r.tax.slabTax)],
      ...(r.tax.rebate ? [['Section 87A rebate', `− ${formatINR(r.tax.rebate)}`]] : []),
      ...(r.tax.marginalRelief ? [['Marginal relief', `− ${formatINR(r.tax.marginalRelief)}`]] : []),
      ['Health & education cess (4%)', formatINR(r.tax.cess)],
      ['Total income tax', formatINR(r.tax.total)],
      ['Employee PF', `− ${formatINR(r.employeePf)}`],
      ['Professional tax', `− ${formatINR(r.professionalTax)}`],
      ['Annual in-hand', formatINR(r.annualInHand)],
      ['Monthly in-hand', formatINR(monthly)],
    ],
    periods: [
      ['Monthly', formatINR(monthly)],
      ['Weekly', formatINR(r.annualInHand / 52)],
      ['Daily (22 working days/month)', formatINR(monthly / 22)],
    ],
    facts: [
      r.taxableIncome <= TAX_RULES.IN.rebateLimit
        ? `Your taxable income of ${formatINR(r.taxableIncome)} is within the ₹12 lakh Section 87A limit, so you pay no income tax under the new regime.`
        : `Your taxable income of ${formatINR(r.taxableIncome)} falls in the ${(r.marginalSlabRate * 100).toFixed(0)}% slab; your effective tax rate on gross salary is ${(r.effectiveTaxRate * 100).toFixed(1)}%.`,
      `Deductions that never reach your bank account add up to ${formatINR(r.totalDeductions)} a year — ${((r.totalDeductions / r.ctc) * 100).toFixed(1)}% of CTC.`,
      `If your employer does not cap PF at ₹1,800 a month, your monthly in-hand would be ${formatINR(calcIndiaSalary({ ctc, pfCapped: false }).monthlyInHand)} (with a larger PF balance instead).`,
    ],
    faqs: [
      { question: `What is the in-hand salary for ₹${lpa} LPA?`, answer: `About ${formatINR(monthly)} per month under the new tax regime for FY 2026-27, assuming 50% basic pay, capped PF and ₹2,400 professional tax.` },
      { question: `How much tax do I pay on ₹${lpa} LPA?`, answer: r.tax.total ? `About ${formatINR(r.tax.total)} a year (${formatINR(r.tax.total / 12)} a month) including 4% cess, under the new regime.` : `Nothing. Your taxable income stays within ₹12 lakh, so the Section 87A rebate brings tax to zero under the new regime.` },
      { question: `Is ₹${lpa} LPA a good salary in India?`, answer: `It depends on city, role and experience. In-hand of ${formatINR(monthly)} a month goes further in tier-2 cities than in Mumbai or Bengaluru, where rent can take 30–40% of take-home pay.` },
      { question: 'Why is in-hand lower than CTC ÷ 12?', answer: `CTC includes employer PF (${formatINR(r.employerPf)} a year here), which goes to your PF account, and your gross salary is reduced by your own PF, professional tax and income tax.` },
    ],
  };
}

export function buildUsPage(hourly) {
  const rules = TAX_RULES.US;
  const annual = hourly * rules.fullTimeHours;
  const w2 = calcUsTakeHome({ gross: annual, type: 'w2' });
  const c1099 = calcUsTakeHome({ gross: annual, type: '1099' });
  const money = (v) => formatUSD(v);
  return {
    country: 'us',
    value: hourly,
    title: `$${hourly} an Hour Is How Much a Year? (${money(annual)} Before Tax)`,
    h1: `$${hourly} an hour is how much a year?`,
    description: `$${hourly} an hour is ${money(annual)} a year for a full-time 40-hour week — about ${money(w2.netMonthly)} a month after federal tax and FICA (2026). See weekly, bi-weekly and 1099 figures.`,
    answer: `$${hourly} an hour is ${money(annual)} a year before tax, based on 40 hours a week for 52 weeks (2,080 hours). After 2026 federal income tax and FICA, a single W-2 employee takes home about ${money(w2.net)} a year, or ${money(w2.netMonthly)} a month, before any state tax.`,
    rows: [
      ['Yearly (2,080 hrs)', money(annual), money(w2.net)],
      ['Monthly', money(annual / 12), money(w2.net / 12)],
      ['Bi-weekly', money(annual / 26), money(w2.net / 26)],
      ['Weekly (40 hrs)', money(annual / 52), money(w2.net / 52)],
      ['Daily (8 hrs)', money(hourly * 8), money(w2.net / 260)],
    ],
    rowHeaders: ['Period', 'Gross pay', 'Take-home (W-2, before state tax)'],
    taxRows: [
      ['Federal income tax', money(w2.federalTax), money(c1099.federalTax)],
      ['Social Security', money(w2.socialSecurity), money(c1099.socialSecurity)],
      ['Medicare', money(w2.medicare), money(c1099.medicare)],
      ['Total tax', money(w2.totalTax), money(c1099.totalTax)],
      ['Take-home per year', money(w2.net), money(c1099.net)],
    ],
    taxHeaders: ['', 'W-2 employee', '1099 contractor'],
    schedules: [
      ['30 hours/week', money(hourly * 30 * 52)],
      ['35 hours/week', money(hourly * 35 * 52)],
      ['40 hours/week, 50 weeks', money(hourly * 2000)],
      ['40 hours/week + 5 hrs overtime (1.5×)', money(hourly * 52 * (40 + 5 * 1.5))],
    ],
    facts: [
      `That is ${(hourly / rules.federalMinimumWage).toFixed(1)}× the federal minimum wage of $7.25 an hour.`,
      `Your top federal bracket is ${(w2.marginalRate * 100).toFixed(0)}%, but your effective federal + FICA rate is ${(w2.effectiveTaxRate * 100).toFixed(1)}% because of the $${rules.standardDeduction.toLocaleString('en-US')} standard deduction and lower brackets.`,
      `As a 1099 contractor at the same rate you would take home about ${money(c1099.net)} — ${money(w2.net - c1099.net)} less — because you pay both halves of Social Security and Medicare.`,
    ],
    faqs: [
      { question: `How much is $${hourly} an hour annually?`, answer: `${money(annual)} a year for 40 hours a week, 52 weeks a year.` },
      { question: `How much is $${hourly} an hour a month?`, answer: `${money(annual / 12)} a month before tax, or about ${money(w2.netMonthly)} after federal tax and FICA for a single W-2 employee.` },
      { question: `How much is $${hourly} an hour bi-weekly?`, answer: `${money(annual / 26)} gross per bi-weekly paycheck (80 hours).` },
      { question: `What is $${hourly} an hour after taxes?`, answer: `About ${money(w2.net)} a year (${money(w2.net / 2080, 2)} per hour worked) after 2026 federal income tax and FICA, before state and local taxes.` },
    ],
  };
}

export function buildUkPage(gross) {
  const r = calcUkTakeHome({ gross });
  const money = (v) => formatGBP(v);
  return {
    country: 'uk',
    value: gross,
    title: `${money(gross)} After Tax: ${money(r.netMonthly)} a Month Take-Home (2026/27)`,
    h1: `${money(gross)} after tax in the UK`,
    description: `On a ${money(gross)} salary you take home ${money(r.net)} a year — ${money(r.netMonthly)} a month — after Income Tax and National Insurance for 2026/27. Full breakdown inside.`,
    answer: `On a salary of ${money(gross)}, your take-home pay is about ${money(r.net)} a year, ${money(r.netMonthly)} a month or ${money(r.netWeekly)} a week for the 2026/27 tax year. You pay ${money(r.incomeTax)} Income Tax and ${money(r.nationalInsurance)} National Insurance (England, Wales & NI rates, 1257L tax code, no pension or student loan).`,
    rows: [
      ['Gross salary', money(r.gross), money(r.gross / 12), money(r.gross / 52)],
      ['Personal Allowance', money(r.personalAllowance), money(r.personalAllowance / 12), money(r.personalAllowance / 52)],
      ['Income Tax', `− ${money(r.incomeTax)}`, `− ${money(r.incomeTax / 12)}`, `− ${money(r.incomeTax / 52)}`],
      ['National Insurance', `− ${money(r.nationalInsurance)}`, `− ${money(r.nationalInsurance / 12)}`, `− ${money(r.nationalInsurance / 52)}`],
      ['Take-home pay', money(r.net), money(r.netMonthly), money(r.netWeekly)],
    ],
    rowHeaders: ['', 'Yearly', 'Monthly', 'Weekly'],
    facts: [
      `You are a ${r.band} taxpayer. Your effective rate of tax and National Insurance combined is ${(r.effectiveTaxRate * 100).toFixed(1)}%.`,
      `At 37.5 hours a week, ${money(gross)} works out to about £${(gross / 1950).toFixed(2)} an hour before tax.`,
      `A 5% salary-sacrifice pension contribution (${money(gross * 0.05)}) would reduce both Income Tax and National Insurance, so your take-home falls by less than the amount saved.`,
    ],
    faqs: [
      { question: `How much is ${money(gross)} a month after tax?`, answer: `About ${money(r.netMonthly)} a month for 2026/27, assuming a 1257L tax code and no pension or student loan deductions.` },
      { question: `How much tax do I pay on ${money(gross)}?`, answer: `${money(r.incomeTax)} Income Tax and ${money(r.nationalInsurance)} National Insurance a year — ${money(r.totalTax)} in total.` },
      { question: `What is ${money(gross)} a week after tax?`, answer: `About ${money(r.netWeekly)} a week.` },
      { question: 'Is this different in Scotland?', answer: 'Yes. Scotland has its own Income Tax bands, so Scottish taxpayers pay a slightly different amount of Income Tax; National Insurance is the same.' },
    ],
  };
}

export function buildUsAnnualPage(annual) {
  const hours = TAX_RULES.US.fullTimeHours;
  const hourly = annual / hours;
  const money = (v, d = 0) => formatUSD(v, d);
  const k = `$${(annual / 1000).toLocaleString('en-US')}k`;
  const single = calcUsPaycheck({ grossAnnual: annual, status: 'single', periods: 26 });
  const byStatus = Object.entries(US_FILING_STATUS).map(([id, s]) => {
    const r = calcUsPaycheck({ grossAnnual: annual, status: id, periods: 26 });
    return [s.label, money(r.federalTax), money(r.net), money(r.perPeriod.net)];
  });
  const byState = [
    ['Texas / Florida / Washington (no income tax)', 'TX'],
    ['Illinois', 'IL'],
    ['New York (excl. NYC)', 'NY'],
    ['California', 'CA'],
  ].map(([label, code]) => {
    const r = calcUsPaycheck({ grossAnnual: annual, status: 'single', state: code, periods: 26 });
    return [label, money(r.stateTax), money(r.net), money(r.net / 12)];
  });
  const ca = calcUsPaycheck({ grossAnnual: annual, status: 'single', state: 'CA', periods: 26 });

  return {
    country: 'us',
    setId: 'us-annual',
    value: annual,
    title: `${k} a Year Is How Much an Hour? (${money(hourly, 2)}/hr)`,
    h1: `${money(annual)} a year is how much an hour?`,
    description: `${money(annual)} a year is ${money(hourly, 2)} an hour for a 40-hour week. After 2026 federal tax and FICA a single filer keeps about ${money(single.net / 12)} a month.`,
    answer: `${money(annual)} a year works out to ${money(hourly, 2)} an hour, based on 40 hours a week for 52 weeks (2,080 hours). A single W-2 employee in a state with no income tax takes home about ${money(single.net)} a year — ${money(single.perPeriod.net)} every two weeks — after 2026 federal income tax, Social Security and Medicare.`,
    rows: [
      ['Hourly (2,080 hrs)', money(hourly, 2), money(single.net / hours, 2)],
      ['Daily (8 hrs)', money(hourly * 8), money(single.net / 260)],
      ['Weekly', money(annual / 52), money(single.net / 52)],
      ['Bi-weekly', money(annual / 26), money(single.perPeriod.net)],
      ['Monthly', money(annual / 12), money(single.net / 12)],
      ['Yearly', money(annual), money(single.net)],
    ],
    rowHeaders: ['Period', 'Gross pay', 'Take-home (single, no state tax)'],
    taxRows: byStatus,
    taxHeaders: ['Filing status', 'Federal tax / year', 'Take-home / year', 'Per bi-weekly check'],
    taxCaption: 'Take-home by filing status (2026, no state tax)',
    stateRows: byState,
    stateHeaders: ['State (single filer)', 'State tax / year', 'Take-home / year', 'Per month'],
    facts: [
      `That is ${(hourly / TAX_RULES.US.federalMinimumWage).toFixed(1)}× the federal minimum wage of $7.25 an hour.`,
      `As a single filer your top federal bracket is ${(single.marginalFederalRate * 100).toFixed(0)}%, but your combined federal + FICA rate is ${(single.effectiveTaxRate * 100).toFixed(1)}% of gross pay.`,
      `In California the same salary loses about ${money(ca.stateTax)} a year to state income tax, leaving ${money(ca.net / 12)} a month.`,
      `Contributing 5% to a traditional 401(k) (${money(annual * 0.05)}) lowers taxable wages, so take-home falls by less than the amount saved.`,
    ],
    faqs: [
      { question: `How much is ${money(annual)} a year per hour?`, answer: `${money(hourly, 2)} an hour, assuming 40 hours a week and 52 paid weeks (2,080 hours).` },
      { question: `What is ${money(annual)} a year after taxes?`, answer: `About ${money(single.net)} a year (${money(single.net / 12)} a month) for a single filer after 2026 federal income tax and FICA, before state tax.` },
      { question: `How much is ${money(annual)} a year bi-weekly?`, answer: `${money(annual / 26)} gross per bi-weekly paycheck, or about ${money(single.perPeriod.net)} after federal tax and FICA for a single filer.` },
      { question: `How much is ${money(annual)} a year per month?`, answer: `${money(annual / 12)} a month before tax.` },
      { question: `Is ${money(annual)} a year a good salary?`, answer: `It depends heavily on location and household size. Compare take-home pay by state above and against local rent; the same salary goes much further in a no-income-tax state with lower housing costs.` },
    ],
  };
}

export function buildSalaryPage(country, value, setId) {
  const id = setId || SALARY_SETS[country]?.id;
  if (id === 'in-lpa') return buildIndiaPage(value);
  if (id === 'us-hourly') return buildUsPage(value);
  if (id === 'us-annual') return buildUsAnnualPage(value);
  if (id === 'uk-annual') return buildUkPage(value);
  return null;
}
