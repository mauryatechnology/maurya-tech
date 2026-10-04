/**
 * US paycheck engine: federal brackets by filing status (tax year 2026), FICA, and
 * state income tax for a curated set of states. Pure functions — client-safe.
 *
 * State tables carry their own `dataYear`: states publish next-year brackets late, so
 * a state may lag the federal year. The UI shows this label; update when states publish.
 * State payroll-insurance programs (CA SDI, NY SDI/PFL, WA Cares/PFML) and local/city
 * income taxes (e.g. NYC) are NOT included — the methodology page says so.
 */
import { progressiveTax, marginalRate } from './core.js';

export const US_FILING_STATUS = {
  single: {
    label: 'Single',
    standardDeduction: 16100,
    additionalMedicareThreshold: 200000,
    brackets: [
      { min: 0, max: 12400, rate: 0.1 },
      { min: 12400, max: 50400, rate: 0.12 },
      { min: 50400, max: 105700, rate: 0.22 },
      { min: 105700, max: 201775, rate: 0.24 },
      { min: 201775, max: 256225, rate: 0.32 },
      { min: 256225, max: 640600, rate: 0.35 },
      { min: 640600, max: Infinity, rate: 0.37 },
    ],
  },
  mfj: {
    label: 'Married filing jointly',
    standardDeduction: 32200,
    additionalMedicareThreshold: 250000,
    brackets: [
      { min: 0, max: 24800, rate: 0.1 },
      { min: 24800, max: 100800, rate: 0.12 },
      { min: 100800, max: 211400, rate: 0.22 },
      { min: 211400, max: 403550, rate: 0.24 },
      { min: 403550, max: 512450, rate: 0.32 },
      { min: 512450, max: 768700, rate: 0.35 },
      { min: 768700, max: Infinity, rate: 0.37 },
    ],
  },
  hoh: {
    label: 'Head of household',
    standardDeduction: 24150,
    additionalMedicareThreshold: 200000,
    brackets: [
      { min: 0, max: 17700, rate: 0.1 },
      { min: 17700, max: 67450, rate: 0.12 },
      { min: 67450, max: 105700, rate: 0.22 },
      { min: 105700, max: 201750, rate: 0.24 },
      { min: 201750, max: 256200, rate: 0.32 },
      { min: 256200, max: 640600, rate: 0.35 },
      { min: 640600, max: Infinity, rate: 0.37 },
    ],
  },
};

export const US_PAYROLL = {
  socialSecurityRate: 0.062,
  socialSecurityWageBase: 184500,
  medicareRate: 0.0145,
  additionalMedicareRate: 0.009,
  limit401k: 24500, // 2026 elective deferral limit (under 50)
};

export const PAY_FREQUENCIES = {
  annual: { label: 'Annual salary', periods: 1 },
  monthly: { label: 'Monthly', periods: 12 },
  semimonthly: { label: 'Semi-monthly (24/yr)', periods: 24 },
  biweekly: { label: 'Bi-weekly (26/yr)', periods: 26 },
  weekly: { label: 'Weekly', periods: 52 },
  hourly: { label: 'Hourly', periods: null },
};

const flat = (rate) => [{ min: 0, max: Infinity, rate }];

/**
 * Per-state rules. brackets[status] falls back to single when a status is missing.
 * `credit` is a non-refundable personal credit subtracted from computed tax.
 */
