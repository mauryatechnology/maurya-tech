import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Post from '@/lib/models/Post';
import Country from '@/lib/models/Country';
import { verifyToken, hasPermission, ROLES } from '@/lib/auth';
import { defaultTools } from '@/data/tools';
import { defaultGuides } from '@/data/guides';
import { toolContent } from '@/data/toolContent';
import { defaultCountries } from '@/data/countries';
import { runQualityGate } from '@/lib/content/qualityGate';
import { SALARY_SETS } from '@/lib/programmatic/salary';
import { GLOBAL_TOOL_SLUGS } from '@/lib/seo/related';
import { ADS_ENABLED, ADSENSE_CLIENT } from '@/lib/ads/config';
import { TAX_RULES } from '@/lib/tax';

const DAY = 86400000;
const daysSince = (d) => (d ? Math.floor((Date.now() - new Date(d).getTime()) / DAY) : null);

/** SEO health report for /admin/seo: inventory, freshness, quality gate, orphans, config. */
export async function GET(req) {
  const authUser = await verifyToken(req.cookies.get('admin_token')?.value);
  if (!authUser) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (!hasPermission(authUser.role, ROLES.EDITOR)) {
    return NextResponse.json({ message: 'Forbidden: Insufficient privileges' }, { status: 403 });
  }

  let dbPosts = [];
  let dbCountries = [];
  try {
    await connectToDatabase();
    [dbPosts, dbCountries] = await Promise.all([
      Post.find({}).select('title slug content excerpt category author faqSchema primaryKeyword relatedToolSlug sources lastReviewedAt updatedAt isPublished status canonicalCountry clusterType').lean(),
      Country.find({}).select('code enabled monetizationRules').lean(),
    ]);
  } catch (err) {
    console.warn('SEO report DB fallback:', err.message);
  }

  // Inventory
  const tools = defaultTools.filter((t) => t.enabled);
  const countryToolPages = tools
    .filter((t) => !GLOBAL_TOOL_SLUGS.includes(t.slug))
    .reduce((n, t) => n + (t.countries || []).length, 0);
  const salaryPages = Object.values(SALARY_SETS).reduce((n, s) => n + s.values.length, 0);
  const publishedPosts = dbPosts.filter((p) => p.isPublished);
  const inventory = {
    globalToolPages: GLOBAL_TOOL_SLUGS.length,
    countryToolPages,
    guides: defaultGuides.length,
    salaryPages,
    dbPublishedPosts: publishedPosts.length,
    dbPostsInReview: dbPosts.filter((p) => p.status === 'review').length,
  };
  inventory.total = inventory.globalToolPages + inventory.countryToolPages + inventory.guides + inventory.salaryPages + inventory.dbPublishedPosts;

  // Freshness (finance pages must be reviewed within 12 months)
  const freshness = [
    ...Object.entries(toolContent).map(([slug, c]) => ({ type: 'tool', id: slug, lastReviewed: c.lastReviewed })),
    ...defaultGuides.map((g) => ({ type: 'guide', id: g.slug, lastReviewed: g.lastReviewed || g.date })),
    ...Object.entries(TAX_RULES).map(([code, r]) => ({ type: 'tax-rules', id: code, lastReviewed: r.lastReviewed })),
  ].map((r) => ({ ...r, ageDays: daysSince(r.lastReviewed), stale: (daysSince(r.lastReviewed) ?? 9999) > 365 }));

  // Quality gate across guides + DB posts
  const allKeywords = [...defaultGuides.map((g) => g.seo?.primaryKeyword), ...dbPosts.map((p) => p.primaryKeyword)];
  const allTitles = [...defaultGuides.map((g) => g.seo?.title || g.title), ...dbPosts.map((p) => p.title)];
  // Everything except this page's own single entry, so a page never "conflicts" with itself.
  const without = (arr, v) => {
    const i = arr.indexOf(v);
    return (i === -1 ? arr : [...arr.slice(0, i), ...arr.slice(i + 1)]).filter(Boolean);
  };
  const others = (kw, title) => ({ otherKeywords: without(allKeywords, kw), otherTitles: without(allTitles, title) });
  const quality = [
    ...defaultGuides.map((g) => {
      const q = runQualityGate(
        { ...g, faqSchema: g.seo?.faqSchema, primaryKeyword: g.seo?.primaryKeyword, lastReviewedAt: g.lastReviewed },
        others(g.seo?.primaryKeyword, g.seo?.title || g.title)
      );
      return { source: 'static', slug: g.slug, title: g.title, score: q.score, passed: q.passed, failing: Object.entries(q.checks).filter(([, c]) => !c.passed).map(([k]) => k) };
    }),
    ...publishedPosts.map((p) => {
      const q = runQualityGate(p, others(p.primaryKeyword, p.title));
      return { source: 'db', slug: p.slug, title: p.title, score: q.score, passed: q.passed, failing: Object.entries(q.checks).filter(([, c]) => !c.passed).map(([k]) => k) };
    }),
  ].sort((a, b) => a.score - b.score);

  // Orphans: content with no link to a tool and nothing pointing at it from a tool
  const linkedGuideTools = new Set(defaultGuides.map((g) => g.relatedToolSlug).filter(Boolean));
  const orphans = [
    ...publishedPosts
      .filter((p) => !p.relatedToolSlug && !/\]\(\/(in|us|uk|tools)\//.test(p.content || ''))
      .map((p) => ({ type: 'post', id: p.slug, reason: 'No link to any tool and no related tool set' })),
    ...tools
      .filter((t) => !toolContent[t.slug])
      .map((t) => ({ type: 'tool', id: t.slug, reason: 'No long-form content in data/toolContent.js' })),
    ...tools
      .filter((t) => !GLOBAL_TOOL_SLUGS.includes(t.slug) && !linkedGuideTools.has(t.slug))
      .map((t) => ({ type: 'tool', id: t.slug, reason: 'No guide links to this tool yet' })),
  ];

  // Configuration checklist
  const countries = (dbCountries.length ? dbCountries : defaultCountries).map((c) => ({
    code: c.code,
    enabled: c.enabled,
    adNetwork: c.monetizationRules?.adNetwork || 'none',
    source: dbCountries.length ? 'db' : 'static',
  }));
  const config = [
    { key: 'NEXT_PUBLIC_ADSENSE_CLIENT', ok: /^ca-pub-\d{10,20}$/.test(ADSENSE_CLIENT), hint: 'AdSense publisher ID (ca-pub-…)' },
    { key: 'NEXT_PUBLIC_ADS_ENABLED', ok: ADS_ENABLED, hint: 'Set to true after AdSense approval' },
    { key: 'NEXT_PUBLIC_ADSENSE_SLOT_DEFAULT', ok: Boolean(process.env.NEXT_PUBLIC_ADSENSE_SLOT_DEFAULT), hint: 'A responsive display ad unit ID' },
    { key: 'GOOGLE_SITE_VERIFICATION', ok: Boolean(process.env.GOOGLE_SITE_VERIFICATION), hint: 'Search Console HTML-tag token (or verify via DNS)' },
    { key: 'BING_SITE_VERIFICATION', ok: Boolean(process.env.BING_SITE_VERIFICATION), hint: 'Bing Webmaster Tools msvalidate.01 token' },
    { key: 'INDEXNOW_KEY', ok: Boolean(process.env.INDEXNOW_KEY), hint: 'Random 32+ char hex key for IndexNow pings' },
    ...countries.map((c) => ({ key: `Market ${c.code} ad network (${c.source})`, ok: c.adNetwork === 'adsense', hint: `Currently "${c.adNetwork}" — set to adsense in /admin/markets` })),
  ];

  return NextResponse.json({ success: true, inventory, freshness, quality, orphans, config, generatedAt: new Date().toISOString() });
}
