/**
 * Shared, pure tax/salary engine used by the client calculators, the server-rendered
 * reference tables, and the programmatic salary pages — one source of truth so every
 * number on the site agrees.
 *
 * Rates must be re-verified every budget / tax year (see TAX_RULES.*.lastReviewed).
 * Pure functions only: no server imports, safe to use in client components.
 */

export const TAX_RULES = {
  IN: {
    label: 'FY 2026-27 (AY 2027-28), New Tax Regime',
    lastReviewed: '2026-10-04',
    sources: [
      { name: 'Income Tax Department — Tax slabs', url: 'https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable-1' },
      { name: 'Union Budget 2026-27 (slabs unchanged from 2025-26)', url: 'https://www.indiabudget.gov.in/' },
      { name: 'EPFO — contribution rates', url: 'https://www.epfindia.gov.in/' },
    ],
    standardDeduction: 75000,
    rebateLimit: 1200000, // Section 87A: no tax if taxable income <= ₹12 lakh
    maxRebate: 60000,
    cessRate: 0.04,
    slabs: [
      { min: 0, max: 400000, rate: 0 },
      { min: 400000, max: 800000, rate: 0.05 },
      { min: 800000, max: 1200000, rate: 0.1 },
      { min: 1200000, max: 1600000, rate: 0.15 },
      { min: 1600000, max: 2000000, rate: 0.2 },
      { min: 2000000, max: 2400000, rate: 0.25 },
      { min: 2400000, max: Infinity, rate: 0.3 },
    ],
    surcharge: [
      { min: 5000000, max: 10000000, rate: 0.1 },
      { min: 10000000, max: 20000000, rate: 0.15 },
      { min: 20000000, max: Infinity, rate: 0.25 }, // capped at 25% under the new regime
    ],
    epfRate: 0.12,
    epfMonthlyWageCap: 15000, // statutory ceiling → ₹1,800/month
    gratuityRate: 0.0481,
    defaultProfessionalTax: 2400,
  },
  US: {
    label: 'Tax year 2026, single filer (federal)',
    lastReviewed: '2026-09-28',
    sources: [
      { name: 'IRS — 2026 inflation adjustments (Rev. Proc. 2025-32)', url: 'https://www.irs.gov/newsroom' },
      { name: 'SSA — Contribution and benefit base', url: 'https://www.ssa.gov/oact/cola/cbb.html' },
      { name: 'IRS — Self-employment tax', url: 'https://www.irs.gov/businesses/small-businesses-self-employed/self-employment-tax-social-security-and-medicare-taxes' },
    ],
    standardDeduction: 16100,
    brackets: [
      { min: 0, max: 12400, rate: 0.1 },
      { min: 12400, max: 50400, rate: 0.12 },
      { min: 50400, max: 105700, rate: 0.22 },
      { min: 105700, max: 201775, rate: 0.24 },
      { min: 201775, max: 256225, rate: 0.32 },
      { min: 256225, max: 640600, rate: 0.35 },
      { min: 640600, max: Infinity, rate: 0.37 },
    ],
    socialSecurityRate: 0.062,
    socialSecurityWageBase: 184500,
    medicareRate: 0.0145,
    additionalMedicareRate: 0.009,
    additionalMedicareThreshold: 200000,
    seEarningsFactor: 0.9235,
    // Section 199A qualified business income deduction (Rev. Proc. 2025-32, single filer)
    qbiRate: 0.2,
    qbiThreshold: 201750,
    qbiPhaseOutEnd: 276750,
    federalMinimumWage: 7.25,
    fullTimeHours: 2080,
  },
  UK: {
    label: '2026/27 tax year (England, Wales & Northern Ireland)',
    lastReviewed: '2026-09-28',
    sources: [
      { name: 'GOV.UK — Income Tax rates and Personal Allowances', url: 'https://www.gov.uk/income-tax-rates' },
      { name: 'GOV.UK — National Insurance rates and categories', url: 'https://www.gov.uk/national-insurance-rates-letters' },
    ],
    personalAllowance: 12570,
    taperThreshold: 100000,
    bands: [
      { name: 'Basic rate', min: 0, max: 37700, rate: 0.2 },
      { name: 'Higher rate', min: 37700, max: 125140, rate: 0.4 },
      { name: 'Additional rate', min: 125140, max: Infinity, rate: 0.45 },
    ],
    additionalRateThreshold: 125140, // applies to gross income, not taxable
    niPrimaryThreshold: 12570,
    niUpperEarningsLimit: 50270,
    niMainRate: 0.08,
    niUpperRate: 0.02,
    fullTimeHours: 1950, // 37.5 h × 52 weeks
  },
};

