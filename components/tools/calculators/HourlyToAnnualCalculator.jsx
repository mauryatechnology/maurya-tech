'use client';

import React, { useState, useMemo } from 'react';
import { NumericInput } from '@/components/tools/NumericInput';
import { CalculatorContainer } from '@/components/tools/CalculatorContainer';
import { DollarSign, PoundSterling, Sparkles, Building, Briefcase } from 'lucide-react';
import { calcUsTakeHome, calcUkTakeHome, TAX_RULES } from '@/lib/tax';

export function HourlyToAnnualCalculator({
  country = 'us',
  countryName = 'United States',
  tool,
  initialHourlyRate,
}) {
  const isUK = country.toLowerCase() === 'uk';
  const currencySymbol = isUK ? '£' : '$';
  const locale = isUK ? 'en-GB' : 'en-US';

  const [hourlyRate, setHourlyRate] = useState(initialHourlyRate ?? (isUK ? 18 : 25));
  const [hoursPerWeek, setHoursPerWeek] = useState(isUK ? 37.5 : 40);
  const [weeksPerYear, setWeeksPerYear] = useState(52);
  const [contractorType, setContractorType] = useState('w2'); // US only: 'w2' | '1099'
  const [stateRatePct, setStateRatePct] = useState(0); // US only, optional flat estimate

  const calculation = useMemo(() => {
    const rate = Math.max(0, Number(hourlyRate) || 0);
    const weeklyHours = Math.max(1, Number(hoursPerWeek) || 0);
    const annualWeeks = Math.max(1, Math.min(52, Number(weeksPerYear) || 0));

    const totalHours = weeklyHours * annualWeeks;
    const grossAnnual = rate * totalHours;

    let net;
    let taxLines;
    if (isUK) {
      const r = calcUkTakeHome({ gross: grossAnnual });
      net = r.net;
      taxLines = [
        { label: 'Income Tax (PAYE)', value: r.incomeTax },
        { label: 'National Insurance', value: r.nationalInsurance },
      ];
    } else {
      const r = calcUsTakeHome({
        gross: grossAnnual,
        type: contractorType,
        stateRate: (Number(stateRatePct) || 0) / 100,
      });
      net = r.net;
      taxLines = [
        { label: 'Federal income tax', value: r.federalTax },
        { label: contractorType === '1099' ? 'Self-employment tax' : 'FICA (Social Security + Medicare)', value: r.fica },
      ];
      if (r.stateTax > 0) taxLines.push({ label: 'State tax (your estimate)', value: r.stateTax });
    }

    return {
      totalHours,
      grossAnnual: Math.round(grossAnnual),
      grossMonthly: Math.round(grossAnnual / 12),
      grossBiweekly: Math.round(grossAnnual / 26),
      grossWeekly: Math.round(grossAnnual / annualWeeks),
      grossDaily: Math.round(rate * (weeklyHours / 5)),
      taxLines,
      netAnnual: Math.round(net),
      netMonthly: Math.round(net / 12),
    };
  }, [hourlyRate, hoursPerWeek, weeksPerYear, contractorType, stateRatePct, isUK]);

  const formatMoney = (val) => `${currencySymbol}${Number(val || 0).toLocaleString(locale)}`;

  const summaryText = `Hourly: ${formatMoney(hourlyRate)}/hr (${hoursPerWeek}h/wk) → Annual gross: ${formatMoney(
    calculation.grossAnnual
  )} | Est. monthly take-home: ${formatMoney(calculation.netMonthly)}/mo`;

  const CurrencyIcon = isUK ? PoundSterling : DollarSign;

  return (
    <CalculatorContainer
      country={country}
      countryName={countryName}
      toolName={tool?.name || 'Hourly to Annual Salary Calculator'}
      category="salary"
      badge={isUK ? TAX_RULES.UK.label : TAX_RULES.US.label}
      description={
        isUK
          ? 'Convert your hourly wage to annual, monthly and weekly pay, with Income Tax and National Insurance deducted using current HMRC bands.'
          : 'Convert your hourly pay to annual, monthly, bi-weekly and weekly income, with federal tax and FICA (W-2) or self-employment tax (1099) estimated.'
      }
      resultSummaryText={summaryText}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <CurrencyIcon className="w-5 h-5 text-emerald-600" />
              <span>Wage &amp; Schedule Details</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">Enter your hourly pay and working schedule.</p>
          </div>

          <NumericInput
            id="hourly-input"
            label="Hourly Rate"
            prefix={currencySymbol}
            value={hourlyRate}
            onChange={setHourlyRate}
            step={0.5}
            min={0}
            placeholder={isUK ? '18' : '25'}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <NumericInput id="hours-per-week" label="Hours Per Week" suffix="hrs" value={hoursPerWeek} onChange={setHoursPerWeek} step={0.5} min={1} max={80} />
            <NumericInput id="weeks-per-year" label="Paid Weeks Per Year" suffix="wks" value={weeksPerYear} onChange={setWeeksPerYear} step={1} min={1} max={52} />
          </div>

          {!isUK && (
            <>
              <div className="space-y-2 pt-2">
                <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Employment Status (Tax Type)</span>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'w2', title: 'W-2 Employee', sub: '7.65% FICA employee share', Icon: Building },
                    { id: '1099', title: '1099 Contractor', sub: '15.3% self-employment tax', Icon: Briefcase },
                  ].map(({ id, title, sub, Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setContractorType(id)}
                      aria-pressed={contractorType === id}
                      className={`min-h-[48px] p-3.5 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1 transition cursor-pointer ${
                        contractorType === id
                          ? 'border-cyan-600 bg-cyan-50/70 text-cyan-950 shadow-xs ring-2 ring-cyan-500/20'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Icon className="w-4 h-4 text-cyan-600" />
                        {title}
                      </span>
                      <span className="text-[10px] text-slate-500 font-normal">{sub}</span>
                    </button>
                  ))}
                </div>
              </div>
              <NumericInput
                id="state-rate"
                label="State income tax (optional)"
                suffix="%"
                value={stateRatePct}
                onChange={setStateRatePct}
                step={0.5}
                min={0}
                max={15}
                hint="Leave 0 for states without income tax (e.g. Texas, Florida)"
              />
            </>
          )}
        </div>

        <div className="lg:col-span-6 space-y-6">
          <div className="bg-gradient-to-br from-[#0A2540] to-[#0A192F] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs uppercase tracking-wider font-bold text-cyan-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Annual Gross Earnings
              </span>
              <span className="text-[11px] font-mono text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-full">
                {calculation.totalHours.toLocaleString(locale)} hrs/yr
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-slate-300 font-medium">Gross Annual Salary</div>
              <div className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight flex items-baseline gap-1">
                <span>{formatMoney(calculation.grossAnnual)}</span>
                <span className="text-sm font-medium text-slate-300">/ year</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between gap-3">
              <div>
                <span className="text-xs text-emerald-300 font-bold block">Estimated Take-Home</span>
                <span className="text-[11px] text-slate-300">{formatMoney(calculation.netAnnual)} per year</span>
              </div>
              <span className="text-xl font-extrabold text-emerald-300">{formatMoney(calculation.netMonthly)}/mo</span>
            </div>

            <div className="space-y-2 text-xs">
              {calculation.taxLines.map((l) => (
                <div key={l.label} className="flex justify-between py-1 border-b border-white/5 text-slate-200">
                  <span>{l.label}</span>
                  <span className="font-semibold text-rose-300">-{formatMoney(l.value)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
              <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Gross Pay Equivalents</div>
              <div className="grid grid-cols-2 gap-2 text-slate-200">
                {[
                  ['Monthly', calculation.grossMonthly],
                  ['Bi-Weekly', calculation.grossBiweekly],
                  ['Weekly', calculation.grossWeekly],
                  ['Daily', calculation.grossDaily],
                ].map(([k, v]) => (
                  <div key={k} className="p-2.5 rounded-xl bg-white/5 flex justify-between">
                    <span>{k}:</span>
                    <span className="font-bold">{formatMoney(v)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </CalculatorContainer>
  );
}
