import connectToDatabase from '@/lib/mongodb';
import AuditLog from '@/lib/models/AuditLog';

export async function logAuditEvent({
  action,
  entityType,
  entityId = '',
  entityName = '',
  performedBy = 'Admin',
  changes = {},
  req = null,
}) {
  try {
    await connectToDatabase();

    let ipAddress = '';
    let userAgent = '';

    if (req) {
      ipAddress =
        req.headers.get('x-forwarded-for')?.split(',')[0] ||
        req.headers.get('x-real-ip') ||
        '';
      userAgent = req.headers.get('user-agent') || '';
    }

    await AuditLog.create({
      action,
      entityType,
      entityId: String(entityId),
      entityName,
      performedBy,
      changes,
      ipAddress,
      userAgent,
    });
  } catch (err) {
    console.warn('Audit logging warning:', err.message);
  }
}
