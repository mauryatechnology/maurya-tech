import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Project from '@/lib/models/Project';
import { verifyToken, hasPermission, ROLES } from '@/lib/auth';
import { projects as fallbackProjects } from '@/data/projects';

export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    const filter = {};
    if (category && category !== 'All') {
      filter.category = category;
    }
    if (featured === 'true') {
      filter.featured = true;
    }

    const dbProjects = await Project.find(filter).sort({ order: 1, createdAt: -1 });

    if (dbProjects && dbProjects.length > 0) {
      return NextResponse.json({ success: true, projects: dbProjects });
    }

    let list = fallbackProjects.projects || [];
    if (category && category !== 'All') {
      list = list.filter((p) => p.category === category);
    }
    if (featured === 'true') {
      list = list.filter((p) => p.featured);
    }
    return NextResponse.json({ success: true, projects: list });
  } catch (error) {
    console.error('Projects fetch error:', error);
    return NextResponse.json({ success: true, projects: fallbackProjects.projects || [] });
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

    const newProject = await Project.create({
      ...body,
      slug,
    });

    return NextResponse.json({ success: true, project: newProject }, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
