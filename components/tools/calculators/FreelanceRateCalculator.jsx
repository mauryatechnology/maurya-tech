'use client';

import React, { useState, useMemo } from 'react';
import { NumericInput } from '@/components/tools/NumericInput';
import { CalculatorContainer } from '@/components/tools/CalculatorContainer';
import {
  DollarSign,
  Clock,
  Briefcase,
  TrendingUp,
  PieChart,
  ShieldCheck,
  Calendar,
  Sparkles,
} from 'lucide-react';

export function FreelanceRateCalculator({
  country = 'in',
  countryName = 'India',
  computeConfig = {},
  tool,
}) {
  const isIndia = country === 'in';
  const isUk = country === 'uk';
  const currencySymbol = isIndia ? '₹' : isUk ? '£' : '$';

  // State
  const [targetTakeHome, setTargetTakeHome] = useState(isIndia ? 1800000 : 120000); // ₹18L or $120k
  const [weeksPerYear, setWeeksPerYear] = useState(48); // 48 working weeks (4 weeks off)
  const [billableHoursPerWeek, setBillableHoursPerWeek] = useState(25); // 25 billable hours/wk
  const [annualExpenses, setAnnualExpenses] = useState(isIndia ? 150000 : 10000); // Subscriptions, gear
  const [taxRatePercent, setTaxRatePercent] = useState(25); // 25% tax reserve
  const [profitMarginPercent, setProfitMarginPercent] = useState(15); // 15% business safety buffer

  const calculation = useMemo(() => {
    const netIncome = Math.max(0, Number(targetTakeHome) || 0);
    const expenses = Math.max(0, Number(annualExpenses) || 0);
    const weeks = Math.max(1, Number(weeksPerYear) || 1);
    const hoursPerWeek = Math.max(1, Number(billableHoursPerWeek) || 1);
    const taxRate = Math.max(0, Number(taxRatePercent) || 0) / 100;
    const profitMargin = Math.max(0, Number(profitMarginPercent) || 0) / 100;

    // Gross needed before tax = (Net Income) / (1 - Tax Rate)
    const grossIncomeBeforeTax = taxRate < 1 ? netIncome / (1 - taxRate) : netIncome;
    const taxesPaid = grossIncomeBeforeTax - netIncome;

    // Total revenue needed = (Gross Income + Expenses) * (1 + Profit Margin)
    const totalRequiredRevenue = (grossIncomeBeforeTax + expenses) * (1 + profitMargin);
    const profitBuffer = totalRequiredRevenue - (grossIncomeBeforeTax + expenses);

    const totalBillableHours = weeks * hoursPerWeek;
    const hourlyRate = totalBillableHours > 0 ? totalRequiredRevenue / totalBillableHours : 0;
    const dailyRate = hourlyRate * 8;
    const weeklyRevenue = totalRequiredRevenue / weeks;
    const monthlyRevenue = totalRequiredRevenue / 12;

    // Percentages for visual bar
    const netRatio = totalRequiredRevenue > 0 ? (netIncome / totalRequiredRevenue) * 100 : 0;
    const taxRatio = totalRequiredRevenue > 0 ? (taxesPaid / totalRequiredRevenue) * 100 : 0;
    const expenseRatio = totalRequiredRevenue > 0 ? (expenses / totalRequiredRevenue) * 100 : 0;
    const profitRatio = totalRequiredRevenue > 0 ? (profitBuffer / totalRequiredRevenue) * 100 : 0;

    return {
      totalBillableHours,
      totalRequiredRevenue: Math.round(totalRequiredRevenue),
      hourlyRate: Math.round(hourlyRate),
      dailyRate: Math.round(dailyRate),
      weeklyRevenue: Math.round(weeklyRevenue),
      monthlyRevenue: Math.round(monthlyRevenue),
      netIncome: Math.round(netIncome),
      taxesPaid: Math.round(taxesPaid),
      expenses: Math.round(expenses),
      profitBuffer: Math.round(profitBuffer),
      netRatio: Math.round(netRatio),
      taxRatio: Math.round(taxRatio),
      expenseRatio: Math.round(expenseRatio),
      profitRatio: Math.round(profitRatio),
      // Project rule of thumb
      twoWeekSprint: Math.round(hourlyRate * 50), // 50 billable hours sprint
      monthlyRetainer: Math.round(monthlyRevenue),
    };
  }, [
    targetTakeHome,
    weeksPerYear,
    billableHoursPerWeek,
    annualExpenses,
    taxRatePercent,
    profitMarginPercent,
  ]);

  const formatMoney = (val) => {
    return `${currencySymbol}${Number(val || 0).toLocaleString(isIndia ? 'en-IN' : 'en-US')}`;
  };

  const summaryText = `Target Income: ${formatMoney(targetTakeHome)} → Recommended Freelance Rate: ${formatMoney(
    calculation.hourlyRate
  )}/hr (${formatMoney(calculation.dailyRate)}/day | ${formatMoney(calculation.monthlyRevenue)}/mo)`;

  return (
    <CalculatorContainer
      country={country}
      countryName={countryName}
      toolName={tool?.name || 'Freelance & Consultant Rate Calculator'}
      category="finance"
      badge="Pricing Strategy"
      description="Determine your exact freelance hourly rate, day rate, and project pricing based on target take-home income, billable hours, business software overhead, and tax buffers."
      resultSummaryText={summaryText}
      faqs={tool?.seo?.faqSchema || []}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-cyan-600" />
              <span>Target Income & Capacity</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Specify your target salary and realistic billable workload.
            </p>
          </div>

          <NumericInput
            id="target-take-home"
            label="Desired Annual Take-Home (Net Salary)"
            prefix={currencySymbol}
            value={targetTakeHome}
            onChange={setTargetTakeHome}
            step={isIndia ? 50000 : 5000}
            min={1000}
            placeholder={isIndia ? '18,00,000' : '120,000'}
            hint="The actual cash you want to deposit in your personal bank account"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <NumericInput
              id="weeks-per-year"
              label="Working Weeks / Year"
              value={weeksPerYear}
              onChange={setWeeksPerYear}
              min={20}
              max={52}
              placeholder="48"
              hint="48 weeks = 4 weeks vacation"
            />
            <NumericInput
              id="billable-hours"
              label="Billable Hours / Week"
              value={billableHoursPerWeek}
              onChange={setBillableHoursPerWeek}
              min={5}
              max={50}
              placeholder="25"
              hint="Avg 25-30 hrs (rest is admin/sales)"
            />
          </div>

          <div className="border-t border-slate-100 pt-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Overhead, Taxes & Safety Margin
            </h3>
            <div className="space-y-4">
              <NumericInput
                id="annual-expenses"
                label="Annual Business Expenses"
                prefix={currencySymbol}
                value={annualExpenses}
                onChange={setAnnualExpenses}
                step={isIndia ? 10000 : 1000}
                placeholder={isIndia ? '1,50,000' : '10,000'}
                hint="Software (GitHub, AWS, Figma), laptop, co-working, accountant"
              />

              <div className="grid grid-cols-2 gap-4">
                <NumericInput
                  id="tax-rate-percent"
                  label="Tax Reserve Buffer"
                  suffix="%"
                  value={taxRatePercent}
                  onChange={setTaxRatePercent}
                  min={0}
                  max={60}
                  placeholder="25"
                />
                <NumericInput
                  id="profit-margin-percent"
                  label="Profit Margin Buffer"
                  suffix="%"
                  value={profitMarginPercent}
                  onChange={setProfitMarginPercent}
                  min={0}
                  max={50}
                  placeholder="15"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Outputs */}
        <div className="lg:col-span-6 space-y-6">
          {/* Main Rate Card */}
          <div className="bg-linear-to-br from-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-xl border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Recommended Pricing
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {calculation.totalBillableHours} billable hrs/yr
              </span>
            </div>

            <div>
              <div className="text-xs text-slate-400">Target Minimum Hourly Rate</div>
              <div className="text-4xl sm:text-5xl font-extrabold font-mono tracking-tight text-white mt-1">
                {formatMoney(calculation.hourlyRate)}{' '}
                <span className="text-lg font-normal text-slate-400">/ hour</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
              <div>
                <div className="text-xs text-slate-400">Day Rate (8 Hours)</div>
                <div className="text-xl font-bold font-mono text-cyan-300 mt-0.5">
                  {formatMoney(calculation.dailyRate)}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Monthly Gross Billing</div>
                <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">
                  {formatMoney(calculation.monthlyRevenue)}
                </div>
              </div>
            </div>

            {/* Visual Revenue Breakdown */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Revenue Allocation Breakdown</span>
                <span className="font-mono text-slate-400">
                  Total: {formatMoney(calculation.totalRequiredRevenue)}
                </span>
              </div>

              <div className="h-3 rounded-full bg-slate-800 overflow-hidden flex">
                <div
                  style={{ width: `${calculation.netRatio}%` }}
                  className="bg-emerald-500"
                  title={`Net Personal: ${calculation.netRatio}%`}
                />
                <div
                  style={{ width: `${calculation.taxRatio}%` }}
                  className="bg-rose-500"
                  title={`Taxes: ${calculation.taxRatio}%`}
                />
                <div
                  style={{ width: `${calculation.expenseRatio}%` }}
                  className="bg-amber-500"
                  title={`Expenses: ${calculation.expenseRatio}%`}
                />
                <div
                  style={{ width: `${calculation.profitRatio}%` }}
                  className="bg-cyan-500"
                  title={`Profit Buffer: ${calculation.profitRatio}%`}
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Net ({calculation.netRatio}%)</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span>Taxes ({calculation.taxRatio}%)</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Overhead ({calculation.expenseRatio}%)</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                  <span>Profit ({calculation.profitRatio}%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Project Quote Rule of Thumb */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-600" />
              <span>Project Pricing Rule of Thumb</span>
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-slate-500">2-Week Sprint Quote (50 hrs)</div>
                <div className="text-lg font-bold font-mono text-slate-900 mt-1">
                  {formatMoney(calculation.twoWeekSprint)}
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-slate-500">Monthly Retainer Quote</div>
                <div className="text-lg font-bold font-mono text-slate-900 mt-1">
                  {formatMoney(calculation.monthlyRetainer)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CalculatorContainer>
  );
}
