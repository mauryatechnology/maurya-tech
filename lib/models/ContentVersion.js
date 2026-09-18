import mongoose from 'mongoose';

const ContentVersionSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
      index: true,
    },
    version: {
      type: Number,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      default: '',
    },
    author: {
      type: String,
      default: '',
    },
    changedBy: {
      type: String,
      default: 'Admin',
    },
    changeSummary: {
      type: String,
      default: 'Routine content revision',
    },
    qualityScore: {
      type: Number,
      default: 0,
    },
    snapshotAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

ContentVersionSchema.index({ postId: 1, version: -1 });

export default mongoose.models.ContentVersion ||
  mongoose.model('ContentVersion', ContentVersionSchema);
