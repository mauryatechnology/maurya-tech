import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getMarketProfile } from '@/lib/market/getMarketProfile';
import { getGuidesForCountry } from '@/lib/market/getGuide';
import {
  BookOpen,
  ChevronRight,
  Clock,
  ArrowRight,
  Sparkles,
  User,
  Calendar,
  Layers,
} from 'lucide-react';

const SUPPORTED_COUNTRIES = ['in', 'us', 'uk'];

export async function generateMetadata({ params }) {
  const { country } = await params;
  const normalized = (country || '').toLowerCase();
  if (!SUPPORTED_COUNTRIES.includes(normalized)) return {};

  const market = await getMarketProfile(normalized);

  return {
    title: `In-Depth Guides & Technical Playbooks for ${market.name} (2026)`,
    description: `Comprehensive, verified guides on taxes, salary structuring, W-2/1099 contracts, and tech careers for professionals in ${market.name}.`,
    alternates: {
      canonical: `https://maurya-tech.com/${normalized}/guides`,
      languages: {
        'en-IN': 'https://maurya-tech.com/in/guides',
        'en-US': 'https://maurya-tech.com/us/guides',
        'en-GB': 'https://maurya-tech.com/uk/guides',
      },
    },
    openGraph: {
      title: `Guides on Tax, Salary & Careers for ${market.name}`,
      description: `Verified guides on taxes, salary structuring and careers for professionals in ${market.name}.`,
      url: `https://maurya-tech.com/${normalized}/guides`,
      type: 'website',
      siteName: 'Maurya Technologies',
    },
  };
}

export default async function CountryGuidesDirectoryPage({ params }) {
  const { country } = await params;
  const normalized = (country || '').toLowerCase();
  if (!SUPPORTED_COUNTRIES.includes(normalized)) notFound();

  const market = await getMarketProfile(normalized);
  const guides = await getGuidesForCountry(normalized);

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
            <span className="text-slate-900 font-semibold">Guides & Playbooks</span>
          </nav>

          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-xs font-semibold text-cyan-800">
              <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
              <span>Expert Knowledge Base • {market.name} {market.code === 'IN' ? '🇮🇳' : market.code === 'US' ? '🇺🇸' : '🇬🇧'}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Authoritative Technical & Financial Guides
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              Researched, data-driven playbooks on salary breakdowns, regulatory tax changes, and engineering compensation benchmarks for {market.name}.
            </p>
          </div>
        </div>
      </div>

      {/* Guides Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/${normalized}/guides/${guide.slug}`}
              className="group bg-white rounded-3xl border border-slate-200 hover:border-cyan-400 p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-cyan-50 border border-cyan-100 text-cyan-700 text-xs font-bold uppercase tracking-wider">
                    {guide.category}
                  </span>
                  <div className="flex items-center gap-1 text-slate-400 text-xs font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{guide.readTime || '5 min read'}</span>
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 group-hover:text-cyan-700 transition leading-snug">
                  {guide.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                  {guide.excerpt}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-cyan-600 group-hover:text-cyan-700">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <User className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[140px]">{guide.author || 'Engineering Team'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>Read Guide</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
