'use client';

import React, { useMemo, useState } from 'react';
import { NumericInput } from '@/components/tools/NumericInput';
import { CalculatorContainer } from '@/components/tools/CalculatorContainer';
import { Receipt, Sparkles } from 'lucide-react';
import { calcUsPaycheck, US_FILING_STATUS, US_STATES, PAY_FREQUENCIES, US_PAYROLL } from '@/lib/tax';

// Alphabetical, with the free-entry "Other state" option last
const STATE_OPTIONS = Object.entries(US_STATES)
  .filter(([k]) => k !== 'OTHER')
  .sort(([, a], [, b]) => a.name.localeCompare(b.name))
  .map(([k, v]) => [k, v.name])
  .concat([['OTHER', US_STATES.OTHER.name]]);

const money = (n, d = 0) => `$${Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })}`;

function Select({ id, label, value, onChange, options, hint }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="block text-xs font-bold text-slate-700 uppercase tracking-wider">{label}</label>
        {hint && <span className="text-[11px] text-slate-400">{hint}</span>}
      </div>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full min-h-[48px] rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-hidden"
      >
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </div>
  );
}

export function UsPaycheckCalculator({ country = 'us', countryName = 'United States', tool, initialAnnual }) {
  const [payType, setPayType] = useState('annual');
  const [amount, setAmount] = useState(initialAnnual ?? 75000);
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [frequency, setFrequency] = useState('biweekly');
  const [status, setStatus] = useState('single');
  const [state, setState] = useState('TX');
  const [customRate, setCustomRate] = useState(0);
  const [pct401k, setPct401k] = useState(0);
  const [healthPerPaycheck, setHealthPerPaycheck] = useState(0);

  const periods = PAY_FREQUENCIES[frequency].periods;

  const r = useMemo(() => {
    const a = Math.max(0, Number(amount) || 0);
    const grossAnnual =
      payType === 'hourly' ? a * Math.max(1, Number(hoursPerWeek) || 0) * 52 : a * (PAY_FREQUENCIES[payType].periods || 1);
    return calcUsPaycheck({
      grossAnnual,
      status,
      state,
      customStateRate: customRate,
      pct401k,
      healthAnnual: (Number(healthPerPaycheck) || 0) * periods,
      periods,
    });
  }, [amount, payType, hoursPerWeek, status, state, customRate, pct401k, healthPerPaycheck, periods]);

  const bars = [
    { label: 'Take-home', value: r.net, color: 'bg-emerald-500' },
    { label: 'Taxes', value: r.taxes, color: 'bg-rose-500' },
    { label: 'Pre-tax deductions', value: r.deductions, color: 'bg-amber-400' },
  ];
  const pct = (v) => (r.gross > 0 ? (v / r.gross) * 100 : 0);
  const st = US_STATES[state];
  const freqLabel = PAY_FREQUENCIES[frequency].label.split(' (')[0].toLowerCase();

  const summaryText = `Gross ${money(r.gross)}/yr (${US_FILING_STATUS[status].label}, ${st.name}) → take-home ${money(r.perPeriod.net)} per ${freqLabel} paycheck, ${money(r.net)}/yr`;

  return (
    <CalculatorContainer
      country={country}
      countryName={countryName}
      toolName={tool?.name || 'US Paycheck Calculator'}
      category="salary"
      badge="Tax year 2026 · federal + state"
      description="Estimate your take-home pay per paycheck after federal income tax, Social Security, Medicare, state income tax, 401(k) and health-insurance deductions."
      resultSummaryText={summaryText}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Receipt className="w-5 h-5 text-cyan-600" aria-hidden="true" />
              <span>Your pay</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              id="pay-type"
              label="I know my"
              value={payType}
              onChange={setPayType}
              options={Object.entries(PAY_FREQUENCIES).map(([k, v]) => [k, v.label])}
            />
            <NumericInput
              id="pay-amount"
              label={payType === 'hourly' ? 'Hourly rate' : 'Gross amount'}
              prefix="$"
              value={amount}
              onChange={setAmount}
              step={payType === 'hourly' ? 0.5 : 100}
              required
            />
          </div>

          {payType === 'hourly' && (
            <NumericInput id="hours" label="Hours per week" suffix="hrs" value={hoursPerWeek} onChange={setHoursPerWeek} min={1} max={80} />
          )}

          <div className="grid grid-cols-2 gap-4">
            <Select
              id="frequency"
              label="Paid"
              value={frequency}
              onChange={setFrequency}
              options={Object.entries(PAY_FREQUENCIES).filter(([k]) => k !== 'hourly' && k !== 'annual').map(([k, v]) => [k, v.label])}
            />
            <Select
              id="status"
              label="Filing status"
              value={status}
              onChange={setStatus}
              options={Object.entries(US_FILING_STATUS).map(([k, v]) => [k, v.label])}
            />
          </div>

          <Select
            id="state"
            label="State"
            value={state}
            onChange={setState}
            hint={st.dataYear}
            options={STATE_OPTIONS}
          />
          {st.custom && (
            <NumericInput id="state-rate" label="State income tax rate" suffix="%" value={customRate} onChange={setCustomRate} step={0.1} max={15} />
          )}

          <div className="grid grid-cols-2 gap-4">
            <NumericInput
              id="k401"
              label="401(k)"
              suffix="% of pay"
              value={pct401k}
              onChange={setPct401k}
              step={1}
              max={100}
              hint={`limit ${money(US_PAYROLL.limit401k)}`}
            />
            <NumericInput id="health" label="Health insurance" prefix="$" suffix="/check" value={healthPerPaycheck} onChange={setHealthPerPaycheck} step={10} />
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          <div className="bg-gradient-to-br from-[#0A2540] to-[#0D3B66] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs uppercase tracking-wider font-bold text-cyan-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" aria-hidden="true" /> Take-home per paycheck
              </span>
              <span className="text-[11px] font-mono text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-full">{periods}× a year</span>
            </div>

            <div>
              <div className="text-3xl sm:text-5xl font-extrabold tracking-tight">{money(r.perPeriod.net)}</div>
              <div className="text-sm text-slate-300 mt-1">{money(r.net)} a year · effective tax rate {(r.effectiveTaxRate * 100).toFixed(1)}%</div>
            </div>

            <div className="space-y-2" aria-label="Where your gross pay goes">
              <div className="flex h-4 w-full overflow-hidden rounded-full bg-white/10">
                {bars.map((b) => (
                  <div key={b.label} className={b.color} style={{ width: `${pct(b.value)}%` }} />
                ))}
              </div>
              <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-300">
                {bars.map((b) => (
                  <li key={b.label} className="flex items-center gap-1.5">
                    <span className={`inline-block w-2.5 h-2.5 rounded-full ${b.color}`} aria-hidden="true" />
                    {b.label} {pct(b.value).toFixed(0)}%
                  </li>
                ))}
              </ul>
            </div>

            <table className="w-full text-xs">
              <thead className="text-slate-400">
                <tr><th className="text-left font-semibold pb-1">Per paycheck</th><th className="text-right font-semibold pb-1">Amount</th><th className="text-right font-semibold pb-1">Per year</th></tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {[
                  ['Gross pay', r.perPeriod.gross, r.gross],
                  ['Federal income tax', -r.perPeriod.federalTax, -r.federalTax],
                  ['Social Security (6.2%)', -r.perPeriod.socialSecurity, -r.socialSecurity],
                  ['Medicare (1.45%+)', -r.perPeriod.medicare, -r.medicare],
                  [`State tax (${state === 'OTHER' ? 'your rate' : st.name.split(' (')[0]})`, -r.perPeriod.stateTax, -r.stateTax],
                  ['401(k)', -r.perPeriod.k401, -r.k401],
                  ['Health insurance', -r.perPeriod.health, -r.health],
                ].map(([k, a, b]) => (
                  <tr key={k}>
                    <td className="py-1.5">{k}</td>
                    <td className={`py-1.5 text-right font-semibold ${a < 0 ? 'text-rose-300' : ''}`}>{a < 0 ? `-${money(-a)}` : money(a)}</td>
                    <td className="py-1.5 text-right text-slate-400">{b < 0 ? `-${money(-b)}` : money(b)}</td>
                  </tr>
                ))}
                <tr className="font-bold text-white">
                  <td className="pt-2">Take-home</td>
                  <td className="pt-2 text-right text-emerald-300">{money(r.perPeriod.net)}</td>
                  <td className="pt-2 text-right">{money(r.net)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Estimate for a W-2 employee using the standard deduction. Excludes local/city tax (e.g. NYC), state disability and paid-leave premiums, and extra withholding from your W-4.
          </p>
        </div>
      </div>
    </CalculatorContainer>
  );
}
