'use client';

import React, { useMemo, useState } from 'react';
import { NumericInput } from '@/components/tools/NumericInput';
import { CalculatorContainer } from '@/components/tools/CalculatorContainer';
import { InputCard, ResultCard, ScheduleTable, Select, milestoneRows } from '@/components/tools/FormBits';
import { Home } from 'lucide-react';
import { calcUsMortgage, calcUkMortgage } from '@/lib/finance/mortgage';

const usd = (n) => `$${Math.round(n || 0).toLocaleString('en-US')}`;
const gbp = (n) => `£${Math.round(n || 0).toLocaleString('en-GB')}`;

const scheduleRows = (schedule, money) =>
  milestoneRows(schedule).map((r) => [r.year, money(r.interest), money(r.principal), money(r.balance)]);
const SCHEDULE_HEADERS = ['Year', 'Interest that year', 'Principal that year', 'Balance left'];

function UsMortgage({ country, countryName, tool }) {
  const [price, setPrice] = useState(400000);
  const [down, setDown] = useState(80000);
  const [rate, setRate] = useState(6.5);
  const [years, setYears] = useState('30');
  const [taxPct, setTaxPct] = useState(1.1);
  const [insurance, setInsurance] = useState(1800);
  const [hoa, setHoa] = useState(0);
  const [pmiPct, setPmiPct] = useState(0.5);

  const r = useMemo(
    () => calcUsMortgage({ price, downPayment: down, ratePct: rate, years: Number(years), propertyTaxPct: taxPct, insuranceAnnual: insurance, hoaMonthly: hoa, pmiPct }),
    [price, down, rate, years, taxPct, insurance, hoa, pmiPct]
  );

  const summaryText = `${usd(r.price)} home, ${r.downPct.toFixed(0)}% down, ${rate}% for ${years} years → ${usd(r.monthlyTotal)}/month (principal & interest ${usd(r.principalInterest)})`;

  return (
    <CalculatorContainer
      country={country}
      countryName={countryName}
      toolName={tool?.name || 'Mortgage Calculator'}
      category="finance"
      badge="PITI · PMI · amortization"
      description="Estimate your monthly mortgage payment including property tax, homeowners insurance, PMI and HOA dues, plus total interest over the loan."
      resultSummaryText={summaryText}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <InputCard icon={Home} title="Home and loan">
          <div className="grid grid-cols-2 gap-4">
            <NumericInput id="price" label="Home price" prefix="$" value={price} onChange={setPrice} step={5000} required />
            <NumericInput id="down" label="Down payment" prefix="$" value={down} onChange={setDown} step={1000} hint={`${r.downPct.toFixed(1)}%`} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <NumericInput id="rate" label="Interest rate" suffix="%" value={rate} onChange={setRate} step={0.125} min={0} max={20} required />
            <Select id="term" label="Loan term" value={years} onChange={setYears} options={[['30', '30 years'], ['20', '20 years'], ['15', '15 years'], ['10', '10 years']]} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <NumericInput id="tax" label="Property tax" suffix="%/yr" value={taxPct} onChange={setTaxPct} step={0.1} max={5} />
            <NumericInput id="insurance" label="Home insurance" prefix="$" suffix="/yr" value={insurance} onChange={setInsurance} step={100} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <NumericInput id="hoa" label="HOA dues" prefix="$" suffix="/mo" value={hoa} onChange={setHoa} step={25} />
            <NumericInput id="pmi" label="PMI rate" suffix="%/yr" value={pmiPct} onChange={setPmiPct} step={0.05} max={3} hint="if < 20% down" />
          </div>
        </InputCard>

        <div className="lg:col-span-6 space-y-6">
          <ResultCard
            label="Monthly payment"
            value={usd(r.monthlyTotal)}
            sub={`Loan ${usd(r.loan)} · total interest ${usd(r.totalInterest)}`}
            rows={[
              ['Principal & interest', usd(r.principalInterest)],
              ['Property tax', usd(r.propertyTax)],
              ['Homeowners insurance', usd(r.insurance)],
              ['PMI', r.pmi ? `${usd(r.pmi)} for ${Math.ceil((r.pmiMonths || 0) / 12)} yrs` : 'None (20%+ down)'],
              ['HOA dues', usd(r.hoa)],
              [`Total paid over ${years} years (P&I)`, usd(r.totalPaid)],
            ]}
          />
          <ScheduleTable title="Balance over time" headers={SCHEDULE_HEADERS} rows={scheduleRows(r.schedule, usd)} />
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Fixed-rate estimate. Property tax and insurance vary by county and insurer; lenders may escrow them and add closing costs. PMI ends automatically when the balance reaches 78% of the original price.
          </p>
        </div>
      </div>
    </CalculatorContainer>
  );
}

