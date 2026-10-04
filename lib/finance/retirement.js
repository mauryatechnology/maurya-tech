/**
 * US 401(k) projection. Limits are the IRS 2026 figures (Notice 2025-67) and are held
 * flat in the projection — real limits rise with inflation, so long projections are
 * conservative. Pure functions, client-safe.
 */

export const US_401K = {
  year: 2026,
  lastReviewed: '2026-10-04',
  electiveLimit: 24500,
  catchUp50: 8000,
  catchUp60to63: 11250,
  totalLimit: 72000, // employee + employer additions, Section 415(c), before catch-up
};

/** Employee elective deferral limit for someone of `age` at year end. */
export function employeeLimit(age) {
  const a = Number(age) || 0;
  if (a >= 60 && a <= 63) return US_401K.electiveLimit + US_401K.catchUp60to63;
  if (a >= 50) return US_401K.electiveLimit + US_401K.catchUp50;
  return US_401K.electiveLimit;
}

/** Employer match: `matchRatePct` of what you defer, on deferrals up to `matchCapPct` of pay. */
export function employerMatch(salary, contribPct, matchRatePct, matchCapPct) {
  const s = Math.max(0, Number(salary) || 0);
  const matched = Math.min(Math.max(0, Number(contribPct) || 0), Math.max(0, Number(matchCapPct) || 0));
  return (s * matched * Math.max(0, Number(matchRatePct) || 0)) / 10000;
}

/**
 * Year-by-year projection to retirement. Contributions are spread through the year, so
 * they earn about half a year's return in the year they are made.
 */
export function project401k({
  age,
  retireAge,
  salary,
  contribPct,
  matchRatePct = 0,
  matchCapPct = 0,
  balance = 0,
  returnPct = 7,
  raisePct = 0,
}) {
  const r = (Number(returnPct) || 0) / 100;
  let pay = Math.max(0, Number(salary) || 0);
  let bal = Math.max(0, Number(balance) || 0);
  let totalEmployee = 0;
  let totalEmployer = 0;
  const rows = [];
  const startAge = Math.round(Number(age) || 0);
  const endAge = Math.max(startAge, Math.round(Number(retireAge) || 0));

  for (let a = startAge; a < endAge; a++) {
    const employee = Math.min((pay * (Number(contribPct) || 0)) / 100, employeeLimit(a));
    const catchUpRoom = employeeLimit(a) - US_401K.electiveLimit;
    const employer = Math.max(0, Math.min(employerMatch(pay, contribPct, matchRatePct, matchCapPct), US_401K.totalLimit + catchUpRoom - employee));
    const added = employee + employer;
    const growth = bal * r + added * (r / 2);
    bal += added + growth;
    totalEmployee += employee;
    totalEmployer += employer;
    rows.push({ age: a + 1, salary: pay, employee, employer, balance: bal });
    pay *= 1 + (Number(raisePct) || 0) / 100;
  }

  const firstYear = rows[0] || { employee: 0, employer: 0 };
  const fullMatchPct = Number(matchCapPct) || 0;
  return {
    balance: bal,
    totalEmployee,
    totalEmployer,
    growth: bal - Math.max(0, Number(balance) || 0) - totalEmployee - totalEmployer,
    firstYearEmployee: firstYear.employee,
    firstYearEmployer: firstYear.employer,
    // Match given up this year by contributing less than the match cap
    missedMatch: (Number(contribPct) || 0) < fullMatchPct ? employerMatch(salary, fullMatchPct, matchRatePct, matchCapPct) - employerMatch(salary, contribPct, matchRatePct, matchCapPct) : 0,
    rows,
  };
}
