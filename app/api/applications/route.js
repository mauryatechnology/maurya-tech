import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Application from '@/lib/models/Application';
import { verifyToken, hasPermission, ROLES } from '@/lib/auth';
import { logSecurityEvent } from '@/lib/securityLogger';
import { getClientIp } from '@/lib/rateLimit';

// Escape regex special characters to prevent NoSQL regex injection attacks
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function GET(req) {
  try {
    const token = req.cookies.get('admin_token')?.value;
    const authUser = await verifyToken(token);
    if (!authUser) {
      logSecurityEvent({
        eventType: 'UNAUTHORIZED_ACCESS_ATTEMPT',
        ip: getClientIp(req),
        endpoint: '/api/applications',
      });
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    if (!hasPermission(authUser.role, ROLES.ADMIN)) {
      return NextResponse.json({ success: false, message: 'Forbidden: Insufficient privileges' }, { status: 403 });
    }

    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const jobId = searchParams.get('jobId');
    const rawSearch = searchParams.get('search');

    const filter = {};
    if (status && status !== 'all' && typeof status === 'string') {
      filter.status = status;
    }
    if (jobId && jobId !== 'all' && typeof jobId === 'string') {
      filter.jobId = jobId;
    }
    if (rawSearch && typeof rawSearch === 'string') {
      const sanitizedSearch = escapeRegex(rawSearch.slice(0, 100).trim());
      filter.$or = [
        { name: { $regex: sanitizedSearch, $options: 'i' } },
        { email: { $regex: sanitizedSearch, $options: 'i' } },
        { jobTitle: { $regex: sanitizedSearch, $options: 'i' } },
      ];
    }

    const applications = await Application.find(filter).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error('Fetch applications error:', error);
    return NextResponse.json({ success: false, error: 'Failed to retrieve applications.' }, { status: 500 });
  }
}
