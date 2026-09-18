'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { NumericInput } from '@/components/tools/NumericInput';
import { CalculatorContainer } from '@/components/tools/CalculatorContainer';
import { Wallet, TrendingDown, ArrowDownRight, ShieldCheck, Sparkles, Building2, HelpCircle } from 'lucide-react';

export function SalaryCtcCalculator({
  country = 'in',
  countryName = 'India',
  computeConfig = {},
  tool,
}) {
  const isIndia = country.toLowerCase() === 'in';
  const currencySymbol = isIndia ? '₹' : '£';

  // Input states
  const [ctc, setCtc] = useState(isIndia ? 1000000 : 45000); // 10 Lakh default for IN, 45k for UK
  const [basicPct, setBasicPct] = useState(50);
  const [capEpf, setCapEpf] = useState(true); // ₹1800/mo statutory cap
  const [bonus, setBonus] = useState(0);

  // Real-time pure client-side math
  const calculation = useMemo(() => {
    if (isIndia) {
      const annualCtc = Math.max(0, Number(ctc) || 0);
      const basicAnnual = (annualCtc * (basicPct / 100));
      const monthlyBasic = basicAnnual / 12;

      // EPF Employee Share (12% of basic, optionally capped at ₹1800/mo)
      let monthlyEpf = 0;
      if (capEpf) {
        monthlyEpf = Math.min(monthlyBasic * 0.12, 1800);
      } else {
        monthlyEpf = monthlyBasic * 0.12;
      }
      const annualEpf = monthlyEpf * 12;

      // Professional Tax (Standard ₹2,400/yr in most states)
      const annualPt = 2400;
      const monthlyPt = 200;

      // 2026 New Tax Regime Income Tax Calculation
      const standardDeduction = 75000;
      const taxableIncome = Math.max(0, annualCtc - standardDeduction);

      let incomeTax = 0;
      // Section 87A Rebate: Zero tax if taxable income <= 7,00,000
      if (taxableIncome <= 700000) {
        incomeTax = 0;
      } else {
        if (taxableIncome > 300000) {
          incomeTax += (Math.min(taxableIncome, 700000) - 300000) * 0.05;
        }
        if (taxableIncome > 700000) {
          incomeTax += (Math.min(taxableIncome, 1000000) - 700000) * 0.10;
        }
        if (taxableIncome > 1000000) {
          incomeTax += (Math.min(taxableIncome, 1200000) - 1000000) * 0.15;
        }
        if (taxableIncome > 1200000) {
          incomeTax += (Math.min(taxableIncome, 1500000) - 1200000) * 0.20;
        }
        if (taxableIncome > 1500000) {
          incomeTax += (taxableIncome - 1500000) * 0.30;
        }
      }

      // 4% Health & Education Cess
      const cess = incomeTax * 0.04;
      const totalAnnualTax = incomeTax + cess;
      const monthlyTax = totalAnnualTax / 12;

      const totalAnnualDeductions = annualEpf + annualPt + totalAnnualTax;
      const annualInHand = Math.max(0, annualCtc - totalAnnualDeductions - bonus);
      const monthlyInHand = annualInHand / 12;

      return {
        monthlyInHand: Math.round(monthlyInHand),
        annualInHand: Math.round(annualInHand),
        monthlyTax: Math.round(monthlyTax),
        annualTax: Math.round(totalAnnualTax),
        monthlyEpf: Math.round(monthlyEpf),
        annualEpf: Math.round(annualEpf),
        monthlyPt,
        annualPt,
        standardDeduction,
        taxableIncome: Math.round(taxableIncome),
        totalDeductions: Math.round(totalAnnualDeductions),
      };
    } else {
      // UK PAYE Calculation
      const gross = Math.max(0, Number(ctc) || 0);
      const personalAllowance = 12570;
      const taxable = Math.max(0, gross - personalAllowance);

      let tax = 0;
      if (taxable > 0) {
        tax += Math.min(taxable, 37700) * 0.20; // 20% basic rate up to £50,270
        if (taxable > 37700) {
          tax += (taxable - 37700) * 0.40; // 40% higher rate
        }
      }

      // National Insurance (approx 8% on earnings between £12,570 and £50,270)
      const niThreshold = 12570;
      let ni = 0;
      if (gross > niThreshold) {
        ni = Math.min(gross - niThreshold, 37700) * 0.08;
      }

      const totalDeductions = tax + ni;
      const netAnnual = Math.max(0, gross - totalDeductions);

      return {
        monthlyInHand: Math.round(netAnnual / 12),
        annualInHand: Math.round(netAnnual),
        monthlyTax: Math.round(tax / 12),
        annualTax: Math.round(tax),
        monthlyEpf: Math.round(ni / 12),
        annualEpf: Math.round(ni),
        standardDeduction: personalAllowance,
        taxableIncome: Math.round(taxable),
        totalDeductions: Math.round(totalDeductions),
      };
    }
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
      badge={isIndia ? '2026 Budget New Tax Regime' : 'HMRC PAYE Rates'}
      description={
        isIndia
          ? 'Estimate your exact monthly take-home salary based on your annual CTC with PF, professional tax, and the ₹75,000 New Regime standard deduction.'
          : 'Calculate your net take-home salary from your gross annual pay with PAYE tax bands and National Insurance deductions.'
      }
      resultSummaryText={summaryText}
      faqs={tool?.seo?.faqSchema || []}
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
                hint="Deducted from regular monthly take-home"
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
                {isIndia ? '2026 Slabs' : 'PAYE UK'}
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
              <div className="flex justify-between py-1 border-b border-white/5 text-slate-200">
                <span>Income Tax (TDS)</span>
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
              Don&apos;t accept the first offer. Get our curated <strong>Salary Negotiation Scripts & ATS Resume Pack</strong> designed by senior engineering hiring managers.
            </p>
            <div className="pt-1 flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-900">Only ₹199</span>
              <Link
                href="/contact?ref=salary-pack"
                className="px-4 py-2 rounded-xl bg-[#0A2540] hover:bg-slate-800 text-white font-semibold text-xs transition cursor-pointer shadow-xs inline-block"
              >
                Get Negotiation Pack
              </Link>
            </div>
          </div>
        </div>
      </div>
    </CalculatorContainer>
  );
}
