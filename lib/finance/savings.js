/**
 * India savings engines: SIP, fixed deposit and PPF. Pure functions — client-safe and
 * used by both the calculators and the server-rendered reference tables.
 * Re-check SAVINGS_RULES every quarter (PPF rate) and every Budget (TDS, LTCG).
 */

export const SAVINGS_RULES = {
  lastReviewed: '2026-10-04',
  ppf: {
    ratePct: 7.1,
    rateQuarter: 'October–December 2026',
    minYearly: 500,
    maxYearly: 150000,
    years: 15,
  },
  fd: {
    tdsRate: 0.1,
    tdsThreshold: 50000, // interest per bank per financial year
    tdsThresholdSenior: 100000,
  },
  equity: {
    ltcgExempt: 125000, // long-term gains on equity funds exempt each year
    ltcgRate: 0.125,
  },
};

const num = (v, min = 0) => Math.max(min, Number(v) || 0);

/**
 * SIP future value with an optional yearly step-up. Each instalment is invested at the
 * start of the month and compounds monthly (the convention most fund houses use).
 */
export function sipFutureValue({ monthly, ratePct, years, stepUpPct = 0 }) {
  const i = num(ratePct) / 100 / 12;
  const n = Math.round(num(years) * 12);
  let amount = num(monthly);
  let balance = 0;
  let invested = 0;
  const yearly = [];
  for (let m = 1; m <= n; m++) {
    if (m > 1 && (m - 1) % 12 === 0) amount *= 1 + num(stepUpPct) / 100;
    balance = (balance + amount) * (1 + i);
    invested += amount;
    if (m % 12 === 0 || m === n) yearly.push({ year: Math.ceil(m / 12), invested, value: balance });
  }
  return { invested, value: balance, gains: balance - invested, yearly };
}

export const FD_COMPOUNDING = {
  quarterly: { label: 'Quarterly (most banks)', perYear: 4 },
  monthly: { label: 'Monthly', perYear: 12 },
  halfyearly: { label: 'Half-yearly', perYear: 2 },
  yearly: { label: 'Yearly', perYear: 1 },
  payout: { label: 'Interest paid out (simple)', perYear: 0 },
};

/** Fixed deposit maturity. `payout` = interest paid out, so no compounding. */
export function fdMaturity({ principal, ratePct, years = 0, months = 0, compounding = 'quarterly' }) {
  const p = num(principal);
  const r = num(ratePct) / 100;
  const t = num(years) + num(months) / 12;
  const f = FD_COMPOUNDING[compounding]?.perYear ?? 4;
  const maturity = f === 0 ? p * (1 + r * t) : p * Math.pow(1 + r / f, f * t);
  const interest = maturity - p;
  return {
    principal: p,
    interest,
    maturity,
    effectiveYieldPct: f === 0 ? r * 100 : (Math.pow(1 + r / f, f) - 1) * 100,
    averageYearlyInterest: t > 0 ? interest / t : 0,
  };
}

/** Whether a bank will deduct TDS on this year's FD interest (per bank, per financial year). */
export function fdTdsApplies(yearlyInterest, senior = false) {
  const limit = senior ? SAVINGS_RULES.fd.tdsThresholdSenior : SAVINGS_RULES.fd.tdsThreshold;
  return yearlyInterest > limit;
}

/**
 * PPF maturity for a fixed yearly deposit made before 5 April each year (so it earns
 * interest for the whole year). Deposits are clamped to the ₹500–₹1.5 lakh limits.
 */
export function ppfMaturity({ yearly, ratePct = SAVINGS_RULES.ppf.ratePct, years = SAVINGS_RULES.ppf.years }) {
  const { minYearly, maxYearly } = SAVINGS_RULES.ppf;
  const deposit = Math.min(maxYearly, Math.max(minYearly, num(yearly)));
  const r = num(ratePct) / 100;
  let balance = 0;
  const rows = [];
  for (let y = 1; y <= Math.round(num(years, 1)); y++) {
    const opening = balance;
    const interest = (opening + deposit) * r;
    balance = opening + deposit + interest;
    rows.push({ year: y, deposit, interest, balance });
  }
  const invested = deposit * rows.length;
  return { deposit, invested, interest: balance - invested, maturity: balance, rows };
}
