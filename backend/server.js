import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import { connectDB, getDBStatus } from './config/db.js';
import User from './models/User.js';
import Job from './models/Job.js';
import Application from './models/Application.js';
import Experience from './models/Experience.js';
import Mentorship from './models/Mentorship.js';
import {
  initialUsers,
  initialJobs,
  initialApplications,
  initialExperiences,
  initialMentorships,
  placementStats,
} from './data/seedData.js';
import { authenticateToken } from './middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure backend/.env is loaded reliably
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'placehub_super_secret_jwt_key_2026';

app.use(cors());
app.use(express.json());

// In-Memory state fallback when MongoDB is offline
let memUsers = [...initialUsers];
let memJobs = [...initialJobs];
let memApplications = [...initialApplications];
let memExperiences = [...initialExperiences];
let memMentorships = [...initialMentorships];

// Helper for JWT creation
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// ==========================================
// 1. HEALTH & METRICS
// ==========================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    portal: 'PlaceHub - College Placement & Alumni Portal',
    database: getDBStatus() ? 'MongoDB Connected' : 'In-Memory Fallback Active',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/stats', (req, res) => {
  const dynamicStats = {
    ...placementStats,
    activeDrives: memJobs.filter((j) => j.status === 'Active').length,
    registeredAlumni: memUsers.filter((u) => u.role === 'alumni').length,
    totalApplications: memApplications.length,
    totalExperiences: memExperiences.length,
  };
  res.json(dynamicStats);
});

// ==========================================
// 2. AUTHENTICATION & PROFILES
// ==========================================
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  let user = null;
  if (getDBStatus()) {
    user = await User.findOne({ email });
  } else {
    user = memUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = generateToken(user);
  res.json({
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      branch: user.branch,
      cgpa: user.cgpa,
      graduationYear: user.graduationYear,
      company: user.company,
      designation: user.designation,
      skills: user.skills || [],
      avatar: user.avatar,
      bio: user.bio,
      resumeUrl: user.resumeUrl,
      placedAt: user.placedAt,
    },
  });
});

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role, branch, cgpa, graduationYear, company, designation } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  const existing = memUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ message: 'User already exists with this email.' });
  }

  const newUser = {
    _id: `u_${Date.now()}`,
    name,
    email,
    password,
    role: role || 'student',
    branch: branch || 'Computer Science',
    cgpa: Number(cgpa) || 8.0,
    graduationYear: Number(graduationYear) || 2026,
    company: company || '',
    designation: designation || '',
    skills: ['React', 'JavaScript'],
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
    bio: '',
    resumeUrl: '',
    placedAt: '',
    isAvailableForMentorship: true,
  };

  if (getDBStatus()) {
    try {
      await User.create(newUser);
    } catch (e) {
      console.warn('Failed to insert into Mongo, retaining in memory:', e.message);
    }
  }

  memUsers.push(newUser);
  const token = generateToken(newUser);
  res.status(201).json({ token, user: newUser });
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  let user = null;
  if (getDBStatus()) {
    user = await User.findById(req.user.id);
  }
  if (!user) {
    user = memUsers.find((u) => u._id === req.user.id || u.email === req.user.email);
  }

  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ user });
});

app.put('/api/auth/profile', authenticateToken, async (req, res) => {
  const updates = req.body;
  const index = memUsers.findIndex((u) => u._id === req.user.id || u.email === req.user.email);
  if (index !== -1) {
    memUsers[index] = { ...memUsers[index], ...updates };
  }

  if (getDBStatus()) {
    try {
      await User.findByIdAndUpdate(req.user.id, updates);
    } catch (e) {
      console.warn('Mongo update error:', e.message);
    }
  }

  res.json({ message: 'Profile updated successfully', user: memUsers[index] });
});

