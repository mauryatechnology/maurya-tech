import Link from 'next/link';
import { authors } from '@/data/authors';
import { Breadcrumbs, JsonLd } from '@/components/seo/PageParts';
import { absoluteUrl, breadcrumbSchema } from '@/lib/seo/schema';

export const metadata = {
  title: 'Editorial Policy — How We Research, Write and Review',
  description:
    'How Maurya Tech researches, writes, fact-checks and updates its calculators and guides, how AI assistance is used, and how advertising is kept separate from content.',
  alternates: { canonical: absoluteUrl('/editorial-policy') },
};

export default function EditorialPolicyPage() {
  const crumbs = [{ name: 'Home', href: '/' }, { name: 'Editorial policy', href: '/editorial-policy' }];
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8 text-slate-700">
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <Breadcrumbs items={crumbs} />
      <header className="space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Editorial policy</h1>
        <p className="text-slate-600">Our goal is simple: every page should answer its question correctly, clearly and without making you hunt for the answer.</p>
      </header>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-slate-900">Sources</h2>
        <p>Tax rates, thresholds and contribution limits come from official government sources — the Income Tax Department of India and Union Budget documents, the IRS and SSA, and GOV.UK/HMRC. Each finance page lists the sources it relies on.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-slate-900">Review and updates</h2>
        <p>Every calculator and guide shows who wrote it, who reviewed it and when it was last reviewed. Finance pages are re-reviewed whenever tax rules change and at least once a year. Pages that fall out of date are corrected or taken down.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-slate-900">Use of AI</h2>
        <p>We sometimes use AI tools to draft outlines or first versions of explanatory text. Nothing is published without a person checking it, and every number on a finance page is verified against the official source and our calculation engine before publication.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-slate-900">Advertising and affiliate links</h2>
        <p>This site is funded by display advertising, occasional affiliate links and our own digital products. Advertisers have no influence on calculations or editorial content. Ads are labelled, never placed inside calculator inputs, and we do not use pop-ups on tool or guide pages. Affiliate links are disclosed where they appear.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-slate-900">Not professional advice</h2>
        <p>Our calculators give estimates for general information. For decisions about your own tax, loans or employment, check your payslip, employer or a qualified professional.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-slate-900">Who we are</h2>
        <ul className="list-disc pl-5 space-y-1">
          {authors.map((a) => (
            <li key={a.slug}>
              <Link href={`/authors/${a.slug}`} className="text-cyan-700 hover:underline">{a.name}</Link> — {a.role}
            </li>
          ))}
        </ul>
        <p>
          Spotted a mistake? <Link href="/contact" className="text-cyan-700 hover:underline">Contact us</Link>. See how the numbers are calculated on our{' '}
          <Link href="/methodology" className="text-cyan-700 hover:underline">methodology page</Link>.
        </p>
      </section>
    </div>
  );
}
