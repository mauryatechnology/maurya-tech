import connectToDatabase from '@/lib/mongodb';
import Job from '@/lib/models/Job';
import Project from '@/lib/models/Project';
import Post from '@/lib/models/Post';
import { jobs as fallbackJobs } from '@/data/jobs';
import { projects as fallbackProjects } from '@/data/projects';
import { posts as fallbackPosts } from '@/data/posts';
import { authors } from '@/data/authors';
import { toolContent } from '@/data/toolContent';
import { getToolsForCountry } from '@/lib/market/getTool';
import { getGuidesForCountry } from '@/lib/market/getGuide';
import { GLOBAL_TOOL_SLUGS } from '@/lib/seo/related';
import { setsForCountry, salaryPagePath } from '@/lib/programmatic/salary';
import { TAX_RULES } from '@/lib/tax';

const SUPPORTED_COUNTRIES = ['in', 'us', 'uk'];

// lastModified is only set when we actually know when content changed — an always-"now"
// date teaches Google to ignore the field for the whole site.
const iso = (d) => {
  if (!d) return undefined;
  const t = new Date(d);
  return Number.isNaN(t.getTime()) ? undefined : t.toISOString();
};

export default async function sitemap() {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://maurya-tech.com').replace(/\/$/, '');
  const entry = (path, lastModified, priority = 0.7) => ({
    url: `${baseUrl}${path}`,
    ...(iso(lastModified) ? { lastModified: iso(lastModified) } : {}),
    priority,
  });

  const routes = [];

  // 1. Agency pages
  for (const path of ['', '/about', '/services', '/projects', '/products', '/pricing', '/technologies', '/careers', '/blog', '/contact']) {
    routes.push(entry(path, undefined, path === '' ? 1.0 : 0.6));
  }

  // 2. Trust pages + global tools
  routes.push(entry('/methodology', TAX_RULES.IN.lastReviewed, 0.5));
  routes.push(entry('/editorial-policy', undefined, 0.4));
  for (const a of authors) routes.push(entry(`/authors/${a.slug}`, undefined, 0.4));
  routes.push(entry('/tools', undefined, 0.8));
  for (const slug of GLOBAL_TOOL_SLUGS) routes.push(entry(`/tools/${slug}`, toolContent[slug]?.lastReviewed, 0.9));

  // 3. Country hubs, localized tools, guides, salary breakdowns
  for (const country of SUPPORTED_COUNTRIES) {
    routes.push(entry(`/${country}`, undefined, 0.9));
    routes.push(entry(`/${country}/tools`, undefined, 0.8));
    routes.push(entry(`/${country}/guides`, undefined, 0.7));

    try {
      const tools = await getToolsForCountry(country);
      for (const tool of tools) {
        if (GLOBAL_TOOL_SLUGS.includes(tool.slug)) continue;
        if (tool.slug === 'cgpa-calculator' && country !== 'in') continue;
        routes.push(entry(`/${country}/tools/${tool.slug}`, toolContent[tool.slug]?.lastReviewed || tool.updatedAt, 0.9));
      }
    } catch (err) {
      console.warn(`Sitemap tool lookup error for ${country}:`, err.message);
    }

    try {
      const guides = await getGuidesForCountry(country);
      for (const guide of guides) {
        routes.push(entry(`/${country}/guides/${guide.slug}`, guide.lastReviewed || guide.date, 0.8));
      }
    } catch (err) {
      console.warn(`Sitemap guide lookup error for ${country}:`, err.message);
    }

    const sets = setsForCountry(country);
    if (sets.length) {
      const reviewed = TAX_RULES[country.toUpperCase()].lastReviewed;
      routes.push(entry(`/${country}/salary`, reviewed, 0.8));
      for (const set of sets) {
        for (const v of set.values) routes.push(entry(salaryPagePath(country, v, set.id), reviewed, 0.7));
      }
    }
  }

  // 4. Jobs, projects, blog posts (DB first, static fallback)
  let jobs = [];
  let projects = [];
  let posts = [];
  try {
    await connectToDatabase();
    const [dbJobs, dbProjects, dbPosts] = await Promise.all([
      Job.find({ isActive: true }).select('customId slug _id updatedAt').lean(),
      Project.find({ isPublished: true }).select('slug customId _id updatedAt').lean(),
      Post.find({ isPublished: true }).select('slug customId _id updatedAt').lean(),
    ]);
    jobs = dbJobs.map((j) => entry(`/careers/${j.customId || j._id}`, j.updatedAt, 0.6));
    projects = dbProjects.map((p) => entry(`/projects/${p.slug || p.customId || p._id}`, p.updatedAt, 0.6));
    posts = dbPosts.map((b) => entry(`/blog/${b.slug || b.customId || b._id}`, b.updatedAt, 0.6));
  } catch (error) {
    console.warn('Sitemap dynamic query fallback:', error.message);
  }

  if (!jobs.length) {
    jobs = (fallbackJobs.jobs || []).filter((j) => j.isActive).map((job) => entry(`/careers/${job.id}`, job.updatedAt || job.postedDate, 0.6));
  }
  if (!projects.length) {
    projects = (fallbackProjects.projects || []).map((p) => entry(`/projects/${p.slug || p.id}`, p.updatedAt, 0.6));
  }
  if (!posts.length) {
    posts = (fallbackPosts.posts || []).map((p) => entry(`/blog/${p.slug || p.id}`, p.updatedAt || p.date, 0.6));
  }

  return [...routes, ...jobs, ...projects, ...posts];
}
