import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      enum: ['create', 'update', 'delete', 'publish', 'unpublish', 'export', 'refund'],
      required: true,
      index: true,
    },
    entityType: {
      type: String,
      enum: ['Post', 'Tool', 'Country', 'Order', 'Inquiry', 'AutomationRule', 'Job', 'Settings'],
      required: true,
      index: true,
    },
    entityId: {
      type: String,
      default: '',
      index: true,
    },
    entityName: {
      type: String,
      default: '',
    },
    performedBy: {
      type: String,
      default: 'Admin',
      index: true,
    },
    changes: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
      default: '',
    },
    userAgent: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

AuditLogSchema.index({ createdAt: -1 });

export default mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);
