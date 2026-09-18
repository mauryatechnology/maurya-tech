import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import AuditLog from '@/lib/models/AuditLog';
import { verifyToken, hasPermission, ROLES } from '@/lib/auth';

export async function GET(req) {
  try {
    const token = req.cookies.get('admin_token')?.value;
    const authUser = await verifyToken(token);
    if (!authUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    if (!hasPermission(authUser.role, ROLES.ADMIN)) {
      return NextResponse.json({ message: 'Forbidden: Insufficient privileges' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const entityType = searchParams.get('entityType');

    await connectToDatabase();

    const query = {};
    if (entityType && entityType !== 'all') {
      query.entityType = entityType;
    }

    const logs = await AuditLog.find(query).sort({ createdAt: -1 }).limit(100).lean();
    return NextResponse.json({ success: true, logs });
  } catch (error) {
    console.error('Fetch audit logs error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error fetching audit logs.' },
      { status: 500 }
    );
  }
}
