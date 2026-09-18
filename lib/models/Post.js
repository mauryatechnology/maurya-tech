import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    customId: {
      type: String,
      unique: true,
      sparse: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    excerpt: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      default: '',
    },
    author: {
      type: String,
      default: 'Maurya Technologies Team',
    },
    date: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
    readTime: {
      type: String,
      default: '5 min read',
    },
    category: {
      type: String,
      default: 'Technology',
    },
    tags: [String],
    featured: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['draft', 'review', 'published'],
      default: 'published',
      index: true,
    },
    version: {
      type: Number,
      default: 1,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    // Additive fields for multi-country SEO, topic clusters, and quality gate
    canonicalCountry: {
      type: String,
      enum: ['IN', 'US', 'UK', 'GLOBAL'],
      default: 'IN',
      index: true,
    },
    targetCountries: {
      type: [String],
      default: ['IN'],
    },
    clusterType: {
      type: String,
      enum: ['pillar', 'spoke', 'tool_guide'],
      default: 'spoke',
    },
    monetizationIntent: {
      type: String,
      enum: ['high_cpc', 'affiliate', 'lead_gen', 'informational'],
      default: 'informational',
    },
    primaryKeyword: {
      type: String,
      default: '',
    },
    faqSchema: [
      {
        question: String,
        answer: String,
      },
    ],
    qualityScore: {
      type: Number,
      default: 0,
    },
    qualityChecks: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    relatedToolSlug: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

PostSchema.virtual('id').get(function () {
  return this.customId || this.slug || this._id.toHexString();
});

PostSchema.set('toJSON', {
  virtuals: true,
});

export default mongoose.models.Post || mongoose.model('Post', PostSchema);
