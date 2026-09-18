import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getMarketProfile } from '@/lib/market/getMarketProfile';
import {
  Calculator,
  Percent,
  Calendar,
  CreditCard,
  FileCheck2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  TrendingUp,
  Cpu,
} from 'lucide-react';

const SUPPORTED_COUNTRIES = ['in', 'us', 'uk'];

export async function generateMetadata({ params }) {
  const { country } = await params;
  const normalized = (country || '').toLowerCase();
  if (!SUPPORTED_COUNTRIES.includes(normalized)) return {};

  const market = await getMarketProfile(normalized);

  return {
    title: `${market.name} Digital Utility Hub: Free Online Calculators & Tools`,
    description: `Access instant, accurate calculators for ${market.name}. CTC to in-hand salary, EMI, percentage, age, and ATS resume checkers. 100% client-side privacy.`,
  };
}

export default async function CountryHomePage({ params }) {
  const { country } = await params;
  const normalized = (country || '').toLowerCase();
  if (!SUPPORTED_COUNTRIES.includes(normalized)) notFound();

  const market = await getMarketProfile(normalized);

  // Define country-customized tool cards
  const tools = [
    {
      slug: normalized === 'us' ? 'hourly-to-annual-salary' : 'ctc-calculator',
      title:
        normalized === 'in'
          ? 'CTC to In-Hand Salary Calculator'
          : normalized === 'us'
          ? 'Hourly to Annual Salary & Tax Calculator'
          : 'Gross to Net PAYE Salary Calculator',
      description:
        normalized === 'in'
          ? 'Calculate monthly take-home salary from your annual CTC under the 2026 New Tax Regime with PF and standard deduction.'
          : normalized === 'us'
          ? 'Convert your hourly pay to 40h/week annual income and estimate federal, state, and FICA deductions.'
          : 'Calculate take-home pay under HMRC PAYE tax bands, National Insurance, and pension contributions.',
      badge: 'Most Popular',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      icon: Calculator,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      slug: 'percentage-calculator',
      title: 'Percentage & Discount Calculator',
      description: 'Quickly find percentage increases, markups, discounts, exam scores, and GST/sales tax in seconds.',
      badge: 'Everyday Utility',
      badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      icon: Percent,
      color: 'from-cyan-500 to-blue-600',
    },
    {
      slug: 'age-calculator',
      title: 'Exact Age & Birthday Countdown',
      description: 'Calculate your exact age in years, months, days, hours, and minutes with upcoming birthday alerts.',
      badge: 'Instant Math',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      icon: Calendar,
      color: 'from-amber-500 to-orange-600',
    },
    {
      slug: normalized === 'in' ? 'emi-calculator' : 'ats-resume-checker',
      title:
        normalized === 'in'
          ? 'Home, Car & Personal Loan EMI Calculator'
          : 'Free ATS Resume Checker & Parser',
      description:
        normalized === 'in'
          ? 'Calculate monthly loan installments with principal vs interest visual amortization charts.'
          : 'Scan your resume against modern ATS algorithms with instant keyword density and impact scoring.',
      badge: normalized === 'in' ? 'Finance' : 'Career',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      icon: normalized === 'in' ? CreditCard : FileCheck2,
      color: 'from-indigo-500 to-purple-600',
    },
  ];

  return (
    <div className="space-y-16 py-8 sm:py-12">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
          <span className="text-base">{market.code === 'IN' ? '🇮🇳' : market.code === 'US' ? '🇺🇸' : '🇬🇧'}</span>
          <span>{market.name} Digital Utility Platform</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
          Smart, Instant Online Calculators Tailored for{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0A2540] via-[#00A8CC] to-[#00D4FF]">
            {market.name}
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          High-performance tools for employees, freelancers, students, and businesses. 100% private with instant browser math and zero data collection.
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-600 pt-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">
            <Zap className="w-3.5 h-3.5 text-amber-500" /> Instant 0ms Calculations
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Client-Side Privacy
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-cyan-500" /> 2026 {market.currency} Standards
          </div>
        </div>
      </section>

      {/* Featured Tools Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Featured Calculators</h2>
            <p className="text-sm text-slate-500 mt-1">
              Select a tool to run real-time calculations customized for {market.name}.
            </p>
          </div>
          <Link
            href={`/${normalized}/tools`}
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-cyan-700 hover:text-cyan-900 transition"
          >
            All {market.name} Tools <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool) => {
            const IconComponent = tool.icon;
            return (
              <Link
                key={tool.slug}
                href={`/${normalized}/tools/${tool.slug}`}
                className="group relative bg-white border border-slate-200/80 rounded-2xl p-6 hover:shadow-lg hover:border-cyan-400/50 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${tool.color} flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform duration-300`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${tool.badgeColor}`}>
                      {tool.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-cyan-700 transition">
                      {tool.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed mt-2">
                      {tool.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-cyan-700 group-hover:text-cyan-900">
                  <span>Open Calculator</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Commercial Agency Bridge Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#0A2540] to-[#0A192F] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl border border-slate-800">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-cyan-300 text-xs font-semibold">
              <Cpu className="w-3.5 h-3.5" />
              <span>Maurya Technologies Engineering</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Need Custom Software, Web Apps, or AI Automation?
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              We engineer enterprise-grade SaaS, mobile apps, and custom platforms with our signature zero-risk Pilot Model for founders and businesses in {market.name}.
            </p>
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 font-bold text-xs shadow-md transition"
              >
                Request a Free MVP Consultation
              </Link>
              <Link
                href="/projects"
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition"
              >
                Explore Portfolio & Case Studies
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
