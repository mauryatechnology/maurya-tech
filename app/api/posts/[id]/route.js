import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Post from '@/lib/models/Post';
import ContentVersion from '@/lib/models/ContentVersion';
import { verifyToken } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';
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

    // 3. Update post and increment version
    const updatedPost = await Post.findByIdAndUpdate(
      existingPost._id,
      {
        ...body,
        version: currentVersion + 1,
      },
      { new: true }
    );

    // 4. Log administrative audit trail
    await logAuditEvent({
      action: body.isPublished && !existingPost.isPublished ? 'publish' : 'update',
      entityType: 'Post',
      entityId: updatedPost._id,
      entityName: updatedPost.title,
      performedBy: authUser.email || 'Admin',
      changes: { version: currentVersion + 1, status: updatedPost.status },
      req,
    });

    return NextResponse.json({ success: true, post: updatedPost });
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
