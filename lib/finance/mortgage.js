/**
 * Mortgage engine for the US and UK mortgage calculator and its reference tables.
 * Pure functions only — safe in client components and server-rendered blocks.
 */

export const MORTGAGE_RULES = {
  lastReviewed: '2026-10-04',
  US: {
    pmiDropLtv: 0.78, // Homeowners Protection Act: PMI ends automatically at 78% of the original value
    pmiRequiredBelowDownPct: 20,
  },
  UK: {
    // Stamp Duty Land Tax, England & Northern Ireland, from 1 April 2025 (main residence,
    // not an additional property). Scotland (LBTT) and Wales (LTT) use their own taxes.
    sdlt: [
      { min: 0, max: 125000, rate: 0 },
      { min: 125000, max: 250000, rate: 0.02 },
      { min: 250000, max: 925000, rate: 0.05 },
      { min: 925000, max: 1500000, rate: 0.1 },
      { min: 1500000, max: Infinity, rate: 0.12 },
    ],
    sdltFirstTimeBuyer: [
      { min: 0, max: 300000, rate: 0 },
      { min: 300000, max: 500000, rate: 0.05 },
    ],
    firstTimeBuyerPriceCap: 500000, // above this, first-time buyers pay the standard rates
  },
};

const bands = (amount, table) =>
  table.reduce((t, b) => (amount > b.min ? t + (Math.min(amount, b.max) - b.min) * b.rate : t), 0);

/** Level monthly repayment on a fully amortising loan. */
export function monthlyPayment(principal, annualRatePct, years) {
  const p = Math.max(0, Number(principal) || 0);
  const n = Math.max(1, Math.round((Number(years) || 0) * 12));
  const r = Math.max(0, Number(annualRatePct) || 0) / 100 / 12;
  if (p === 0) return 0;
  if (r === 0) return p / n;
  return (p * r) / (1 - Math.pow(1 + r, -n));
}

/** Year-by-year amortisation: interest paid, principal repaid and closing balance. */
export function amortize(principal, annualRatePct, years) {
  const r = Math.max(0, Number(annualRatePct) || 0) / 100 / 12;
  const pay = monthlyPayment(principal, annualRatePct, years);
  let balance = Math.max(0, Number(principal) || 0);
  const rows = [];
  for (let y = 1; y <= Math.round(years); y++) {
    let interest = 0;
    let repaid = 0;
    for (let m = 0; m < 12 && balance > 0.005; m++) {
      const i = balance * r;
      const prin = Math.min(balance, pay - i);
      interest += i;
      repaid += prin;
      balance -= prin;
    }
    rows.push({ year: y, interest, principal: repaid, balance: Math.max(0, balance) });
  }
  return rows;
}

/** Months until the balance first falls to `target` (or null if it never does). */
function monthsUntilBalance(principal, annualRatePct, years, target) {
  const r = Math.max(0, Number(annualRatePct) || 0) / 100 / 12;
  const pay = monthlyPayment(principal, annualRatePct, years);
  let balance = principal;
  const n = Math.round(years * 12);
  for (let m = 1; m <= n; m++) {
    balance -= pay - balance * r;
    if (balance <= target) return m;
  }
  return null;
}

/**
 * US monthly housing payment (PITI + PMI + HOA). PMI applies when the down payment is
 * under 20% and stops automatically once the balance reaches 78% of the original price.
 */
export function calcUsMortgage({
  price,
  downPayment,
  ratePct,
  years = 30,
  propertyTaxPct = 0,
  insuranceAnnual = 0,
  hoaMonthly = 0,
  pmiPct = 0,
}) {
  const homePrice = Math.max(0, Number(price) || 0);
  const down = Math.min(homePrice, Math.max(0, Number(downPayment) || 0));
  const loan = homePrice - down;
  const downPct = homePrice > 0 ? (down / homePrice) * 100 : 0;

  const principalInterest = monthlyPayment(loan, ratePct, years);
  const propertyTax = (homePrice * Math.max(0, Number(propertyTaxPct) || 0)) / 100 / 12;
  const insurance = Math.max(0, Number(insuranceAnnual) || 0) / 12;
  const hoa = Math.max(0, Number(hoaMonthly) || 0);

  const needsPmi = loan > 0 && downPct < MORTGAGE_RULES.US.pmiRequiredBelowDownPct;
  const pmi = needsPmi ? (loan * Math.max(0, Number(pmiPct) || 0)) / 100 / 12 : 0;
  const pmiMonths = needsPmi ? monthsUntilBalance(loan, ratePct, years, homePrice * MORTGAGE_RULES.US.pmiDropLtv) : 0;

  const months = Math.round(years * 12);
  const totalInterest = principalInterest * months - loan;

  return {
    price: homePrice,
    down,
    downPct,
    loan,
    principalInterest,
    propertyTax,
    insurance,
    hoa,
    pmi,
    pmiMonths,
    totalPmi: pmi * (pmiMonths || 0),
    monthlyTotal: principalInterest + propertyTax + insurance + hoa + pmi,
    totalInterest,
    totalPaid: principalInterest * months,
    schedule: amortize(loan, ratePct, years),
  };
}

/** Stamp Duty Land Tax (England & NI) on a main residence. */
export function ukStampDuty(price, firstTimeBuyer = false) {
  const p = Math.max(0, Number(price) || 0);
  const r = MORTGAGE_RULES.UK;
  const ftbRelief = firstTimeBuyer && p <= r.firstTimeBuyerPriceCap;
  return Math.round(bands(p, ftbRelief ? r.sdltFirstTimeBuyer : r.sdlt));
}

/** UK mortgage: repayment or interest-only, with loan-to-value and stamp duty. */
export function calcUkMortgage({ price, deposit, ratePct, years = 25, type = 'repayment', firstTimeBuyer = false }) {
  const homePrice = Math.max(0, Number(price) || 0);
  const dep = Math.min(homePrice, Math.max(0, Number(deposit) || 0));
  const loan = homePrice - dep;
  const months = Math.round(years * 12);
  const interestOnly = type === 'interest-only';
  const monthly = interestOnly ? (loan * Math.max(0, Number(ratePct) || 0)) / 100 / 12 : monthlyPayment(loan, ratePct, years);
  const totalPaid = monthly * months + (interestOnly ? loan : 0);

  return {
    price: homePrice,
    deposit: dep,
    loan,
    ltv: homePrice > 0 ? (loan / homePrice) * 100 : 0,
    monthly,
    interestOnly,
    totalPaid,
    totalInterest: totalPaid - loan,
    stampDuty: ukStampDuty(homePrice, firstTimeBuyer),
    schedule: interestOnly ? [] : amortize(loan, ratePct, years),
  };
}
