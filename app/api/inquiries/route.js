import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Inquiry from '@/lib/models/Inquiry';
import { verifyToken, hasPermission, ROLES } from '@/lib/auth';
import { logSecurityEvent } from '@/lib/securityLogger';
import { getClientIp } from '@/lib/rateLimit';

export async function GET(req) {
  try {
    const token = req.cookies.get('admin_token')?.value;
    const authUser = await verifyToken(token);
    if (!authUser) {
      logSecurityEvent({
        eventType: 'UNAUTHORIZED_INQUIRIES_ACCESS',
        ip: getClientIp(req),
        endpoint: '/api/inquiries',
      });
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    if (!hasPermission(authUser.role, ROLES.ADMIN)) {
      return NextResponse.json({ success: false, message: 'Forbidden: Insufficient privileges' }, { status: 403 });
    }

    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const spam = searchParams.get('spam'); // 'clean', 'spam', 'all'

    const filter = {};
    if (type && type !== 'all' && typeof type === 'string') {
      filter.type = type.slice(0, 50);
    }
    if (status && status !== 'all' && typeof status === 'string') {
      filter.status = status.slice(0, 50);
    }
    if (spam === 'clean') {
      filter.isSpam = { $ne: true };
    } else if (spam === 'spam') {
      filter.isSpam = true;
    }

    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50', 10)));
    const skip = (page - 1) * limit;

    const total = await Inquiry.countDocuments(filter);
    const inquiries = await Inquiry.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      count: inquiries.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      inquiries,
    });
  } catch (error) {
    console.error('Inquiries fetch error:', error);
    return NextResponse.json({ success: false, error: 'Failed to retrieve inquiries.' }, { status: 500 });
  }
}
