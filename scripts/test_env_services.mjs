/**
 * Service Diagnostic & Environment Verification Script
 * Run with: node --env-file=.env.local scripts/test_env_services.mjs
 */

import mongoose from 'mongoose';

async function testServices() {
  console.log('\n========================================');
  console.log('🔍 Maurya Tech Services Health Check');
  console.log('========================================\n');

  let passed = 0;
  let warnings = 0;
  let errors = 0;

  // 1. JWT Configuration
  const jwtSecret = process.env.JWT_SECRET;
  if (jwtSecret && jwtSecret.length >= 32) {
    console.log('✅ JWT_SECRET: Configured & satisfies 32+ character security standard');
    passed++;
  } else {
    console.log('❌ JWT_SECRET: Missing or under 32 characters');
    errors++;
  }

  // 2. Database Connection
  const mongoUri = process.env.MONGODB_URI;
  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
      console.log('✅ MONGODB_URI: Successfully connected to MongoDB Atlas');
      passed++;
      await mongoose.disconnect();
    } catch (dbErr) {
      console.log(`⚠️ MONGODB_URI: Configured but connection timed out (${dbErr.message})`);
      warnings++;
    }
  } else {
    console.log('❌ MONGODB_URI: Not configured in environment');
    errors++;
  }

  // 3. Payment Gateway (Razorpay)
  const rzpKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const rzpSecret = process.env.RAZORPAY_KEY_SECRET;
  const rzpWebhook = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (rzpKey && rzpSecret) {
    console.log(`✅ RAZORPAY: Key ID and Key Secret configured (Key ID: ${rzpKey.slice(0, 10)}...)`);
    passed++;
  } else {
    console.log('⚠️ RAZORPAY: Key ID or Secret missing (Demo checkout fallback active in development)');
    warnings++;
  }

  if (rzpWebhook) {
    console.log('✅ RAZORPAY_WEBHOOK_SECRET: Configured for external webhook validation');
    passed++;
  } else {
    console.log('⚠️ RAZORPAY_WEBHOOK_SECRET: Not set (recommended for production)');
    warnings++;
  }

  // 4. Cloudflare Turnstile Bot Defense
  const turnstileSite = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (turnstileSite && turnstileSecret) {
    console.log('✅ CLOUDFLARE TURNSTILE: Site Key & Secret Key configured');
    passed++;
  } else {
    console.log('⚠️ CLOUDFLARE TURNSTILE: Keys missing (development bypass active)');
    warnings++;
  }

  // 5. Email (SMTP / Nodemailer)
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  if (smtpUser && smtpPass) {
    console.log(`✅ SMTP EMAIL: Configured (${smtpUser})`);
    passed++;
  } else {
    console.log('⚠️ SMTP EMAIL: SMTP_USER or SMTP_PASS missing (email delivery skipped)');
    warnings++;
  }

  // 6. Site URL Configuration
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) {
    console.log(`✅ NEXT_PUBLIC_SITE_URL: Configured (${siteUrl})`);
    passed++;
  } else {
    console.log('⚠️ NEXT_PUBLIC_SITE_URL: Not set (defaulting to https://maurya-tech.com)');
    warnings++;
  }

  console.log('\n----------------------------------------');
  console.log(`Summary: ${passed} Passed, ${warnings} Warnings, ${errors} Critical Errors`);
  console.log('----------------------------------------\n');

  if (errors > 0) {
    process.exit(1);
  }
}

testServices().catch((err) => {
  console.error('Fatal service check error:', err);
  process.exit(1);
});
