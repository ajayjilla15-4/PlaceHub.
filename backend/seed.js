import mongoose from 'mongoose';
import dotenv from 'dotenv';
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
} from './data/seedData.js';

dotenv.config();

const seed = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/placehub';
  console.log(`Connecting to MongoDB at ${uri}...`);

  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully.');

    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});
    await Experience.deleteMany({});
    await Mentorship.deleteMany({});

    console.log('Inserting seed users...');
    await User.insertMany(initialUsers);

    console.log('Inserting seed jobs/drives...');
    await Job.insertMany(initialJobs);

    console.log('Inserting seed applications...');
    await Application.insertMany(initialApplications);

    console.log('Inserting interview experiences...');
    await Experience.insertMany(initialExperiences);

    console.log('Inserting mentorship requests...');
    await Mentorship.insertMany(initialMentorships);

    console.log('=============================================');
    console.log('✅ PlaceHub Database seeded successfully!');
    console.log('=============================================');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seed();
