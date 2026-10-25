import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema(
  {
    authorName: { type: String, required: true },
    authorEmail: { type: String },
    company: { type: String, required: true },
    role: { type: String, required: true },
    batch: { type: Number, default: 2024 },
    packageCTC: { type: String, default: '12 LPA' },
    status: {
      type: String,
      enum: ['Selected', 'Rejected', 'Offered'],
      default: 'Selected',
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    rounds: [
      {
        roundName: { type: String },
        details: { type: String },
      },
    ],
    tips: { type: String, required: true },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Experience || mongoose.model('Experience', experienceSchema);
