import { cache } from 'react';
import connectToDatabase from '@/lib/mongodb';
import Tool from '@/lib/models/Tool';
import { defaultTools, localizeTool } from '@/data/tools';

const BRAND_SUFFIX = /\s*\|\s*Maurya Tech(nologies)?\s*$/i;

/**
 * DB records (edited in /admin/tools) win field-by-field, but anything they lack —
 * newer SEO fields, scope/category fixes — falls back to the static definition so an
 * old DB row can never strip a page of content. Mongo ObjectIds/dates are dropped so
 * the result is safe to pass to client components.
 */
function mergeTool(dbTool) {
  const base = defaultTools.find((t) => t.slug === dbTool.slug) || {};
  // DB SEO only wins when an admin actually edited it (seo.customized, set by /api/tools);
  // otherwise it is a stale seed copy and the maintained static SEO is used.
  const seo = dbTool.seo?.customized ? { ...(base.seo || {}), ...dbTool.seo } : { ...(dbTool.seo || {}), ...(base.seo || {}) };
  if (!seo.faqSchema?.length) seo.faqSchema = base.seo?.faqSchema || [];
  if (seo.title) seo.title = seo.title.replace(BRAND_SUFFIX, '');
  return {
    ...base,
    slug: dbTool.slug,
    name: dbTool.name || base.name,
    category: dbTool.category || base.category,
    countries: dbTool.countries?.length ? dbTool.countries : base.countries,
    scope: dbTool.scope || base.scope,
    status: dbTool.status || base.status,
    enabled: dbTool.enabled ?? base.enabled,
    seo,
    updatedAt: dbTool.updatedAt ? new Date(dbTool.updatedAt).toISOString() : undefined,
  };
}

export const getToolBySlug = cache(async (slug, countryCode = 'IN') => {
  const normalizedCountry = (countryCode || 'IN').toUpperCase();

  try {
    await connectToDatabase();
    const dbTool = await Tool.findOne({ slug, enabled: true }).lean();
    if (dbTool) {
      const merged = mergeTool(dbTool);
      if (isToolAvailableForCountry(merged, normalizedCountry)) return localizeTool(merged, normalizedCountry);
    }
  } catch (err) {
    console.warn('Tool DB lookup fallback:', err.message);
  }

  const fallback = defaultTools.find((t) => t.slug === slug && t.enabled);
  if (fallback && isToolAvailableForCountry(fallback, normalizedCountry)) {
    return localizeTool(fallback, normalizedCountry);
  }

  return null;
});

export const getToolsForCountry = cache(async (countryCode = 'IN') => {
  const normalizedCountry = (countryCode || 'IN').toUpperCase();

  try {
    await connectToDatabase();
    const dbTools = await Tool.find({ enabled: true, status: 'published' }).lean();
    if (dbTools && dbTools.length > 0) {
      return withStaticFallbacks(dbTools.map(mergeTool))
        .filter((t) => isToolAvailableForCountry(t, normalizedCountry))
        .map((t) => localizeTool(t, normalizedCountry));
    }
  } catch (err) {
    console.warn('Tools list DB lookup fallback:', err.message);
  }

  return defaultTools
    .filter((t) => t.enabled && isToolAvailableForCountry(t, normalizedCountry))
    .map((t) => localizeTool(t, normalizedCountry));
});

/** Every enabled tool regardless of country (used for GLOBAL /tools routes and sitemaps). */
export const getAllTools = cache(async () => {
  try {
    await connectToDatabase();
    const dbTools = await Tool.find({ enabled: true, status: 'published' }).lean();
    if (dbTools && dbTools.length > 0) return withStaticFallbacks(dbTools.map(mergeTool));
  } catch (err) {
    console.warn('All tools DB lookup fallback:', err.message);
  }
  return defaultTools.filter((t) => t.enabled);
});

/** DB tools plus any static tool the DB does not have yet (so new tools ship without a seed). */
function withStaticFallbacks(dbTools) {
  const have = new Set(dbTools.map((t) => t.slug));
  return [...dbTools.filter((t) => t.enabled !== false), ...defaultTools.filter((t) => t.enabled && !have.has(t.slug))];
}

function isToolAvailableForCountry(tool, countryCode) {
  if (tool.scope === 'GLOBAL') return true;
  if (Array.isArray(tool.countries)) {
    return tool.countries.map((c) => c.toUpperCase()).includes(countryCode);
  }
  return true;
}
