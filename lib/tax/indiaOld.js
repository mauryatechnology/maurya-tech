/**
 * India OLD tax regime, FY 2026-27 — individuals below 60. Pure functions.
 * Used by the new-vs-old comparison (compareIndiaRegimes in ./index.js).
 */
import { progressiveTax, surchargeWithRelief } from './core.js';

export const IN_OLD_REGIME = {
  label: 'FY 2026-27 (AY 2027-28), Old Tax Regime — age below 60',
  standardDeduction: 50000,
  rebateLimit: 500000, // Section 87A: taxable income ≤ ₹5 lakh
  maxRebate: 12500,
  cessRate: 0.04,
  slabs: [
    { min: 0, max: 250000, rate: 0 },
    { min: 250000, max: 500000, rate: 0.05 },
    { min: 500000, max: 1000000, rate: 0.2 },
    { min: 1000000, max: Infinity, rate: 0.3 },
  ],
  surcharge: [
    { min: 5000000, max: 10000000, rate: 0.1 },
    { min: 10000000, max: 20000000, rate: 0.15 },
    { min: 20000000, max: 50000000, rate: 0.25 },
    { min: 50000000, max: Infinity, rate: 0.37 },
  ],
  limits: {
    sec80C: 150000,
    sec80CCD1B: 50000,
    sec80DSelf: 25000, // self/spouse/children, below 60
    sec80DParents: 50000, // parents 60+ (₹25,000 if below 60)
    sec24b: 200000, // self-occupied home-loan interest
    professionalTax: 2500,
  },
};

/** HRA exemption u/s 10(13A): least of HRA received, rent − 10% of basic, 50%/40% of basic. */
export function hraExemption({ basic = 0, hraReceived = 0, rentPaid = 0, metro = true }) {
  const b = Math.max(0, basic);
  const received = Math.max(0, hraReceived);
  const rentExcess = Math.max(0, rentPaid - 0.1 * b);
  const cap = (metro ? 0.5 : 0.4) * b;
  return Math.round(Math.max(0, Math.min(received, rentExcess, cap)));
}

export function indiaOldRegimeTax(taxableIncome) {
  const r = IN_OLD_REGIME;
  const income = Math.max(0, taxableIncome);
  const beforeSurcharge = (inc) => {
    const t = progressiveTax(inc, r.slabs);
    return t - (inc <= r.rebateLimit ? Math.min(t, r.maxRebate) : 0);
  };
  const slabTax = progressiveTax(income, r.slabs);
  const rebate = income <= r.rebateLimit ? Math.min(slabTax, r.maxRebate) : 0;
  const afterRebate = slabTax - rebate;
  const surcharge = surchargeWithRelief(income, beforeSurcharge, r.surcharge);
  const cess = (afterRebate + surcharge) * r.cessRate;
  return {
    slabTax: Math.round(slabTax),
    rebate: Math.round(rebate),
    marginalRelief: 0,
    surcharge: Math.round(surcharge),
    cess: Math.round(cess),
    total: Math.round(afterRebate + surcharge + cess),
  };
}

/** Clamp each claimed deduction to its statutory limit and total them. */
export function oldRegimeDeductions({
  hra = 0,
  sec80C = 0,
  sec80CCD1B = 0,
  sec80DSelf = 0,
  sec80DParents = 0,
  sec24b = 0,
  professionalTax = 0,
}) {
  const L = IN_OLD_REGIME.limits;
  const items = {
    standardDeduction: IN_OLD_REGIME.standardDeduction,
    hra: Math.max(0, hra),
    professionalTax: Math.min(Math.max(0, professionalTax), L.professionalTax),
    sec80C: Math.min(Math.max(0, sec80C), L.sec80C),
    sec80CCD1B: Math.min(Math.max(0, sec80CCD1B), L.sec80CCD1B),
    sec80D: Math.min(Math.max(0, sec80DSelf), L.sec80DSelf) + Math.min(Math.max(0, sec80DParents), L.sec80DParents),
    sec24b: Math.min(Math.max(0, sec24b), L.sec24b),
  };
  const total = Object.values(items).reduce((a, b) => a + b, 0);
  return { items, total };
}
