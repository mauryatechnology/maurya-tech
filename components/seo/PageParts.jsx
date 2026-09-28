import Link from 'next/link';
import { ArrowRight, BadgeCheck, BookOpen, Calculator, HelpCircle, Link2 } from 'lucide-react';
import { getAuthor } from '@/data/authors';
import { serializeJsonLd } from '@/lib/utils';

/** Server-rendered building blocks shared by tool, guide and programmatic pages. */

export function JsonLd({ data }) {
  if (!data) return null;
  const list = Array.isArray(data) ? data.filter(Boolean) : [data];
  return list.map((d, i) => (
    <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(d) }} />
  ));
}

export function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 font-medium">
      {items.map((c, i) => (
        <span key={`${c.name}-${i}`} className="flex items-center gap-1.5">
          {i > 0 && <span aria-hidden="true" className="text-slate-300">/</span>}
          {c.href && i < items.length - 1 ? (
            <Link href={c.href} className="hover:text-slate-900 transition">{c.name}</Link>
          ) : (
            <span className="text-slate-900 font-semibold" aria-current="page">{c.name}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function AnswerBox({ children, label = 'Quick answer' }) {
  return (
    <div className="rounded-2xl border border-cyan-200 bg-cyan-50/60 p-5">
      <p className="text-[11px] font-bold uppercase tracking-wider text-cyan-800 mb-1.5">{label}</p>
      <p className="text-sm sm:text-base leading-relaxed text-slate-800">{children}</p>
    </div>
  );
}

export function ContentSections({ sections = [] }) {
  return sections.map((s) => (
    <section key={s.heading} className="space-y-3">
      <h2 className="text-xl font-bold text-slate-900 tracking-tight">{s.heading}</h2>
      {s.paragraphs?.map((p, i) => (
        <p key={i} className="text-sm sm:text-[15px] leading-relaxed text-slate-700">{p}</p>
      ))}
      {s.list?.length > 0 && (
        <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-[15px] leading-relaxed text-slate-700">
          {s.list.map((li, i) => <li key={i}>{li}</li>)}
        </ul>
      )}
    </section>
  ));
}

export function FaqSection({ faqs = [], title = 'Frequently asked questions' }) {
  if (!faqs.length) return null;
  return (
    <section aria-labelledby="faq-heading" className="space-y-4">
      <h2 id="faq-heading" className="flex items-center gap-2 text-xl font-bold text-slate-900 tracking-tight">
        <HelpCircle className="w-5 h-5 text-cyan-700" aria-hidden="true" />
        {title}
      </h2>
      <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
        {faqs.map((f) => (
          <details key={f.question} className="group p-5" open>
            <summary className="cursor-pointer list-none font-semibold text-sm sm:text-base text-slate-900">
              <h3 className="inline">{f.question}</h3>
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">{f.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function ReviewBox({ authorSlug, reviewerSlug, lastReviewed, sources = [] }) {
  const author = authorSlug ? getAuthor(authorSlug) : null;
  const reviewer = reviewerSlug ? getAuthor(reviewerSlug) : null;
  const date = lastReviewed
    ? new Date(lastReviewed).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  return (
    <section aria-label="Sources and review" className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 text-sm">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-600">
        <span className="flex items-center gap-1.5 font-semibold text-emerald-700">
          <BadgeCheck className="w-4 h-4" aria-hidden="true" />
          {date ? `Last reviewed ${date}` : 'Reviewed'}
        </span>
        {author && (
          <span>
            By <Link href={`/authors/${author.slug}`} className="font-semibold text-slate-900 hover:underline">{author.name}</Link>
          </span>
        )}
        {reviewer && reviewer.slug !== author?.slug && (
          <span>
            Reviewed by <Link href={`/authors/${reviewer.slug}`} className="font-semibold text-slate-900 hover:underline">{reviewer.name}</Link>
          </span>
        )}
        <Link href="/methodology" className="text-cyan-700 hover:underline">How we calculate</Link>
      </div>
      {sources.length > 0 && (
        <div>
          <p className="font-semibold text-slate-800 mb-1">Sources</p>
          <ul className="list-disc pl-5 space-y-0.5 text-slate-600">
            {sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{s.name}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className="text-xs text-slate-500">
        Estimates for general information only — not tax, legal or financial advice. Check your payslip, employer or a qualified adviser before acting.
      </p>
    </section>
  );
}

export function RelatedLinks({ tools = [], guides = [], extra = null }) {
  if (!tools.length && !guides.length && !extra) return null;
  return (
    <section aria-labelledby="related-heading" className="space-y-4">
      <h2 id="related-heading" className="flex items-center gap-2 text-xl font-bold text-slate-900 tracking-tight">
        <Link2 className="w-5 h-5 text-cyan-700" aria-hidden="true" />
        Related tools &amp; guides
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {tools.map((t) => (
          <Link key={t.href} href={t.href} className="group flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 hover:border-cyan-400 transition">
            <Calculator className="w-5 h-5 mt-0.5 text-cyan-700 shrink-0" aria-hidden="true" />
            <span>
              <span className="block font-semibold text-sm text-slate-900 group-hover:text-cyan-800">{t.name}</span>
              {t.description && <span className="block text-xs text-slate-500 mt-0.5 line-clamp-2">{t.description}</span>}
            </span>
          </Link>
        ))}
        {guides.map((g) => (
          <Link key={g.href} href={g.href} className="group flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 hover:border-cyan-400 transition">
            <BookOpen className="w-5 h-5 mt-0.5 text-indigo-700 shrink-0" aria-hidden="true" />
            <span>
              <span className="block font-semibold text-sm text-slate-900 group-hover:text-cyan-800">{g.name}</span>
              {g.description && <span className="block text-xs text-slate-500 mt-0.5 line-clamp-2">{g.description}</span>}
            </span>
          </Link>
        ))}
      </div>
      {extra}
    </section>
  );
}

export function LinkPills({ title, links = [], hub }) {
  if (!links.length) return null;
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h2>
      <div className="flex flex-wrap gap-2">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="min-h-[40px] inline-flex items-center rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:border-cyan-400 hover:text-cyan-800 transition">
            {l.name}
          </Link>
        ))}
      </div>
      {hub && (
        <Link href={hub.href} className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-700 hover:underline">
          {hub.label} <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      )}
    </section>
  );
}
