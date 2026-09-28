import Link from 'next/link';
import { ArrowRight, Calculator } from 'lucide-react';
import { getAllTools } from '@/lib/market/getTool';
import { CALCULATOR_COMPONENTS } from '@/components/tools/registry';
import { GLOBAL_TOOL_SLUGS, toolPath } from '@/lib/seo/related';
import { Breadcrumbs, JsonLd } from '@/components/seo/PageParts';
import { absoluteUrl, breadcrumbSchema } from '@/lib/seo/schema';

export const metadata = {
  title: 'Free Online Calculators: Salary, Tax, Loans & Everyday Maths',
  description:
    'Every free calculator on Maurya Tech in one place — salary and tax for India, the US and the UK, loan EMI, resume tools, and everyday percentage, age and unit converters.',
  alternates: { canonical: absoluteUrl('/tools') },
};

const COUNTRY_LABEL = { IN: 'India', US: 'United States', UK: 'United Kingdom' };

export default async function ToolsHubPage() {
  const tools = (await getAllTools()).filter((t) => CALCULATOR_COMPONENTS[t.slug]);
  const global = tools.filter((t) => GLOBAL_TOOL_SLUGS.includes(t.slug));
  const localized = tools.filter((t) => !GLOBAL_TOOL_SLUGS.includes(t.slug));
  const crumbs = [{ name: 'Home', href: '/' }, { name: 'Tools', href: '/tools' }];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <Breadcrumbs items={crumbs} />
      <header className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">Free online calculators</h1>
        <p className="text-slate-600 max-w-2xl">
          Salary, tax and loan calculators built for the rules of each country, plus everyday tools that work the same everywhere. Every calculation runs in your browser — nothing you type is stored.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Everyday calculators</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {global.map((t) => (
            <Link key={t.slug} href={toolPath(t.slug)} className="group rounded-2xl border border-slate-200 bg-white p-5 hover:border-cyan-400 transition">
              <Calculator className="w-5 h-5 text-cyan-700 mb-2" aria-hidden="true" />
              <span className="block font-semibold text-slate-900 group-hover:text-cyan-800">{t.name}</span>
              <span className="block text-sm text-slate-500 mt-1 line-clamp-2">{t.seo?.description}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Country-specific calculators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {localized.map((t) => (
            <div key={t.slug} className="rounded-2xl border border-slate-200 bg-white p-5">
              <span className="block font-semibold text-slate-900">{t.name}</span>
              <span className="block text-sm text-slate-500 mt-1 line-clamp-2">{t.seo?.description}</span>
              <div className="flex flex-wrap gap-2 mt-3">
                {(t.countries || []).map((c) => (
                  <Link
                    key={c}
                    href={toolPath(t.slug, c)}
                    className="min-h-[40px] inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 text-xs font-semibold text-slate-700 hover:border-cyan-400 hover:text-cyan-800"
                  >
                    {COUNTRY_LABEL[c.toUpperCase()] || c} <ArrowRight className="w-3 h-3" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
