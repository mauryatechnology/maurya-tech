import mongoose from 'mongoose';

const AffiliateOfferSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    category: {
      type: String,
      enum: ['tax_filing', 'hosting', 'dev_tool', 'courses', 'banking', 'career', 'general'],
      default: 'general',
    },
    country: {
      type: String,
      enum: ['IN', 'US', 'UK', 'GLOBAL'],
      default: 'GLOBAL',
      index: true,
    },
    placement: {
      type: String,
      enum: ['tool_sidebar', 'tool_footer', 'blog_inline', 'banner_top'],
      default: 'tool_sidebar',
    },
    targetUrl: {
      type: String,
      required: true,
      trim: true,
    },
    badge: {
      type: String,
      default: 'Partner Offer',
    },
    ctaText: {
      type: String,
      default: 'Learn More',
    },
    description: {
      type: String,
      default: '',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    clicksCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.AffiliateOffer ||
  mongoose.model('AffiliateOffer', AffiliateOfferSchema);
