'use client';

import React, { useMemo, useState } from 'react';
import { NumericInput } from '@/components/tools/NumericInput';
import { CalculatorContainer } from '@/components/tools/CalculatorContainer';
import { Scale, Sparkles, Home } from 'lucide-react';
import { calcIndiaSalary, compareIndiaRegimes, hraExemption, IN_OLD_REGIME, TAX_RULES, formatINR } from '@/lib/tax';

function Toggle({ id, checked, onChange, label, sub }) {
  return (
    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
      <div className="space-y-0.5">
        <span id={`${id}-label`} className="text-xs font-bold text-slate-800 block">{label}</span>
        {sub && <span className="text-[11px] text-slate-500 block">{sub}</span>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={`${id}-label`}
        onClick={() => onChange(!checked)}
        className={`w-12 h-6 shrink-0 flex items-center rounded-full p-1 transition cursor-pointer ${checked ? 'bg-cyan-600' : 'bg-slate-300'}`}
      >
        <span className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}

export function IncomeTaxNewVsOldCalculator({ country = 'in', countryName = 'India', tool, initialGross }) {
  const [amount, setAmount] = useState(initialGross ?? 1500000);
  const [isCtc, setIsCtc] = useState(false);
  const [basicPct, setBasicPct] = useState(50);
  const [hraReceived, setHraReceived] = useState(300000);
  const [rentMonthly, setRentMonthly] = useState(25000);
  const [metro, setMetro] = useState(true);
  const [sec80C, setSec80C] = useState(150000);
  const [sec80DSelf, setSec80DSelf] = useState(25000);
  const [sec80DParents, setSec80DParents] = useState(0);
  const [nps, setNps] = useState(0);
  const [homeLoan, setHomeLoan] = useState(0);
  const [pt, setPt] = useState(2400);

  const r = useMemo(() => {
    const gross = isCtc ? calcIndiaSalary({ ctc: amount, basicPct }).grossSalary : Math.max(0, Number(amount) || 0);
    const basic = gross * (basicPct / 100);
    const hra = hraExemption({ basic, hraReceived, rentPaid: (Number(rentMonthly) || 0) * 12, metro });
    const cmp = compareIndiaRegimes({
      grossSalary: gross,
      deductions: { hra, sec80C, sec80CCD1B: nps, sec80DSelf, sec80DParents, sec24b: homeLoan, professionalTax: pt },
    });
    return { ...cmp, hra };
  }, [amount, isCtc, basicPct, hraReceived, rentMonthly, metro, sec80C, sec80DSelf, sec80DParents, nps, homeLoan, pt]);

  const rows = [
    ['Gross salary', r.gross, r.gross],
    ['Total deductions', -r.new.deductions, -r.old.deductions],
    ['Taxable income', r.new.taxable, r.old.taxable],
    ['Tax on slabs', r.new.tax.slabTax, r.old.tax.slabTax],
    ['87A rebate / marginal relief', -(r.new.tax.rebate + r.new.tax.marginalRelief), -(r.old.tax.rebate + r.old.tax.marginalRelief)],
    ['Surcharge', r.new.tax.surcharge, r.old.tax.surcharge],
    ['Health & education cess (4%)', r.new.tax.cess, r.old.tax.cess],
  ];
  const fmt = (v) => (v < 0 ? `− ${formatINR(-v)}` : formatINR(v));
  const verdict =
    r.better === 'equal' ? 'Both regimes cost the same' : `${r.better === 'new' ? 'New' : 'Old'} regime saves you ${formatINR(r.saving)}`;

  const summaryText = `Gross ${formatINR(r.gross)} → New regime tax ${formatINR(r.new.tax.total)}, Old regime tax ${formatINR(r.old.tax.total)}. ${verdict} a year.`;

  return (
    <CalculatorContainer
      country={country}
      countryName={countryName}
      toolName={tool?.name || 'Income Tax Calculator: New vs Old Regime'}
      category="salary"
      badge="FY 2025-26 · both regimes"
      description="Compare your income tax under the new and old regimes side by side — with HRA, 80C, 80D, NPS and home-loan interest — and see which regime saves you more."
      resultSummaryText={summaryText}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2 border-b border-slate-100 pb-4">
            <Scale className="w-5 h-5 text-cyan-600" aria-hidden="true" /> Salary
          </h2>
          <NumericInput id="salary" label={isCtc ? 'Annual CTC' : 'Annual gross salary'} prefix="₹" value={amount} onChange={setAmount} step={10000} required />
          <Toggle id="is-ctc" checked={isCtc} onChange={setIsCtc} label="This figure is my CTC" sub="Employer PF (capped at ₹1,800/month) will be removed to get gross salary" />

          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pt-2">
            <Home className="w-4 h-4 text-cyan-600" aria-hidden="true" /> Old-regime deductions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <NumericInput id="basic" label="Basic pay" suffix="% of gross" value={basicPct} onChange={setBasicPct} max={100} />
            <NumericInput id="hra" label="HRA received" prefix="₹" suffix="/yr" value={hraReceived} onChange={setHraReceived} step={1000} />
          </div>
          <div className="grid grid-cols-2 gap-4 items-end">
            <NumericInput id="rent" label="Rent paid" prefix="₹" suffix="/mo" value={rentMonthly} onChange={setRentMonthly} step={1000} />
            <Toggle id="metro" checked={metro} onChange={setMetro} label="Metro city" sub="50% vs 40% of basic" />
          </div>
          <p className="text-[11px] text-slate-500 -mt-2">HRA exemption worked out: <strong className="text-slate-800">{formatINR(r.hra)}</strong></p>
          <div className="grid grid-cols-2 gap-4">
            <NumericInput id="80c" label="80C" prefix="₹" value={sec80C} onChange={setSec80C} step={5000} hint="max ₹1.5L" />
            <NumericInput id="80ccd" label="NPS 80CCD(1B)" prefix="₹" value={nps} onChange={setNps} step={5000} hint="max ₹50k" />
            <NumericInput id="80d-self" label="80D (self/family)" prefix="₹" value={sec80DSelf} onChange={setSec80DSelf} step={1000} hint="max ₹25k" />
            <NumericInput id="80d-parents" label="80D (parents)" prefix="₹" value={sec80DParents} onChange={setSec80DParents} step={1000} hint="max ₹50k" />
            <NumericInput id="24b" label="Home-loan interest" prefix="₹" value={homeLoan} onChange={setHomeLoan} step={5000} hint="24(b) max ₹2L" />
            <NumericInput id="pt" label="Professional tax" prefix="₹" value={pt} onChange={setPt} step={100} hint="max ₹2.5k" />
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="bg-gradient-to-br from-[#0A2540] to-[#0D3B66] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <span className="text-xs uppercase tracking-wider font-bold text-cyan-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" aria-hidden="true" /> Recommendation
              </span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${r.better === 'old' ? 'bg-amber-400 text-slate-900' : 'bg-emerald-400 text-slate-900'}`}>
                {verdict}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                ['New regime', r.new.tax.total, r.better === 'new'],
                ['Old regime', r.old.tax.total, r.better === 'old'],
              ].map(([k, v, win]) => (
                <div key={k} className={`rounded-2xl p-4 border ${win ? 'border-emerald-400/60 bg-emerald-500/10' : 'border-white/10 bg-white/5'}`}>
                  <div className="text-[11px] uppercase tracking-wider text-slate-300">{k}</div>
                  <div className="text-2xl sm:text-3xl font-extrabold mt-1">{formatINR(v)}</div>
                  <div className="text-[11px] text-slate-400">{formatINR(v / 12)} / month</div>
                </div>
              ))}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="text-slate-400">
                  <tr>
                    <th className="text-left font-semibold pb-1">Per year</th>
                    <th className="text-right font-semibold pb-1">New regime</th>
                    <th className="text-right font-semibold pb-1">Old regime</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-200">
                  {rows.map(([k, a, b]) => (
                    <tr key={k}>
                      <td className="py-1.5 pr-2">{k}</td>
                      <td className="py-1.5 text-right whitespace-nowrap">{fmt(a)}</td>
                      <td className="py-1.5 text-right whitespace-nowrap">{fmt(b)}</td>
                    </tr>
                  ))}
                  <tr className="font-bold text-white">
                    <td className="pt-2">Total tax</td>
                    <td className="pt-2 text-right">{formatINR(r.new.tax.total)}</td>
                    <td className="pt-2 text-right">{formatINR(r.old.tax.total)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {r.breakEvenDeductions > 0
                ? <>The old regime only wins if your deductions (beyond its ₹50,000 standard deduction) exceed about <strong className="text-white">{formatINR(r.breakEvenDeductions)}</strong>. Yours: {formatINR(Math.max(0, r.old.deductions - IN_OLD_REGIME.standardDeduction))}.</>
                : <>At this income the old regime already results in no more tax than the new regime.</>}
            </p>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            {TAX_RULES.IN.label}; old regime for individuals below 60. Excludes employer NPS (80CCD(2)), other income, and marginal relief on surcharge. HRA exemption requires actual rent payment — keep receipts.
          </p>
        </div>
      </div>
    </CalculatorContainer>
  );
}