const round = (n) => Math.round(Number.isFinite(n) ? n : 0);

import { progressiveTax, marginalRate, surchargeWithRelief } from './core.js';

export { progressiveTax, marginalRate };
export * from './us.js';
export * from './indiaOld.js';

/* ------------------------------------------------------------------ India */

/** Income tax under the new regime on an already-computed taxable income. */
function newRegimeBeforeSurcharge(income) {
  const r = TAX_RULES.IN;
  const slabTax = progressiveTax(income, r.slabs);
  let rebate = 0;
  let marginalRelief = 0;
  if (income <= r.rebateLimit) {
    rebate = Math.min(slabTax, r.maxRebate);
  } else {
    // Marginal relief: tax cannot exceed the income earned above ₹12 lakh.
    const excess = income - r.rebateLimit;
    if (slabTax > excess) marginalRelief = slabTax - excess;
  }
  return { slabTax, rebate, marginalRelief, taxAfterRebate: Math.max(0, slabTax - rebate - marginalRelief) };
}

export function indiaNewRegimeTax(taxableIncome) {
  const r = TAX_RULES.IN;
  const income = Math.max(0, taxableIncome);
  const { slabTax, rebate, marginalRelief, taxAfterRebate } = newRegimeBeforeSurcharge(income);

  const surcharge = surchargeWithRelief(income, (inc) => newRegimeBeforeSurcharge(inc).taxAfterRebate, r.surcharge);
  const cess = (taxAfterRebate + surcharge) * r.cessRate;

  return {
    slabTax: round(slabTax),
    rebate: round(rebate),
    marginalRelief: round(marginalRelief),
    surcharge: round(surcharge),
    cess: round(cess),
    total: round(taxAfterRebate + surcharge + cess),
  };
}

/**
 * CTC → in-hand. CTC is treated as including the employer's PF contribution
 * (and optionally gratuity), which never reach the bank account.
 */
export function calcIndiaSalary({
  ctc,
  basicPct = 50,
  pfCapped = true,
  employerPfInCtc = true,
  gratuityInCtc = false,
  professionalTax = TAX_RULES.IN.defaultProfessionalTax,
  variablePay = 0,
}) {
  const r = TAX_RULES.IN;
  const annualCtc = Math.max(0, Number(ctc) || 0);
  const basicAnnual = annualCtc * (basicPct / 100);
  const monthlyBasic = basicAnnual / 12;

  const monthlyPf = pfCapped
    ? Math.min(monthlyBasic, r.epfMonthlyWageCap) * r.epfRate
    : monthlyBasic * r.epfRate;
  const employeePf = monthlyPf * 12;
  const employerPf = employerPfInCtc ? employeePf : 0;
  const gratuity = gratuityInCtc ? basicAnnual * r.gratuityRate : 0;

  const grossSalary = Math.max(0, annualCtc - employerPf - gratuity);
  const taxableIncome = Math.max(0, grossSalary - r.standardDeduction);
  const tax = indiaNewRegimeTax(taxableIncome);
  const pt = Math.max(0, Number(professionalTax) || 0);

  const annualInHand = Math.max(0, grossSalary - employeePf - pt - tax.total);
  const variable = Math.min(Math.max(0, Number(variablePay) || 0), annualInHand);
  const fixedInHand = annualInHand - variable;

  return {
    ctc: round(annualCtc),
    basicAnnual: round(basicAnnual),
    employerPf: round(employerPf),
    gratuity: round(gratuity),
    grossSalary: round(grossSalary),
    standardDeduction: r.standardDeduction,
    taxableIncome: round(taxableIncome),
    tax,
    employeePf: round(employeePf),
    professionalTax: round(pt),
    totalDeductions: round(employerPf + gratuity + employeePf + pt + tax.total),
    annualInHand: round(annualInHand),
    monthlyInHand: round(fixedInHand / 12),
    monthlyInHandIncludingVariable: round(annualInHand / 12),
    effectiveTaxRate: grossSalary > 0 ? tax.total / grossSalary : 0,
    marginalSlabRate: marginalRate(taxableIncome, r.slabs),
  };
}

