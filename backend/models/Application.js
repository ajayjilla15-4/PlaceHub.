import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    status: {
      type: String,
      enum: ['Applied', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'],
      default: 'Applied',
    },
    notes: { type: String, default: '' },
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Application || mongoose.model('Application', applicationSchema);
