import mongoose from 'mongoose';

const ToolSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    }, // 'ctc-calculator', 'hourly-to-annual-salary', 'emi-calculator', etc.
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['salary', 'finance', 'general', 'career', 'developer'],
      default: 'general',
      index: true,
    },
    countries: {
      type: [String],
      default: ['IN', 'US', 'UK'],
      index: true,
    },
    scope: {
      type: String,
      enum: ['GLOBAL', 'LOCALIZED', 'COUNTRY_EXCLUSIVE'],
      default: 'LOCALIZED',
    },
    // Country-specific rules, formula parameters, tax brackets, and rate tables
    computeConfig: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    seo: {
      title: { type: String, default: '' },
      description: { type: String, default: '' },
      primaryKeyword: { type: String, default: '' },
      customized: { type: Boolean, default: false }, // true once an admin edits SEO in /admin/tools
      faqSchema: [
        {
          question: String,
          answer: String,
        },
      ],
    },
    status: {
      type: String,
      enum: ['draft', 'review', 'published'],
      default: 'published',
      index: true,
    },
    enabled: {
      type: Boolean,
      default: true,
      index: true,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Tool || mongoose.model('Tool', ToolSchema);
