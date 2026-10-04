import connectToDatabase from '@/lib/mongodb';
import Subscriber from '@/lib/models/Subscriber';
import { TOKEN_RE, htmlPage, tokenFromPost } from '@/lib/newsletterPages';

const invalid = () => htmlPage('Link not valid', 'This confirmation link is invalid or has expired.');

// GET only shows the button — see lib/newsletterPages.js for why.
export function GET(req) {
  const token = new URL(req.url).searchParams.get('token') || '';
  if (!TOKEN_RE.test(token)) return invalid();
  return htmlPage('Confirm your subscription', 'Click the button to start receiving tax and salary rule-change alerts.', {
    action: '/api/newsletter/confirm',
    button: 'Confirm subscription',
    token,
  });
}

export async function POST(req) {
  const token = await tokenFromPost(req);
  if (!TOKEN_RE.test(token)) return invalid();
  try {
    await connectToDatabase();
    const sub = await Subscriber.findOneAndUpdate(
      { token, status: { $ne: 'unsubscribed' } },
      { status: 'subscribed', confirmedAt: new Date() },
      { new: true }
    );
    if (!sub) return invalid();
    return htmlPage('You are subscribed', 'Thanks — we will email you only when tax rules or calculator results change.');
  } catch {
    return htmlPage('Something went wrong', 'Please try the link again in a few minutes.');
  }
}
