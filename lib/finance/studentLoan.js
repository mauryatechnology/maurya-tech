/**
 * UK student loan repayments, 2026/27 thresholds (GOV.UK "Repaying your student loan").
 * Pure functions, client-safe. Update thresholds every April.
 */

export const UK_STUDENT_LOANS = {
  taxYear: '2026/27',
  lastReviewed: '2026-10-04',
  plans: {
    plan1: { label: 'Plan 1', threshold: 26900, rate: 0.09, writeOffYears: 25, who: 'English/Welsh courses before Sept 2012; all Northern Ireland loans' },
    plan2: { label: 'Plan 2', threshold: 29385, rate: 0.09, writeOffYears: 30, who: 'English/Welsh courses Sept 2012 – July 2023' },
    plan4: { label: 'Plan 4', threshold: 33795, rate: 0.09, writeOffYears: 30, who: 'Scottish loans' },
    plan5: { label: 'Plan 5', threshold: 25000, rate: 0.09, writeOffYears: 40, who: 'English courses from August 2023' },
    postgrad: { label: 'Postgraduate Loan', threshold: 21000, rate: 0.06, writeOffYears: 30, who: 'Master’s and doctoral loans' },
  },
};

/** Annual repayment on one plan for a given annual salary. */
export function studentLoanRepayment(salary, planId) {
  const p = UK_STUDENT_LOANS.plans[planId];
  if (!p) return 0;
  return Math.max(0, (Number(salary) || 0) - p.threshold) * p.rate;
}

/**
 * Will the loan be repaid before it is written off? Simulates year by year: interest is
 * added, then that year's repayment is taken. Thresholds are held at today's level and
 * salary grows by `growthPct` a year, so results are an estimate in today's money.
 */
export function projectStudentLoan({ salary, planId, balance, interestPct, growthPct = 3, yearsSinceDue = 0 }) {
  const p = UK_STUDENT_LOANS.plans[planId];
  if (!p) return null;
  let bal = Math.max(0, Number(balance) || 0);
  let pay = Math.max(0, Number(salary) || 0);
  const r = (Number(interestPct) || 0) / 100;
  const yearsLeft = Math.max(0, p.writeOffYears - (Number(yearsSinceDue) || 0));
  let totalRepaid = 0;
  const rows = [];

  for (let y = 1; y <= yearsLeft && bal > 0; y++) {
    bal += bal * r;
    const repay = Math.min(bal, studentLoanRepayment(pay, planId));
    bal -= repay;
    totalRepaid += repay;
    rows.push({ year: y, salary: pay, repayment: repay, balance: bal });
    pay *= 1 + (Number(growthPct) || 0) / 100;
  }

  return {
    repaidInFull: bal <= 0.5,
    yearsToRepay: bal <= 0.5 ? rows.length : null,
    writtenOff: bal > 0.5 ? bal : 0,
    totalRepaid,
    yearsLeft,
    rows,
  };
}
