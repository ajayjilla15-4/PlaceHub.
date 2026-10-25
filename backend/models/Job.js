import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    logo: {
      type: String,
      default: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&q=80&w=200',
    },
    location: { type: String, default: 'Bangalore, India' },
    type: {
      type: String,
      enum: ['Full-Time', 'Internship', 'Alumni Referral'],
      default: 'Full-Time',
    },
    packageCTC: { type: String, required: true }, // e.g. "18 LPA", "45,000 / month"
    minCGPA: { type: Number, default: 7.0 },
    eligibleBranches: [{ type: String }],
    description: { type: String, required: true },
    requirements: [{ type: String }],
    deadline: { type: Date, required: true },
    driveDate: { type: Date },
    rounds: [{ type: String }],
    status: {
      type: String,
      enum: ['Active', 'Closed', 'Upcoming'],
      default: 'Active',
    },
    postedBy: {
      name: { type: String, default: 'Placement Cell' },
      role: { type: String, default: 'admin' },
      email: { type: String },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Job || mongoose.model('Job', jobSchema);
