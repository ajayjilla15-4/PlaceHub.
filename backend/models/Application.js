import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    _id: { type: String },
    studentId: { type: String, required: true },
    studentName: { type: String },
    studentEmail: { type: String },
    jobId: { type: String, required: true },
    company: { type: String },
    jobTitle: { type: String },
    packageCTC: { type: String },
    status: {
      type: String,
      enum: ['Applied', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'],
      default: 'Applied',
    },
    notes: { type: String, default: '' },
    appliedAt: { type: Date, default: Date.now },
    student: { type: String },
    job: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Application || mongoose.model('Application', applicationSchema);
