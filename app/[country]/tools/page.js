import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getMarketProfile } from '@/lib/market/getMarketProfile';
import { getToolsForCountry } from '@/lib/market/getTool';
import {
  Calculator,
  Percent,
  Calendar,
  CreditCard,
  Zap,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Search,
  FileCheck2,
  GraduationCap,
  FileText,
  Ruler,
  Briefcase,
} from 'lucide-react';

const SUPPORTED_COUNTRIES = ['in', 'us', 'uk'];

export async function generateMetadata({ params }) {
  const { country } = await params;
  const normalized = (country || '').toLowerCase();
  if (!SUPPORTED_COUNTRIES.includes(normalized)) return {};

  const market = await getMarketProfile(normalized);

  return {
    title: `Free Online Calculators & Financial Tools for ${market.name} (2026)`,
    description: `Browse all free online calculators for ${market.name}. Instant CTC to in-hand salary, hourly wages, loan EMI, percentage, and age calculations. 100% client-side privacy.`,
    alternates: {
      canonical: `https://maurya-tech.com/${normalized}/tools`,
      languages: {
        'en-IN': 'https://maurya-tech.com/in/tools',
        'en-US': 'https://maurya-tech.com/us/tools',
        'en-GB': 'https://maurya-tech.com/uk/tools',
      },
    },
  };
}

const TOOL_ICONS = {
  'ctc-calculator': Calculator,
  'hourly-to-annual-salary': Calculator,
  'emi-calculator': CreditCard,
  'percentage-calculator': Percent,
  'age-calculator': Calendar,
  'ats-resume-checker': FileCheck2,
  'cgpa-calculator': GraduationCap,
  'resume-builder': FileText,
  'unit-converter': Ruler,
  'freelance-rate-calculator': Briefcase,
};

const CATEGORY_NAMES = {
  salary: 'Salary & Taxes',
  finance: 'Loans & Finance',
  general: 'Math & Daily Utilities',
};

export default async function CountryToolsDirectoryPage({ params }) {
  const { country } = await params;
  const normalized = (country || '').toLowerCase();
  if (!SUPPORTED_COUNTRIES.includes(normalized)) notFound();

  const market = await getMarketProfile(normalized);
  const tools = await getToolsForCountry(normalized);

  // Group tools by category
  const categories = ['salary', 'finance', 'general'];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header Breadcrumb & Hero */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Link href={`/${normalized}`} className="hover:text-slate-900 transition">
              {market.name} Hub
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-semibold">Tools & Calculators</span>
          </nav>

          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-xs font-semibold text-cyan-800">
              <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
              <span>2026 Verified Utilities • {market.name} {market.code === 'IN' ? '🇮🇳' : market.code === 'US' ? '🇺🇸' : '🇬🇧'}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Tools & Calculators Directory
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              Fast, zero-friction calculation engines calibrated for {market.name} tax laws, banking formulas, and daily professional math. Instant 0ms response running entirely in your browser.
            </p>
          </div>

          {/* Privacy & Speed Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700">
              <Zap className="w-4 h-4 text-amber-500 shrink-0" />
              <span>0ms Latency (Runs in Browser)</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Zero Tracking & Zero Data Storage</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700">
              <Sparkles className="w-4 h-4 text-cyan-600 shrink-0" />
              <span>Always 100% Free Forever</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-12">
        {categories.map((catKey) => {
          const categoryTools = tools.filter((t) => t.category === catKey);
          if (categoryTools.length === 0) return null;

          return (
            <div key={catKey} className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block"></span>
                  {CATEGORY_NAMES[catKey] || catKey}
                </h2>
                <span className="text-xs font-semibold text-slate-400">
                  {categoryTools.length} {categoryTools.length === 1 ? 'Tool' : 'Tools'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryTools.map((tool) => {
                  const Icon = TOOL_ICONS[tool.slug] || Calculator;
                  return (
                    <Link
                      key={tool.slug}
                      href={`/${normalized}/tools/${tool.slug}`}
                      className="group bg-white rounded-2xl border border-slate-200 hover:border-cyan-400 p-6 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-cyan-600 group-hover:text-white transition-all duration-300">
                            <Icon className="w-6 h-6" />
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-[11px] font-semibold text-slate-600 capitalize">
                            {tool.category}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 group-hover:text-cyan-700 transition">
                            {tool.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                            {tool.seo?.description || `Accurate calculations for ${market.name} professionals.`}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-cyan-600 group-hover:text-cyan-700">
                        <span>Launch Tool</span>
                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Global CTA Box for Tech Services */}
        <div className="mt-16 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30 uppercase tracking-wider">
              Maurya Technologies Consulting
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Need Custom Software, Web Apps, or Cloud Architecture?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              We design and build high-performance full-stack web applications, automated business workflows, and scalable cloud platforms for companies in {market.name} and worldwide.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-md transition"
              >
                <span>Book Free Architecture Call</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/10 transition"
              >
                <span>Explore Services</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
