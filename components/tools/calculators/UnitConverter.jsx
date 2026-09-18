'use client';

import React, { useState, useMemo } from 'react';
import { NumericInput } from '@/components/tools/NumericInput';
import { CalculatorContainer } from '@/components/tools/CalculatorContainer';
import {
  ArrowLeftRight,
  Ruler,
  Scale,
  Thermometer,
  HardDrive,
  Gauge,
  CheckCircle2,
} from 'lucide-react';

const UNIT_CATEGORIES = {
  length: {
    name: 'Length & Distance',
    icon: Ruler,
    defaultFrom: 'meters',
    defaultTo: 'feet',
    units: {
      meters: { name: 'Meters (m)', factor: 1 },
      kilometers: { name: 'Kilometers (km)', factor: 1000 },
      centimeters: { name: 'Centimeters (cm)', factor: 0.01 },
      millimeters: { name: 'Millimeters (mm)', factor: 0.001 },
      miles: { name: 'Miles (mi)', factor: 1609.344 },
      yards: { name: 'Yards (yd)', factor: 0.9144 },
      feet: { name: 'Feet (ft)', factor: 0.3048 },
      inches: { name: 'Inches (in)', factor: 0.0254 },
    },
  },
  mass: {
    name: 'Mass & Weight',
    icon: Scale,
    defaultFrom: 'kilograms',
    defaultTo: 'pounds',
    units: {
      kilograms: { name: 'Kilograms (kg)', factor: 1 },
      grams: { name: 'Grams (g)', factor: 0.001 },
      milligrams: { name: 'Milligrams (mg)', factor: 0.000001 },
      pounds: { name: 'Pounds (lbs)', factor: 0.45359237 },
      ounces: { name: 'Ounces (oz)', factor: 0.02834952 },
      tons: { name: 'Metric Tons (t)', factor: 1000 },
    },
  },
  data: {
    name: 'Digital Data Storage',
    icon: HardDrive,
    defaultFrom: 'gigabytes',
    defaultTo: 'megabytes',
    units: {
      bytes: { name: 'Bytes (B)', factor: 1 },
      kilobytes: { name: 'Kilobytes (KB)', factor: 1024 },
      megabytes: { name: 'Megabytes (MB)', factor: 1048576 },
      gigabytes: { name: 'Gigabytes (GB)', factor: 1073741824 },
      terabytes: { name: 'Terabytes (TB)', factor: 1099511627776 },
      petabytes: { name: 'Petabytes (PB)', factor: 1125899906842624 },
    },
  },
  temperature: {
    name: 'Temperature',
    icon: Thermometer,
    defaultFrom: 'celsius',
    defaultTo: 'fahrenheit',
    units: {
      celsius: { name: 'Celsius (°C)' },
      fahrenheit: { name: 'Fahrenheit (°F)' },
      kelvin: { name: 'Kelvin (K)' },
    },
  },
  speed: {
    name: 'Speed & Velocity',
    icon: Gauge,
    defaultFrom: 'kmh',
    defaultTo: 'mph',
    units: {
      kmh: { name: 'Kilometers per hour (km/h)', factor: 1 },
      mph: { name: 'Miles per hour (mph)', factor: 1.609344 },
      ms: { name: 'Meters per second (m/s)', factor: 3.6 },
      knots: { name: 'Knots (kn)', factor: 1.852 },
    },
  },
};

