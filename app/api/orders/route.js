import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import { verifyToken, hasPermission, ROLES } from '@/lib/auth';
import { sendMail, escapeHtml } from '@/lib/emailService';
import { logAuditEvent } from '@/lib/audit';

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
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    await connectToDatabase();

    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { customerEmail: { $regex: escaped, $options: 'i' } },
        { orderId: { $regex: escaped, $options: 'i' } },
        { customerName: { $regex: escaped, $options: 'i' } },
      ];
    }

    const orders = await Order.find(query).sort({ createdAt: -1 }).limit(100).lean();

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error('Fetch orders error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error fetching orders.' },
      { status: 500 }
    );
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
    const { orderId, action } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required.' }, { status: 400 });
    }

    await connectToDatabase();
    const order = await Order.findOne({ orderId });
    if (!order) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }

    if (action === 'resend_email') {
      const downloadUrl = `https://maurya-tech.com/api/products/download?token=${order.downloadToken}`;
      await sendMail({
        to: order.customerEmail,
        subject: `Your Download Refresh: ${order.productTitle}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h3>Hello ${escapeHtml(order.customerName || 'there')},</h3>
            <p>Here is your refreshed download link for <strong>${escapeHtml(order.productTitle)}</strong>:</p>
            <p><a href="${downloadUrl}" style="background: #0284c7; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block;">Download Now</a></p>
          </div>
        `,
      });

      await logAuditEvent({
        action: 'update',
        entityType: 'Order',
        entityId: order._id,
        entityName: `Resent download email for ${order.orderId}`,
        performedBy: authUser.email || 'Admin',
        req,
      });

      return NextResponse.json({ success: true, message: 'Download link resent successfully.' });
    }

    return NextResponse.json({ error: 'Unsupported action.' }, { status: 400 });
  } catch (error) {
    console.error('Order action error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error processing order action.' },
      { status: 500 }
    );
  }
}
