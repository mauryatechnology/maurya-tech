import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Subscriber from '@/lib/models/Subscriber';
import { verifyToken, hasPermission, ROLES } from '@/lib/auth';

const STATUSES = ['pending', 'subscribed', 'unsubscribed'];
const COUNTRIES = ['IN', 'US', 'UK', 'GLOBAL'];
const FIELDS = ['email', 'country', 'status', 'source', 'consentAt', 'confirmedAt', 'unsubscribedAt', 'createdAt'];

// Quote every cell and neutralise spreadsheet formulas (CSV injection).
const csvCell = (v) => {
  let s = v instanceof Date ? v.toISOString() : String(v ?? '');
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
};

/** Tax-alert subscribers for /admin/subscribers. `?format=csv` downloads the filtered list. */
export async function GET(req) {
  const authUser = await verifyToken(req.cookies.get('admin_token')?.value);
  if (!authUser) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (!hasPermission(authUser.role, ROLES.ADMIN)) {
    return NextResponse.json({ message: 'Forbidden: Insufficient privileges' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const country = searchParams.get('country');
  const query = {};
  if (STATUSES.includes(status)) query.status = status;
  if (COUNTRIES.includes(country)) query.country = country;

  try {
    await connectToDatabase();

    if (searchParams.get('format') === 'csv') {
      const rows = await Subscriber.find(query).select(FIELDS.join(' ')).sort({ createdAt: -1 }).lean();
      const csv = [FIELDS.join(','), ...rows.map((r) => FIELDS.map((f) => csvCell(r[f])).join(','))].join('\r\n');
      return new Response(`${csv}\r\n`, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
          'Cache-Control': 'no-store',
        },
      });
    }

    const [subscribers, counts] = await Promise.all([
      Subscriber.find(query).select(FIELDS.join(' ')).sort({ createdAt: -1 }).limit(500).lean(),
      Subscriber.aggregate([{ $group: { _id: { status: '$status', country: '$country' }, n: { $sum: 1 } } }]),
    ]);
    return NextResponse.json({ success: true, subscribers, counts: counts.map((c) => ({ ...c._id, n: c.n })) });
  } catch (error) {
    console.error('Fetch subscribers error:', error.message);
    return NextResponse.json({ success: false, message: 'Could not load subscribers.' }, { status: 500 });
  }
}
