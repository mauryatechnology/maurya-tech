import { NextResponse } from 'next/server';
import { sendMail, escapeHtml } from '@/lib/emailService';
import connectToDatabase from '@/lib/mongodb';
import Inquiry from '@/lib/models/Inquiry';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { verifyTurnstileToken } from '@/lib/turnstile';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Only these fields are persisted, each length-capped, so a crafted payload
// cannot inject arbitrary schema fields or store unbounded documents.
const INQUIRY_FIELDS = {
  name: 100, email: 100, subject: 200, message: 5000,
  contactName: 100, workEmail: 100, companyName: 150, jobTitle: 100,
  service: 100, budget: 100, details: 5000,
  fullName: 100, officialEmail: 100, organization: 150, partnershipType: 100,
};

function sanitizeInquiry(data) {
  const clean = {};
  for (const [field, maxLength] of Object.entries(INQUIRY_FIELDS)) {
    const value = data[field];
    if (typeof value === 'string' && value.trim()) {
      clean[field] = value.trim().slice(0, maxLength);
    }
  }
  return clean;
}


function calculateSpamScore(data) {
  let score = 0;
  const name = (data.name || data.contactName || data.fullName || '').trim();
  const email = (data.email || data.workEmail || data.officialEmail || '').trim().toLowerCase();
  const text = `${data.subject || ''} ${data.message || ''} ${data.details || ''}`.toLowerCase();

  // Heuristic 1: Almost no vowels in name or excessive consonant clusters (random string bots)
  if (name.length >= 4) {
    const vowels = (name.match(/[aeiouyAEIOUY]/g) || []).length;
    if (vowels / name.length < 0.15) score += 40;
    if (/^[A-Z0-9\s_-]+$/.test(name) && name.length > 8) score += 25;
  }

  // Heuristic 2: Gmail dot trick or 4+ digits in email username
  const localPart = email.split('@')[0] || '';
  const dotCount = (localPart.match(/\./g) || []).length;
  if (dotCount >= 3) score += 35;
  if (/\d{4,}/.test(localPart)) score += 25;

  // Heuristic 3: Common spam keywords
  const spamKeywords = [
    'crypto', 'bitcoin', 'forex', 'casino', 'viagra', 'seo ranking guarantee',
    'backlinks package', 'guest post outreach', 'telegram:', 'whatsapp us for loan',
    'adult dating', 'earn $', 'make money fast', 'poker', 'porn'
  ];
  if (spamKeywords.some((kw) => text.includes(kw))) {
    score += 50;
  }

  // Heuristic 4: Cyrillic / Russian spam characters in general English agency form
  if (/[\u0400-\u04FF]/.test(text) || /[\u0400-\u04FF]/.test(name)) {
    score += 45;
  }

  // Heuristic 5: Excessive links (2+ URLs in message)
  const links = (text.match(/https?:\/\//g) || []).length;
  if (links >= 2) score += 30;

  return Math.min(score, 100);
}

export async function POST(req) {
  try {
    // 1. Rate Limiting Check (Max 5 submissions per 5 minutes per IP)
    const clientIp = getClientIp(req);
    const rateCheck = checkRateLimit(`contact-${clientIp}`, 5, 5 * 60 * 1000);

    if (!rateCheck.isAllowed) {
      return NextResponse.json(
        {
          success: false,
          message: `Too many submissions. Please wait ${rateCheck.resetInSeconds} seconds before sending another message.`,
        },
        { status: 429 }
      );
    }

    const payload = await req.json();
    const { type, data } = payload;

    if (!data) {
      return NextResponse.json({ success: false, message: 'Invalid payload.' }, { status: 400 });
    }

    // 2. Honeypot check: If the hidden honeypot field is filled, it's 100% an automated bot
    const honeypot = data.website_hp || data._hp || payload.honeypot;
    if (honeypot && String(honeypot).trim().length > 0) {
      console.warn(`[Anti-Spam] Bot trapped by honeypot field from IP ${clientIp}. Silently dropped.`);
      // Return fake 200 OK so the bot script thinks it succeeded without retrying
      return NextResponse.json(
        { success: true, message: 'Message sent successfully. We will get back to you within 24 hours.' },
        { status: 200 }
      );
    }

    // 2.5 Cloudflare Turnstile Bot Challenge (2nd layer of defense)
    const turnstileToken = payload.turnstileToken || data.turnstileToken;
    const turnstileCheck = await verifyTurnstileToken(turnstileToken, clientIp);
    if (!turnstileCheck.success) {
      return NextResponse.json(
        { success: false, message: turnstileCheck.error || 'Security verification failed. Please try again.' },
        { status: 403 }
      );
    }

    // 3. Validate email depending on type
    const contactEmail = data.email || data.workEmail || data.officialEmail;
    if (contactEmail && !EMAIL_REGEX.test(contactEmail.trim())) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    // 4. Calculate spam score & source context
    const spamScore = calculateSpamScore(data);
    const isSpam = spamScore >= 60;
    const sourceCountry = req.headers.get('x-vercel-ip-country') || req.headers.get('cf-ipcountry') || 'Unknown';
    const sourcePage = data.sourcePage || req.headers.get('referer') || '/contact';

    // 5. Store in MongoDB with spam heuristics
    try {
      await connectToDatabase();
      await Inquiry.create({
        type: type || 'user',
        ...sanitizeInquiry(data),
        sourceCountry,
        sourcePage,
        spamScore,
        isSpam,
      });
    } catch (dbError) {
      console.error('MongoDB Inquiry Save Error:', dbError);
    }

    // 6. If flagged as spam, suppress the notification email to keep inbox clean
    if (isSpam) {
      console.warn(`[Anti-Spam] Inquiry flagged as likely spam (score: ${spamScore}/100). Email notification suppressed.`);
      return NextResponse.json(
        { success: true, message: 'Message sent successfully. We will get back to you within 24 hours.' },
        { status: 200 }
      );
    }

    // 4. Prepare and Send Email Notification
    let subject = '';
    let htmlContent = '';

    if (type === 'user') {
      subject = `New User Inquiry from ${data.name || 'Visitor'}`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
          <h2 style="color: #0f172a;">General User Inquiry</h2>
          <p><strong>Name:</strong> ${escapeHtml(data.name) || 'N/A'}</p>
          <p><strong>Email:</strong> <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></p>
          <p><strong>Subject:</strong> ${escapeHtml(data.subject) || 'N/A'}</p>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 15px 0;" />
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap; background-color: #f8fafc; padding: 12px; border-radius: 6px;">${escapeHtml(data.message) || 'N/A'}</p>
        </div>
      `;
    } else if (type === 'company') {
      subject = `New Project Request from ${data.companyName || 'Company'}`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
          <h2 style="color: #0f172a;">Company Project Inquiry</h2>
          <p><strong>Contact Name:</strong> ${escapeHtml(data.contactName) || 'N/A'}</p>
          <p><strong>Work Email:</strong> <a href="mailto:${escapeHtml(data.workEmail)}">${escapeHtml(data.workEmail)}</a></p>
          <p><strong>Company Name:</strong> ${escapeHtml(data.companyName) || 'N/A'}</p>
          <p><strong>Job Title:</strong> ${escapeHtml(data.jobTitle) || 'N/A'}</p>
          <p><strong>Service Needed:</strong> ${escapeHtml(data.service) || 'N/A'}</p>
          <p><strong>Estimated Budget:</strong> ${escapeHtml(data.budget) || 'N/A'}</p>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 15px 0;" />
          <p><strong>Project Details:</strong></p>
          <p style="white-space: pre-wrap; background-color: #f8fafc; padding: 12px; border-radius: 6px;">${escapeHtml(data.details) || 'N/A'}</p>
        </div>
      `;
    } else if (type === 'sales') {
      subject = `New Partnership Inquiry from ${data.organization || 'Partner'}`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
          <h2 style="color: #0f172a;">Partnership / Sales Inquiry</h2>
          <p><strong>Full Name:</strong> ${escapeHtml(data.fullName) || 'N/A'}</p>
          <p><strong>Official Email:</strong> <a href="mailto:${escapeHtml(data.officialEmail)}">${escapeHtml(data.officialEmail)}</a></p>
          <p><strong>Organization:</strong> ${escapeHtml(data.organization) || 'N/A'}</p>
          <p><strong>Partnership Type:</strong> ${escapeHtml(data.partnershipType) || 'N/A'}</p>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 15px 0;" />
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap; background-color: #f8fafc; padding: 12px; border-radius: 6px;">${escapeHtml(data.message) || 'N/A'}</p>
        </div>
      `;
    } else {
      return NextResponse.json({ success: false, message: 'Invalid submission type' }, { status: 400 });
    }

    await sendMail({ subject, html: htmlContent, replyTo: contactEmail });

    return NextResponse.json({ success: true, message: 'Message sent successfully. We will get back to you within 24 hours.' }, { status: 200 });
  } catch (error) {
    console.error('Contact Route Error:', error);
    return NextResponse.json({ success: false, message: 'Error sending inquiry. Please try again.' }, { status: 500 });
  }
}
