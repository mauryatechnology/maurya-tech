/**
 * Content Quality Gate (plan §6.4). Runs before a page can move to `published`.
 * Pure function: pass the post plus optional context (other pages' keywords/titles)
 * to enable the cannibalisation and uniqueness checks.
 */

const FINANCE_CATEGORIES = /tax|salary|payroll|loan|emi|finance|invest|insurance|pension/i;
const MS_PER_DAY = 86400000;

export function runQualityGate(post = {}, context = {}) {
  const content = post.content || '';
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const isToolGuide = post.clusterType === 'tool_guide';
  const minRequiredWords = isToolGuide ? 800 : 1200;
  const faqs = Array.isArray(post.faqSchema) ? post.faqSchema : post.seo?.faqSchema || [];
  const title = post.metaTitle || post.seo?.title || post.title || '';
  const description = post.metaDescription || post.seo?.description || post.excerpt || '';
  const primaryKeyword = (post.primaryKeyword || post.seo?.primaryKeyword || '').trim().toLowerCase();
  const internalLinks = (content.match(/\]\(\/(?!\/)[^)]+\)/g) || []).length;
  const isFinance = FINANCE_CATEGORIES.test(`${post.category || ''} ${title}`);
  const sources = Array.isArray(post.sources) ? post.sources : [];
  const reviewedAt = post.lastReviewedAt || post.lastReviewed || post.updatedAt;
  const reviewedDaysAgo = reviewedAt ? (Date.now() - new Date(reviewedAt).getTime()) / MS_PER_DAY : Infinity;

  const otherKeywords = (context.otherKeywords || []).map((k) => (k || '').trim().toLowerCase()).filter(Boolean);
  const otherTitles = (context.otherTitles || []).map((t) => (t || '').trim().toLowerCase()).filter(Boolean);

  const checks = {
    minWordCount: {
      passed: wordCount >= minRequiredWords,
      actual: wordCount,
      target: minRequiredWords,
      label: `Word count (min ${minRequiredWords})`,
      weight: 20,
    },
    hasFaq: {
      passed: faqs.length >= 5,
      actual: faqs.length,
      label: 'At least 5 FAQs (shown on page + FAQPage schema)',
      weight: 10,
    },
    hasTable: {
      passed: /\|(.+)\|[\r\n]+\|[-:| ]+\|/.test(content),
      label: 'At least one data table or worked breakdown',
      weight: 10,
    },
    internalLinks: {
      passed: internalLinks >= 3,
      actual: internalLinks,
      label: 'At least 3 internal links (tool, hub, related page)',
      weight: 10,
    },
    hasToolLink: {
      passed: Boolean(post.relatedToolSlug || /\/tools\//.test(content)),
      label: 'Links to a relevant calculator',
      weight: 10,
    },
    hasAuthorAttribution: {
      passed: Boolean((post.author || '').trim().length > 2),
      label: 'Named author',
      weight: 5,
    },
    hasHeadingsHierarchy: {
      passed: (content.match(/^## /gm) || []).length >= 3,
      label: 'At least 3 H2 sections',
      weight: 5,
    },
    titleLength: {
      passed: title.length >= 20 && title.length <= 60,
      actual: title.length,
      label: 'Title 20–60 characters',
      weight: 5,
    },
    descriptionLength: {
      passed: description.length >= 70 && description.length <= 160,
      actual: description.length,
      label: 'Meta description 70–160 characters',
      weight: 5,
    },
    primaryKeyword: {
      passed: Boolean(primaryKeyword),
      label: 'Primary keyword set',
      weight: 5,
    },
    noCannibalisation: {
      passed: !primaryKeyword || !otherKeywords.includes(primaryKeyword),
      label: 'Primary keyword not already targeted by another page',
      weight: 5,
    },
    uniqueTitle: {
      passed: !title || !otherTitles.includes(title.trim().toLowerCase()),
      label: 'Title is unique across the site',
      weight: 5,
    },
    financeSources: {
      passed: !isFinance || sources.length > 0 || /\]\(https?:\/\/[^)]*(gov|nic\.in|irs\.gov|gov\.uk)/i.test(content),
      label: 'Finance pages cite official sources',
      weight: 5,
      required: isFinance,
    },
    financeFreshness: {
      passed: !isFinance || reviewedDaysAgo <= 365,
      label: 'Finance pages reviewed within 12 months',
      weight: 0,
      required: isFinance,
    },
  };

  let score = 0;
  for (const c of Object.values(checks)) if (c.passed) score += c.weight;
  if (!checks.minWordCount.passed && wordCount >= minRequiredWords * 0.7) score += 10;

  // Hard requirements: failing any of these blocks publication regardless of score.
  const blockers = Object.entries(checks)
    .filter(([, c]) => c.required && !c.passed)
    .map(([k]) => k);

  const passedCount = Object.values(checks).filter((c) => c.passed).length;
  const passed = score >= 75 && blockers.length === 0;

  return {
    score,
    passed,
    status: !passed ? (score >= 50 ? 'needs_improvement' : 'rejected') : score >= 85 ? 'excellent' : 'passed',
    passedCount,
    totalChecks: Object.keys(checks).length,
    blockers,
    checks,
  };
}
