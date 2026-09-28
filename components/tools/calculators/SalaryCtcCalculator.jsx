'use client';

import React, { useState, useMemo } from 'react';
import { NumericInput } from '@/components/tools/NumericInput';
import { CalculatorContainer } from '@/components/tools/CalculatorContainer';
import { Wallet, Sparkles, Building2 } from 'lucide-react';
import { calcIndiaSalary, calcUkTakeHome, TAX_RULES } from '@/lib/tax';
import { ResumePackCta } from '@/components/tools/ResumePackCta';

export function SalaryCtcCalculator({
  country = 'in',
  countryName = 'India',
  computeConfig = {},
  tool,
  initialCtc,
}) {
  const isIndia = country.toLowerCase() === 'in';
  const currencySymbol = isIndia ? '₹' : '£';

  // Input states
  const [ctc, setCtc] = useState(initialCtc ?? (isIndia ? 1000000 : 45000)); // 10 Lakh default for IN, 45k for UK
  const [basicPct, setBasicPct] = useState(50);
  const [capEpf, setCapEpf] = useState(true); // ₹1800/mo statutory cap
  const [bonus, setBonus] = useState(0);

  // Real-time pure client-side math via the shared tax engine (lib/tax)
  const calculation = useMemo(() => {
    if (isIndia) {
      const r = calcIndiaSalary({ ctc, basicPct, pfCapped: capEpf, variablePay: bonus });
      return {
        monthlyInHand: r.monthlyInHand,
        annualInHand: r.annualInHand,
        monthlyTax: Math.round(r.tax.total / 12),
        annualTax: r.tax.total,
        monthlyEpf: Math.round(r.employeePf / 12),
        annualEpf: r.employeePf,
        monthlyPt: Math.round(r.professionalTax / 12),
        annualPt: r.professionalTax,
        employerPf: r.employerPf,
        grossSalary: r.grossSalary,
        standardDeduction: r.standardDeduction,
        taxableIncome: r.taxableIncome,
        totalDeductions: r.totalDeductions,
      };
    }
    const r = calcUkTakeHome({ gross: ctc });
    return {
      monthlyInHand: r.netMonthly,
      annualInHand: r.net,
      monthlyTax: Math.round(r.incomeTax / 12),
      annualTax: r.incomeTax,
      monthlyEpf: Math.round(r.nationalInsurance / 12),
      annualEpf: r.nationalInsurance,
      standardDeduction: r.personalAllowance,
      taxableIncome: r.taxableIncome,
      totalDeductions: r.totalTax,
    };
  }, [ctc, basicPct, capEpf, bonus, isIndia]);

  const formatMoney = (val) => {
    return `${currencySymbol}${Number(val || 0).toLocaleString(isIndia ? 'en-IN' : 'en-GB')}`;
  };

  const summaryText = `Annual CTC: ${formatMoney(ctc)} → Estimated Monthly In-Hand: ${formatMoney(
    calculation.monthlyInHand
  )}/mo | Annual In-Hand: ${formatMoney(calculation.annualInHand)} | Total Deductions: ${formatMoney(
    calculation.totalDeductions
  )}`;

  return (
    <CalculatorContainer
      country={country}
      countryName={countryName}
      toolName={tool?.name || (isIndia ? 'CTC to In-Hand Salary Calculator' : 'Gross to Net Salary Calculator')}
      category="salary"
      badge={isIndia ? TAX_RULES.IN.label : `HMRC ${TAX_RULES.UK.label}`}
      description={
        isIndia
          ? 'Estimate your monthly take-home salary from annual CTC: employer and employee PF, professional tax, the ₹75,000 standard deduction and the Section 87A rebate (zero tax up to ₹12 lakh taxable income).'
          : 'Calculate your net take-home salary from your gross annual pay with PAYE tax bands and National Insurance deductions.'
      }
      resultSummaryText={summaryText}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs Card */}
        <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Wallet className="w-5 h-5 text-cyan-600" />
              <span>Enter Salary Details</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Adjust your figures below to see real-time in-hand calculations.
            </p>
          </div>

          <NumericInput
            id="ctc-input"
            label={isIndia ? 'Annual CTC (Cost to Company)' : 'Annual Gross Salary'}
            prefix={currencySymbol}
            value={ctc}
            onChange={setCtc}
            step={10000}
            min={0}
            placeholder={isIndia ? '10,00,000' : '45,000'}
            hint={isIndia ? 'Ex: 12 Lakhs = 1200000' : 'Gross annual pay'}
            required
          />

          {isIndia && (
            <div className="space-y-4 pt-2">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  <span>Basic Salary Percentage</span>
                  <span className="text-cyan-700 font-extrabold">{basicPct}% of CTC</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="60"
                  step="5"
                  value={basicPct}
                  onChange={(e) => setBasicPct(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>30% (Lower PF)</span>
                  <span>50% (Standard)</span>
                  <span>60% (High PF)</span>
                </div>
              </div>

              {/* EPF Cap Toggle */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-800 block">Cap EPF to ₹1,800/Month?</span>
                  <span className="text-[11px] text-slate-500 block">
                    Statutory limit of 12% on ₹15,000 wage ceiling (most IT companies cap it).
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setCapEpf(!capEpf)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition cursor-pointer ${
                    capEpf ? 'bg-cyan-600' : 'bg-slate-300'
                  }`}
                  aria-label="Toggle EPF Cap"
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      capEpf ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <NumericInput
                id="bonus-input"
                label="Annual Variable / Joining Bonus (if any)"
                prefix={currencySymbol}
                value={bonus}
                onChange={setBonus}
                step={5000}
                min={0}
                placeholder="0"
                hint="Paid separately — excluded from the regular monthly figure"
              />
            </div>
          )}
        </div>

        {/* Right Result Highlight Box */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-gradient-to-br from-[#0A2540] to-[#0D3B66] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs uppercase tracking-wider font-bold text-cyan-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Estimated Take-Home Pay
              </span>
              <span className="text-[11px] font-mono text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-full">
                {isIndia ? 'New Regime' : 'PAYE UK'}
              </span>
            </div>

            {/* Big Headline Monthly Number */}
            <div className="space-y-1">
              <div className="text-xs text-slate-300 font-medium">Monthly In-Hand Salary</div>
              <div className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight flex items-baseline gap-1">
                <span>{formatMoney(calculation.monthlyInHand)}</span>
                <span className="text-sm font-medium text-slate-300">/ month</span>
              </div>
            </div>

            {/* Annual Figure */}
            <div className="p-4 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-200 font-medium">Annual In-Hand Salary</span>
              <span className="text-base font-bold text-cyan-300">{formatMoney(calculation.annualInHand)}</span>
            </div>

            {/* Deductions Breakdown Table */}
            <div className="space-y-2.5 pt-2 border-t border-white/10 text-xs">
              <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                Monthly Deductions Breakdown
              </div>
              {isIndia && calculation.employerPf > 0 && (
                <div className="flex justify-between py-1 border-b border-white/5 text-slate-200">
                  <span>Employer PF (part of CTC)</span>
                  <span className="font-semibold text-rose-300">-{formatMoney(Math.round(calculation.employerPf / 12))}</span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-white/5 text-slate-200">
                <span>Income Tax (TDS incl. cess)</span>
                <span className="font-semibold text-rose-300">-{formatMoney(calculation.monthlyTax)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5 text-slate-200">
                <span>{isIndia ? 'Employee EPF (12%)' : 'National Insurance'}</span>
                <span className="font-semibold text-rose-300">-{formatMoney(calculation.monthlyEpf)}</span>
              </div>
              {isIndia && (
                <div className="flex justify-between py-1 border-b border-white/5 text-slate-200">
                  <span>Professional Tax</span>
                  <span className="font-semibold text-rose-300">-{formatMoney(calculation.monthlyPt)}</span>
                </div>
              )}
              <div className="flex justify-between py-2 text-slate-100 font-bold border-t border-white/20">
                <span>Total Annual Deductions</span>
                <span className="text-rose-300">-{formatMoney(calculation.totalDeductions)} / yr</span>
              </div>
            </div>
          </div>

          {/* Contextual Career / Resume Pack CTA (§11.5) */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-900">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span>Negotiating a Job Offer or Promotion?</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Get the <strong>Salary Negotiation Scripts &amp; ATS Resume Pack</strong> — counter-offer email templates, ATS-friendly resume templates and bullet-point formulas.
            </p>
            <ResumePackCta label="Get Negotiation Pack" country={country} />
          </div>
        </div>
      </div>
    </CalculatorContainer>
  );
}
