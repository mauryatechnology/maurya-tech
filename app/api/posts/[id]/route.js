import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Post from '@/lib/models/Post';
import ContentVersion from '@/lib/models/ContentVersion';
import { verifyToken, hasPermission, ROLES } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';
import { pingIndexNow } from '@/lib/seo/indexNow';
import { runQualityGate } from '@/lib/content/qualityGate';
import { posts as fallbackPosts } from '@/data/posts';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const post = await Post.findOneAndUpdate(
      {
        $or: [
          { slug: id },
          { customId: id },
          { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
        ],
      },
      { $inc: { viewsCount: 1 } },
      { new: true }
    );

    if (post) {
      return NextResponse.json({ success: true, post });
    }

    const fallback = (fallbackPosts.posts || []).find((p) => p.slug === id || p.id === id);
    if (fallback) {
      return NextResponse.json({ success: true, post: fallback });
    }

    return NextResponse.json({ message: 'Post not found' }, { status: 404 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const token = req.cookies.get('admin_token')?.value;
    const authUser = await verifyToken(token);
    if (!authUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    if (!hasPermission(authUser.role, ROLES.EDITOR)) {
      return NextResponse.json({ message: 'Forbidden: Insufficient privileges' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    await connectToDatabase();

    // 1. Fetch current post before updating to snapshot version history
    const existingPost = await Post.findOne({
      $or: [
        { slug: id },
        { customId: id },
        { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
      ],
    });

    if (!existingPost) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    const currentVersion = existingPost.version || 1;

    // 2. Save immutable ContentVersion snapshot
    await ContentVersion.create({
      postId: existingPost._id,
      version: currentVersion,
      title: existingPost.title,
      content: existingPost.content,
      excerpt: existingPost.excerpt,
      author: existingPost.author,
      changedBy: authUser.email || authUser.username || 'Admin',
      changeSummary: body.changeSummary || `Version ${currentVersion} snapshot prior to edit`,
      qualityScore: existingPost.qualityScore || 0,
    });

    // 3. Update post with whitelisted fields and increment version
    const allowedFields = [
      'title', 'slug', 'content', 'excerpt', 'category', 'tags',
      'coverImage', 'metaTitle', 'metaDescription', 'isPublished',
      'status', 'market', 'readingTime', 'author', 'qualityScore',
      'primaryKeyword', 'faqSchema', 'sources', 'canonicalCountry', 'targetCountries',
      'relatedToolSlug', 'clusterType', 'authorSlug', 'reviewerSlug'
    ];

    const safeUpdates = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        safeUpdates[field] = body[field];
      }
    }
    safeUpdates.version = currentVersion + 1;
    safeUpdates.updatedAt = new Date();

    // 3b. Quality Gate: a post cannot go live unless it passes (plan §6.4).
    //     A superadmin may override explicitly; the override is written to the audit log.
    let quality = null;
    const goingLive = safeUpdates.isPublished === true || safeUpdates.status === 'published';
    if (goingLive) {
      const candidate = { ...existingPost.toObject(), ...safeUpdates, lastReviewedAt: new Date() };
      const others = await Post.find({ _id: { $ne: existingPost._id }, isPublished: true })
        .select('title primaryKeyword')
        .lean();
      quality = runQualityGate(candidate, {
        otherKeywords: others.map((o) => o.primaryKeyword),
        otherTitles: others.map((o) => o.title),
      });
      safeUpdates.qualityScore = quality.score;

      const override = body.overrideQualityGate === true && hasPermission(authUser.role, ROLES.SUPERADMIN);
      if (!quality.passed && !override) {
        safeUpdates.isPublished = false;
        safeUpdates.status = 'review';
      }
    }

    const updatedPost = await Post.findByIdAndUpdate(
      existingPost._id,
      safeUpdates,
      { new: true }
    );

    // 4. Log administrative audit trail
    await logAuditEvent({
      action: body.isPublished && !existingPost.isPublished ? 'publish' : 'update',
      entityType: 'Post',
      entityId: updatedPost._id,
      entityName: updatedPost.title,
      performedBy: authUser.email || 'Admin',
      changes: {
        version: currentVersion + 1,
        status: updatedPost.status,
        ...(quality ? { qualityScore: quality.score, qualityPassed: quality.passed, qualityOverride: body.overrideQualityGate === true } : {}),
      },
      req,
    });

    // 5. Ask IndexNow-enabled engines to recrawl the published URLs (non-blocking)
    if (updatedPost.isPublished) {
      const cc = (updatedPost.canonicalCountry || '').toLowerCase();
      const paths = [`/blog/${updatedPost.slug}`];
      if (['in', 'us', 'uk'].includes(cc)) paths.push(`/${cc}/guides/${updatedPost.slug}`);
      pingIndexNow(paths);
    }

    return NextResponse.json({
      success: true,
      post: updatedPost,
      ...(quality ? { qualityGate: quality } : {}),
      ...(quality && !quality.passed && !updatedPost.isPublished
        ? { message: `Held for review: Quality Gate score ${quality.score}/100${quality.blockers.length ? ` (blocked by: ${quality.blockers.join(', ')})` : ''}.` }
        : {}),
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const token = req.cookies.get('admin_token')?.value;
    const authUser = await verifyToken(token);
    if (!authUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    if (!hasPermission(authUser.role, ROLES.EDITOR)) {
      return NextResponse.json({ message: 'Forbidden: Insufficient privileges' }, { status: 403 });
    }

    const { id } = await params;
    await connectToDatabase();

    const deleted = await Post.findOneAndDelete({
      $or: [
        { slug: id },
        { customId: id },
        { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
      ],
    });

    if (deleted) {
      await logAuditEvent({
        action: 'delete',
        entityType: 'Post',
        entityId: deleted._id,
        entityName: deleted.title,
        performedBy: authUser.email || 'Admin',
        req,
      });
    }

    return NextResponse.json({ success: true, message: 'Post deleted' });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
