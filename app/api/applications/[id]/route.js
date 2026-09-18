import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Application from '@/lib/models/Application';
import { verifyToken, hasPermission, ROLES } from '@/lib/auth';
import { sendMail, escapeHtml } from '@/lib/emailService';

export async function GET(req, { params }) {
  try {
    const token = req.cookies.get('admin_token')?.value;
    const authUser = await verifyToken(token);
    if (!authUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    if (!hasPermission(authUser.role, ROLES.ADMIN)) {
      return NextResponse.json({ message: 'Forbidden: Insufficient privileges' }, { status: 403 });
    }

    const { id } = await params;
    await connectToDatabase();

    const application = await Application.findById(id);
    if (!application) {
      return NextResponse.json({ message: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, application });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const token = req.cookies.get('admin_token')?.value;
    const authUser = await verifyToken(token);
    if (!authUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    if (!hasPermission(authUser.role, ROLES.ADMIN)) {
      return NextResponse.json({ message: 'Forbidden: Insufficient privileges' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    await connectToDatabase();

    // Only these fields are admin-updatable; notifyApplicant/emailMessage are
    // request-only flags and must not be written to the document.
    const updates = {};
    if (typeof body.status === 'string') updates.status = body.status.slice(0, 50);
    if (typeof body.notes === 'string') updates.notes = body.notes.slice(0, 3000);

    const updatedApplication = await Application.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    if (!updatedApplication) {
      return NextResponse.json({ message: 'Application not found' }, { status: 404 });
    }

    // Optional: send status update email if requested
    if (body.notifyApplicant && body.status) {
      await sendMail({
        to: updatedApplication.email,
        subject: `Update regarding your application for ${updatedApplication.jobTitle} - Maurya Technologies`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
              <h2>Dear ${escapeHtml(updatedApplication.name)},</h2>
              <p>We wanted to give you an update on your application for the <strong>${escapeHtml(updatedApplication.jobTitle)}</strong> position.</p>
              <p>Your current application status is: <strong>${escapeHtml(body.status)}</strong></p>
              ${body.emailMessage ? `<p>${escapeHtml(body.emailMessage)}</p>` : ''}
              <p>Best regards,<br/>Team Maurya Technologies</p>
            </div>
        `,
      });
    }

    return NextResponse.json({ success: true, application: updatedApplication });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const token = req.cookies.get('admin_token')?.value;
    const authUser = await verifyToken(token);
    if (!authUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    if (!hasPermission(authUser.role, ROLES.ADMIN)) {
      return NextResponse.json({ message: 'Forbidden: Insufficient privileges' }, { status: 403 });
    }

    const { id } = await params;
    await connectToDatabase();

    await Application.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Application deleted successfully' });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
