/** Bracket helpers shared by every country module. */

export function progressiveTax(income, brackets) {
  let tax = 0;
  for (const b of brackets) {
    if (income > b.min) tax += (Math.min(income, b.max) - b.min) * b.rate;
  }
  return tax;
}

/**
 * Indian surcharge with marginal relief: tax + surcharge may not exceed the tax +
 * surcharge payable at the start of the surcharge band plus the income above it.
 * `baseTax(income)` returns tax after rebate/relief but before surcharge and cess.
 */
export function surchargeWithRelief(income, baseTax, bands) {
  const total = (inc) => {
    const t = baseTax(inc);
    const band = bands.find((x) => inc > x.min && inc <= x.max);
    if (!band) return t;
    return Math.min(t * (1 + band.rate), total(band.min) + (inc - band.min));
  };
  return Math.max(0, total(income) - baseTax(income));
}

export function marginalRate(income, brackets) {
  const b = brackets.find((x) => income > x.min && income <= x.max) || brackets[0];
  return b.rate;
}