// ==========================================
// 3. JOBS & PLACEMENT DRIVES
// ==========================================
app.get('/api/jobs', (req, res) => {
  const { branch, type, search } = req.query;
  let results = [...memJobs];

  if (type) {
    results = results.filter((j) => j.type.toLowerCase() === type.toLowerCase());
  }

  if (branch) {
    results = results.filter((j) => !j.eligibleBranches || j.eligibleBranches.includes(branch));
  }

  if (search) {
    const s = search.toLowerCase();
    results = results.filter(
      (j) =>
        j.title.toLowerCase().includes(s) ||
        j.company.toLowerCase().includes(s) ||
        j.location.toLowerCase().includes(s)
    );
  }

  res.json(results);
});

app.get('/api/jobs/:id', (req, res) => {
  const job = memJobs.find((j) => j._id === req.params.id);
  if (!job) return res.status(404).json({ message: 'Job not found' });
  res.json(job);
});

app.post('/api/jobs', authenticateToken, (req, res) => {
  const {
    title,
    company,
    logo,
    location,
    type,
    packageCTC,
    minCGPA,
    eligibleBranches,
    description,
    requirements,
    deadline,
    driveDate,
    rounds,
  } = req.body;

  if (!title || !company || !packageCTC) {
    return res.status(400).json({ message: 'Title, company, and package CTC are required.' });
  }

  const newJob = {
    _id: `job_${Date.now()}`,
    title,
    company,
    logo: logo || 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&q=80&w=200',
    location: location || 'Bangalore, India',
    type: type || 'Full-Time',
    packageCTC,
    minCGPA: Number(minCGPA) || 6.5,
    eligibleBranches: eligibleBranches || ['Computer Science', 'Information Technology'],
    description: description || 'Exciting career opportunity via college campus placement.',
    requirements: requirements || ['Strong coding skills', 'Good communication'],
    deadline: deadline || new Date(Date.now() + 15 * 86400000).toISOString(),
    driveDate: driveDate || new Date(Date.now() + 20 * 86400000).toISOString(),
    rounds: rounds || ['Online Assessment', 'Technical Interview', 'HR Interview'],
    status: 'Active',
    postedBy: {
      name: req.user.name,
      role: req.user.role,
      email: req.user.email,
    },
    createdAt: new Date().toISOString(),
  };

  memJobs.unshift(newJob);
  if (getDBStatus()) {
    Job.create(newJob).catch((e) => console.warn(e.message));
  }

  res.status(201).json(newJob);
});

app.delete('/api/jobs/:id', authenticateToken, async (req, res) => {
  if (getDBStatus()) {
    try {
      await Job.findByIdAndDelete(req.params.id);
    } catch (e) {
      console.warn('Mongo delete job error:', e.message);
    }
  }
  memJobs = memJobs.filter((j) => j._id !== req.params.id);
  res.json({ message: 'Job posting deleted' });
});

// ==========================================
// 4. APPLICATIONS TRACKING
// ==========================================
app.post('/api/jobs/:id/apply', authenticateToken, async (req, res) => {
  const jobId = req.params.id;
  const job = memJobs.find((j) => j._id === jobId);
  if (!job) return res.status(404).json({ message: 'Job not found' });

  // Check if student
  const student = memUsers.find((u) => u._id === req.user.id || u.email === req.user.email);

  // Check if already applied
  const existingApp = memApplications.find(
    (a) => a.studentId === req.user.id && a.jobId === jobId
  );
  if (existingApp) {
    return res.status(400).json({ message: 'You have already applied for this role.' });
  }

  // CGPA validation
  if (student && student.cgpa < job.minCGPA) {
    return res.status(400).json({
      message: `Your CGPA (${student.cgpa}) is lower than the minimum required (${job.minCGPA}) for this drive.`,
    });
  }

  const newApp = {
    _id: `app_${Date.now()}`,
    studentId: req.user.id,
    studentName: req.user.name,
    studentEmail: req.user.email,
    jobId: job._id,
    company: job.company,
    jobTitle: job.title,
    packageCTC: job.packageCTC,
    status: 'Applied',
    notes: 'Application submitted successfully. Under initial profile screening.',
    appliedAt: new Date().toISOString(),
  };

  memApplications.unshift(newApp);

  if (getDBStatus()) {
    try {
      await Application.create(newApp);
    } catch (e) {
      console.warn('Mongo application create error:', e.message);
    }
  }

  res.status(201).json({ message: 'Application submitted successfully!', application: newApp });
});

