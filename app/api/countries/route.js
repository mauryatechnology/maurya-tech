import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Country from '@/lib/models/Country';
import { defaultCountries } from '@/data/countries';
import { verifyToken } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';

export async function GET(req) {
  try {
    await connectToDatabase();
    let countries = await Country.find().sort({ launchTier: 1, name: 1 }).lean();

    if (!countries || countries.length === 0) {
      // Auto-seed if empty
      await Country.insertMany(defaultCountries);
      countries = await Country.find().sort({ launchTier: 1, name: 1 }).lean();
    }

    return NextResponse.json({ success: true, countries });
  } catch (error) {
    console.error('Fetch countries error:', error);
    return NextResponse.json({ success: true, countries: defaultCountries });
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
    const { code, enabled, currency, defaultLanguage, supportedLanguages, timezone } = body;

    if (!code) {
      return NextResponse.json({ error: 'Country code is required.' }, { status: 400 });
    }

    await connectToDatabase();

    const normalizedCode = code.toUpperCase();
    const updated = await Country.findOneAndUpdate(
      { code: normalizedCode },
      {
        enabled: enabled !== undefined ? enabled : true,
        ...(currency && { currency }),
        ...(defaultLanguage && { defaultLanguage }),
        ...(supportedLanguages && { supportedLanguages }),
        ...(timezone && { timezone }),
      },
      { new: true, upsert: true }
    );

    await logAuditEvent({
      action: 'update',
      entityType: 'Country',
      entityId: updated._id,
      entityName: `${updated.name} (${updated.code})`,
      performedBy: authUser.email || 'Admin',
      changes: { enabled, currency, defaultLanguage },
      req,
    });

    return NextResponse.json({ success: true, country: updated });
  } catch (error) {
    console.error('Update country error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error updating country.' },
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
    const { code, name, currency, defaultLanguage } = body;

    if (!code || !name) {
      return NextResponse.json({ error: 'Code and Name are required.' }, { status: 400 });
    }

    await connectToDatabase();

    const country = await Country.create({
      ...body,
      code: code.toUpperCase(),
      enabled: body.enabled !== undefined ? body.enabled : true,
      launchTier: body.launchTier || 2,
    });

    await logAuditEvent({
      action: 'create',
      entityType: 'Country',
      entityId: country._id,
      entityName: `${country.name} (${country.code})`,
      performedBy: authUser.email || 'Admin',
      req,
    });

    return NextResponse.json({ success: true, country });
  } catch (error) {
    console.error('Create country error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error creating country.' },
      { status: 500 }
    );
  }
}
