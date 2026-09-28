import connectToDatabase from '@/lib/mongodb';
import Subscriber from '@/lib/models/Subscriber';

const page = (title, body) =>
  new Response(
    `<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><body style="font-family:Arial,sans-serif;max-width:520px;margin:15vh auto;padding:0 16px;color:#0f172a"><h1 style="font-size:22px">${title}</h1><p>${body}</p><p><a href="/tools">Back to the calculators</a></p></body>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );

export async function GET(req) {
  const token = new URL(req.url).searchParams.get('token') || '';
  if (!/^[a-f0-9]{48}$/.test(token)) return page('Link not valid', 'This confirmation link is invalid or has expired.');
  try {
    await connectToDatabase();
    const sub = await Subscriber.findOneAndUpdate(
      { token, status: { $ne: 'unsubscribed' } },
      { status: 'subscribed', confirmedAt: new Date() },
      { new: true }
    );
    if (!sub) return page('Link not valid', 'This confirmation link is invalid or has expired.');
    return page('You are subscribed', 'Thanks — we will email you only when tax rules or calculator results change.');
  } catch {
    return page('Something went wrong', 'Please try the link again in a few minutes.');
  }
}
