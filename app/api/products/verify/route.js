import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import { getProductBySku } from '@/data/digitalProducts';
import { sendMail, escapeHtml } from '@/lib/emailService';

export async function POST(request) {
  try {
    const body = await request.json();
    const { orderId, paymentId = '', signature = '' } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required.' }, { status: 400 });
    }

    await connectToDatabase();
    const order = await Order.findOne({ orderId });

    if (!order) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }

    if (order.status === 'paid') {
      return NextResponse.json({
        success: true,
        message: 'Order already verified.',
        downloadUrl: `/api/products/download?token=${order.downloadToken}`,
      });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const isProduction = process.env.NODE_ENV === 'production';
    const isDemoOrder = orderId.startsWith('demo_order_');

    if (isProduction && isDemoOrder) {
      return NextResponse.json(
        { error: 'Demo orders are strictly not permitted in production mode.' },
        { status: 403 }
      );
    }

    if (!isDemoOrder) {
      if (!keySecret) {
        return NextResponse.json(
          { error: 'Payment verification secret is not configured.' },
          { status: 500 }
        );
      }

      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      if (generatedSignature !== signature) {
        return NextResponse.json(
          { error: 'Invalid payment signature. Verification failed.' },
          { status: 400 }
        );
      }
    }

    // Generate secure download token valid for 7 days
    const downloadToken = crypto.randomBytes(24).toString('hex');
    const downloadExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    order.status = 'paid';
    order.paymentId = paymentId || `pay_${crypto.randomBytes(8).toString('hex')}`;
    order.signature = signature;
    order.downloadToken = downloadToken;
    order.downloadExpiresAt = downloadExpiresAt;
    await order.save();

    const product = getProductBySku(order.productSku);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://maurya-tech.com';
    const downloadUrl = `${siteUrl}/api/products/download?token=${downloadToken}`;

    // Dispatch automated delivery email via nodemailer
    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1e293b; background-color: #f8fafc; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #0f172a; margin: 0; font-size: 22px;">Maurya Technologies</h2>
          <p style="color: #0284c7; font-size: 14px; margin-top: 4px; font-weight: 600;">Order Confirmation & Instant Delivery</p>
        </div>

        <div style="background-color: #ffffff; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
          <h3 style="color: #0f172a; margin-top: 0;">Thank you for your purchase, ${escapeHtml(order.customerName || 'there')}!</h3>
          <p style="font-size: 14px; color: #475569; line-height: 1.6;">
            Your payment for <strong>${escapeHtml(order.productTitle || product?.title || 'Digital Product')}</strong> has been confirmed.
          </p>

          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0; font-size: 13px; color: #166534; font-weight: 600;">
              Order ID: ${escapeHtml(order.orderId)}<br/>
              Amount Paid: ${escapeHtml(order.currency)} ${escapeHtml(String(order.amount))}
            </p>
          </div>

          <div style="text-align: center; margin: 28px 0;">
            <a href="${downloadUrl}" style="background-color: #0284c7; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-size: 15px; font-weight: bold; display: inline-block;">
              Download Your Assets Now &rarr;
            </a>
          </div>

          <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">
            This download link is active for 7 days. If you ever need it refreshed, reply directly to this email.
          </p>
        </div>

        <div style="text-align: center; margin-top: 24px; font-size: 12px; color: #94a3b8;">
          <p>&copy; ${new Date().getFullYear()} Maurya Technologies. All rights reserved.</p>
        </div>
      </div>
    `;

    try {
      const emailSent = await sendMail({
        to: order.customerEmail,
        subject: `Your Download: ${product?.title || 'Maurya Technologies Digital Product'}`,
        html: emailHtml,
      });

      if (emailSent) {
        order.emailDelivered = true;
        await order.save();
      }
    } catch (mailErr) {
      console.warn('Post-checkout email delivery warning:', mailErr.message);
    }

    return NextResponse.json({
      success: true,
      downloadUrl: `/api/products/download?token=${downloadToken}`,
      downloadToken,
      message: 'Payment verified successfully. Assets ready for download.',
    });
  } catch (error) {
    console.error('Verify API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error during verification.' },
      { status: 500 }
    );
  }
}