export const US_STATES = {
  TX: { name: 'Texas', noIncomeTax: true, dataYear: 'no state income tax' },
  FL: { name: 'Florida', noIncomeTax: true, dataYear: 'no state income tax' },
  WA: { name: 'Washington', noIncomeTax: true, dataYear: 'no state wage income tax' },
  NV: { name: 'Nevada', noIncomeTax: true, dataYear: 'no state income tax' },
  TN: { name: 'Tennessee', noIncomeTax: true, dataYear: 'no state wage income tax' },
  IL: {
    name: 'Illinois',
    dataYear: '2026 rates (IDOR)',
    exemption: { single: 2925, mfj: 5850, hoh: 2925 },
    brackets: { single: flat(0.0495) },
  },
  CA: {
    name: 'California',
    dataYear: '2025 FTB tables (2026 not yet published)',
    standardDeduction: { single: 5706, mfj: 11412, hoh: 11412 },
    credit: { single: 153, mfj: 306, hoh: 153 },
    brackets: {
      single: [
        { min: 0, max: 11079, rate: 0.01 },
        { min: 11079, max: 26264, rate: 0.02 },
        { min: 26264, max: 41452, rate: 0.04 },
        { min: 41452, max: 57542, rate: 0.06 },
        { min: 57542, max: 72724, rate: 0.08 },
        { min: 72724, max: 371479, rate: 0.093 },
        { min: 371479, max: 445771, rate: 0.103 },
        { min: 445771, max: 742953, rate: 0.113 },
        { min: 742953, max: 1000000, rate: 0.123 },
        { min: 1000000, max: Infinity, rate: 0.133 }, // incl. 1% Mental Health Services Tax
      ],
      mfj: [
        { min: 0, max: 22158, rate: 0.01 },
        { min: 22158, max: 52528, rate: 0.02 },
        { min: 52528, max: 82904, rate: 0.04 },
        { min: 82904, max: 115084, rate: 0.06 },
        { min: 115084, max: 145448, rate: 0.08 },
        { min: 145448, max: 742958, rate: 0.093 },
        { min: 742958, max: 891542, rate: 0.103 },
        { min: 891542, max: 1000000, rate: 0.113 },
        { min: 1000000, max: 1485906, rate: 0.123 }, // 11.3% + 1% MHST above $1M
        { min: 1485906, max: Infinity, rate: 0.133 },
      ],
    },
  },
  GA: {
    name: 'Georgia',
    dataYear: '2026 rate and deduction (HB 463)',
    standardDeduction: { single: 15000, mfj: 30000, hoh: 15000 },
    brackets: { single: flat(0.0499) },
  },
  MA: {
    name: 'Massachusetts',
    dataYear: '2026 rates',
    exemption: { single: 4400, mfj: 8800, hoh: 6800 },
    brackets: {
      // 5% flat plus the 4% millionaire surtax on income above the indexed threshold
      single: [
        { min: 0, max: 1107750, rate: 0.05 },
        { min: 1107750, max: Infinity, rate: 0.09 },
      ],
    },
  },
  NJ: {
    name: 'New Jersey',
    dataYear: '2025 rates (not indexed)',
    exemption: { single: 1000, mfj: 2000, hoh: 1000 },
    brackets: {
      single: [
        { min: 0, max: 20000, rate: 0.014 },
        { min: 20000, max: 35000, rate: 0.0175 },
        { min: 35000, max: 40000, rate: 0.035 },
        { min: 40000, max: 75000, rate: 0.05525 },
        { min: 75000, max: 500000, rate: 0.0637 },
        { min: 500000, max: 1000000, rate: 0.0897 },
        { min: 1000000, max: Infinity, rate: 0.1075 },
      ],
      // Married filing jointly and head of household share NJ's Table B
      mfj: [
        { min: 0, max: 20000, rate: 0.014 },
        { min: 20000, max: 50000, rate: 0.0175 },
        { min: 50000, max: 70000, rate: 0.0245 },
        { min: 70000, max: 80000, rate: 0.035 },
        { min: 80000, max: 150000, rate: 0.05525 },
        { min: 150000, max: 500000, rate: 0.0637 },
        { min: 500000, max: 1000000, rate: 0.0897 },
        { min: 1000000, max: Infinity, rate: 0.1075 },
      ],
      hoh: [
        { min: 0, max: 20000, rate: 0.014 },
        { min: 20000, max: 50000, rate: 0.0175 },
        { min: 50000, max: 70000, rate: 0.0245 },
        { min: 70000, max: 80000, rate: 0.035 },
        { min: 80000, max: 150000, rate: 0.05525 },
        { min: 150000, max: 500000, rate: 0.0637 },
        { min: 500000, max: 1000000, rate: 0.0897 },
        { min: 1000000, max: Infinity, rate: 0.1075 },
      ],
    },
  },
  NC: {
    name: 'North Carolina',
    dataYear: '2026 rate (NCDOR)',
    standardDeduction: { single: 12750, mfj: 25500, hoh: 19125 },
    brackets: { single: flat(0.0399) },
  },
  PA: {
    name: 'Pennsylvania (state only, excl. local EIT)',
    dataYear: 'flat rate, unchanged since 2004',
    taxes401k: true, // PA does not exclude employee 401(k) deferrals from taxable wages
    brackets: { single: flat(0.0307) },
  },
  NY: {
    name: 'New York (state only, excl. NYC)',
    dataYear: '2026 rates',
    standardDeduction: { single: 8000, mfj: 16050, hoh: 11200 },
    brackets: {
      single: [
        { min: 0, max: 8500, rate: 0.039 },
        { min: 8500, max: 11700, rate: 0.044 },
        { min: 11700, max: 13900, rate: 0.0515 },
        { min: 13900, max: 80650, rate: 0.054 },
        { min: 80650, max: 215400, rate: 0.059 },
        { min: 215400, max: 1077550, rate: 0.0685 },
        { min: 1077550, max: 5000000, rate: 0.0965 },
        { min: 5000000, max: 25000000, rate: 0.103 },
        { min: 25000000, max: Infinity, rate: 0.109 },
      ],
      mfj: [
        { min: 0, max: 17150, rate: 0.039 },
        { min: 17150, max: 23600, rate: 0.044 },
        { min: 23600, max: 27900, rate: 0.0515 },
        { min: 27900, max: 161550, rate: 0.054 },
        { min: 161550, max: 323200, rate: 0.059 },
        { min: 323200, max: 2155350, rate: 0.0685 },
        { min: 2155350, max: 5000000, rate: 0.0965 },
        { min: 5000000, max: 25000000, rate: 0.103 },
        { min: 25000000, max: Infinity, rate: 0.109 },
      ],
      hoh: [
        { min: 0, max: 12800, rate: 0.039 },
        { min: 12800, max: 17650, rate: 0.044 },
        { min: 17650, max: 20900, rate: 0.0515 },
        { min: 20900, max: 107650, rate: 0.054 },
        { min: 107650, max: 269300, rate: 0.059 },
        { min: 269300, max: 1616450, rate: 0.0685 },
        { min: 1616450, max: 5000000, rate: 0.0965 },
        { min: 5000000, max: 25000000, rate: 0.103 },
        { min: 25000000, max: Infinity, rate: 0.109 },
      ],
    },
  },
  AZ: {
    name: 'Arizona',
    dataYear: '2026 rate (ADOR); deduction follows federal',
    standardDeduction: { single: 16100, mfj: 32200, hoh: 24150 },
    brackets: { single: flat(0.025) },
  },
  CO: {
    name: 'Colorado',
    dataYear: '2026 rate; starts from federal taxable income',
    // Colorado taxes federal taxable income, i.e. after the federal standard deduction
    standardDeduction: { single: 16100, mfj: 32200, hoh: 24150 },
    brackets: { single: flat(0.044) },
  },
  MI: {
    name: 'Michigan (state only, excl. city tax)',
    dataYear: '2026 rate and exemption (Treasury)',
    exemption: { single: 5900, mfj: 11800, hoh: 5900 },
    brackets: { single: flat(0.0425) },
  },
  OH: {
    name: 'Ohio (state only, excl. city/school tax)',
    dataYear: '2026 flat rate (HB 96); personal exemption not included',
    // No tax at or below $26,050; above it, $332 plus 2.75% of the excess
    calc: (taxable) => (taxable <= 26050 ? 0 : 332 + (taxable - 26050) * 0.0275),
  },
  VA: {
    name: 'Virginia',
    dataYear: '2026 rates',
    standardDeduction: { single: 8750, mfj: 17500, hoh: 8750 },
    exemption: { single: 930, mfj: 1860, hoh: 930 },
    brackets: {
      single: [
        { min: 0, max: 3000, rate: 0.02 },
        { min: 3000, max: 5000, rate: 0.03 },
        { min: 5000, max: 17000, rate: 0.05 },
        { min: 17000, max: Infinity, rate: 0.0575 },
      ],
    },
  },
  OTHER: { name: 'Other state (enter a flat rate)', custom: true, dataYear: 'your estimate' },
};

