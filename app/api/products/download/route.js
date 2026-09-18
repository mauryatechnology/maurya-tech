import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import { escapeHtml } from '@/lib/emailService';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return new NextResponse('Invalid or missing download token.', { status: 400 });
    }

    await connectToDatabase();
    const order = await Order.findOne({ downloadToken: token, status: 'paid' });

    if (!order) {
      return new NextResponse('Download token not found or order has not been completed.', { status: 404 });
    }

    if (order.downloadExpiresAt && new Date() > new Date(order.downloadExpiresAt)) {
      return new NextResponse(
        'This download link has expired. Please contact support@maurya-tech.com to request a refresh.',
        { status: 410 }
      );
    }

    // Deliver product kit content based on product SKU
    if (order.productSku === 'career-guide-1on1') {
      const confirmationHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>1-on-1 Career Advisory Booking - Maurya Technologies</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; color: #0f172a; padding: 40px 20px; text-align: center; }
            .card { max-width: 540px; margin: 0 auto; background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
            h1 { font-size: 22px; color: #0f172a; margin-bottom: 8px; }
            p { font-size: 14px; color: #475569; line-height: 1.6; }
            .btn { display: inline-block; background: #0284c7; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 16px; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Session Confirmed!</h1>
            <p>Thank you, <strong>${escapeHtml(order.customerName || 'Engineer')}</strong>. Your 1-on-1 Senior Tech Career Advisory booking (Order ID: ${escapeHtml(order.orderId)}) has been registered.</p>
            <p>Our lead architect will contact you directly at <strong>${escapeHtml(order.customerEmail)}</strong> within 12 hours with your private calendar slot and pre-session review intake form.</p>
            <a href="mailto:support@maurya-tech.com?subject=1-on-1%20Career%20Session%20Booking%20(${encodeURIComponent(order.orderId)})" class="btn">Message Your Advisor</a>
          </div>
        </body>
        </html>
      `;
      return new NextResponse(confirmationHtml, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    // Default: Resume Pack & Salary Negotiation Kit Download
    const sampleGuideContent = `# Maurya Technologies: 2026 Tech Resume & Salary Negotiation Kit

Thank you for your purchase! (Order: ${order.orderId} | Licensed to: ${order.customerEmail})

---

## 1. The High-Impact Bullet Formula (Google XYZ Formula)
- Accomplished [X] as measured by [Y], by doing [Z].
- Weak: "Worked on Flutter mobile app and fixed bugs."
- Strong: "Engineered 14 responsive screens in Flutter using Riverpod, reducing app crash rate by 34% and cutting cold start time by 180ms across 50k+ active Android users."

## 2. ATS Optimization Checklist
1. Use single-column layout (multi-column layouts confuse 80% of legacy ATS parsers).
2. Explicitly include keywords mentioned in the job description (e.g. Next.js, Docker, CI/CD, Jest).
3. Standard section headers: "Experience", "Skills", "Projects", "Education". Avoid fancy creative headers like "My Journey" or "Passions".
4. Always export as clean text PDF.

## 3. Tech Salary Negotiation Framework
- Never give the first number during initial recruiter screening.
- Script: "I want to be respectful of both our time, but right now I am focused on understanding if this role is the right engineering fit. What is the approved budget range for this position?"
- When counter-offering: Always anchor 10-15% above your actual target to leave room for negotiation, and cite market data from our CTC & Hourly calculators.

---
© ${new Date().getFullYear()} Maurya Technologies. All rights reserved.`;

    return new NextResponse(sampleGuideContent, {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Content-Disposition': 'attachment; filename="maurya-tech-resume-negotiation-kit-2026.md"',
      },
    });
  } catch (error) {
    console.error('Download route error:', error);
    return new NextResponse('Internal server error processing download.', { status: 500 });
  }
}