app.get('/api/applications/my', authenticateToken, (req, res) => {
  const userApps = memApplications.filter(
    (a) => a.studentId === req.user.id || a.studentEmail === req.user.email
  );
  res.json(userApps);
});

app.get('/api/applications/job/:jobId', authenticateToken, (req, res) => {
  const apps = memApplications.filter((a) => a.jobId === req.params.jobId);
  res.json(apps);
});

app.get('/api/applications/all', authenticateToken, (req, res) => {
  res.json(memApplications);
});

app.patch('/api/applications/:id/status', authenticateToken, async (req, res) => {
  const { status, notes } = req.body;
  const appItem = memApplications.find((a) => a._id === req.params.id);
  if (!appItem) return res.status(404).json({ message: 'Application not found' });

  if (status) appItem.status = status;
  if (notes) appItem.notes = notes;

  if (getDBStatus()) {
    try {
      await Application.findByIdAndUpdate(req.params.id, {
        ...(status ? { status } : {}),
        ...(notes ? { notes } : {}),
      });
    } catch (e) {
      console.warn('Mongo application status update error:', e.message);
    }
  }

  res.json({ message: 'Status updated', application: appItem });
});

// ==========================================
// 5. ALUMNI DIRECTORY & MENTORSHIP
// ==========================================
app.get('/api/alumni', (req, res) => {
  const { company, batch, search } = req.query;
  let alumniList = memUsers.filter((u) => u.role === 'alumni');

  if (company) {
    alumniList = alumniList.filter(
      (a) => a.company && a.company.toLowerCase().includes(company.toLowerCase())
    );
  }

  if (batch) {
    alumniList = alumniList.filter((a) => a.graduationYear === Number(batch));
  }

  if (search) {
    const s = search.toLowerCase();
    alumniList = alumniList.filter(
      (a) =>
        a.name.toLowerCase().includes(s) ||
        (a.company && a.company.toLowerCase().includes(s)) ||
        (a.designation && a.designation.toLowerCase().includes(s)) ||
        (a.skills && a.skills.some((sk) => sk.toLowerCase().includes(s)))
    );
  }

  res.json(alumniList);
});

app.post('/api/mentorship/request', authenticateToken, async (req, res) => {
  const { alumniId, alumniName, topic, message } = req.body;

  if (!alumniId || !message) {
    return res.status(400).json({ message: 'Alumni ID and message are required.' });
  }

  const newMentorship = {
    _id: `ment_${Date.now()}`,
    studentId: req.user.id,
    studentName: req.user.name,
    studentEmail: req.user.email,
    alumniId,
    alumniName: alumniName || 'Alumni Mentor',
    topic: topic || 'Career Guidance',
    message,
    status: 'Pending',
    createdAt: new Date().toISOString(),
  };

  memMentorships.unshift(newMentorship);

  if (getDBStatus()) {
    try {
      await Mentorship.create(newMentorship);
    } catch (e) {
      console.warn('Mongo mentorship create error:', e.message);
    }
  }

  res.status(201).json({ message: 'Mentorship request sent!', request: newMentorship });
});

app.get('/api/mentorship/my', authenticateToken, (req, res) => {
  const requests = memMentorships.filter(
    (m) =>
      m.studentId === req.user.id ||
      m.studentEmail === req.user.email ||
      m.alumniId === req.user.id
  );
  res.json(requests);
});

app.patch('/api/mentorship/:id/status', authenticateToken, async (req, res) => {
  const { status } = req.body;
  const ment = memMentorships.find((m) => m._id === req.params.id);
  if (!ment) return res.status(404).json({ message: 'Request not found' });

  ment.status = status || ment.status;

  if (getDBStatus()) {
    try {
      await Mentorship.findByIdAndUpdate(req.params.id, { status: ment.status });
    } catch (e) {
      console.warn('Mongo mentorship update error:', e.message);
    }
  }

  res.json({ message: 'Request status updated', request: ment });
});

