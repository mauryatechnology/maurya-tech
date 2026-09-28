import { cache } from 'react';
import connectToDatabase from '@/lib/mongodb';
import Post from '@/lib/models/Post';
import { defaultGuides, getGuidesForCountry as getFallbackGuides, getGuideBySlug as getFallbackGuide } from '@/data/guides';

export const getGuideBySlug = cache(async (slug, countryCode = 'IN') => {
  const normalizedCountry = (countryCode || 'IN').toUpperCase();

  try {
    await connectToDatabase();
    const dbPost = await Post.findOne({
      slug,
      isPublished: true,
      $or: [
        { canonicalCountry: normalizedCountry },
        { targetCountries: normalizedCountry },
        { canonicalCountry: 'GLOBAL' },
      ],
    }).lean();

    if (dbPost) {
      return {
        slug: dbPost.slug,
        title: dbPost.title,
        excerpt: dbPost.excerpt,
        content: dbPost.content,
        country: dbPost.canonicalCountry || normalizedCountry,
        language: dbPost.language || 'en',
        category: dbPost.category || 'Technology',
        clusterType: dbPost.clusterType || 'spoke',
        relatedToolSlug: dbPost.relatedToolSlug || '',
        author: dbPost.author || 'Maurya Technologies Team',
        authorRole: 'Engineering Team',
        authorSlug: dbPost.authorSlug || 'editorial-team',
        reviewerSlug: dbPost.reviewerSlug || '',
        lastReviewed: dbPost.lastReviewedAt ? new Date(dbPost.lastReviewedAt).toISOString().split('T')[0] : undefined,
        sources: (dbPost.sources || []).map((s) => ({ name: s.name, url: s.url })),
        readTime: dbPost.readTime || '5 min read',
        date: dbPost.date || new Date(dbPost.createdAt).toISOString().split('T')[0],
        seo: {
          title: dbPost.title,
          description: dbPost.excerpt,
          faqSchema: dbPost.faqSchema || [],
        },
      };
    }
  } catch (err) {
    console.warn('Guide DB lookup fallback:', err.message);
  }

  return getFallbackGuide(slug, normalizedCountry);
});

export const getGuidesForCountry = cache(async (countryCode = 'IN') => {
  const normalizedCountry = (countryCode || 'IN').toUpperCase();

  try {
    await connectToDatabase();
    const dbPosts = await Post.find({
      isPublished: true,
      $or: [
        { canonicalCountry: normalizedCountry },
        { targetCountries: normalizedCountry },
      ],
    }).lean();

    if (dbPosts && dbPosts.length > 0) {
      const mapped = dbPosts.map((p) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        category: p.category,
        clusterType: p.clusterType,
        author: p.author,
        readTime: p.readTime,
        date: p.date,
      }));
      // Merge with fallback guides if needed
      const fallbacks = getFallbackGuides(normalizedCountry);
      const combined = [...mapped];
      for (const fb of fallbacks) {
        if (!combined.some((c) => c.slug === fb.slug)) {
          combined.push(fb);
        }
      }
      return combined;
    }
  } catch (err) {
    console.warn('Guides list DB lookup fallback:', err.message);
  }

  return getFallbackGuides(normalizedCountry);
});
