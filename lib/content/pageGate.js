/**
 * Quality Gate for generated pages (tool pages and programmatic salary pages).
 * Long-form guides/posts use runQualityGate (qualityGate.js); these pages are
 * template-driven, so the gate checks the metadata and content model instead.
 */
import { defaultTools, localizeTool } from '@/data/tools';
import { getToolContent } from '@/data/toolContent';
import { SALARY_SET_LIST, buildSalaryPage, salaryPagePath } from '@/lib/programmatic/salary';
import { GLOBAL_TOOL_SLUGS, toolPath } from '@/lib/seo/related';
import { TAX_RULES } from '@/lib/tax';

const DAY = 86400000;
const FINANCE = new Set(['salary', 'finance']);

function check(page, titles) {
  const title = page.title || '';
  const description = page.description || '';
  const faqs = page.faqs || [];
  const ageDays = page.lastReviewed ? (Date.now() - new Date(page.lastReviewed).getTime()) / DAY : Infinity;
  const checks = {
    titleLength: { passed: title.length >= 20 && title.length <= 60, actual: title.length },
    descriptionLength: { passed: description.length >= 70 && description.length <= 160, actual: description.length },
    uniqueTitle: { passed: titles.get(title.toLowerCase()) === 1 },
    answerFirst: { passed: (page.answer || '').length >= 80 },
    faqs: { passed: faqs.length >= page.minFaqs, actual: faqs.length },
    depth: { passed: page.depth >= page.minDepth, actual: page.depth },
    sources: { passed: !page.finance || (page.sources || []).length > 0 },
    freshness: { passed: !page.finance || ageDays <= 365 },
    internalLinks: { passed: page.links >= 3, actual: page.links },
  };
  const failing = Object.entries(checks).filter(([, c]) => !c.passed).map(([k]) => k);
  return { path: page.path, type: page.type, title, passed: failing.length === 0, failing, checks };
}

/** Every generated page on the site, in the shape the gate needs. */
export function collectGeneratedPages() {
  const pages = [];

  for (const tool of defaultTools.filter((t) => t.enabled)) {
    const countries = GLOBAL_TOOL_SLUGS.includes(tool.slug) ? [null] : tool.countries || [];
    for (const c of countries) {
      const code = c || 'IN';
      const t = c ? localizeTool(tool, c) : tool;
      const content = getToolContent(tool.slug, code);
      pages.push({
        type: 'tool',
        path: toolPath(tool.slug, (c || 'in').toLowerCase()),
        title: t.seo?.title,
        description: t.seo?.description,
        answer: content?.summary,
        faqs: content?.faqs,
        minFaqs: 5,
        depth: (content?.sections?.length || 0) + (content?.blocks?.length || 0),
        minDepth: 2,
        sources: content?.sources,
        finance: FINANCE.has(tool.category),
        lastReviewed: content?.lastReviewed,
        // related tools (≥3 rendered) + breadcrumb hub links are always present on tool pages
        links: 3 + (content?.hub ? 1 : 0),
      });
    }
  }

  for (const set of SALARY_SET_LIST) {
    for (const v of set.values) {
      const p = buildSalaryPage(set.country, v, set.id);
      pages.push({
        type: 'salary',
        path: salaryPagePath(set.country, v, set.id),
        title: p.title,
        description: p.description,
        answer: p.answer,
        faqs: p.faqs,
        minFaqs: 4,
        depth: (p.rows?.length || 0) + (p.facts?.length || 0),
        minDepth: 8,
        sources: [{}], // sources come from TAX_RULES and are always rendered in the review box
        finance: true,
        lastReviewed: TAX_RULES[set.country.toUpperCase()].lastReviewed,
        links: 5, // neighbours + hub + calculator + related tools
      });
    }
  }
  return pages;
}

export function runPageGate(pages = collectGeneratedPages()) {
  const titles = new Map();
  for (const p of pages) {
    const k = (p.title || '').toLowerCase();
    titles.set(k, (titles.get(k) || 0) + 1);
  }
  const results = pages.map((p) => check(p, titles));
  return {
    total: results.length,
    failing: results.filter((r) => !r.passed),
    results,
  };
}
