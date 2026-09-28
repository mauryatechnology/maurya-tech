/** Bracket helpers shared by every country module. */

export function progressiveTax(income, brackets) {
  let tax = 0;
  for (const b of brackets) {
    if (income > b.min) tax += (Math.min(income, b.max) - b.min) * b.rate;
  }
  return tax;
}

export function marginalRate(income, brackets) {
  const b = brackets.find((x) => income > x.min && income <= x.max) || brackets[0];
  return b.rate;
}
