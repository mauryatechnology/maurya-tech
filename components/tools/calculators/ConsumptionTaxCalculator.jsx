'use client';

import React, { useMemo, useState } from 'react';
import { NumericInput } from '@/components/tools/NumericInput';
import { CalculatorContainer } from '@/components/tools/CalculatorContainer';
import { InputCard, ResultCard, Select } from '@/components/tools/FormBits';
import { Receipt } from 'lucide-react';
import { CONSUMPTION_TAX_RULES, US_STATE_SALES_TAX, applyTax, gstSplit } from '@/lib/finance/salesTax';
import { formatINR } from '@/lib/tax';

const usd = (n) => `$${Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const gbp = (n) => `£${Number(n || 0).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const MODES = [['add', 'Add tax to a price'], ['remove', 'Remove tax from a price']];

function ModeSelect({ mode, setMode, taxName }) {
  return (
    <Select
      id="tax-mode"
      label="I want to"
      value={mode}
      onChange={setMode}
      options={MODES.map(([k, l]) => [k, l.replace('tax', taxName)])}
    />
  );
}

function GstCalculator({ country, countryName, tool }) {
  const [mode, setMode] = useState('add');
  const [amount, setAmount] = useState(10000);
  const [rate, setRate] = useState('18');
  const [inter, setInter] = useState(false);
  const r = useMemo(() => applyTax(amount, rate, mode), [amount, rate, mode]);
  const split = gstSplit(r.tax, inter);

  return (
    <CalculatorContainer
      country={country}
      countryName={countryName}
      toolName={tool?.name || 'GST Calculator'}
      category="finance"
      badge="GST 2.0 slabs · CGST/SGST/IGST"
      description="Add GST to a price or remove it from a GST-inclusive price at 5%, 18% or 40%, with the CGST + SGST or IGST split shown."
      resultSummaryText={`${mode === 'add' ? 'Net' : 'Inclusive'} ${formatINR(amount)} at ${rate}% GST → net ${inr(r.net)}, GST ${inr(r.tax)}, total ${inr(r.gross)}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <InputCard icon={Receipt} title="Price and GST rate">
          <ModeSelect mode={mode} setMode={setMode} taxName="GST" />
          <NumericInput id="gst-amount" label={mode === 'add' ? 'Price before GST' : 'Price including GST'} prefix="₹" value={amount} onChange={setAmount} step={100} required />
          <Select id="gst-rate" label="GST rate" value={rate} onChange={setRate} options={CONSUMPTION_TAX_RULES.IN.rates.map((x) => [String(x.rate), x.label])} />
          <label className="flex items-start gap-2 text-sm text-slate-700 cursor-pointer">
            <input type="checkbox" checked={inter} onChange={(e) => setInter(e.target.checked)} className="mt-0.5 w-4 h-4 accent-cyan-700" />
            <span>Inter-state supply (IGST instead of CGST + SGST)</span>
          </label>
        </InputCard>
        <div className="lg:col-span-6 space-y-6">
          <ResultCard
            label={mode === 'add' ? 'Price including GST' : 'Price before GST'}
            value={inr(mode === 'add' ? r.gross : r.net)}
            sub={`GST at ${rate}%: ${inr(r.tax)}`}
            rows={[
              ['Taxable value', inr(r.net)],
              ...(inter ? [[`IGST (${rate}%)`, inr(split.igst)]] : [[`CGST (${Number(rate) / 2}%)`, inr(split.cgst)], [`SGST (${Number(rate) / 2}%)`, inr(split.sgst)]]),
              ['Total invoice value', inr(r.gross)],
            ]}
          />
        </div>
      </div>
    </CalculatorContainer>
  );
}

function SalesTaxCalculator({ country, countryName, tool }) {
  const [mode, setMode] = useState('add');
  const [amount, setAmount] = useState(100);
  const [state, setState] = useState('CA');
  const [local, setLocal] = useState(0);
  const base = US_STATE_SALES_TAX.find(([c]) => c === state)?.[2] ?? 0;
  const rate = base + (Number(local) || 0);
  const r = useMemo(() => applyTax(amount, rate, mode), [amount, rate, mode]);

  return (
    <CalculatorContainer
      country={country}
      countryName={countryName}
      toolName={tool?.name || 'Sales Tax Calculator'}
      category="finance"
      badge={`State rates as of ${CONSUMPTION_TAX_RULES.US.asOf}`}
      description="Add sales tax to a price or work out the pre-tax price from a receipt total, using your state's rate plus any county or city rate."
      resultSummaryText={`${usd(amount)} ${mode === 'add' ? 'before' : 'including'} tax at ${rate.toFixed(3).replace(/\.?0+$/, '')}% → tax ${usd(r.tax)}, total ${usd(r.gross)}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <InputCard icon={Receipt} title="Price and location">
          <ModeSelect mode={mode} setMode={setMode} taxName="sales tax" />
          <NumericInput id="st-amount" label={mode === 'add' ? 'Price before tax' : 'Total including tax'} prefix="$" value={amount} onChange={setAmount} step={1} required />
          <Select id="st-state" label="State" value={state} onChange={setState} hint={`state rate ${base}%`} options={US_STATE_SALES_TAX.map(([c, n, rt]) => [c, `${n} — ${rt}%`])} />
          <NumericInput id="st-local" label="Local (county + city) rate" suffix="%" value={local} onChange={setLocal} step={0.25} min={0} max={6} hint="check your receipt" />
        </InputCard>
        <div className="lg:col-span-6 space-y-6">
          <ResultCard
            label={mode === 'add' ? 'Total with sales tax' : 'Price before tax'}
            value={usd(mode === 'add' ? r.gross : r.net)}
            sub={`Combined rate ${rate.toFixed(3).replace(/\.?0+$/, '')}%`}
            rows={[
              ['Price before tax', usd(r.net)],
              [`State tax (${base}%)`, usd((r.net * base) / 100)],
              [`Local tax (${Number(local) || 0}%)`, usd(Math.max(0, r.tax - (r.net * base) / 100))],
              ['Total', usd(r.gross)],
            ]}
          />
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Many items are exempt or taxed at reduced rates in some states — groceries, prescription drugs and clothing are common examples. Local rates vary by ZIP code.
          </p>
        </div>
      </div>
    </CalculatorContainer>
  );
}

function VatCalculator({ country, countryName, tool }) {
  const [mode, setMode] = useState('add');
  const [amount, setAmount] = useState(100);
  const [rate, setRate] = useState('20');
  const r = useMemo(() => applyTax(amount, rate, mode), [amount, rate, mode]);

  return (
    <CalculatorContainer
      country={country}
      countryName={countryName}
      toolName={tool?.name || 'VAT Calculator'}
      category="finance"
      badge="20% · 5% · 0%"
      description="Add VAT to a net price or remove VAT from a gross price at the UK standard, reduced or zero rate."
      resultSummaryText={`${gbp(amount)} ${mode === 'add' ? 'net' : 'gross'} at ${rate}% VAT → net ${gbp(r.net)}, VAT ${gbp(r.tax)}, gross ${gbp(r.gross)}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <InputCard icon={Receipt} title="Price and VAT rate">
          <ModeSelect mode={mode} setMode={setMode} taxName="VAT" />
          <NumericInput id="vat-amount" label={mode === 'add' ? 'Net price (excl. VAT)' : 'Gross price (incl. VAT)'} prefix="£" value={amount} onChange={setAmount} step={1} required />
          <Select id="vat-rate" label="VAT rate" value={rate} onChange={setRate} options={CONSUMPTION_TAX_RULES.UK.rates.map((x) => [String(x.rate), x.label])} />
        </InputCard>
        <div className="lg:col-span-6 space-y-6">
          <ResultCard
            label={mode === 'add' ? 'Price including VAT' : 'Price excluding VAT'}
            value={gbp(mode === 'add' ? r.gross : r.net)}
            sub={`VAT at ${rate}%: ${gbp(r.tax)}`}
            rows={[
              ['Net (excl. VAT)', gbp(r.net)],
              [`VAT (${rate}%)`, gbp(r.tax)],
              ['Gross (incl. VAT)', gbp(r.gross)],
            ]}
          />
          {mode === 'remove' && rate === '20' && (
            <p className="text-[11px] text-slate-500">Shortcut: at 20%, the VAT in a VAT-inclusive price is one sixth of the total — not 20% of it.</p>
          )}
        </div>
      </div>
    </CalculatorContainer>
  );
}

/** One component for all three tool slugs; the country decides which tax applies. */
export function ConsumptionTaxCalculator(props) {
  const c = (props.country || '').toLowerCase();
  if (c === 'in') return <GstCalculator {...props} />;
  if (c === 'uk') return <VatCalculator {...props} />;
  return <SalesTaxCalculator {...props} />;
}
