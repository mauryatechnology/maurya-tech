import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Job from '@/lib/models/Job';
import { verifyToken, hasPermission, ROLES } from '@/lib/auth';
import { jobs as fallbackJobs } from '@/data/jobs';

export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const all = searchParams.get('all') === 'true';

    const filter = all ? {} : { isActive: true };
    const dbJobs = await Job.find(filter).sort({ order: 1, createdAt: -1 });

    if (dbJobs && dbJobs.length > 0) {
      return NextResponse.json({ success: true, jobs: dbJobs });
    }

    // Fallback to static data if database is not yet populated
    const staticList = all ? fallbackJobs.jobs : fallbackJobs.jobs.filter((j) => j.isActive);
    return NextResponse.json({ success: true, jobs: staticList });
  } catch (error) {
    console.error('Fetch jobs error:', error);
    // Safe fallback to static data on DB connection error
    return NextResponse.json({ success: true, jobs: fallbackJobs.jobs.filter((j) => j.isActive) });
  }
}

export async function POST(req) {
  try {
    const token = req.cookies.get('admin_token')?.value;
    const authUser = await verifyToken(token);
    if (!authUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    if (!hasPermission(authUser.role, ROLES.ADMIN)) {
      return NextResponse.json({ message: 'Forbidden: Insufficient privileges' }, { status: 403 });
    }

    const body = await req.json();
    await connectToDatabase();

    const customId = body.id || Date.now().toString();
    const newJob = await Job.create({
      ...body,
      customId,
    });

    return NextResponse.json({ success: true, job: newJob }, { status: 201 });
  } catch (error) {
    console.error('Create job error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
