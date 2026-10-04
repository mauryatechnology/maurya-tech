'use client';

import React, { useMemo, useState } from 'react';
import { NumericInput } from '@/components/tools/NumericInput';
import { CalculatorContainer } from '@/components/tools/CalculatorContainer';
import { InputCard, ResultCard, Select } from '@/components/tools/FormBits';
import { Landmark } from 'lucide-react';
import { FD_COMPOUNDING, SAVINGS_RULES, fdMaturity, fdTdsApplies } from '@/lib/finance/savings';
import { formatINR } from '@/lib/tax';

export function FdCalculator({ country = 'in', countryName = 'India', tool }) {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(5);
  const [months, setMonths] = useState(0);
  const [compounding, setCompounding] = useState('quarterly');
  const [senior, setSenior] = useState(false);

  const r = useMemo(() => fdMaturity({ principal, ratePct: rate, years, months, compounding }), [principal, rate, years, months, compounding]);
  const tds = fdTdsApplies(r.averageYearlyInterest, senior);
  const limit = senior ? SAVINGS_RULES.fd.tdsThresholdSenior : SAVINGS_RULES.fd.tdsThreshold;

  return (
    <CalculatorContainer
      country={country}
      countryName={countryName}
      toolName={tool?.name || 'FD Calculator'}
      category="finance"
      badge="Quarterly compounding · TDS check"
      description="Work out the maturity amount and interest on a bank fixed deposit, the effective annual yield, and whether the bank will deduct TDS."
      resultSummaryText={`${formatINR(principal)} at ${rate}% for ${years}y ${months}m (${FD_COMPOUNDING[compounding].label.toLowerCase()}) → ${formatINR(r.maturity)}, interest ${formatINR(r.interest)}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <InputCard icon={Landmark} title="Your deposit">
          <NumericInput id="fd-principal" label="Deposit amount" prefix="₹" value={principal} onChange={setPrincipal} step={10000} min={1000} required />
          <NumericInput id="fd-rate" label="Interest rate" suffix="% p.a." value={rate} onChange={setRate} step={0.05} min={0} max={15} required />
          <div className="grid grid-cols-2 gap-4">
            <NumericInput id="fd-years" label="Years" suffix="yrs" value={years} onChange={setYears} step={1} min={0} max={10} />
            <NumericInput id="fd-months" label="Months" suffix="mo" value={months} onChange={setMonths} step={1} min={0} max={11} />
          </div>
          <Select id="fd-compounding" label="Interest" value={compounding} onChange={setCompounding} options={Object.entries(FD_COMPOUNDING).map(([k, v]) => [k, v.label])} />
          <label className="flex items-start gap-2 text-sm text-slate-700 cursor-pointer">
            <input type="checkbox" checked={senior} onChange={(e) => setSenior(e.target.checked)} className="mt-0.5 w-4 h-4 accent-cyan-700" />
            <span>Senior citizen (60+) — enter your bank’s senior rate above</span>
          </label>
        </InputCard>

        <div className="lg:col-span-6 space-y-6">
          <ResultCard
            label="Maturity amount"
            value={formatINR(r.maturity)}
            sub={`Effective yield ${r.effectiveYieldPct.toFixed(2)}% a year`}
            rows={[
              ['Deposit', formatINR(r.principal)],
              ['Total interest', formatINR(r.interest)],
              ['Average interest per year', formatINR(r.averageYearlyInterest)],
              ['TDS by the bank', tds ? `Likely — over ${formatINR(limit)}/yr` : `No — under ${formatINR(limit)}/yr`],
            ]}
          />
          <p className="text-[11px] text-slate-500 leading-relaxed">
            FD interest is taxed at your slab rate every year whether paid out or reinvested. Banks deduct 10% TDS when interest from all your deposits with that bank exceeds {formatINR(SAVINGS_RULES.fd.tdsThreshold)} in a financial year ({formatINR(SAVINGS_RULES.fd.tdsThresholdSenior)} for senior citizens); submit Form 15G/15H if your total income is below the taxable limit.
          </p>
        </div>
      </div>
    </CalculatorContainer>
  );
}
