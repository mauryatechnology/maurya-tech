import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { getMarketProfile } from '@/lib/market/getMarketProfile';
import { getGuideBySlug, getGuidesForCountry } from '@/lib/market/getGuide';
import { getToolBySlug } from '@/lib/market/getTool';
import { CrossPromoBanner } from '@/components/pages/careers/CrossPromoBanner';
import { serializeJsonLd } from '@/lib/utils';
import {
  ChevronRight,
  Clock,
  Calendar,
  User,
  Calculator,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

const SUPPORTED_COUNTRIES = ['in', 'us', 'uk'];

export async function generateStaticParams() {
  const params = [];
  for (const country of SUPPORTED_COUNTRIES) {
    const guides = await getGuidesForCountry(country);
    for (const guide of guides) {
      params.push({
        country,
        slug: guide.slug,
      });
    }
  }
  return params;
}

export async function generateMetadata({ params }) {
  const { country, slug } = await params;
  const normalizedCountry = (country || '').toLowerCase();
  if (!SUPPORTED_COUNTRIES.includes(normalizedCountry)) return {};

  const market = await getMarketProfile(normalizedCountry);
  const guide = await getGuideBySlug(slug, normalizedCountry);
  if (!guide) return {};

  const title = guide.seo?.title || `${guide.title} | Maurya Technologies`;
  const description = guide.seo?.description || guide.excerpt;

  return {
    title,
    description,
    keywords: guide.seo?.primaryKeyword ? [guide.seo.primaryKeyword, market.name, 'guide'] : undefined,
    alternates: {
      canonical: `https://maurya-tech.com/${normalizedCountry}/guides/${guide.slug}`,
      languages: {
        'en-IN': `https://maurya-tech.com/in/guides/${guide.slug}`,
        'en-US': `https://maurya-tech.com/us/guides/${guide.slug}`,
        'en-GB': `https://maurya-tech.com/uk/guides/${guide.slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `https://maurya-tech.com/${normalizedCountry}/guides/${guide.slug}`,
      siteName: 'Maurya Technologies',
      type: 'article',
      publishedTime: guide.date,
      authors: [guide.author || 'Maurya Technologies Team'],
    },
  };
}

export default async function GuideDetailPage({ params }) {
  const { country, slug } = await params;
  const normalizedCountry = (country || '').toLowerCase();
  if (!SUPPORTED_COUNTRIES.includes(normalizedCountry)) notFound();

  const market = await getMarketProfile(normalizedCountry);
  const guide = await getGuideBySlug(slug, normalizedCountry);
  if (!guide) notFound();

  // Related tool lookup
  const relatedTool = guide.relatedToolSlug
    ? await getToolBySlug(guide.relatedToolSlug, normalizedCountry)
    : null;

  // Article JSON-LD Schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.excerpt,
    datePublished: guide.date,
    dateModified: guide.date,
    author: {
      '@type': 'Person',
      name: guide.author || 'Maurya Technologies Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Maurya Technologies',
      url: 'https://maurya-tech.com',
      logo: 'https://maurya-tech.com/favicon.ico',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://maurya-tech.com/${normalizedCountry}/guides/${guide.slug}`,
    },
  };

  // FAQPage JSON-LD Schema
  const faqSchema =
    guide.seo?.faqSchema && guide.seo.faqSchema.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: guide.seo.faqSchema.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: f.answer,
            },
          })),
        }
      : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqSchema) }}
        />
      )}

      {/* Hero Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Link href={`/${normalizedCountry}`} className="hover:text-slate-900 transition">
              {market.name} Hub
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href={`/${normalizedCountry}/guides`} className="hover:text-slate-900 transition">
              Guides
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-semibold truncate max-w-[200px]">
              {guide.category}
            </span>
          </nav>

          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-xs font-bold text-cyan-800 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
              <span>{guide.category} • 2026 Reference</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {guide.title}
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {guide.excerpt}
            </p>

            {/* Author & E-E-A-T Strip */}
            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold">
                  {guide.author ? guide.author[0] : 'M'}
                </div>
                <div>
                  <div className="font-bold text-slate-900">{guide.author || 'Engineering Team'}</div>
                  <div className="text-[11px] text-slate-400">{guide.authorRole || 'Maurya Technologies'}</div>
                </div>
              </div>

              <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>

              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Updated: {guide.date}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{guide.readTime || '6 min read'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-10">
        {/* Related Tool Callout */}
        {relatedTool && (
          <div className="p-6 rounded-3xl bg-gradient-to-r from-cyan-900 to-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                Companion Interactive Engine
              </span>
              <h3 className="text-lg font-bold">{relatedTool.name}</h3>
              <p className="text-xs text-slate-300">
                Run your exact real numbers instantly with 2026 formula verification.
              </p>
            </div>
            <Link
              href={`/${normalizedCountry}/tools/${relatedTool.slug}`}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shrink-0"
            >
              <span>Open Tool</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Prose Content */}
        <article className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-12 shadow-xs prose prose-slate max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-cyan-600 prose-table:border prose-th:bg-slate-50 prose-th:p-3 prose-td:p-3 prose-th:border prose-td:border">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            {guide.content}
          </ReactMarkdown>
        </article>

        {/* FAQ Section Display */}
        {guide.seo?.faqSchema && guide.seo.faqSchema.length > 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-cyan-600" />
              <span>Frequently Asked Questions</span>
            </h2>
            <div className="space-y-4">
              {guide.seo.faqSchema.map((faq, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="text-sm font-bold text-slate-900">{faq.question}</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Digital Product & Career Acceleration Banner */}
        <CrossPromoBanner />
      </div>
    </div>
  );
}
