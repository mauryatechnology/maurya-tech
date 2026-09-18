import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import AutomationRule from '@/lib/models/AutomationRule';
import { verifyToken } from '@/lib/auth';

export async function GET(req) {
  try {
    const token = req.cookies.get('admin_token')?.value;
    const authUser = await verifyToken(token);
    if (!authUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const rules = await AutomationRule.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, rules });
  } catch (error) {
    console.error('Fetch automation rules error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error fetching rules.' },
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
    await connectToDatabase();
    const rule = await AutomationRule.create(body);
    return NextResponse.json({ success: true, rule });
  } catch (error) {
    console.error('Create automation rule error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error creating rule.' },
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
    const { id, enabled } = body;

    await connectToDatabase();
    const updated = await AutomationRule.findByIdAndUpdate(
      id,
      { enabled },
      { new: true }
    );

    return NextResponse.json({ success: true, rule: updated });
  } catch (error) {
    console.error('Update rule error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error updating rule.' },
      { status: 500 }
    );
  }
}
