'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Share2, Copy, Check, ShieldCheck, Zap, ChevronRight } from 'lucide-react';
import { useToolPage } from '@/components/tools/ToolPageContext';
import { toast } from 'sonner';

export function CalculatorContainer({
  country = 'in',
  countryName = 'India',
  toolName,
  category = 'salary',
  badge = 'Instant Calculation',
  description,
  children,
  resultSummaryText = '',
}) {
  const [copied, setCopied] = useState(false);
  const { breadcrumbs, embedded } = useToolPage();
  const crumbs = breadcrumbs || [
    { name: `${countryName} Hub`, href: `/${country}` },
    { name: 'Tools & Calculators', href: `/${country}/tools` },
    { name: toolName },
  ];
  const TitleTag = embedded ? 'h2' : 'h1';

  const handleCopyResult = () => {
    if (!resultSummaryText) {
      toast.info('Adjust the inputs to generate a result first.');
      return;
    }

    navigator.clipboard.writeText(
      `${toolName} (${countryName}) Result:\n${resultSummaryText}\nCalculated free on: https://maurya-tech.com/${country}`
    );
    setCopied(true);
    toast.success('Calculation summary copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);

    try {
      fetch('/api/analytics/tool-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolSlug: typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : '',
          country,
        }),
      }).catch(() => {});
    } catch {}
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${toolName} - Maurya Technologies`,
          text: `Free ${toolName} for ${countryName}. Instant calculations with 2026 regulations.`,
          url: window.location.href,
        });
      } catch {
        // User cancelled share
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Tool link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumbs (BreadcrumbList schema is emitted server-side by the page) */}
      {!embedded && (
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 font-medium">
          {crumbs.map((c, i) => (
            <React.Fragment key={`${c.name}-${i}`}>
              {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />}
              {c.href && i < crumbs.length - 1 ? (
                <Link href={c.href} className="hover:text-slate-900 transition">{c.name}</Link>
              ) : (
                <span className="text-slate-900 font-semibold" aria-current="page">{c.name}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-50 border border-cyan-200 text-[11px] font-bold text-cyan-800 uppercase tracking-wider">
            <Zap className="w-3 h-3 text-cyan-600" />
            <span>{badge}</span>
          </div>
          <TitleTag className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {toolName}
          </TitleTag>
          {description && (
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start md:self-center">
          <button
            onClick={handleCopyResult}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition cursor-pointer"
            title="Copy current calculation breakdown"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
            <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
            title="Share this tool"
          >
            <Share2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Tool Body */}
      <div className="relative">{children}</div>

      {/* Privacy & Performance Guarantee */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 shadow-2xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            <strong className="text-slate-800">100% Client-Side Privacy:</strong> Your financial and personal calculations execute entirely inside your browser. No figures are ever stored or sent to our servers.
          </span>
        </div>
        <div className="text-[11px] font-mono text-slate-400 shrink-0">
          Runs in your browser
        </div>
      </div>

    </div>
  );
}
