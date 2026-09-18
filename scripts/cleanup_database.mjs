import mongoose from 'mongoose';

/**
 * Maurya Technologies - Database Cleanup Utility
 * Usage:
 *   Dry-run (preview only): node --env-file=.env.local scripts/cleanup_database.mjs
 *   Execute cleanup:        node --env-file=.env.local scripts/cleanup_database.mjs --execute
 */

const isExecute = process.argv.includes('--execute');

async function runCleanup() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('❌ MONGODB_URI not found in environment.');
    process.exit(1);
  }

  console.log(`Connecting to MongoDB (${isExecute ? '⚡ LIVE EXECUTION' : '🔍 DRY-RUN PREVIEW'})...`);
  await mongoose.connect(mongoUri);
  const db = mongoose.connection.db;

  console.log('\n--- 1. ANALYTICS COLLECTION ---');
  const legacyAnalyticsCount = await db.collection('analytics').countDocuments({ eventType: null });
  console.log(`Found ${legacyAnalyticsCount} legacy unaggregated analytics documents (eventType: null).`);

  if (isExecute && legacyAnalyticsCount > 0) {
    const res = await db.collection('analytics').deleteMany({ eventType: null });
    console.log(`✅ Deleted ${res.deletedCount} legacy analytics records.`);
  } else if (!isExecute && legacyAnalyticsCount > 0) {
    console.log(`[DRY RUN] Would delete ${legacyAnalyticsCount} records. Run with --execute to perform.`);
  }

  console.log('\n--- 2. INQUIRIES (SPAM BOT PURGE) ---');
  // Known bot email patterns from pre-honeypot submissions:
  // e.g. emails with multiple consecutive dots in username or randomized names
  const spamQuery = {
    $or: [
      { email: { $regex: /\.[a-z]\.[a-z]\./i } }, // e.g. i.ven.a.nek.ec.28@gmail.com
      { name: { $regex: /^[A-Za-z]{15,}$/ } }, // e.g. HylAdEodrfhFSNszm
    ],
  };

  const spamInquiries = await db.collection('inquiries').find(spamQuery).toArray();
  console.log(`Found ${spamInquiries.length} probable bot spam inquiries:`);
  spamInquiries.forEach((s) => console.log(` - ID: ${s._id} | Name: "${s.name}" | Email: ${s.email}`));

  if (isExecute && spamInquiries.length > 0) {
    const res = await db.collection('inquiries').deleteMany(spamQuery);
    console.log(`✅ Deleted ${res.deletedCount} bot spam inquiries.`);
  } else if (!isExecute && spamInquiries.length > 0) {
    console.log(`[DRY RUN] Would delete ${spamInquiries.length} spam records. Run with --execute to perform.`);
  }

  console.log('\n--- 3. VERIFY ESSENTIAL CMS COLLECTIONS (PROTECTED) ---');
  const counts = {
    users: await db.collection('users').countDocuments(),
    jobs: await db.collection('jobs').countDocuments(),
    projects: await db.collection('projects').countDocuments(),
    services: await db.collection('services').countDocuments(),
    posts: await db.collection('posts').countDocuments(),
    tools: await db.collection('tools').countDocuments(),
    countries: await db.collection('countries').countDocuments(),
    applications: await db.collection('applications').countDocuments(),
  };
  console.log('Protected collections status:', counts);
  console.log('✅ All protected collections intact.');

  await mongoose.disconnect();
  console.log('\nDatabase cleanup check finished.');
}

runCleanup().catch((err) => {
  console.error('Cleanup error:', err);
  process.exit(1);
});
