import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Tool from '@/lib/models/Tool';
import { defaultTools } from '@/data/tools';
import { verifyToken } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';

export async function GET(req) {
  try {
    await connectToDatabase();
    let tools = await Tool.find().sort({ category: 1, name: 1 }).lean();

    if (!tools || tools.length === 0) {
      await Tool.insertMany(defaultTools);
      tools = await Tool.find().sort({ category: 1, name: 1 }).lean();
    }

    return NextResponse.json({ success: true, tools });
  } catch (error) {
    console.error('Fetch tools error:', error);
    return NextResponse.json({ success: true, tools: defaultTools });
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
    const { slug, enabled, status, countries, scope, computeConfig, seo } = body;

    if (!slug) {
      return NextResponse.json({ error: 'Tool slug is required.' }, { status: 400 });
    }

    await connectToDatabase();

    const updated = await Tool.findOneAndUpdate(
      { slug },
      {
        ...(enabled !== undefined && { enabled }),
        ...(status && { status }),
        ...(countries && { countries }),
        ...(scope && { scope }),
        ...(computeConfig && { computeConfig }),
        ...(seo && { seo }),
      },
      { new: true, upsert: true }
    );

    await logAuditEvent({
      action: 'update',
      entityType: 'Tool',
      entityId: updated._id,
      entityName: updated.name || slug,
      performedBy: authUser.email || 'Admin',
      changes: { enabled, status, scope },
      req,
    });

    return NextResponse.json({ success: true, tool: updated });
  } catch (error) {
    console.error('Update tool error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error updating tool.' },
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
    const { slug, name, category } = body;

    if (!slug || !name) {
      return NextResponse.json({ error: 'Tool slug and name are required.' }, { status: 400 });
    }

    await connectToDatabase();

    const tool = await Tool.create({
      ...body,
      enabled: body.enabled !== undefined ? body.enabled : true,
      status: body.status || 'published',
    });

    await logAuditEvent({
      action: 'create',
      entityType: 'Tool',
      entityId: tool._id,
      entityName: tool.name,
      performedBy: authUser.email || 'Admin',
      req,
    });

    return NextResponse.json({ success: true, tool });
  } catch (error) {
    console.error('Create tool error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error creating tool.' },
      { status: 500 }
    );
  }
}
