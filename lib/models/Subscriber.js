import mongoose from 'mongoose';

/**
 * Tax/rule-change alert subscribers. Double opt-in: status stays `pending` until the
 * address confirms via the emailed link (or `subscribed` directly when SMTP is not
 * configured, so no one is ever mailed without having asked).
 */
const SubscriberSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
    country: { type: String, enum: ['IN', 'US', 'UK', 'GLOBAL'], default: 'GLOBAL', index: true },
    topics: { type: [String], default: [] },
    source: { type: String, default: '', maxlength: 200 },
    status: { type: String, enum: ['pending', 'subscribed', 'unsubscribed'], default: 'pending', index: true },
    consentText: { type: String, default: '' },
    consentAt: { type: Date },
    confirmedAt: { type: Date },
    unsubscribedAt: { type: Date },
    token: { type: String, required: true, index: true }, // confirm + unsubscribe links
    // Campaign IDs of alerts already delivered — lets a send resume without duplicates.
    alertsSent: { type: [String], default: [], index: true },
  },
  { timestamps: true }
);

export default mongoose.models.Subscriber || mongoose.model('Subscriber', SubscriberSchema);
