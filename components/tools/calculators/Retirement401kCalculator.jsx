'use client';

import React, { useMemo, useState } from 'react';
import { NumericInput } from '@/components/tools/NumericInput';
import { CalculatorContainer } from '@/components/tools/CalculatorContainer';
import { InputCard, ResultCard, ScheduleTable } from '@/components/tools/FormBits';
import { PiggyBank } from 'lucide-react';
import { US_401K, employeeLimit, project401k } from '@/lib/finance/retirement';
import { formatUSD } from '@/lib/tax';

export function Retirement401kCalculator({ country = 'us', countryName = 'United States', tool }) {
  const [age, setAge] = useState(30);
  const [retireAge, setRetireAge] = useState(65);
  const [salary, setSalary] = useState(80000);
  const [contribPct, setContribPct] = useState(6);
  const [matchRate, setMatchRate] = useState(50);
  const [matchCap, setMatchCap] = useState(6);
  const [balance, setBalance] = useState(20000);
  const [returnPct, setReturnPct] = useState(7);
  const [raisePct, setRaisePct] = useState(3);

  const r = useMemo(
    () => project401k({ age, retireAge, salary, contribPct, matchRatePct: matchRate, matchCapPct: matchCap, balance, returnPct, raisePct }),
    [age, retireAge, salary, contribPct, matchRate, matchCap, balance, returnPct, raisePct]
  );
  const limit = employeeLimit(age);
  const capped = (Number(salary) * Number(contribPct)) / 100 > limit;

  return (
    <CalculatorContainer
      country={country}
      countryName={countryName}
      toolName={tool?.name || '401(k) Calculator'}
      category="finance"
      badge={`${US_401K.year} limits · employer match`}
      description="Project your 401(k) balance at retirement from your contributions, employer match, raises and investment return — using the 2026 IRS limits and catch-up rules."
      resultSummaryText={`Age ${age}→${retireAge}, ${formatUSD(salary)} salary, ${contribPct}% + match → ${formatUSD(r.balance)} at retirement`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <InputCard icon={PiggyBank} title="You and your plan">
          <div className="grid grid-cols-2 gap-4">
            <NumericInput id="k-age" label="Current age" suffix="yrs" value={age} onChange={setAge} step={1} min={18} max={75} required />
            <NumericInput id="k-retire" label="Retirement age" suffix="yrs" value={retireAge} onChange={setRetireAge} step={1} min={40} max={80} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <NumericInput id="k-salary" label="Annual salary" prefix="$" value={salary} onChange={setSalary} step={1000} required />
            <NumericInput id="k-balance" label="Current balance" prefix="$" value={balance} onChange={setBalance} step={1000} />
          </div>
          <NumericInput id="k-contrib" label="Your contribution" suffix="% of pay" value={contribPct} onChange={setContribPct} step={1} min={0} max={100} hint={`limit ${formatUSD(limit)} at your age`} />
          <div className="grid grid-cols-2 gap-4">
            <NumericInput id="k-match" label="Employer match" suffix="%" value={matchRate} onChange={setMatchRate} step={25} min={0} max={200} hint="of what you put in" />
            <NumericInput id="k-cap" label="Matched up to" suffix="% of pay" value={matchCap} onChange={setMatchCap} step={1} min={0} max={25} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <NumericInput id="k-return" label="Annual return" suffix="%" value={returnPct} onChange={setReturnPct} step={0.5} min={0} max={15} />
            <NumericInput id="k-raise" label="Yearly raise" suffix="%" value={raisePct} onChange={setRaisePct} step={0.5} min={0} max={10} />
          </div>
        </InputCard>

        <div className="lg:col-span-6 space-y-6">
          <ResultCard
            label={`Balance at ${retireAge}`}
            value={formatUSD(r.balance)}
            sub={`Before tax · in future dollars · ${Number(retireAge) - Number(age)} years`}
            rows={[
              ['Your contributions', formatUSD(r.totalEmployee)],
              ['Employer contributions', formatUSD(r.totalEmployer)],
              ['Investment growth', formatUSD(r.growth)],
              ['This year: you / employer', `${formatUSD(r.firstYearEmployee)} / ${formatUSD(r.firstYearEmployer)}`],
            ]}
          />
          {r.missedMatch > 0 && (
            <p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              You are leaving about <strong>{formatUSD(r.missedMatch)}</strong> of free employer match on the table this year. Contributing {matchCap}% of pay would collect the full match.
            </p>
          )}
          {capped && <p className="text-xs text-slate-600">Your contribution is capped at the {US_401K.year} limit of {formatUSD(limit)} for your age.</p>}
          <ScheduleTable
            title="Balance by age"
            headers={['Age', 'Salary', 'You + employer', 'Balance']}
            rows={r.rows
              .filter((y, i) => i === 0 || y.age % 5 === 0 || i === r.rows.length - 1)
              .map((y) => [y.age, formatUSD(y.salary), formatUSD(y.employee + y.employer), formatUSD(y.balance)])}
          />
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Projection only — returns are not guaranteed. Contribution limits are held at {US_401K.year} levels (they usually rise with inflation). Traditional 401(k) withdrawals are taxed as income; Roth withdrawals can be tax-free.
          </p>
        </div>
      </div>
    </CalculatorContainer>
  );
}