/* --------------------------------------------------------------------- US */

/**
 * 20% QBI deduction for a sole proprietor: limited to 20% of taxable income before it,
 * and phased out between the threshold and the end of the phase-in range. The phase-out
 * assumes a service business with no employees (the common contractor case) — the most
 * conservative treatment.
 */
function qbiDeductionFor(qbi, taxableBeforeQbi) {
  const r = TAX_RULES.US;
  const full = r.qbiRate * Math.min(Math.max(0, qbi), taxableBeforeQbi);
  if (taxableBeforeQbi <= r.qbiThreshold) return full;
  if (taxableBeforeQbi >= r.qbiPhaseOutEnd) return 0;
  return full * (1 - (taxableBeforeQbi - r.qbiThreshold) / (r.qbiPhaseOutEnd - r.qbiThreshold));
}

export function calcUsTakeHome({ gross, type = 'w2', stateRate = 0 }) {
  const r = TAX_RULES.US;
  const income = Math.max(0, Number(gross) || 0);

  let socialSecurity;
  let medicare;
  let seDeduction = 0;
  if (type === '1099') {
    const seBase = income * r.seEarningsFactor;
    socialSecurity = Math.min(seBase, r.socialSecurityWageBase) * r.socialSecurityRate * 2;
    const seMedicare = seBase * r.medicareRate * 2;
    medicare = seMedicare + Math.max(0, seBase - r.additionalMedicareThreshold) * r.additionalMedicareRate;
    // Half of SE tax is deductible; the 0.9% Additional Medicare Tax is not part of SE tax.
    seDeduction = (socialSecurity + seMedicare) / 2;
  } else {
    socialSecurity = Math.min(income, r.socialSecurityWageBase) * r.socialSecurityRate;
    medicare = income * r.medicareRate
      + Math.max(0, income - r.additionalMedicareThreshold) * r.additionalMedicareRate;
  }

  const beforeQbi = Math.max(0, income - seDeduction - r.standardDeduction);
  const qbiDeduction = type === '1099' ? qbiDeductionFor(income - seDeduction, beforeQbi) : 0;
  const taxableIncome = Math.max(0, beforeQbi - qbiDeduction);
  const federalTax = progressiveTax(taxableIncome, r.brackets);
  const stateTax = income * Math.max(0, Number(stateRate) || 0);
  const fica = socialSecurity + medicare;
  const totalTax = federalTax + fica + stateTax;
  const net = Math.max(0, income - totalTax);

  return {
    gross: round(income),
    taxableIncome: round(taxableIncome),
    federalTax: round(federalTax),
    socialSecurity: round(socialSecurity),
    medicare: round(medicare),
    fica: round(fica),
    stateTax: round(stateTax),
    totalTax: round(totalTax),
    net: round(net),
    netMonthly: round(net / 12),
    netBiweekly: round(net / 26),
    effectiveTaxRate: income > 0 ? totalTax / income : 0,
    marginalRate: marginalRate(taxableIncome, r.brackets),
  };
}

/* --------------------------------------------------------------------- UK */

export function ukPersonalAllowance(gross) {
  const r = TAX_RULES.UK;
  const reduction = Math.max(0, gross - r.taperThreshold) / 2;
  return Math.max(0, r.personalAllowance - reduction);
}

