import { defaultTools, localizeTool } from '@/data/tools';
import { defaultGuides } from '@/data/guides';
import { SALARY_SETS } from '@/lib/programmatic/salary';
import { SITE_URL } from '@/lib/seo/schema';
import { toolPath } from '@/lib/seo/related';

export const dynamic = 'force-static';

// llms.txt (https://llmstxt.org): a plain-text map of the site's most useful pages
// for AI assistants and answer engines.
export function GET() {
  const tools = defaultTools
    .filter((t) => t.enabled)
    .flatMap((t) => {
      const countries = t.scope === 'GLOBAL' ? [null] : (t.countries || ['IN']).map((c) => c.toLowerCase());
      return countries.map((c) => {
        const lt = c ? localizeTool(t, c) : t;
        return `- [${lt.name}${c ? ` (${c.toUpperCase()})` : ''}](${SITE_URL}${toolPath(t.slug, c || 'in')}): ${lt.seo?.description || ''}`;
      });
    });

  const guides = defaultGuides.map(
    (g) => `- [${g.title}](${SITE_URL}/${g.country.toLowerCase()}/guides/${g.slug}): ${g.excerpt}`
  );

  const hubs = Object.keys(SALARY_SETS).map((c) => `- [Salary breakdowns — ${c.toUpperCase()}](${SITE_URL}/${c}/salary)`);

  const body = `# Maurya Tech

> Free salary, tax, loan and everyday calculators for India, the United States and the United Kingdom, with country-specific rules (India new tax regime FY 2026-27, US federal tax year 2026, UK 2026/27 PAYE). All calculations run in the browser.

## Calculators
${tools.join('\n')}

## Salary breakdowns
${hubs.join('\n')}

## Guides
${guides.join('\n')}

## About
- [How our calculators work](${SITE_URL}/methodology)
- [Editorial policy](${SITE_URL}/editorial-policy)
`;

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