// ==========================================
// 6. INTERVIEW EXPERIENCES
// ==========================================
app.get('/api/experiences', (req, res) => {
  const { company, search } = req.query;
  let exps = [...memExperiences];

  if (company) {
    exps = exps.filter((e) => e.company.toLowerCase().includes(company.toLowerCase()));
  }

  if (search) {
    const s = search.toLowerCase();
    exps = exps.filter(
      (e) =>
        e.company.toLowerCase().includes(s) ||
        e.role.toLowerCase().includes(s) ||
        e.tips.toLowerCase().includes(s)
    );
  }

  res.json(exps);
});

app.post('/api/experiences', authenticateToken, async (req, res) => {
  const { company, role, batch, packageCTC, status, difficulty, rounds, tips } = req.body;

  if (!company || !role || !tips) {
    return res.status(400).json({ message: 'Company, role, and tips are required.' });
  }

  const newExp = {
    _id: `exp_${Date.now()}`,
    authorName: req.user.name,
    authorEmail: req.user.email,
    company,
    role,
    batch: Number(batch) || 2024,
    packageCTC: packageCTC || '14 LPA',
    status: status || 'Selected',
    difficulty: difficulty || 'Medium',
    rounds: rounds || [{ roundName: 'Round 1: Technical', details: 'DSA & Core concepts' }],
    tips,
    likes: 0,
    createdAt: new Date().toISOString(),
  };

  memExperiences.unshift(newExp);

  if (getDBStatus()) {
    try {
      await Experience.create(newExp);
    } catch (e) {
      console.warn('Mongo experience create error:', e.message);
    }
  }

  res.status(201).json(newExp);
});

app.post('/api/experiences/:id/like', async (req, res) => {
  const exp = memExperiences.find((e) => e._id === req.params.id);
  if (!exp) return res.status(404).json({ message: 'Experience not found' });
  exp.likes = (exp.likes || 0) + 1;

  if (getDBStatus()) {
    try {
      await Experience.findByIdAndUpdate(req.params.id, { likes: exp.likes });
    } catch (e) {
      console.warn('Mongo experience like update error:', e.message);
    }
  }

  res.json({ likes: exp.likes });
});

// Start Server after waiting for database connection
const startServer = async () => {
  // Wait for database connection attempt before serving requests
  const connected = await connectDB();
  if (connected) {
    try {
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        console.log('[Seed] Seeding MongoDB with initial PlaceHub data...');
        await User.insertMany(initialUsers);
        await Job.insertMany(initialJobs);
        await Application.insertMany(initialApplications);
        await Experience.insertMany(initialExperiences);
        await Mentorship.insertMany(initialMentorships);
        console.log('[Seed] MongoDB successfully seeded!');
      } else {
        console.log(`[Database] Found ${userCount} existing users in MongoDB.`);
      }

      // Hydrate in-memory cache with database records
      const [dbUsers, dbJobs, dbApps, dbExps, dbMents] = await Promise.all([
        User.find({}),
        Job.find({}),
        Application.find({}),
        Experience.find({}),
        Mentorship.find({}),
      ]);
      if (dbUsers.length > 0) memUsers = dbUsers.map((u) => (u.toObject ? u.toObject() : u));
      if (dbJobs.length > 0) memJobs = dbJobs.map((j) => (j.toObject ? j.toObject() : j));
      if (dbApps.length > 0) memApplications = dbApps.map((a) => (a.toObject ? a.toObject() : a));
      if (dbExps.length > 0) memExperiences = dbExps.map((e) => (e.toObject ? e.toObject() : e));
      if (dbMents.length > 0) memMentorships = dbMents.map((m) => (m.toObject ? m.toObject() : m));
    } catch (e) {
      console.warn('[Seed Warning] MongoDB auto-seed/cache hydration skipped:', e.message);
    }
  }

  app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`🚀 PlaceHub Server running on http://localhost:${PORT}`);
    console.log(`📚 Technology Stack: React.js + Node.js + MongoDB`);
    console.log(`🎓 Placement & Alumni Portal API ready`);
    console.log(`💾 Database Status: ${getDBStatus() ? 'MongoDB Connected' : 'In-Memory Fallback Active'}`);
    console.log(`=================================================`);
  });
};

startServer();
