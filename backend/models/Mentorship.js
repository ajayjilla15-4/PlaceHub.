import mongoose from 'mongoose';

const mentorshipSchema = new mongoose.Schema(
  {
    _id: { type: String },
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },
    studentEmail: { type: String, required: true },
    alumniId: { type: String, required: true },
    alumniName: { type: String, required: true },
    topic: {
      type: String,
      enum: ['Resume Review', 'Mock Interview', 'Referral Request', 'Career Guidance'],
      default: 'Career Guidance',
    },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Completed', 'Declined'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Mentorship || mongoose.model('Mentorship', mentorshipSchema);
