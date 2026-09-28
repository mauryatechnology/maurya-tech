import { CALCULATOR_COMPONENTS } from '@/components/tools/registry';
import { ToolPageProvider } from '@/components/tools/ToolPageContext';
import { ReferenceBlocks } from '@/components/tools/ReferenceBlocks';
import { ResumePackCta } from '@/components/tools/ResumePackCta';
import { Ad } from '@/components/ads/Ad';
import {
  AnswerBox,
  ContentSections,
  FaqSection,
  JsonLd,
  LinkPills,
  RelatedLinks,
  ReviewBox,
} from '@/components/seo/PageParts';
import { getToolContent } from '@/data/toolContent';
import { getAuthor } from '@/data/authors';
import { breadcrumbSchema, faqSchema, softwareAppSchema, reviewedWebPageSchema } from '@/lib/seo/schema';
import { TaxAlertCapture } from '@/components/tools/TaxAlertCapture';
import { relatedGuides, relatedTools, salaryLinks } from '@/lib/seo/related';

/**
 * Full tool page following the Page Quality Standard (plan §6.1):
 * calculator → ad → quick answer → how it works → reference tables → ad → FAQ →
 * sources/review → related links → ad. Shared by /[country]/tools/[slug] and /tools/[slug].
 */
export function ToolPage({ tool, market, country, path, breadcrumbs }) {
  const Calculator = CALCULATOR_COMPONENTS[tool.slug];
  const contentCountry = country ? country.toUpperCase() : 'IN';
  const content = getToolContent(tool.slug, contentCountry);
  const faqs = content?.faqs?.length ? content.faqs : tool.seo?.faqSchema || [];
  const linkCountry = country || 'in';

  const schemas = [
    softwareAppSchema({
      name: tool.name,
      description: tool.seo?.description || tool.name,
      url: path,
      category: tool.category,
      currency: country ? market.currency : 'USD',
      dateModified: content?.lastReviewed,
    }),
    breadcrumbSchema(breadcrumbs),
    faqSchema(faqs),
    content
      ? reviewedWebPageSchema({
          name: tool.seo?.title || tool.name,
          description: tool.seo?.description,
          url: path,
          lastReviewed: content.lastReviewed,
          author: getAuthor(content.author),
          reviewer: content.reviewer ? getAuthor(content.reviewer) : null,
        })
      : null,
  ];

  const tools = relatedTools(tool.slug, linkCountry, 4);
  const guides = country ? relatedGuides({ country, toolSlug: tool.slug, limit: 3 }) : [];
  const salaryHub = content?.hub;
  const pills = salaryHub && country ? salaryLinks(country, 10) : [];
  const author = content ? getAuthor(content.author) : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <JsonLd data={schemas} />

      <ToolPageProvider breadcrumbs={breadcrumbs}>
        <Calculator country={linkCountry} countryName={country ? market.name : 'Worldwide'} tool={tool} />
      </ToolPageProvider>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {content?.summary && <AnswerBox>{content.summary}</AnswerBox>}

        <Ad market={market} placement="toolResult" minHeight={280} />

        {content && <ContentSections sections={content.sections} />}

        <ReferenceBlocks blocks={content?.blocks} />

        <Ad market={market} placement="toolMid" minHeight={280} />

        {content?.productCta && (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2">
            <h2 className="text-lg font-bold text-slate-900">Want ready-made templates?</h2>
            <p className="text-sm text-slate-600">
              The ATS Resume &amp; Salary Negotiation Pack includes ATS-friendly templates, bullet-point formulas and counter-offer email scripts.
            </p>
            <ResumePackCta label="Get the pack" country={linkCountry} />
          </section>
        )}

        <FaqSection faqs={faqs} />

        <ReviewBox
          authorSlug={author?.slug}
          reviewerSlug={content?.reviewer}
          lastReviewed={content?.lastReviewed || tool.updatedAt}
          sources={content?.sources || []}
        />

        <LinkPills title="Popular salary breakdowns" links={pills} hub={salaryHub} />

        <RelatedLinks tools={tools} guides={guides} />

        <Ad market={market} placement="toolBottom" minHeight={250} />

        <TaxAlertCapture country={country || 'global'} source={path} />
      </div>
    </div>
  );
}
