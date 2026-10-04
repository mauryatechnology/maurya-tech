/**
 * Internal-linking engine (plan T14). Related links are curated per topic cluster and
 * filtered to what actually exists for the visitor's country, so every tool, guide and
 * programmatic page links sideways (related tools), up (hub) and down (guides/values).
 */
import { defaultTools, localizeTool } from '@/data/tools';
import { defaultGuides } from '@/data/guides';
import { SALARY_SETS, salaryPagePath } from '@/lib/programmatic/salary';

export const GLOBAL_TOOL_SLUGS = ['percentage-calculator', 'age-calculator', 'unit-converter'];

/** Canonical URL for a tool: GLOBAL tools live once at /tools/<slug>. */
export function toolPath(slug, country = 'in') {
  return GLOBAL_TOOL_SLUGS.includes(slug) ? `/tools/${slug}` : `/${country.toLowerCase()}/tools/${slug}`;
}

const CLUSTERS = {
  salary: ['ctc-calculator', 'income-tax-calculator', 'us-paycheck-calculator', 'hourly-to-annual-salary', 'student-loan-calculator', '401k-calculator', 'freelance-rate-calculator', 'percentage-calculator'],
  finance: ['mortgage-calculator', 'sip-calculator', 'ppf-calculator', 'fd-calculator', '401k-calculator', 'emi-calculator', 'us-paycheck-calculator', 'income-tax-calculator', 'ctc-calculator', 'student-loan-calculator', 'gst-calculator', 'sales-tax-calculator', 'vat-calculator', 'percentage-calculator'],
  career: ['ats-resume-checker', 'resume-builder', 'ctc-calculator', 'hourly-to-annual-salary', 'cgpa-calculator'],
  education: ['cgpa-calculator', 'percentage-calculator', 'resume-builder'],
  utility: ['percentage-calculator', 'gst-calculator', 'sales-tax-calculator', 'vat-calculator', 'age-calculator', 'unit-converter'],
};

const TOOL_CLUSTER = {
  'ctc-calculator': 'salary',
  'hourly-to-annual-salary': 'salary',
  'freelance-rate-calculator': 'salary',
  'us-paycheck-calculator': 'salary',
  'income-tax-calculator': 'salary',
  'emi-calculator': 'finance',
  'mortgage-calculator': 'finance',
  'sip-calculator': 'finance',
  'fd-calculator': 'finance',
  'ppf-calculator': 'finance',
  '401k-calculator': 'finance',
  'student-loan-calculator': 'salary',
  'gst-calculator': 'finance',
  'sales-tax-calculator': 'finance',
  'vat-calculator': 'finance',
  'ats-resume-checker': 'career',
  'resume-builder': 'career',
  'cgpa-calculator': 'education',
  'percentage-calculator': 'utility',
  'age-calculator': 'utility',
  'unit-converter': 'utility',
};

function availableIn(tool, country) {
  if (!tool || !tool.enabled) return false;
  if (GLOBAL_TOOL_SLUGS.includes(tool.slug)) return true;
  return (tool.countries || []).map((c) => c.toUpperCase()).includes(country.toUpperCase());
}

export function relatedTools(slug, country = 'in', limit = 5) {
  const cluster = CLUSTERS[TOOL_CLUSTER[slug]] || CLUSTERS.utility;
  const pool = [...cluster, ...CLUSTERS.career, ...CLUSTERS.utility];
  const seen = new Set([slug]);
  const out = [];
  for (const s of pool) {
    if (seen.has(s)) continue;
    seen.add(s);
    const tool = defaultTools.find((t) => t.slug === s);
    if (!availableIn(tool, country)) continue;
    const lt = localizeTool(tool, country);
    out.push({ name: lt.name, href: toolPath(s, country), description: lt.seo?.description || '' });
    if (out.length >= limit) break;
  }
  return out;
}

export function relatedGuides({ country = 'in', toolSlug, excludeSlug, limit = 3 }) {
  const code = country.toUpperCase();
  const guides = defaultGuides.filter((g) => g.country === code && g.slug !== excludeSlug);
  guides.sort((a, b) => Number(b.relatedToolSlug === toolSlug) - Number(a.relatedToolSlug === toolSlug));
  return guides.slice(0, limit).map((g) => ({
    name: g.title,
    href: `/${country.toLowerCase()}/guides/${g.slug}`,
    description: g.excerpt,
  }));
}

/** Programmatic salary pages relevant to a tool, for "popular breakdowns" link lists. */
export function salaryLinks(country = 'in', limit = 12) {
  const c = country.toLowerCase();
  const set = SALARY_SETS[c];
  if (!set) return [];
  const vals = set.values;
  const step = Math.max(1, Math.floor(vals.length / limit));
  const picks = vals.filter((_, i) => i % step === 0).slice(0, limit);
  return picks.map((v) => ({ name: set.label(v), href: salaryPagePath(c, v) }));
}

export const SALARY_TOOL_FOR_COUNTRY = {
  in: 'ctc-calculator',
  us: 'hourly-to-annual-salary',
  uk: 'ctc-calculator',
};
