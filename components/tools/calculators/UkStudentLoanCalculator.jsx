'use client';

import React, { useMemo, useState } from 'react';
import { NumericInput } from '@/components/tools/NumericInput';
import { CalculatorContainer } from '@/components/tools/CalculatorContainer';
import { InputCard, ResultCard, Select } from '@/components/tools/FormBits';
import { GraduationCap } from 'lucide-react';
import { UK_STUDENT_LOANS, projectStudentLoan, studentLoanRepayment } from '@/lib/finance/studentLoan';
import { calcUkTakeHome, formatGBP } from '@/lib/tax';

const PLANS = UK_STUDENT_LOANS.plans;
const UNDERGRAD = Object.entries(PLANS).filter(([k]) => k !== 'postgrad');

export function UkStudentLoanCalculator({ country = 'uk', countryName = 'United Kingdom', tool }) {
  const [salary, setSalary] = useState(35000);
  const [plan, setPlan] = useState('plan2');
  const [postgrad, setPostgrad] = useState(false);
  const [balance, setBalance] = useState(45000);
  const [interest, setInterest] = useState(6);
  const [growth, setGrowth] = useState(3);
  const [yearsSince, setYearsSince] = useState(0);

  const ug = studentLoanRepayment(salary, plan);
  const pg = postgrad ? studentLoanRepayment(salary, 'postgrad') : 0;
  const total = ug + pg;
  const tax = calcUkTakeHome({ gross: salary });

  const proj = useMemo(
    () => projectStudentLoan({ salary, planId: plan, balance, interestPct: interest, growthPct: growth, yearsSinceDue: yearsSince }),
    [salary, plan, balance, interest, growth, yearsSince]
  );

  return (
    <CalculatorContainer
      country={country}
      countryName={countryName}
      toolName={tool?.name || 'Student Loan Repayment Calculator'}
      category="salary"
      badge={`${UK_STUDENT_LOANS.taxYear} thresholds`}
      description="Work out your monthly student loan repayment for Plan 1, 2, 4, 5 or a Postgraduate Loan, your take-home pay after it, and whether you are likely to repay before the loan is written off."
      resultSummaryText={`${formatGBP(salary)} on ${PLANS[plan].label}${postgrad ? ' + Postgraduate' : ''} → ${formatGBP(total / 12)}/month student loan; take-home ${formatGBP((tax.net - total) / 12)}/month`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <InputCard icon={GraduationCap} title="Your loan">
          <NumericInput id="sl-salary" label="Annual salary" prefix="£" value={salary} onChange={setSalary} step={500} required />
          <Select id="sl-plan" label="Repayment plan" value={plan} onChange={setPlan} hint={PLANS[plan].who} options={UNDERGRAD.map(([k, v]) => [k, `${v.label} — threshold ${formatGBP(v.threshold)}`])} />
          <label className="flex items-start gap-2 text-sm text-slate-700 cursor-pointer">
            <input type="checkbox" checked={postgrad} onChange={(e) => setPostgrad(e.target.checked)} className="mt-0.5 w-4 h-4 accent-cyan-700" />
            <span>I also have a Postgraduate Loan (6% above {formatGBP(PLANS.postgrad.threshold)})</span>
          </label>
          <div className="border-t border-slate-100 pt-4 space-y-4">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Will I pay it off? (optional)</p>
            <div className="grid grid-cols-2 gap-4">
              <NumericInput id="sl-balance" label={`${PLANS[plan].label} balance`} prefix="£" value={balance} onChange={setBalance} step={1000} />
              <NumericInput id="sl-interest" label="Interest rate" suffix="%" value={interest} onChange={setInterest} step={0.1} min={0} max={15} hint="see your SLC account" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <NumericInput id="sl-growth" label="Pay rise a year" suffix="%" value={growth} onChange={setGrowth} step={0.5} min={0} max={10} />
              <NumericInput id="sl-since" label="Years repaying so far" suffix="yrs" value={yearsSince} onChange={setYearsSince} step={1} min={0} max={39} />
            </div>
          </div>
        </InputCard>

        <div className="lg:col-span-6 space-y-6">
          <ResultCard
            label="Student loan per month"
            value={formatGBP(total / 12)}
            sub={`${formatGBP(total)} a year · ${PLANS[plan].label}${postgrad ? ' + Postgraduate' : ''}`}
            rows={[
              [`${PLANS[plan].label} (9% over ${formatGBP(PLANS[plan].threshold)})`, `${formatGBP(ug)} / yr`],
              ...(postgrad ? [[`Postgraduate (6% over ${formatGBP(PLANS.postgrad.threshold)})`, `${formatGBP(pg)} / yr`]] : []),
              ['Income Tax + NI', `${formatGBP(tax.totalTax)} / yr`],
              ['Take-home after tax, NI and loan', `${formatGBP((tax.net - total) / 12)} / month`],
            ]}
          />
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs text-sm text-slate-700 space-y-1">
            <h3 className="text-sm font-bold text-slate-900">Repayment outlook</h3>
            {proj.repaidInFull ? (
              <p>At this salary growth you would clear your {PLANS[plan].label} loan in about <strong>{proj.yearsToRepay} years</strong>, repaying {formatGBP(proj.totalRepaid)} in total.</p>
            ) : (
              <p>You would repay about {formatGBP(proj.totalRepaid)} over the {proj.yearsLeft} years left, and roughly <strong>{formatGBP(proj.writtenOff)}</strong> would be written off — so overpaying is unlikely to save you money.</p>
            )}
            <p className="text-[11px] text-slate-500">Estimate in today’s money: thresholds held at {UK_STUDENT_LOANS.taxYear} levels, one interest rate for the whole term.</p>
          </div>
        </div>
      </div>
    </CalculatorContainer>
  );
}
