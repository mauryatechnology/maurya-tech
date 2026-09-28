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
    dataYear: '2025 rates',
    exemption: { single: 2850, mfj: 5700, hoh: 2850 },
    brackets: { single: flat(0.0495) },
  },
  CA: {
    name: 'California',
    dataYear: '2024 tables (indexed yearly — verify)',
    standardDeduction: { single: 5540, mfj: 11080, hoh: 11080 },
    credit: { single: 149, mfj: 298, hoh: 149 },
    brackets: {
      single: [
        { min: 0, max: 10756, rate: 0.01 },
        { min: 10756, max: 25499, rate: 0.02 },
        { min: 25499, max: 40245, rate: 0.04 },
        { min: 40245, max: 55866, rate: 0.06 },
        { min: 55866, max: 70606, rate: 0.08 },
        { min: 70606, max: 360659, rate: 0.093 },
        { min: 360659, max: 432787, rate: 0.103 },
        { min: 432787, max: 721314, rate: 0.113 },
        { min: 721314, max: 1000000, rate: 0.123 },
        { min: 1000000, max: Infinity, rate: 0.133 }, // incl. 1% Mental Health Services Tax
      ],
      mfj: [
        { min: 0, max: 21512, rate: 0.01 },
        { min: 21512, max: 50998, rate: 0.02 },
        { min: 50998, max: 80490, rate: 0.04 },
        { min: 80490, max: 111732, rate: 0.06 },
        { min: 111732, max: 141212, rate: 0.08 },
        { min: 141212, max: 721318, rate: 0.093 },
        { min: 721318, max: 865574, rate: 0.103 },
        { min: 865574, max: 1000000, rate: 0.113 },
        { min: 1000000, max: 1442628, rate: 0.123 },
        { min: 1442628, max: Infinity, rate: 0.133 },
      ],
    },
  },
  NY: {
    name: 'New York (state only, excl. NYC)',
    dataYear: '2025 tables — verify',
    standardDeduction: { single: 8000, mfj: 16050, hoh: 11200 },
    brackets: {
      single: [
        { min: 0, max: 8500, rate: 0.04 },
        { min: 8500, max: 11700, rate: 0.045 },
        { min: 11700, max: 13900, rate: 0.0525 },
        { min: 13900, max: 80650, rate: 0.055 },
        { min: 80650, max: 215400, rate: 0.06 },
        { min: 215400, max: 1077550, rate: 0.0685 },
        { min: 1077550, max: 5000000, rate: 0.0965 },
        { min: 5000000, max: 25000000, rate: 0.103 },
        { min: 25000000, max: Infinity, rate: 0.109 },
      ],
      mfj: [
        { min: 0, max: 17150, rate: 0.04 },
        { min: 17150, max: 23600, rate: 0.045 },
        { min: 23600, max: 27900, rate: 0.0525 },
        { min: 27900, max: 161550, rate: 0.055 },
        { min: 161550, max: 323200, rate: 0.06 },
        { min: 323200, max: 2155350, rate: 0.0685 },
        { min: 2155350, max: 5000000, rate: 0.0965 },
        { min: 5000000, max: 25000000, rate: 0.103 },
        { min: 25000000, max: Infinity, rate: 0.109 },
      ],
      hoh: [
        { min: 0, max: 12800, rate: 0.04 },
        { min: 12800, max: 17650, rate: 0.045 },
        { min: 17650, max: 20900, rate: 0.0525 },
        { min: 20900, max: 107650, rate: 0.055 },
        { min: 107650, max: 269300, rate: 0.06 },
        { min: 269300, max: 1616450, rate: 0.0685 },
        { min: 1616450, max: 5000000, rate: 0.0965 },
        { min: 5000000, max: 25000000, rate: 0.103 },
        { min: 25000000, max: Infinity, rate: 0.109 },
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
  const brackets = st.brackets[status] || st.brackets.single;
  const taxable = Math.max(0, stateWages - deduction - exemption);
  const credit = st.credit?.[status] ?? st.credit?.single ?? 0;
  return Math.max(0, progressiveTax(taxable, brackets) - credit);
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
  const stateTax = usStateTax(state, status, taxableWages, (Number(customStateRate) || 0) / 100);

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
