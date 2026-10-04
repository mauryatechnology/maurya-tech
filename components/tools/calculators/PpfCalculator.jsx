'use client';

import React, { useMemo, useState } from 'react';
import { NumericInput } from '@/components/tools/NumericInput';
import { CalculatorContainer } from '@/components/tools/CalculatorContainer';
import { InputCard, ResultCard, ScheduleTable, milestoneRows } from '@/components/tools/FormBits';
import { PiggyBank } from 'lucide-react';
import { SAVINGS_RULES, ppfMaturity } from '@/lib/finance/savings';
import { formatINR } from '@/lib/tax';

const PPF = SAVINGS_RULES.ppf;

export function PpfCalculator({ country = 'in', countryName = 'India', tool }) {
  const [yearly, setYearly] = useState(PPF.maxYearly);
  const [rate, setRate] = useState(PPF.ratePct);
  const [years, setYears] = useState(PPF.years);

  const r = useMemo(() => ppfMaturity({ yearly, ratePct: rate, years: Math.min(50, Math.max(15, Number(years) || 15)) }), [yearly, rate, years]);
  const clamped = r.deposit !== (Number(yearly) || 0);

  return (
    <CalculatorContainer
      country={country}
      countryName={countryName}
      toolName={tool?.name || 'PPF Calculator'}
      category="finance"
      badge={`${PPF.ratePct}% · ${PPF.rateQuarter}`}
      description="Project your Public Provident Fund balance at maturity for a yearly deposit, with the interest earned each year and the option to extend beyond 15 years."
      resultSummaryText={`${formatINR(r.deposit)}/year for ${r.rows.length} years at ${rate}% → ${formatINR(r.maturity)} (interest ${formatINR(r.interest)}, tax-free)`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <InputCard icon={PiggyBank} title="Your PPF account">
          <NumericInput
            id="ppf-yearly"
            label="Yearly deposit"
            prefix="₹"
            value={yearly}
            onChange={setYearly}
            step={5000}
            min={PPF.minYearly}
            max={PPF.maxYearly}
            hint="₹500 – ₹1.5 lakh"
            required
          />
          {clamped && <p className="text-xs text-amber-700">PPF allows {formatINR(PPF.minYearly)} to {formatINR(PPF.maxYearly)} a year; using {formatINR(r.deposit)}.</p>}
          <div className="grid grid-cols-2 gap-4">
            <NumericInput id="ppf-rate" label="Interest rate" suffix="% p.a." value={rate} onChange={setRate} step={0.1} min={0} max={15} hint={`now ${PPF.ratePct}%`} />
            <NumericInput id="ppf-years" label="Years" suffix="yrs" value={years} onChange={setYears} step={5} min={15} max={50} hint="15 + 5-yr blocks" />
          </div>
          <p className="text-xs text-slate-500">Assumes you deposit before 5 April each year so the full amount earns interest. The rate is set every quarter and may change.</p>
        </InputCard>

        <div className="lg:col-span-6 space-y-6">
          <ResultCard
            label="Maturity value"
            value={formatINR(r.maturity)}
            sub="Tax-free at maturity (EEE)"
            rows={[
              ['Total deposited', formatINR(r.invested)],
              ['Total interest', formatINR(r.interest)],
              ['Interest in the final year', formatINR(r.rows[r.rows.length - 1]?.interest || 0)],
            ]}
          />
          <ScheduleTable
            title="Balance by year"
            headers={['Year', 'Deposited', 'Interest that year', 'Balance']}
            rows={milestoneRows(r.rows).map((y) => [y.year, formatINR(y.deposit * y.year), formatINR(y.interest), formatINR(y.balance)])}
          />
        </div>
      </div>
    </CalculatorContainer>
  );
}
