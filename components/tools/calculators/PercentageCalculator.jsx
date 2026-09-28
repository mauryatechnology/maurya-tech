'use client';

import React, { useState, useMemo } from 'react';
import { NumericInput } from '@/components/tools/NumericInput';
import { CalculatorContainer } from '@/components/tools/CalculatorContainer';
import { Percent, TrendingUp, Tag, Sparkles } from 'lucide-react';

export function PercentageCalculator({
  country = 'in',
  countryName = 'India',
  computeConfig = {},
  tool,
}) {
  const [activeTab, setActiveTab] = useState('what_is'); // 'what_is', 'is_what_pct', 'change', 'discount'

  // Tab 1: What is X% of Y?
  const [p1, setP1] = useState(18);
  const [v1, setV1] = useState(2500);

  // Tab 2: X is what % of Y?
  const [x2, setX2] = useState(450);
  const [y2, setY2] = useState(600);

  // Tab 3: % Increase / Decrease from X to Y
  const [fromVal, setFromVal] = useState(100);
  const [toVal, setToVal] = useState(140);

  // Tab 4: Discount & Tax
  const [originalPrice, setOriginalPrice] = useState(1999);
  const [discountPct, setDiscountPct] = useState(20);
  const [taxPct, setTaxPct] = useState(18);

  const results = useMemo(() => {
    // Mode 1
    const res1 = (p1 / 100) * v1;

    // Mode 2
    const res2 = y2 !== 0 ? (x2 / y2) * 100 : 0;

    // Mode 3
    const changeDiff = toVal - fromVal;
    const changePct = fromVal !== 0 ? (changeDiff / fromVal) * 100 : 0;

    // Mode 4
    const discountAmount = (originalPrice * discountPct) / 100;
    const priceAfterDiscount = originalPrice - discountAmount;
    const taxAmount = (priceAfterDiscount * taxPct) / 100;
    const finalPrice = priceAfterDiscount + taxAmount;

    return {
      res1: Math.round(res1 * 100) / 100,
      res2: Math.round(res2 * 100) / 100,
      changePct: Math.round(changePct * 100) / 100,
      changeDiff,
      discountAmount: Math.round(discountAmount * 100) / 100,
      finalPrice: Math.round(finalPrice * 100) / 100,
    };
  }, [p1, v1, x2, y2, fromVal, toVal, originalPrice, discountPct, taxPct]);

  return (
    <CalculatorContainer
      country={country}
      countryName={countryName}
      toolName={tool?.name || 'Percentage & Discount Calculator'}
      category="general"
      badge="Multi-Formula Utility"
      description="Calculate percentages of any number, percentage change, exam scores, and discounts with sales tax in real time."
      resultSummaryText={`Calculated percentage result: ${results.res1}`}
    >
      <div className="space-y-6">
        {/* Formula Switcher Tabs */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-2xl max-w-2xl border border-slate-200">
          {[
            { id: 'what_is', label: 'What is X% of Y?' },
            { id: 'is_what_pct', label: 'X is what % of Y?' },
            { id: 'change', label: '% Increase / Decrease' },
            { id: 'discount', label: 'Discount & Final Price' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: What is X% of Y? */}
        {activeTab === 'what_is' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="lg:col-span-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900">Calculate Value from Percentage</h3>
              <div className="grid grid-cols-2 gap-4">
                <NumericInput id="p1" label="Percentage" suffix="%" value={p1} onChange={setP1} min={0} />
                <NumericInput id="v1" label="Of Number" value={v1} onChange={setV1} min={0} />
              </div>
            </div>
            <div className="lg:col-span-6 bg-[#0A2540] text-white rounded-2xl p-6 text-center space-y-2">
              <span className="text-xs text-cyan-300 font-semibold uppercase tracking-wider block">Result</span>
              <div className="text-4xl font-extrabold text-white">{results.res1.toLocaleString()}</div>
              <p className="text-xs text-slate-300">
                {p1}% of {v1.toLocaleString()} is exactly <strong className="text-cyan-300">{results.res1}</strong>
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: X is what % of Y? */}
        {activeTab === 'is_what_pct' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="lg:col-span-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900">Calculate Proportion Percentage</h3>
              <div className="grid grid-cols-2 gap-4">
                <NumericInput id="x2" label="Number X" value={x2} onChange={setX2} min={0} />
                <NumericInput id="y2" label="Total Y" value={y2} onChange={setY2} min={1} />
              </div>
            </div>
            <div className="lg:col-span-6 bg-[#0A2540] text-white rounded-2xl p-6 text-center space-y-2">
              <span className="text-xs text-cyan-300 font-semibold uppercase tracking-wider block">Percentage Result</span>
              <div className="text-4xl font-extrabold text-white">{results.res2}%</div>
              <p className="text-xs text-slate-300">
                {x2.toLocaleString()} is <strong className="text-cyan-300">{results.res2}%</strong> of {y2.toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: % Change */}
        {activeTab === 'change' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="lg:col-span-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900">Calculate Percentage Increase or Decrease</h3>
              <div className="grid grid-cols-2 gap-4">
                <NumericInput id="fromVal" label="Original Value" value={fromVal} onChange={setFromVal} min={0} />
                <NumericInput id="toVal" label="New Value" value={toVal} onChange={setToVal} min={0} />
              </div>
            </div>
            <div className="lg:col-span-6 bg-[#0A2540] text-white rounded-2xl p-6 text-center space-y-2">
              <span className="text-xs text-cyan-300 font-semibold uppercase tracking-wider block">
                {results.changePct >= 0 ? 'Percentage Increase' : 'Percentage Decrease'}
              </span>
              <div className={`text-4xl font-extrabold ${results.changePct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {results.changePct >= 0 ? `+${results.changePct}%` : `${results.changePct}%`}
              </div>
              <p className="text-xs text-slate-300">
                Difference: {results.changeDiff >= 0 ? `+${results.changeDiff}` : results.changeDiff}
              </p>
            </div>
          </div>
        )}

        {/* Tab 4: Discount & Price */}
        {activeTab === 'discount' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="lg:col-span-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900">Discount & Final Payable Price</h3>
              <NumericInput id="origPrice" label="Original Retail Price" value={originalPrice} onChange={setOriginalPrice} min={0} />
              <div className="grid grid-cols-2 gap-4">
                <NumericInput id="disc" label="Discount" suffix="%" value={discountPct} onChange={setDiscountPct} min={0} max={100} />
                <NumericInput id="tax" label="Tax / GST" suffix="%" value={taxPct} onChange={setTaxPct} min={0} />
              </div>
            </div>
            <div className="lg:col-span-6 bg-[#0A2540] text-white rounded-2xl p-6 text-center space-y-2">
              <span className="text-xs text-cyan-300 font-semibold uppercase tracking-wider block">Final Payable Price</span>
              <div className="text-4xl font-extrabold text-white">{results.finalPrice.toLocaleString()}</div>
              <p className="text-xs text-slate-300">
                You save: <strong className="text-emerald-400">{results.discountAmount.toLocaleString()}</strong> discount
              </p>
            </div>
          </div>
        )}
      </div>
    </CalculatorContainer>
  );
}
