import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import connectToDatabase from '@/lib/mongodb';
import Subscriber from '@/lib/models/Subscriber';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { sendMail, isMailConfigured } from '@/lib/emailService';
import { SITE_URL } from '@/lib/seo/schema';

const EMAIL_REGEX = /^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,}$/i;
const TOPICS = {
  IN: 'Union Budget and income-tax slab changes',
  US: 'IRS inflation adjustments, brackets and 401(k) limits',
  UK: 'Budget changes to tax bands and National Insurance',
  GLOBAL: 'calculator updates',
};
const CONSENT_TEXT = 'I agree to receive occasional emails about tax and salary rule changes. Unsubscribe any time.';

// One generic response for every accepted request, so the endpoint never reveals
// whether an address is already on the list.
const ok = (pending) =>
  NextResponse.json({
    success: true,
    message: pending ? 'Check your inbox to confirm your subscription.' : 'You are subscribed. We will only email you when rules change.',
  });

export async function POST(req) {
  const ip = getClientIp(req);
  if (!checkRateLimit(`newsletter-${ip}`, 5, 10 * 60 * 1000).isAllowed) {
    return NextResponse.json({ success: false, message: 'Too many attempts. Please try again later.' }, { status: 429 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid request.' }, { status: 400 });
  }

  // Honeypot: real users never fill this hidden field.
  if (body.website) return ok(isMailConfigured);

  const email = String(body.email || '').trim().toLowerCase();
  const country = ['IN', 'US', 'UK'].includes(String(body.country || '').toUpperCase()) ? String(body.country).toUpperCase() : 'GLOBAL';
  const source = String(body.source || '').slice(0, 200);

  if (!EMAIL_REGEX.test(email) || email.length > 254) {
    return NextResponse.json({ success: false, message: 'Please enter a valid email address.' }, { status: 400 });
  }
  if (body.consent !== true) {
    return NextResponse.json({ success: false, message: 'Please tick the consent box to subscribe.' }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const existing = await Subscriber.findOne({ email });
    // Same response a new sign-up gets, so the form cannot be used to test addresses.
    if (existing?.status === 'subscribed') return ok(isMailConfigured);

    const token = crypto.randomBytes(24).toString('hex');
    const status = isMailConfigured ? 'pending' : 'subscribed';
    await Subscriber.findOneAndUpdate(
      { email },
      {
        email,
        country,
        topics: [TOPICS[country]],
        source,
        status,
        consentText: CONSENT_TEXT,
        consentAt: new Date(),
        token,
        ...(status === 'subscribed' ? { confirmedAt: new Date() } : {}),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    if (status === 'pending') {
      const confirmUrl = `${SITE_URL}/api/newsletter/confirm?token=${token}`;
      const unsubUrl = `${SITE_URL}/api/newsletter/unsubscribe?token=${token}`;
      const sent = await sendMail({
        to: email,
        subject: 'Confirm your tax-change alerts — Maurya Tech',
        html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto">
          <h2 style="color:#0A2540">Confirm your subscription</h2>
          <p>You asked to be told when ${TOPICS[country]} affect our calculators. Click below to confirm:</p>
          <p><a href="${confirmUrl}" style="display:inline-block;background:#0A2540;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none">Confirm subscription</a></p>
          <p style="color:#64748b;font-size:12px">If you did not request this, ignore this email or <a href="${unsubUrl}">remove your address</a>.</p>
        </div>`,
      });
      if (!sent) {
        return NextResponse.json({ success: false, message: 'We could not send the confirmation email. Please try again later.' }, { status: 502 });
      }
    }
    return ok(status === 'pending');
  } catch (err) {
    console.error('Newsletter subscribe error:', err.message);
    return NextResponse.json({ success: false, message: 'Could not subscribe right now. Please try again.' }, { status: 500 });
  }
}
