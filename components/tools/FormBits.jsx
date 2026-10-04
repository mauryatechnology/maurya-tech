'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

/** Shared building blocks for calculator UIs (light input card, dark result card). */

export function Select({ id, label, value, onChange, options, hint }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="block text-xs font-bold text-slate-700 uppercase tracking-wider">{label}</label>
        {hint && <span className="text-[11px] text-slate-400">{hint}</span>}
      </div>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full min-h-[48px] rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-hidden"
      >
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </div>
  );
}

export function InputCard({ icon: Icon, title, children }) {
  return (
    <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
          {Icon && <Icon className="w-5 h-5 text-cyan-600" aria-hidden="true" />}
          <span>{title}</span>
        </h2>
      </div>
      {children}
    </div>
  );
}

/** Dark headline result: label, big figure, sub-line and key/value rows. */
export function ResultCard({ label, value, sub, rows = [] }) {
  return (
    <div className="bg-gradient-to-br from-[#0A2540] to-[#0D3B66] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-5">
      <span className="text-xs uppercase tracking-wider font-bold text-cyan-300 flex items-center gap-1.5">
        <Sparkles className="w-4 h-4 text-cyan-400" aria-hidden="true" /> {label}
      </span>
      <div>
        <div className="text-3xl sm:text-5xl font-extrabold tracking-tight">{value}</div>
        {sub && <div className="text-sm text-slate-300 mt-1">{sub}</div>}
      </div>
      {rows.length > 0 && (
        <table className="w-full text-xs">
          <tbody className="divide-y divide-white/5 text-slate-200">
            {rows.map(([k, v]) => (
              <tr key={k}>
                <td className="py-1.5">{k}</td>
                <td className="py-1.5 text-right font-semibold">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

/** Compact light table for year-by-year schedules. `pick` filters which rows to show. */
export function ScheduleTable({ title, headers, rows }) {
  if (!rows.length) return null;
  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs">
      <h3 className="text-sm font-bold text-slate-900 mb-3">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="text-slate-500">
            <tr>
              {headers.map((h, i) => (
                <th key={h} scope="col" className={`pb-2 font-semibold ${i ? 'text-right' : ''}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {rows.map((r) => (
              <tr key={r[0]}>
                {r.map((c, i) => (
                  <td key={i} className={`py-1.5 ${i ? 'text-right' : ''} ${i === r.length - 1 ? 'font-semibold' : ''}`}>{c}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Keeps year 1, every 5th year and the final year of a long schedule. */
export const milestoneRows = (rows, key = 'year') =>
  rows.filter((r, i) => i === 0 || r[key] % 5 === 0 || i === rows.length - 1);