export function calcUkTakeHome({ gross }) {
  const r = TAX_RULES.UK;
  const income = Math.max(0, Number(gross) || 0);
  const allowance = ukPersonalAllowance(income);
  const taxable = Math.max(0, income - allowance);

  // Basic and higher bands apply to taxable income; the additional rate starts at
  // £125,140 of gross income (where the allowance has fully tapered away).
  const basic = Math.min(taxable, 37700) * 0.2;
  const higherTop = Math.max(0, r.additionalRateThreshold - allowance);
  const higher = Math.max(0, Math.min(taxable, higherTop) - 37700) * 0.4;
  const additional = Math.max(0, taxable - Math.max(37700, higherTop)) * 0.45;
  const incomeTax = basic + higher + additional;

  const ni = Math.max(0, Math.min(income, r.niUpperEarningsLimit) - r.niPrimaryThreshold) * r.niMainRate
    + Math.max(0, income - r.niUpperEarningsLimit) * r.niUpperRate;

  const net = Math.max(0, income - incomeTax - ni);
  let band = 'Personal Allowance';
  if (income > r.additionalRateThreshold) band = 'Additional rate (45%)';
  else if (taxable > 37700) band = 'Higher rate (40%)';
  else if (taxable > 0) band = 'Basic rate (20%)';

  return {
    gross: round(income),
    personalAllowance: round(allowance),
    taxableIncome: round(taxable),
    incomeTax: round(incomeTax),
    nationalInsurance: round(ni),
    totalTax: round(incomeTax + ni),
    net: round(net),
    netMonthly: round(net / 12),
    netWeekly: round(net / 52),
    effectiveTaxRate: income > 0 ? (incomeTax + ni) / income : 0,
    band,
  };
}

/* ---------------------------------------------------------------- helpers */

export function payPeriods(annual, hoursPerYear) {
  return {
    annual: round(annual),
    monthly: round(annual / 12),
    biweekly: round(annual / 26),
    weekly: round(annual / 52),
    daily: round(annual / 260),
    hourly: hoursPerYear ? Math.round((annual / hoursPerYear) * 100) / 100 : 0,
  };
}

export const formatINR = (n) => `₹${Math.round(n || 0).toLocaleString('en-IN')}`;
export const formatUSD = (n, digits = 0) =>
  `$${Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
export const formatGBP = (n) => `£${Math.round(n || 0).toLocaleString('en-GB')}`;
export const formatPct = (x, digits = 1) => `${(Number(x || 0) * 100).toFixed(digits)}%`;

/* ------------------------------------------------- India: new vs old regime */
import { IN_OLD_REGIME, indiaOldRegimeTax, oldRegimeDeductions } from './indiaOld.js';

/**
 * Compares both regimes on the same gross salary. New regime allows only the ₹75,000
 * standard deduction; the old regime allows HRA, 80C, 80D, 80CCD(1B), 24(b) and
 * professional tax (each clamped to its limit).
 */
export function compareIndiaRegimes({ grossSalary, deductions = {} }) {
  const gross = Math.max(0, Number(grossSalary) || 0);

  const newTaxable = Math.max(0, gross - TAX_RULES.IN.standardDeduction);
  const newTax = indiaNewRegimeTax(newTaxable);

  const old = oldRegimeDeductions(deductions);
  const oldTaxable = Math.max(0, gross - old.total);
  const oldTax = indiaOldRegimeTax(oldTaxable);

  const saving = Math.abs(newTax.total - oldTax.total);
  const better = newTax.total < oldTax.total ? 'new' : newTax.total > oldTax.total ? 'old' : 'equal';

  return {
    gross: Math.round(gross),
    new: { deductions: TAX_RULES.IN.standardDeduction, taxable: Math.round(newTaxable), tax: newTax },
    old: { deductions: Math.round(old.total), items: old.items, taxable: Math.round(oldTaxable), tax: oldTax },
    better,
    saving: Math.round(saving),
    // Old-regime deductions needed (beyond the ₹50k standard deduction) to match the new regime.
    breakEvenDeductions: breakEvenOldDeductions(gross, newTax.total),
  };
}

function breakEvenOldDeductions(gross, targetTax) {
  let lo = 0;
  let hi = gross;
  if (indiaOldRegimeTax(Math.max(0, gross - IN_OLD_REGIME.standardDeduction)).total <= targetTax) return 0;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    const t = indiaOldRegimeTax(Math.max(0, gross - IN_OLD_REGIME.standardDeduction - mid)).total;
    if (t <= targetTax) hi = mid;
    else lo = mid;
  }
  return Math.round(hi);
}
