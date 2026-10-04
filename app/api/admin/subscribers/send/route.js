import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Subscriber from '@/lib/models/Subscriber';
import { verifyToken, hasPermission, ROLES } from '@/lib/auth';
import { sendMail, isMailConfigured, escapeHtml } from '@/lib/emailService';
import { logAuditEvent } from '@/lib/audit';
import { SITE_URL } from '@/lib/seo/schema';

const COUNTRIES = ['IN', 'US', 'UK', 'GLOBAL'];
const BATCH = 100; // per request, so one call stays well inside the function time limit
const CAMPAIGN_RE = /^[a-z0-9-]{8,64}$/;

function renderEmail({ subject, body, link, unsubUrl }) {
  const paragraphs = escapeHtml(body)
    .split(/\n{2,}/)
    .map((p) => `<p>${p.replace(/\n/g, '<br>')}</p>`)
    .join('');
  const cta = link
    ? `<p><a href="${escapeHtml(link)}" style="display:inline-block;background:#0A2540;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none">Open the updated calculator</a></p>`
    : '';
  return `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#0f172a">
    <h2 style="color:#0A2540">${escapeHtml(subject)}</h2>${paragraphs}${cta}
    <p style="color:#64748b;font-size:12px">You get this because you asked to be told when tax rules change. <a href="${unsubUrl}">Unsubscribe</a>.</p>
  </div>`;
}

/**
 * Sends a rule-change alert to confirmed subscribers of the chosen countries.
 * Resumable: each delivered address is tagged with the campaign ID, so the admin page
 * calls this repeatedly until `remaining` is 0 and nobody is mailed twice.
 * With `testTo`, sends one copy to that address only.
 */
export async function POST(req) {
  const authUser = await verifyToken(req.cookies.get('admin_token')?.value);
  if (!authUser) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  if (!hasPermission(authUser.role, ROLES.ADMIN)) {
    return NextResponse.json({ success: false, message: 'Forbidden: Insufficient privileges' }, { status: 403 });
  }
  if (!isMailConfigured) {
    return NextResponse.json({ success: false, message: 'SMTP is not configured — set SMTP_USER and SMTP_PASS first.' }, { status: 400 });
  }

  let input;
  try {
    input = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid request.' }, { status: 400 });
  }

  const subject = String(input.subject || '').trim().slice(0, 150);
  const body = String(input.body || '').trim().slice(0, 5000);
  const link = String(input.link || '').trim();
  const countries = (Array.isArray(input.countries) ? input.countries : []).filter((c) => COUNTRIES.includes(c));
  const campaignId = String(input.campaignId || '');

  if (!subject || !body) return NextResponse.json({ success: false, message: 'Subject and message are required.' }, { status: 400 });
  if (link && !link.startsWith(`${SITE_URL}/`) && !link.startsWith('/')) {
    return NextResponse.json({ success: false, message: 'The link must point to this site.' }, { status: 400 });
  }
  const absLink = link.startsWith('/') ? `${SITE_URL}${link}` : link;

  if (input.testTo) {
    const to = String(input.testTo).trim();
    const ok = await sendMail({ to, subject: `[TEST] ${subject}`, html: renderEmail({ subject, body, link: absLink, unsubUrl: `${SITE_URL}/api/newsletter/unsubscribe` }) });
    return NextResponse.json({ success: ok, message: ok ? `Test sent to ${to}.` : 'Test email failed — check SMTP settings.' });
  }

  if (!countries.length) return NextResponse.json({ success: false, message: 'Choose at least one country.' }, { status: 400 });
  if (!CAMPAIGN_RE.test(campaignId)) return NextResponse.json({ success: false, message: 'Invalid campaign ID.' }, { status: 400 });

  try {
    await connectToDatabase();
    const query = { status: 'subscribed', country: { $in: countries }, alertsSent: { $ne: campaignId } };
    const batch = await Subscriber.find(query).select('email token').limit(BATCH).lean();

    let sent = 0;
    let failed = 0;
    for (const s of batch) {
      const unsubUrl = `${SITE_URL}/api/newsletter/unsubscribe?token=${s.token}`;
      const ok = await sendMail({
        to: s.email,
        subject,
        html: renderEmail({ subject, body, link: absLink, unsubUrl }),
        list: { unsubscribe: { url: unsubUrl, comment: 'Unsubscribe' } },
        headers: { 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' },
      });
      // Tag failures too, so one bad address cannot stall the campaign forever.
      await Subscriber.updateOne({ _id: s._id }, { $addToSet: { alertsSent: campaignId } });
      if (ok) sent++;
      else failed++;
    }

    const remaining = await Subscriber.countDocuments(query);
    if (!remaining) {
      await logAuditEvent({
        action: 'publish',
        entityType: 'Subscriber',
        entityId: campaignId,
        entityName: subject,
        performedBy: authUser.email || 'Admin',
        changes: { countries, link: absLink },
        req,
      });
    }
    return NextResponse.json({ success: true, sent, failed, remaining });
  } catch (error) {
    console.error('Send alert error:', error.message);
    return NextResponse.json({ success: false, message: 'Sending failed. Please try again — already-sent addresses are skipped.' }, { status: 500 });
  }
}
