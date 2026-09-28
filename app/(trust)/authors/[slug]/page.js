import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BadgeCheck, ExternalLink } from 'lucide-react';
import { authors, getAuthor, REVIEW_STANDARDS } from '@/data/authors';
import { defaultGuides } from '@/data/guides';
import { toolContent } from '@/data/toolContent';
import { defaultTools, localizeTool } from '@/data/tools';
import { Breadcrumbs, JsonLd } from '@/components/seo/PageParts';
import { absoluteUrl, breadcrumbSchema, personSchema } from '@/lib/seo/schema';
import { toolPath } from '@/lib/seo/related';
import { SALARY_SET_LIST } from '@/lib/programmatic/salary';

export const dynamicParams = false;

export function generateStaticParams() {
  return authors.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const a = authors.find((x) => x.slug === slug);
  if (!a) return {};
  return {
    title: `${a.name} — ${a.role}`,
    description: a.bio.slice(0, 155),
    alternates: { canonical: absoluteUrl(`/authors/${a.slug}`) },
  };
}

const SET_LABELS = {
  'in-lpa': ['In-hand salary by CTC (India)', '/in/salary'],
  'us-hourly': ['Hourly wage to annual salary (US)', '/us/salary'],
  'us-annual': ['Annual salary to hourly and take-home (US)', '/us/salary'],
  'uk-annual': ['UK salary after tax', '/uk/salary'],
};

function List({ items }) {
  return <ul className="list-disc pl-5 text-slate-700 space-y-1">{items.map((e) => <li key={e}>{e}</li>)}</ul>;
}

export default async function AuthorPage({ params }) {
  const { slug } = await params;
  if (!authors.some((a) => a.slug === slug)) notFound();
  const author = getAuthor(slug);

  const tools = Object.entries(toolContent)
    .filter(([, c]) => c.author === slug || c.reviewer === slug)
    .map(([toolSlug, c]) => {
      const t = defaultTools.find((x) => x.slug === toolSlug);
      if (!t) return null;
      const country = (t.countries?.[0] || 'in').toLowerCase();
      return { ...localizeTool(t, country), href: toolPath(t.slug, country), roleHere: c.author === slug ? 'Author' : 'Reviewer' };
    })
    .filter(Boolean);
  const guides = defaultGuides.filter((g) => g.authorSlug === slug || g.reviewerSlug === slug);
  const crumbs = [{ name: 'Home', href: '/' }, { name: author.name, href: `/authors/${slug}` }];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          { '@context': 'https://schema.org', '@type': 'ProfilePage', url: absoluteUrl(`/authors/${slug}`), mainEntity: personSchema(author, { full: true }) },
        ]}
      />
      <Breadcrumbs items={crumbs} />
      <header className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{author.name}</h1>
        <p className="text-slate-600 font-medium">{author.role}</p>
      </header>
      <p className="text-slate-700 leading-relaxed">{author.bio}</p>

      {author.professionalBackground?.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Background</h2>
          <List items={author.professionalBackground} />
        </section>
      )}

      {author.expertise?.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Areas of expertise</h2>
          <div className="flex flex-wrap gap-2">
            {author.expertise.map((e) => (
              <span key={e} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700">{e}</span>
            ))}
          </div>
        </section>
      )}

      {author.credentials?.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Credentials</h2>
          <ul className="space-y-1 text-slate-700">
            {author.credentials.map((c) => (
              <li key={c.name} className="flex items-center gap-2"><BadgeCheck className="w-4 h-4 text-emerald-600" aria-hidden="true" />{c.name}{c.issuer ? ` — ${c.issuer}` : ''}</li>
            ))}
          </ul>
        </section>
      )}

      {author.verifiedProfiles?.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Profiles</h2>
          <div className="flex flex-wrap gap-3">
            {author.verifiedProfiles.map((p) => (
              <a key={p.url} href={p.url} target="_blank" rel="noopener noreferrer me" className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-700 hover:underline">
                {p.label} <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            ))}
          </div>
        </section>
      )}

      {author.reviews?.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-2">What {author.type === 'team' ? 'the team reviews' : `${author.name.split(' ')[0]} reviews`}</h2>
          <List items={author.reviews} />
        </section>
      )}

      <section>
        <h2 className="text-lg font-bold text-slate-900 mb-2">Review standards</h2>
        <List items={REVIEW_STANDARDS.checklist} />
      </section>

      {tools.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Calculators</h2>
          <ul className="space-y-1">
            {tools.map((t) => (
              <li key={t.slug}>
                <Link href={t.href} className="text-cyan-700 hover:underline">{t.name}</Link>
                <span className="text-xs text-slate-500"> — {t.roleHere}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Both profiles are credited (author/reviewer) on every salary breakdown page. */}
      <section>
        <h2 className="text-lg font-bold text-slate-900 mb-2">Salary breakdown pages</h2>
        <ul className="space-y-1">
          {SALARY_SET_LIST.map((set) => {
            const [label, href] = SET_LABELS[set.id] || [set.id, '/'];
            return (
              <li key={set.id}>
                <Link href={href} className="text-cyan-700 hover:underline">{label}</Link>
                <span className="text-xs text-slate-500"> — {set.values.length} pages</span>
              </li>
            );
          })}
        </ul>
      </section>

      {guides.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Guides</h2>
          <ul className="space-y-1">
            {guides.map((g) => (
              <li key={g.slug}>
                <Link href={`/${g.country.toLowerCase()}/guides/${g.slug}`} className="text-cyan-700 hover:underline">{g.title}</Link>
                <span className="text-xs text-slate-500"> — {g.authorSlug === slug ? 'Author' : 'Reviewer'}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="text-sm text-slate-500">
        Read our <Link href={REVIEW_STANDARDS.editorialPolicyUrl} className="text-cyan-700 hover:underline">editorial policy</Link> and{' '}
        <Link href={REVIEW_STANDARDS.methodologyUrl} className="text-cyan-700 hover:underline">calculation methodology</Link>.
      </p>
    </div>
  );
}
