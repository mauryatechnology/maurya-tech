import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Clock, Calendar, ArrowRight } from 'lucide-react';
import { getMarketProfile } from '@/lib/market/getMarketProfile';
import { getGuideBySlug, getGuidesForCountry } from '@/lib/market/getGuide';
import { getToolBySlug } from '@/lib/market/getTool';
import { CrossPromoBanner } from '@/components/pages/careers/CrossPromoBanner';
import { Ad } from '@/components/ads/Ad';
import { Breadcrumbs, FaqSection, JsonLd, RelatedLinks, ReviewBox } from '@/components/seo/PageParts';
import { getAuthor } from '@/data/authors';
import { absoluteUrl, articleSchema, breadcrumbSchema, faqSchema } from '@/lib/seo/schema';
import { relatedGuides, relatedTools, toolPath } from '@/lib/seo/related';

const SUPPORTED_COUNTRIES = ['in', 'us', 'uk'];
const LOCALE = { in: 'en_IN', us: 'en_US', uk: 'en_GB' };

export async function generateStaticParams() {
  const params = [];
  for (const country of SUPPORTED_COUNTRIES) {
    const guides = await getGuidesForCountry(country);
    for (const guide of guides) params.push({ country, slug: guide.slug });
  }
  return params;
}

export async function generateMetadata({ params }) {
  const { country, slug } = await params;
  const normalizedCountry = (country || '').toLowerCase();
  if (!SUPPORTED_COUNTRIES.includes(normalizedCountry)) return {};

  const guide = await getGuideBySlug(slug, normalizedCountry);
  if (!guide) return {};

  const title = (guide.seo?.title || guide.title).replace(/\s*\|\s*Maurya Tech(nologies)?\s*$/i, '');
  const description = guide.seo?.description || guide.excerpt;
  const url = absoluteUrl(`/${normalizedCountry}/guides/${guide.slug}`);
  const author = getAuthor(guide.authorSlug || 'editorial-team');

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Maurya Technologies',
      type: 'article',
      locale: LOCALE[normalizedCountry],
      publishedTime: guide.date,
      modifiedTime: guide.lastReviewed || guide.date,
      authors: [author.name],
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

/** Splits markdown roughly in half at a "## " heading so an ad can sit mid-article. */
function splitMarkdown(md = '') {
  const idx = [];
  const re = /\n## /g;
  let m;
  while ((m = re.exec(md))) idx.push(m.index);
  if (idx.length < 3) return [md, ''];
  const cut = idx[Math.floor(idx.length / 2)];
  return [md.slice(0, cut), md.slice(cut)];
}

const PROSE =
  'bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs prose prose-slate max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-cyan-700 prose-table:block prose-table:overflow-x-auto prose-th:bg-slate-50 prose-th:p-3 prose-td:p-3';

export default async function GuideDetailPage({ params }) {
  const { country, slug } = await params;
  const normalizedCountry = (country || '').toLowerCase();
  if (!SUPPORTED_COUNTRIES.includes(normalizedCountry)) notFound();

  const market = await getMarketProfile(normalizedCountry);
  const guide = await getGuideBySlug(slug, normalizedCountry);
  if (!guide) notFound();

  const relatedTool = guide.relatedToolSlug ? await getToolBySlug(guide.relatedToolSlug, normalizedCountry) : null;
  const author = getAuthor(guide.authorSlug || 'editorial-team');
  const reviewer = guide.reviewerSlug ? getAuthor(guide.reviewerSlug) : null;
  const path = `/${normalizedCountry}/guides/${guide.slug}`;
  const faqs = guide.seo?.faqSchema || [];
  const crumbs = [
    { name: market.name, href: `/${normalizedCountry}` },
    { name: 'Guides', href: `/${normalizedCountry}/guides` },
    { name: guide.title, href: path },
  ];
  const [firstHalf, secondHalf] = splitMarkdown(guide.content);
  const dateLabel = guide.lastReviewed || guide.date;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <JsonLd
        data={[
          articleSchema({
            headline: guide.title,
            description: guide.excerpt,
            url: path,
            datePublished: guide.date,
            dateModified: dateLabel,
            author,
            reviewer,
          }),
          breadcrumbSchema(crumbs),
          faqSchema(faqs),
        ]}
      />

      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-5">
          <Breadcrumbs items={crumbs} />
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">{guide.title}</h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">{guide.excerpt}</p>
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
            <span>
              By{' '}
              <Link href={`/authors/${author.slug}`} className="font-bold text-slate-900 hover:underline">{author.name}</Link>
              {reviewer && reviewer.slug !== author.slug && (
                <>
                  {' '}· Reviewed by{' '}
                  <Link href={`/authors/${reviewer.slug}`} className="font-bold text-slate-900 hover:underline">{reviewer.name}</Link>
                </>
              )}
            </span>
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" aria-hidden="true" /> Updated {dateLabel}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" aria-hidden="true" /> {guide.readTime || '6 min read'}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-10">
        {relatedTool && (
          <div className="p-6 rounded-3xl bg-gradient-to-r from-cyan-900 to-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider">Calculator for this guide</span>
              <p className="text-lg font-bold">{relatedTool.name}</p>
              <p className="text-xs text-slate-300">Run your own numbers with the same rules used in this guide.</p>
            </div>
            <Link
              href={toolPath(relatedTool.slug, normalizedCountry)}
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shrink-0"
            >
              Open calculator <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        )}

        <div className={PROSE}>
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{firstHalf}</ReactMarkdown>
        </div>

        {secondHalf && (
          <>
            <Ad market={market} placement="article" minHeight={280} />
            <div className={PROSE}>
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{secondHalf}</ReactMarkdown>
            </div>
          </>
        )}

        <FaqSection faqs={faqs} />

        <ReviewBox authorSlug={author.slug} reviewerSlug={reviewer?.slug} lastReviewed={dateLabel} sources={guide.sources || []} />

        <Ad market={market} placement="article" minHeight={250} />

        <RelatedLinks
          tools={relatedTool ? relatedTools(relatedTool.slug, normalizedCountry, 3) : []}
          guides={relatedGuides({ country: normalizedCountry, toolSlug: guide.relatedToolSlug, excludeSlug: guide.slug, limit: 3 })}
        />

        <CrossPromoBanner country={normalizedCountry} />
      </div>
    </div>
  );
}
