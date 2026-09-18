import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import AffiliateOffer from '@/lib/models/AffiliateOffer';
import { verifyToken } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get('all') === 'true';
    const country = searchParams.get('country');
    const placement = searchParams.get('placement');

    await connectToDatabase();

    const query = {};
    if (!all) {
      query.enabled = true;
    }

    if (country) {
      query.$or = [{ country: country.toUpperCase() }, { country: 'GLOBAL' }];
    }

    if (placement) {
      query.placement = placement;
    }

    const offers = await AffiliateOffer.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, offers });
  } catch (error) {
    console.error('Fetch affiliate offers error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error fetching offers.' },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const token = req.cookies.get('admin_token')?.value;
    const authUser = await verifyToken(token);
    if (!authUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    // If tracking a click
    if (body.action === 'track_click' && body.id) {
      await connectToDatabase();
      await AffiliateOffer.findByIdAndUpdate(body.id, { $inc: { clicksCount: 1 } });
      return NextResponse.json({ success: true });
    }

    if (!body.title || !body.targetUrl) {
      return NextResponse.json(
        { error: 'Title and target URL are required.' },
        { status: 400 }
      );
    }

    const slug =
      body.slug ||
      body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    await connectToDatabase();

    const offer = await AffiliateOffer.create({
      ...body,
      slug,
    });

    await logAuditEvent({
      action: 'create',
      entityType: 'AffiliateOffer',
      entityId: offer._id,
      entityName: offer.title,
      performedBy: authUser.email || 'Admin',
      changes: body,
      req,
    });

    return NextResponse.json({ success: true, offer });
  } catch (error) {
    console.error('Create affiliate offer error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create affiliate offer.' },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const token = req.cookies.get('admin_token')?.value;
    const authUser = await verifyToken(token);
    if (!authUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Offer ID is required.' }, { status: 400 });
    }

    await connectToDatabase();

    const oldOffer = await AffiliateOffer.findById(id).lean();
    if (!oldOffer) {
      return NextResponse.json({ error: 'Offer not found.' }, { status: 404 });
    }

    const updated = await AffiliateOffer.findByIdAndUpdate(id, updates, { new: true });

    await logAuditEvent({
      action: 'update',
      entityType: 'AffiliateOffer',
      entityId: id,
      entityName: updated.title,
      performedBy: authUser.email || 'Admin',
      changes: updates,
      req,
    });

    return NextResponse.json({ success: true, offer: updated });
  } catch (error) {
    console.error('Update affiliate offer error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update affiliate offer.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const token = req.cookies.get('admin_token')?.value;
    const authUser = await verifyToken(token);
    if (!authUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Offer ID is required.' }, { status: 400 });
    }

    await connectToDatabase();
    const offer = await AffiliateOffer.findByIdAndDelete(id);

    if (offer) {
      await logAuditEvent({
        action: 'delete',
        entityType: 'AffiliateOffer',
        entityId: id,
        entityName: offer.title,
        performedBy: authUser.email || 'Admin',
        req,
      });
    }

    return NextResponse.json({ success: true, message: 'Offer deleted successfully.' });
  } catch (error) {
    console.error('Delete offer error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete offer.' },
      { status: 500 }
    );
  }
}