export function usStateTax(stateCode, status, stateWages, customRate = 0) {
  const st = US_STATES[stateCode] || US_STATES.TX;
  if (st.noIncomeTax) return 0;
  if (st.custom) return Math.max(0, stateWages) * Math.max(0, customRate);
  const deduction = st.standardDeduction?.[status] ?? st.standardDeduction?.single ?? 0;
  const exemption = st.exemption?.[status] ?? st.exemption?.single ?? 0;
  const taxable = Math.max(0, stateWages - deduction - exemption);
  const credit = st.credit?.[status] ?? st.credit?.single ?? 0;
  // A few states (e.g. Ohio) publish a schedule that is not a plain bracket table.
  const gross = st.calc ? st.calc(taxable, status) : progressiveTax(taxable, st.brackets[status] || st.brackets.single);
  return Math.max(0, gross - credit);
}

/**
 * Annualised paycheck estimate for a W-2 employee.
 * - Traditional 401(k) reduces federal/state taxable wages but NOT FICA wages.
 * - Section 125 health premiums reduce federal, state and FICA wages.
 */
export function calcUsPaycheck({
  grossAnnual,
  status = 'single',
  state = 'TX',
  customStateRate = 0,
  pct401k = 0,
  healthAnnual = 0,
  periods = 26,
}) {
  const fs = US_FILING_STATUS[status] || US_FILING_STATUS.single;
  const gross = Math.max(0, Number(grossAnnual) || 0);
  const k401 = Math.min(gross * Math.max(0, Number(pct401k) || 0) / 100, US_PAYROLL.limit401k);
  const health = Math.min(Math.max(0, Number(healthAnnual) || 0), gross - k401);

  const ficaWages = Math.max(0, gross - health);
  const socialSecurity = Math.min(ficaWages, US_PAYROLL.socialSecurityWageBase) * US_PAYROLL.socialSecurityRate;
  const medicare = ficaWages * US_PAYROLL.medicareRate
    + Math.max(0, ficaWages - fs.additionalMedicareThreshold) * US_PAYROLL.additionalMedicareRate;

  const taxableWages = Math.max(0, gross - k401 - health);
  const federalTaxable = Math.max(0, taxableWages - fs.standardDeduction);
  const federalTax = progressiveTax(federalTaxable, fs.brackets);
  const stateWages = US_STATES[state]?.taxes401k ? Math.max(0, gross - health) : taxableWages;
  const stateTax = usStateTax(state, status, stateWages, (Number(customStateRate) || 0) / 100);

  const taxes = federalTax + socialSecurity + medicare + stateTax;
  const deductions = k401 + health;
  const net = Math.max(0, gross - taxes - deductions);
  const r = (n) => Math.round(n);
  const per = (n) => Math.round(n / periods);

  return {
    gross: r(gross),
    k401: r(k401),
    health: r(health),
    federalTaxable: r(federalTaxable),
    federalTax: r(federalTax),
    socialSecurity: r(socialSecurity),
    medicare: r(medicare),
    stateTax: r(stateTax),
    taxes: r(taxes),
    deductions: r(deductions),
    net: r(net),
    perPeriod: {
      gross: per(gross),
      federalTax: per(federalTax),
      socialSecurity: per(socialSecurity),
      medicare: per(medicare),
      stateTax: per(stateTax),
      k401: per(k401),
      health: per(health),
      net: per(net),
    },
    effectiveTaxRate: gross > 0 ? taxes / gross : 0,
    marginalFederalRate: marginalRate(federalTaxable, fs.brackets),
  };
}
