import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Post from '@/lib/models/Post';
import { verifyToken, hasPermission, ROLES } from '@/lib/auth';
import { posts as fallbackPosts } from '@/data/posts';

export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const all = searchParams.get('all') === 'true';
    const category = searchParams.get('category');

    const filter = all ? {} : { isPublished: true };
    if (category && category !== 'All') {
      filter.category = category;
    }

    const dbPosts = await Post.find(filter).sort({ createdAt: -1 });

    if (dbPosts && dbPosts.length > 0) {
      return NextResponse.json({ success: true, posts: dbPosts });
    }

    let list = fallbackPosts.posts || [];
    if (category && category !== 'All') {
      list = list.filter((p) => p.category === category);
    }
    return NextResponse.json({ success: true, posts: list });
  } catch (error) {
    console.error('Posts fetch error:', error);
    return NextResponse.json({ success: true, posts: fallbackPosts.posts || [] });
  }
}


export async function POST(req) {
  try {
    const token = req.cookies.get('admin_token')?.value;
    const authUser = await verifyToken(token);
    if (!authUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    if (!hasPermission(authUser.role, ROLES.EDITOR)) {
      return NextResponse.json({ message: 'Forbidden: Insufficient privileges' }, { status: 403 });
    }

    const body = await req.json();

    if (!body?.title || typeof body.title !== 'string') {
      return NextResponse.json(
        { success: false, message: 'A title is required.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const slug =
      body.slug ||
      body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const newPost = await Post.create({
      ...body,
      slug,
    });

    return NextResponse.json({ success: true, post: newPost }, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
