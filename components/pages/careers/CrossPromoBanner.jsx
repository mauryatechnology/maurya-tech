'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calculator, FileText, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { CheckoutModal } from '@/components/products/CheckoutModal';

const SALARY_TOOL = { in: '/in/tools/ctc-calculator', us: '/us/tools/hourly-to-annual-salary', uk: '/uk/tools/ctc-calculator' };

export function CrossPromoBanner({ variant = 'full', country = 'in' }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-950 border border-cyan-500/30 p-6 sm:p-8 shadow-xl relative overflow-hidden my-8">
        {/* Glow orb */}
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Career Acceleration Suite 2026</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Level Up Your Tech Interviews & Compensation
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Applying for software roles? Check your real monthly take-home pay with our free salary calculator, or grab our ATS-proven resume templates with salary negotiation scripts.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
            {/* Free Tool CTA */}
            <Link
              href={SALARY_TOOL[country] || SALARY_TOOL.in}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 shadow-xs transition"
            >
              <Calculator className="w-4 h-4 text-cyan-400" />
              <span>Calculate Take-Home Pay</span>
            </Link>

            {/* Digital Product CTA */}
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-slate-950 text-xs font-bold shadow-md transition cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Get ATS Resume Kit (₹199)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <CheckoutModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        product={{
          sku: 'resume-pack-2026',
          title: '2026 ATS-Optimized Tech Resume & Salary Negotiation Kit',
          priceDisplay: '₹199',
          features: [
            '5 ATS-compliant Resume Templates (Word, PDF, LaTeX)',
            '50+ High-Impact bullet point formulas for tech roles',
            'Salary negotiation cheat sheets & email counter-scripts',
            'Instant digital download with free lifetime updates',
          ],
        }}
        country="IN"
      />
    </>
  );
}
