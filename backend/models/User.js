import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['student', 'alumni', 'admin'],
      default: 'student',
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    },
    // Student specifics
    rollNumber: { type: String },
    branch: { type: String, default: 'Computer Science' },
    cgpa: { type: Number, default: 8.5 },
    graduationYear: { type: Number, default: 2026 },
    skills: [{ type: String }],
    resumeUrl: { type: String, default: 'https://example.com/resume.pdf' },
    placedAt: { type: String, default: '' },

    // Alumni specifics
    company: { type: String, default: '' },
    designation: { type: String, default: '' },
    experienceYears: { type: Number, default: 1 },
    linkedin: { type: String, default: '' },
    bio: { type: String, default: '' },
    isAvailableForMentorship: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', userSchema);
