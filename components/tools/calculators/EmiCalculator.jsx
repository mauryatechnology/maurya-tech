'use client';

import React, { useState, useMemo } from 'react';
import { NumericInput } from '@/components/tools/NumericInput';
import { CalculatorContainer } from '@/components/tools/CalculatorContainer';
import { CreditCard, Percent, Calendar, PieChart, Sparkles } from 'lucide-react';

export function EmiCalculator({
  country = 'in',
  countryName = 'India',
  computeConfig = {},
  tool,
}) {
  const currencySymbol = '₹';

  // Input states
  const [principal, setPrincipal] = useState(2500000); // 25 Lakhs
  const [rate, setRate] = useState(8.5); // 8.5% p.a.
  const [tenureYears, setTenureYears] = useState(20); // 20 years

  // Real-time client math
  const calculation = useMemo(() => {
    const p = Math.max(0, Number(principal) || 0);
    const annualRate = Math.max(0.1, Number(rate) || 0);
    const years = Math.max(1, Number(tenureYears) || 0);

    const r = annualRate / 12 / 100;
    const n = years * 12;

    // EMI formula: [P x R x (1+R)^N]/[(1+R)^N-1]
    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - p;
    const interestRatio = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;
    const principalRatio = 100 - interestRatio;

    return {
      monthlyEmi: Math.round(emi || 0),
      totalPayment: Math.round(totalPayment || 0),
      totalInterest: Math.round(totalInterest || 0),
      totalMonths: n,
      interestRatio: Math.round(interestRatio),
      principalRatio: Math.round(principalRatio),
    };
  }, [principal, rate, tenureYears]);

  const formatMoney = (val) => {
    return `${currencySymbol}${Number(val || 0).toLocaleString('en-IN')}`;
  };

  const summaryText = `Loan Amount: ${formatMoney(principal)} @ ${rate}% for ${tenureYears} Years → Monthly EMI: ${formatMoney(
    calculation.monthlyEmi
  )}/mo | Total Interest: ${formatMoney(calculation.totalInterest)} | Total Repayment: ${formatMoney(
    calculation.totalPayment
  )}`;

  return (
    <CalculatorContainer
      country={country}
      countryName={countryName}
      toolName={tool?.name || 'Home & Loan EMI Calculator'}
      category="finance"
      badge="Visual Amortization"
      description="Calculate your monthly home, car, or personal loan installment (EMI) with real-time principal vs interest visual breakdown."
      resultSummaryText={summaryText}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs Card */}
        <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-600" />
              <span>Loan Parameters</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Adjust loan amount, interest rate, and duration below.
            </p>
          </div>

          <NumericInput
            id="principal-input"
            label="Total Loan Amount"
            prefix="₹"
            value={principal}
            onChange={setPrincipal}
            step={50000}
            min={10000}
            placeholder="25,00,000"
            hint="Ex: 25 Lakhs = 2500000"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <NumericInput
              id="rate-input"
              label="Interest Rate (p.a.)"
              suffix="%"
              value={rate}
              onChange={setRate}
              step={0.1}
              min={1}
              max={30}
              placeholder="8.5"
              required
            />
            <NumericInput
              id="tenure-input"
              label="Tenure (Years)"
              suffix="yrs"
              value={tenureYears}
              onChange={setTenureYears}
              step={1}
              min={1}
              max={30}
              placeholder="20"
              required
            />
          </div>

          {/* Quick presets */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Quick Loan Presets
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Home (₹35L, 8.5%, 20y)', p: 3500000, r: 8.5, y: 20 },
                { label: 'Car (₹8L, 9.2%, 5y)', p: 800000, r: 9.2, y: 5 },
                { label: 'Personal (₹3L, 12%, 3y)', p: 300000, r: 12.0, y: 3 },
              ].map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setPrincipal(preset.p);
                    setRate(preset.r);
                    setTenureYears(preset.y);
                  }}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 transition cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Result Highlight Box */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-gradient-to-br from-[#0A2540] to-[#1E293B] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs uppercase tracking-wider font-bold text-cyan-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Monthly EMI Installment
              </span>
              <span className="text-[11px] font-mono text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-full">
                {calculation.totalMonths} Installments
              </span>
            </div>

            {/* Headline Monthly EMI */}
            <div className="space-y-1">
              <div className="text-xs text-slate-300 font-medium">Monthly Payable Amount</div>
              <div className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight flex items-baseline gap-1">
                <span>{formatMoney(calculation.monthlyEmi)}</span>
                <span className="text-sm font-medium text-slate-300">/ month</span>
              </div>
            </div>

            {/* Visual Ratio Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-300 font-medium">
                <span>Principal ({calculation.principalRatio}%)</span>
                <span>Total Interest ({calculation.interestRatio}%)</span>
              </div>
              <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden flex">
                <div
                  className="bg-cyan-400 h-full transition-all duration-500"
                  style={{ width: `${calculation.principalRatio}%` }}
                />
                <div
                  className="bg-amber-400 h-full transition-all duration-500"
                  style={{ width: `${calculation.interestRatio}%` }}
                />
              </div>
            </div>

            {/* Breakdown Cards */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-slate-400 text-[11px] block">Total Interest Payable</span>
                <span className="text-base font-bold text-amber-300 block">
                  {formatMoney(calculation.totalInterest)}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-slate-400 text-[11px] block">Total Repayment Amount</span>
                <span className="text-base font-bold text-cyan-300 block">
                  {formatMoney(calculation.totalPayment)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CalculatorContainer>
  );
}
