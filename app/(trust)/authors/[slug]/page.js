import Link from 'next/link';
import { notFound } from 'next/navigation';
import { authors, getAuthor } from '@/data/authors';
import { defaultGuides } from '@/data/guides';
import { toolContent } from '@/data/toolContent';
import { defaultTools } from '@/data/tools';
import { Breadcrumbs, JsonLd } from '@/components/seo/PageParts';
import { absoluteUrl, breadcrumbSchema, personSchema } from '@/lib/seo/schema';
import { toolPath } from '@/lib/seo/related';

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

export default async function AuthorPage({ params }) {
  const { slug } = await params;
  if (!authors.some((a) => a.slug === slug)) notFound();
  const author = getAuthor(slug);

  const tools = Object.entries(toolContent)
    .filter(([, c]) => c.author === slug || c.reviewer === slug)
    .map(([toolSlug]) => defaultTools.find((t) => t.slug === toolSlug))
    .filter(Boolean);
  const guides = defaultGuides.filter((g) => g.authorSlug === slug || g.reviewerSlug === slug);
  const crumbs = [{ name: 'Home', href: '/' }, { name: author.name, href: `/authors/${slug}` }];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <JsonLd data={[breadcrumbSchema(crumbs), { '@context': 'https://schema.org', '@type': 'ProfilePage', mainEntity: personSchema(author) }]} />
      <Breadcrumbs items={crumbs} />
      <header className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{author.name}</h1>
        <p className="text-slate-600 font-medium">{author.role}</p>
      </header>
      <p className="text-slate-700 leading-relaxed">{author.bio}</p>
      {author.expertise?.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Areas covered</h2>
          <ul className="list-disc pl-5 text-slate-700 space-y-1">{author.expertise.map((e) => <li key={e}>{e}</li>)}</ul>
        </section>
      )}
      {author.sameAs?.length > 0 && (
        <p className="text-sm text-slate-600">
          Elsewhere:{' '}
          {author.sameAs.map((u) => (
            <a key={u} href={u} target="_blank" rel="noopener noreferrer me" className="text-cyan-700 hover:underline mr-3">{u.replace(/^https?:\/\//, '')}</a>
          ))}
        </p>
      )}
      {tools.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Calculators written or reviewed</h2>
          <ul className="list-disc pl-5 space-y-1">
            {tools.map((t) => (
              <li key={t.slug}><Link href={toolPath(t.slug, (t.countries?.[0] || 'in').toLowerCase())} className="text-cyan-700 hover:underline">{t.name}</Link></li>
            ))}
          </ul>
        </section>
      )}
      {guides.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Guides</h2>
          <ul className="list-disc pl-5 space-y-1">
            {guides.map((g) => (
              <li key={g.slug}><Link href={`/${g.country.toLowerCase()}/guides/${g.slug}`} className="text-cyan-700 hover:underline">{g.title}</Link></li>
            ))}
          </ul>
        </section>
      )}
      <p className="text-sm text-slate-500">
        Read our <Link href="/editorial-policy" className="text-cyan-700 hover:underline">editorial policy</Link> and{' '}
        <Link href="/methodology" className="text-cyan-700 hover:underline">calculation methodology</Link>.
      </p>
    </div>
  );
}
