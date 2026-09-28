'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BellRing, CheckCircle2, Loader2 } from 'lucide-react';

const COPY = {
  in: {
    title: 'Get notified when tax slabs change (FY 2026-27)',
    body: 'We will email you once when the Union Budget or a CBDT notification changes slabs, rebates or deductions — and our calculators are updated.',
  },
  us: {
    title: 'Get notified when IRS brackets and limits change',
    body: 'One email when the IRS publishes new inflation adjustments (brackets, standard deduction, 401(k) limits) and our calculators are updated.',
  },
  uk: {
    title: 'Get notified when UK tax bands or NI change',
    body: 'One email after the Budget or before the new tax year (6 April) if Income Tax or National Insurance changes.',
  },
  global: {
    title: 'Get notified when our calculators change',
    body: 'An occasional email when rules or formulas behind our calculators are updated. No spam.',
  },
};

/**
 * Non-intrusive, inline alert sign-up (never a popup). Stores the address via
 * /api/newsletter with double opt-in; honeypot field catches naive bots.
 */
export function TaxAlertCapture({ country = 'global', source = '' }) {
  const key = COPY[country] ? country : 'global';
  const copy = COPY[key];
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState('');
  const [state, setState] = useState({ status: 'idle', message: '' });

  const submit = async (e) => {
    e.preventDefault();
    setState({ status: 'loading', message: '' });
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, consent, website, country: key === 'global' ? 'GLOBAL' : key.toUpperCase(), source }),
      });
      const json = await res.json();
      setState({ status: res.ok && json.success ? 'done' : 'error', message: json.message || 'Something went wrong.' });
    } catch {
      setState({ status: 'error', message: 'Network error. Please try again.' });
    }
  };

  return (
    <section aria-labelledby="tax-alert-heading" className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <BellRing className="w-5 h-5 text-cyan-700 mt-0.5 shrink-0" aria-hidden="true" />
        <div className="space-y-1">
          <h2 id="tax-alert-heading" className="text-base font-bold text-slate-900">{copy.title}</h2>
          <p className="text-sm text-slate-600">{copy.body}</p>
        </div>
      </div>

      {state.status === 'done' ? (
        <p role="status" className="mt-4 flex items-center gap-2 text-sm font-semibold text-emerald-700">
          <CheckCircle2 className="w-4 h-4" aria-hidden="true" /> {state.message}
        </p>
      ) : (
        <form onSubmit={submit} className="mt-4 space-y-3" noValidate>
          <div className="flex flex-col sm:flex-row gap-2">
            <label htmlFor={`alert-email-${key}`} className="sr-only">Email address</label>
            <input
              id={`alert-email-${key}`}
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="min-h-[48px] flex-1 rounded-xl border border-slate-200 px-3.5 text-sm text-slate-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-hidden"
            />
            {/* Honeypot — hidden from people and assistive tech */}
            <input type="text" name="website" value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
            <button
              type="submit"
              disabled={state.status === 'loading' || !email || !consent}
              className="min-h-[48px] inline-flex items-center justify-center gap-2 rounded-xl bg-[#0A2540] px-5 text-sm font-semibold text-white disabled:opacity-50 cursor-pointer"
            >
              {state.status === 'loading' && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
              Notify me
            </button>
          </div>
          <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 w-4 h-4 accent-cyan-700" />
            <span>
              I agree to receive occasional emails about tax and salary rule changes. Unsubscribe any time. See our{' '}
              <Link href="/privacy" className="underline">privacy policy</Link>.
            </span>
          </label>
          {state.status === 'error' && <p role="alert" className="text-xs font-semibold text-rose-600">{state.message}</p>}
        </form>
      )}
    </section>
  );
}
