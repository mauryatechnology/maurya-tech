import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import { getProductBySku } from '@/data/digitalProducts';
import { sendMail, escapeHtml } from '@/lib/emailService';

export async function POST(request) {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = request.headers.get('x-razorpay-signature');

    const rawBody = await request.text();

    // Verify HMAC-SHA256 signature if webhook secret is configured
    if (webhookSecret) {
      if (!signature) {
        return NextResponse.json({ error: 'Missing webhook signature' }, { status: 400 });
      }

      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      if (expectedSignature !== signature) {
        console.error('Razorpay Webhook: Invalid signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
      }
    }

    const eventData = JSON.parse(rawBody);
    const eventType = eventData.event;

    // We listen to payment.captured and order.paid
    if (eventType === 'payment.captured' || eventType === 'order.paid') {
      const paymentEntity = eventData.payload?.payment?.entity;
      const orderEntity = eventData.payload?.order?.entity;
      const orderId = paymentEntity?.order_id || orderEntity?.id;
      const paymentId = paymentEntity?.id || '';

      if (orderId) {
        await connectToDatabase();
        const order = await Order.findOne({ orderId });

        if (order && order.status !== 'paid') {
          const downloadToken = crypto.randomBytes(24).toString('hex');
          const downloadExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

          order.status = 'paid';
          if (paymentId) order.paymentId = paymentId;
          order.downloadToken = downloadToken;
          order.downloadExpiresAt = downloadExpiresAt;
          await order.save();

          // Dispatch confirmation email
          try {
            const product = getProductBySku(order.productSku);
            const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://maurya-tech.com';
            const downloadUrl = `${siteUrl}/api/products/download?token=${downloadToken}`;

            await sendMail({
              to: order.customerEmail,
              subject: `Your Download is Ready: ${product?.title || order.productTitle}`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1e293b;">
                  <h2 style="color: #0A2540; margin-bottom: 8px;">Thank you for your order!</h2>
                  <p>Your payment for <strong>${escapeHtml(product?.title || order.productTitle)}</strong> has been confirmed.</p>
                  
                  <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 24px 0;">
                    <p style="margin: 0 0 8px; font-size: 14px; color: #64748b;">Order Reference: <strong>${escapeHtml(order.orderId)}</strong></p>
                    <p style="margin: 0 0 16px; font-size: 14px; color: #64748b;">Amount Paid: <strong>${escapeHtml(order.currency)} ${escapeHtml(String(order.amount))}</strong></p>
                    <a href="${downloadUrl}" style="display: inline-block; background-color: #00D4B8; color: #020617; font-weight: bold; text-decoration: none; padding: 12px 24px; border-radius: 8px;">
                      Download Your Product Files
                    </a>
                  </div>

                  <p style="font-size: 12px; color: #94a3b8;">
                    This download link is active for 7 days. If you face any issues, reply to this email or contact <a href="mailto:${process.env.SUPPORT_EMAIL || 'support@maurya-tech.com'}">${process.env.SUPPORT_EMAIL || 'support@maurya-tech.com'}</a>.
                  </p>
                </div>
              `,
            });

            order.emailDelivered = true;
            await order.save();
          } catch (emailErr) {
            console.error('Webhook: Failed to send confirmation email:', emailErr);
          }
        }
      }
    }

    return NextResponse.json({ status: 'ok', received: true });
  } catch (error) {
    console.error('Razorpay Webhook handler error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
