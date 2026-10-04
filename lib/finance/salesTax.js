/**
 * Consumption taxes for the GST (India), sales tax (US) and VAT (UK) calculators.
 * Pure functions, client-safe. Re-check rates each January (US) and after GST Council
 * meetings / UK Budgets.
 */

export const CONSUMPTION_TAX_RULES = {
  lastReviewed: '2026-10-04',
  IN: {
    // GST 2.0, effective 22 September 2025: the 12% and 28% slabs were removed.
    rates: [
      { rate: 0, label: 'Nil (0%)', examples: 'Fresh food, milk, health and life insurance, education services' },
      { rate: 5, label: '5%', examples: 'Packaged food staples, medicines, most household goods, small restaurants' },
      { rate: 18, label: '18%', examples: 'Most goods and services — electronics, appliances, most cars, professional services' },
      { rate: 40, label: '40%', examples: 'Tobacco, pan masala, aerated and sugary drinks, luxury cars' },
      { rate: 3, label: '3% (gold & silver)', examples: 'Gold, silver and jewellery' },
    ],
    registrationThresholdGoods: 4000000,
    registrationThresholdServices: 2000000,
  },
  UK: {
    rates: [
      { rate: 20, label: 'Standard rate (20%)', examples: 'Most goods and services' },
      { rate: 5, label: 'Reduced rate (5%)', examples: 'Home energy, children’s car seats, some energy-saving materials' },
      { rate: 0, label: 'Zero rate (0%)', examples: 'Most food, books and newspapers, children’s clothes' },
    ],
    registrationThreshold: 90000,
  },
  US: {
    asOf: '1 January 2026',
    // State-level rates only (Tax Foundation); most states add county/city tax on top.
    stateRates: {
      AL: ['Alabama', 4], AK: ['Alaska', 0], AZ: ['Arizona', 5.6], AR: ['Arkansas', 6.5], CA: ['California', 7.25],
      CO: ['Colorado', 2.9], CT: ['Connecticut', 6.35], DE: ['Delaware', 0], DC: ['District of Columbia', 6], FL: ['Florida', 6],
      GA: ['Georgia', 4], HI: ['Hawaii', 4], ID: ['Idaho', 6], IL: ['Illinois', 6.25], IN: ['Indiana', 7],
      IA: ['Iowa', 6], KS: ['Kansas', 6.5], KY: ['Kentucky', 6], LA: ['Louisiana', 5], ME: ['Maine', 5.5],
      MD: ['Maryland', 6], MA: ['Massachusetts', 6.25], MI: ['Michigan', 6], MN: ['Minnesota', 6.875], MS: ['Mississippi', 7],
      MO: ['Missouri', 4.225], MT: ['Montana', 0], NE: ['Nebraska', 5.5], NV: ['Nevada', 6.85], NH: ['New Hampshire', 0],
      NJ: ['New Jersey', 6.625], NM: ['New Mexico', 4.875], NY: ['New York', 4], NC: ['North Carolina', 4.75], ND: ['North Dakota', 5],
      OH: ['Ohio', 5.75], OK: ['Oklahoma', 4.5], OR: ['Oregon', 0], PA: ['Pennsylvania', 6], RI: ['Rhode Island', 7],
      SC: ['South Carolina', 6], SD: ['South Dakota', 4.2], TN: ['Tennessee', 7], TX: ['Texas', 6.25], UT: ['Utah', 6.1],
      VT: ['Vermont', 6], VA: ['Virginia', 5.3], WA: ['Washington', 6.5], WV: ['West Virginia', 6], WI: ['Wisconsin', 5], WY: ['Wyoming', 4],
    },
  },
};

const num = (v) => Math.max(0, Number(v) || 0);
const r2 = (n) => Math.round(n * 100) / 100;

/**
 * Adds tax to a net price, or (mode 'remove') extracts it from a tax-inclusive price.
 * Returns net, tax and gross rounded to the cent/paisa/penny.
 */
export function applyTax(amount, ratePct, mode = 'add') {
  const a = num(amount);
  const rate = num(ratePct) / 100;
  if (mode === 'remove') {
    const net = a / (1 + rate);
    return { net: r2(net), tax: r2(a - net), gross: r2(a) };
  }
  return { net: r2(a), tax: r2(a * rate), gross: r2(a * (1 + rate)) };
}

/** India: intra-state supplies split GST equally into CGST + SGST; inter-state is IGST. */
export function gstSplit(tax, interState = false) {
  const t = num(tax);
  return interState ? { igst: r2(t), cgst: 0, sgst: 0 } : { igst: 0, cgst: r2(t / 2), sgst: r2(t - r2(t / 2)) };
}

/** US states sorted by name, as [code, name, rate]. */
export const US_STATE_SALES_TAX = Object.entries(CONSUMPTION_TAX_RULES.US.stateRates)
  .map(([code, [name, rate]]) => [code, name, rate])
  .sort((a, b) => a[1].localeCompare(b[1]));
