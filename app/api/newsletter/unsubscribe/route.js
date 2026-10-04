import connectToDatabase from '@/lib/mongodb';
import Subscriber from '@/lib/models/Subscriber';
import { TOKEN_RE, htmlPage, tokenFromPost } from '@/lib/newsletterPages';

const invalid = () => htmlPage('Link not valid', 'This unsubscribe link is invalid.');

// GET only shows the button — see lib/newsletterPages.js for why.
export function GET(req) {
  const token = new URL(req.url).searchParams.get('token') || '';
  if (!TOKEN_RE.test(token)) return invalid();
  return htmlPage('Unsubscribe', 'Click the button to stop all tax-alert emails to this address.', {
    action: '/api/newsletter/unsubscribe',
    button: 'Unsubscribe',
    token,
  });
}

export async function POST(req) {
  const token = await tokenFromPost(req);
  if (!TOKEN_RE.test(token)) return invalid();
  try {
    await connectToDatabase();
    await Subscriber.findOneAndUpdate({ token }, { status: 'unsubscribed', unsubscribedAt: new Date() });
    return htmlPage('You are unsubscribed', 'You will not receive any more emails from us.');
  } catch {
    return htmlPage('Something went wrong', 'Please try the link again in a few minutes.');
  }
}