export function UnitConverter({
  country = 'in',
  countryName = 'India',
  computeConfig = {},
  tool,
}) {
  const [categoryKey, setCategoryKey] = useState('length');
  const [inputValue, setInputValue] = useState(10);
  const [fromUnit, setFromUnit] = useState('meters');
  const [toUnit, setToUnit] = useState('feet');

  const currentCategory = UNIT_CATEGORIES[categoryKey];

  const handleCategoryChange = (key) => {
    setCategoryKey(key);
    const cat = UNIT_CATEGORIES[key];
    setFromUnit(cat.defaultFrom);
    setToUnit(cat.defaultTo);
  };

  const handleSwapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const conversionResult = useMemo(() => {
    const val = Number(inputValue) || 0;

    if (categoryKey === 'temperature') {
      let celsius = val;
      if (fromUnit === 'fahrenheit') celsius = ((val - 32) * 5) / 9;
      else if (fromUnit === 'kelvin') celsius = val - 273.15;

      let targetVal = celsius;
      if (toUnit === 'fahrenheit') targetVal = (celsius * 9) / 5 + 32;
      else if (toUnit === 'kelvin') targetVal = celsius + 273.15;

      return {
        outputValue: Math.round(targetVal * 10000) / 10000,
        formatted: Number(targetVal.toFixed(4)).toString(),
      };
    }

    const fromFactor = currentCategory.units[fromUnit]?.factor || 1;
    const toFactor = currentCategory.units[toUnit]?.factor || 1;

    const baseValue = val * fromFactor;
    const converted = baseValue / toFactor;

    return {
      outputValue: converted,
      formatted:
        converted >= 1e6 || (converted > 0 && converted < 1e-4)
          ? converted.toExponential(4)
          : Number(converted.toFixed(4)).toString(),
    };
  }, [categoryKey, inputValue, fromUnit, toUnit, currentCategory]);

  const fromName = currentCategory.units[fromUnit]?.name || fromUnit;
  const toName = currentCategory.units[toUnit]?.name || toUnit;

  const summaryText = `${inputValue} ${fromName} = ${conversionResult.formatted} ${toName}`;

  return (
    <CalculatorContainer
      country={country}
      countryName={countryName}
      toolName={tool?.name || 'Universal Unit & Measurement Converter'}
      category="general"
      badge="Universal Utilities"
      description="Convert between length, weight, digital storage (KB/MB/GB), temperature, and speed units with 100% precision."
      resultSummaryText={summaryText}
      faqs={tool?.seo?.faqSchema || []}
    >
      <div className="space-y-6">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
          {Object.entries(UNIT_CATEGORIES).map(([key, cat]) => {
            const Icon = cat.icon;
            return (
              <button
                key={key}
                onClick={() => handleCategoryChange(key)}
                className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                  categoryKey === key
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4 text-cyan-600" />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Conversion Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Inputs */}
          <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <currentCategory.icon className="w-5 h-5 text-cyan-600" />
                <span>Convert {currentCategory.name}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter value and choose conversion source and destination.
              </p>
            </div>

            <NumericInput
              id="unit-input-val"
              label="Value to Convert"
              value={inputValue}
              onChange={setInputValue}
              step="any"
              placeholder="10"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-11 gap-3 items-center">
              <div className="sm:col-span-5">
                <label className="block text-xs font-semibold text-slate-700 mb-1">From</label>
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:border-cyan-500"
                >
                  {Object.entries(currentCategory.units).map(([k, u]) => (
                    <option key={k} value={k}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-1 flex justify-center pt-5">
                <button
                  type="button"
                  onClick={handleSwapUnits}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                  title="Swap Units"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </button>
              </div>

              <div className="sm:col-span-5">
                <label className="block text-xs font-semibold text-slate-700 mb-1">To</label>
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:border-cyan-500"
                >
                  {Object.entries(currentCategory.units).map(([k, u]) => (
                    <option key={k} value={k}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Right Result Card */}
          <div className="lg:col-span-6 bg-linear-to-br from-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-xl border border-slate-800">
            <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Conversion Result
            </div>

            <div>
              <div className="text-xs text-slate-400">
                {inputValue} {fromName} =
              </div>
              <div className="text-4xl sm:text-5xl font-extrabold font-mono tracking-tight text-white mt-1 break-words">
                {conversionResult.formatted}
              </div>
              <div className="text-sm font-semibold text-cyan-300 mt-2">{toName}</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300 space-y-1">
              <div className="text-slate-400">Exact Scientific Output:</div>
              <div className="font-mono text-white text-sm">{conversionResult.outputValue}</div>
            </div>
          </div>
        </div>
      </div>
    </CalculatorContainer>
  );
}