function UkMortgage({ country, countryName, tool }) {
  const [price, setPrice] = useState(300000);
  const [deposit, setDeposit] = useState(30000);
  const [rate, setRate] = useState(4.5);
  const [years, setYears] = useState(25);
  const [type, setType] = useState('repayment');
  const [ftb, setFtb] = useState(false);

  const r = useMemo(
    () => calcUkMortgage({ price, deposit, ratePct: rate, years: Math.min(40, Math.max(1, Number(years) || 25)), type, firstTimeBuyer: ftb }),
    [price, deposit, rate, years, type, ftb]
  );

  const summaryText = `${gbp(r.price)} home, ${gbp(r.deposit)} deposit (${r.ltv.toFixed(0)}% LTV), ${rate}% over ${years} years → ${gbp(r.monthly)}/month ${type}`;

  return (
    <CalculatorContainer
      country={country}
      countryName={countryName}
      toolName={tool?.name || 'Mortgage Calculator UK'}
      category="finance"
      badge="Repayment · LTV · stamp duty"
      description="Work out monthly mortgage repayments on a repayment or interest-only mortgage, your loan-to-value and the Stamp Duty due in England and Northern Ireland."
      resultSummaryText={summaryText}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <InputCard icon={Home} title="Property and mortgage">
          <div className="grid grid-cols-2 gap-4">
            <NumericInput id="price" label="Property price" prefix="£" value={price} onChange={setPrice} step={5000} required />
            <NumericInput id="deposit" label="Deposit" prefix="£" value={deposit} onChange={setDeposit} step={1000} hint={`${(100 - r.ltv).toFixed(1)}%`} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <NumericInput id="rate" label="Interest rate" suffix="%" value={rate} onChange={setRate} step={0.05} min={0} max={15} required />
            <NumericInput id="years" label="Term" suffix="yrs" value={years} onChange={setYears} step={1} min={1} max={40} />
          </div>
          <Select id="type" label="Mortgage type" value={type} onChange={setType} options={[['repayment', 'Repayment (capital + interest)'], ['interest-only', 'Interest-only']]} />
          <label className="flex items-start gap-2 text-sm text-slate-700 cursor-pointer">
            <input type="checkbox" checked={ftb} onChange={(e) => setFtb(e.target.checked)} className="mt-0.5 w-4 h-4 accent-cyan-700" />
            <span>First-time buyer (Stamp Duty relief up to £500,000)</span>
          </label>
        </InputCard>

        <div className="lg:col-span-6 space-y-6">
          <ResultCard
            label="Monthly repayment"
            value={gbp(r.monthly)}
            sub={`Mortgage ${gbp(r.loan)} · ${r.ltv.toFixed(1)}% loan-to-value`}
            rows={[
              ['Total interest', gbp(r.totalInterest)],
              [`Total repaid over ${years} years`, gbp(r.totalPaid)],
              ...(r.interestOnly ? [['Still owed at the end', gbp(r.loan)]] : []),
              ['Stamp Duty (England & NI)', gbp(r.stampDuty)],
              ['Cash needed (deposit + Stamp Duty)', gbp(r.deposit + r.stampDuty)],
            ]}
          />
          <ScheduleTable title="Balance over time" headers={SCHEDULE_HEADERS} rows={scheduleRows(r.schedule, gbp)} />
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Assumes one rate for the whole term; most UK deals are fixed for 2–5 years and then move to the lender’s variable rate. Stamp Duty is for a main residence in England or Northern Ireland — Scotland (LBTT), Wales (LTT) and additional properties differ.
          </p>
        </div>
      </div>
    </CalculatorContainer>
  );
}

export function MortgageCalculator(props) {
  return (props.country || '').toLowerCase() === 'uk' ? <UkMortgage {...props} /> : <UsMortgage {...props} />;
}
