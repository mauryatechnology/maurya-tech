import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectToDatabase from '@/lib/mongodb';
import User from '@/lib/models/User';
import { sendMail } from '@/lib/emailService';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { logSecurityEvent } from '@/lib/securityLogger';

export async function POST(req) {
  const clientIp = getClientIp(req);

  try {
    // 1. Rate Limiting (Max 3 reset requests per 10 minutes per IP)
    const rateCheck = checkRateLimit(`forgot-pw-${clientIp}`, 3, 10 * 60 * 1000);
    if (!rateCheck.isAllowed) {
      return NextResponse.json(
        {
          success: false,
          message: `Too many password reset requests. Please wait ${rateCheck.resetInSeconds} seconds before trying again.`,
        },
        { status: 429 }
      );
    }

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Please provide a registered admin email address.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    // Always respond with a generic success message to prevent user enumeration attacks
    if (!user) {
      logSecurityEvent({
        eventType: 'FORGOT_PASSWORD_UNKNOWN_EMAIL',
        ip: clientIp,
        endpoint: '/api/auth/forgot-password',
        details: { attemptedEmail: normalizedEmail },
      });

      return NextResponse.json(
        {
          success: true,
          message: 'If the provided email is registered, a secure reset link has been dispatched.',
        },
        { status: 200 }
      );
    }

    // 2. Generate secure one-time reset token (valid for 15 minutes)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedResetToken;
    user.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
    await user.save();

    // 3. Construct reset URL using configured site URL to prevent header poisoning
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://maurya-tech.com';
    const resetUrl = `${baseUrl}/admin/reset-password?token=${resetToken}`;

    const subject = '🔐 Password & Security PIN Reset Request - Maurya Technologies';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #0f172a; margin-bottom: 8px;">Admin Account Recovery</h2>
        <p style="color: #475569; font-size: 14px; margin-bottom: 20px;">
          You requested to reset your password and/or 6-digit Master Security PIN for Maurya Technologies Admin Portal.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #0284c7; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px; display: inline-block;">
            Reset Password & Security PIN
          </a>
        </div>

        <p style="color: #64748b; font-size: 13px; line-height: 1.5;">
          This secure link is valid for <strong>15 minutes</strong>. If you did not initiate this request, please ignore this email. Your credentials remain safe.
        </p>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 11px; color: #94a3b8; word-break: break-all;">
          Or copy and paste this link in your browser:<br />
          <a href="${resetUrl}" style="color: #0284c7;">${resetUrl}</a>
        </p>
      </div>
    `;

    await sendMail({ to: user.email, subject, html });

    logSecurityEvent({
      eventType: 'PASSWORD_RESET_LINK_DISPATCHED',
      ip: clientIp,
      endpoint: '/api/auth/forgot-password',
      details: { userId: user._id.toString() },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'A secure password & PIN reset link has been dispatched to your email.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password route error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
