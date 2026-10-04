'use client';

import React, { useMemo, useState } from 'react';
import { NumericInput } from '@/components/tools/NumericInput';
import { CalculatorContainer } from '@/components/tools/CalculatorContainer';
import { InputCard, ResultCard, ScheduleTable, milestoneRows } from '@/components/tools/FormBits';
import { TrendingUp } from 'lucide-react';
import { sipFutureValue } from '@/lib/finance/savings';
import { formatINR } from '@/lib/tax';

export function SipCalculator({ country = 'in', countryName = 'India', tool, initialMonthly, initialYears }) {
  const [monthly, setMonthly] = useState(initialMonthly ?? 10000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(initialYears ?? 10);
  const [stepUp, setStepUp] = useState(0);

  const r = useMemo(
    () => sipFutureValue({ monthly, ratePct: rate, years: Math.min(50, Math.max(1, Number(years) || 1)), stepUpPct: stepUp }),
    [monthly, rate, years, stepUp]
  );
  const gainPct = r.value > 0 ? (r.gains / r.value) * 100 : 0;

  return (
    <CalculatorContainer
      country={country}
      countryName={countryName}
      toolName={tool?.name || 'SIP Calculator'}
      category="finance"
      badge="Monthly compounding · step-up"
      description="See what a monthly SIP in a mutual fund could grow to, how much of it is your money and how much is returns — with an optional yearly step-up."
      resultSummaryText={`${formatINR(monthly)}/month for ${years} years at ${rate}%${Number(stepUp) ? ` (+${stepUp}%/yr)` : ''} → ${formatINR(r.value)} (invested ${formatINR(r.invested)})`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <InputCard icon={TrendingUp} title="Your SIP">
          <NumericInput id="sip-monthly" label="Monthly investment" prefix="₹" value={monthly} onChange={setMonthly} step={500} min={100} required />
          <div className="grid grid-cols-2 gap-4">
            <NumericInput id="sip-rate" label="Expected return" suffix="% p.a." value={rate} onChange={setRate} step={0.5} min={0} max={30} required />
            <NumericInput id="sip-years" label="Period" suffix="yrs" value={years} onChange={setYears} step={1} min={1} max={50} required />
          </div>
          <NumericInput id="sip-stepup" label="Yearly step-up" suffix="%" value={stepUp} onChange={setStepUp} step={1} min={0} max={50} hint="raise SIP each year" />
          <p className="text-xs text-slate-500">Returns are not guaranteed. Equity funds have historically been volatile; use a conservative rate for planning.</p>
        </InputCard>

        <div className="lg:col-span-6 space-y-6">
          <ResultCard
            label="Estimated value"
            value={formatINR(r.value)}
            sub={`${gainPct.toFixed(0)}% of the final value is returns`}
            rows={[
              ['Total invested', formatINR(r.invested)],
              ['Estimated returns', formatINR(r.gains)],
              ['Final monthly SIP', formatINR(Number(monthly) * Math.pow(1 + (Number(stepUp) || 0) / 100, Math.max(0, Math.ceil(Number(years) || 1) - 1)))],
            ]}
          />
          <ScheduleTable
            title="Growth over time"
            headers={['Year', 'Invested', 'Value']}
            rows={milestoneRows(r.yearly).map((y) => [y.year, formatINR(y.invested), formatINR(y.value)])}
          />
        </div>
      </div>
    </CalculatorContainer>
  );
}
