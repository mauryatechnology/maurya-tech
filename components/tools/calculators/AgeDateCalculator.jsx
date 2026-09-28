'use client';

import React, { useState, useMemo } from 'react';
import { CalculatorContainer } from '@/components/tools/CalculatorContainer';
import { Calendar, Cake, Clock, Heart, Sparkles } from 'lucide-react';

export function AgeDateCalculator({
  country = 'in',
  countryName = 'India',
  computeConfig = {},
  tool,
}) {
  // Default birth date to 2000-01-15
  const [birthDate, setBirthDate] = useState('2000-01-15');
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);

  const calculation = useMemo(() => {
    if (!birthDate) return null;

    const birth = new Date(birthDate);
    const target = new Date(targetDate || new Date());

    if (isNaN(birth.getTime()) || isNaN(target.getTime()) || birth > target) {
      return null;
    }

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonthLastDay = new Date(target.getFullYear(), target.getMonth(), 0).getDate();
      days += prevMonthLastDay;
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    // Total units
    const diffMs = target.getTime() - birth.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;

    // Day of the week born
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayBorn = daysOfWeek[birth.getDay()];

    // Next birthday countdown
    let nextBday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday < target) {
      nextBday = new Date(target.getFullYear() + 1, birth.getMonth(), birth.getDate());
    }
    const daysToNextBday = Math.ceil((nextBday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

    return {
      years,
      months,
      days,
      totalMonths,
      totalWeeks,
      totalDays,
      totalHours,
      totalMinutes,
      dayBorn,
      daysToNextBday,
    };
  }, [birthDate, targetDate]);

  const summaryText = calculation
    ? `Age: ${calculation.years} Years, ${calculation.months} Months, ${calculation.days} Days | Born on a ${calculation.dayBorn} | Total Days lived: ${calculation.totalDays.toLocaleString()} | Next Birthday in: ${calculation.daysToNextBday} days`
    : '';

  return (
    <CalculatorContainer
      country={country}
      countryName={countryName}
      toolName={tool?.name || 'Exact Age & Date Difference Calculator'}
      category="general"
      badge="High Precision Math"
      description="Calculate your exact age in years, months, days, total hours, and minutes. Includes day of birth and countdown to your next birthday."
      resultSummaryText={summaryText}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-600" />
              <span>Select Your Date of Birth</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Choose your birth date to calculate exact chronological age.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="birth-date" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Date of Birth <span className="text-rose-500">*</span>
            </label>
            <input
              id="birth-date"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-hidden min-h-[48px]"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="target-date" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Age as of Date (Default Today)
            </label>
            <input
              id="target-date"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-hidden min-h-[48px]"
            />
          </div>
        </div>

        {/* Right Result */}
        <div className="lg:col-span-6 space-y-6">
          {calculation ? (
            <div className="bg-gradient-to-br from-[#0A2540] to-[#1E293B] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-xs uppercase tracking-wider font-bold text-cyan-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Your Exact Age
                </span>
                <span className="text-[11px] font-mono text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-full">
                  Born on {calculation.dayBorn}
                </span>
              </div>

              {/* Big Headline Output */}
              <div className="space-y-2">
                <div className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight flex items-baseline gap-2">
                  <span>{calculation.years}</span>
                  <span className="text-base font-semibold text-cyan-300">Years</span>
                  <span>{calculation.months}</span>
                  <span className="text-base font-semibold text-cyan-300">Months</span>
                  <span>{calculation.days}</span>
                  <span className="text-base font-semibold text-cyan-300">Days</span>
                </div>
              </div>

              {/* Birthday Countdown */}
              <div className="p-4 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Cake className="w-5 h-5 text-amber-300" />
                  <div>
                    <span className="text-xs font-bold text-white block">Next Birthday Countdown</span>
                    <span className="text-[11px] text-slate-300">
                      {calculation.daysToNextBday === 0 ? 'Today is your birthday! 🎉' : `${calculation.daysToNextBday} days remaining`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Life in Numbers */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 border-t border-white/10 text-xs">
                <div className="p-3 rounded-xl bg-white/5 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase block">Total Months</span>
                  <span className="text-sm font-bold text-white">{calculation.totalMonths.toLocaleString()}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase block">Total Weeks</span>
                  <span className="text-sm font-bold text-white">{calculation.totalWeeks.toLocaleString()}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase block">Total Days</span>
                  <span className="text-sm font-bold text-white">{calculation.totalDays.toLocaleString()}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase block">Total Hours</span>
                  <span className="text-sm font-bold text-white">{calculation.totalHours.toLocaleString()}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 space-y-1 col-span-2 sm:col-span-2">
                  <span className="text-slate-400 text-[10px] uppercase block">Total Minutes</span>
                  <span className="text-sm font-bold text-white">{calculation.totalMinutes.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 bg-white border border-slate-200 rounded-3xl">
              Please enter a valid birth date to see your exact age breakdown.
            </div>
          )}
        </div>
      </div>
    </CalculatorContainer>
  );
}
