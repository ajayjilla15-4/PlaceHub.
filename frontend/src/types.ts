export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'alumni' | 'admin' | string;
  branch?: string;
  cgpa?: number;
  graduationYear?: number;
  company?: string;
  designation?: string;
  avatar?: string;
  bio?: string;
  linkedin?: string;
}

export interface Job {
  _id: string;
  title: string;
  company: string;
  logo?: string;
  packageCTC: string;
  minCGPA: number;
  type: string;
  location: string;
  deadline: string;
  eligibleBranches?: string[];
  description?: string;
  requirements?: string[];
  rounds?: string[];
  postedBy?: string;
  createdAt?: string;
}

export interface Application {
  _id: string;
  jobId: string;
  company: string;
  jobTitle: string;
  packageCTC: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  status: 'Applied' | 'Shortlisted' | 'Interview Scheduled' | 'Selected' | 'Rejected' | string;
  appliedAt: string;
  notes?: string;
}

export interface Alumni {
  _id: string;
  name: string;
  email: string;
  company: string;
  designation: string;
  graduationYear: number;
  branch: string;
  avatar?: string;
  bio?: string;
  linkedin?: string;
}

export interface InterviewRound {
  roundName: string;
  details: string;
}

export interface InterviewExperience {
  _id: string;
  company: string;
  role: string;
  packageCTC: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | string;
  tips: string;
  authorName?: string;
  batch?: number | string;
  rounds: InterviewRound[];
  likes?: number;
  createdAt?: string;
}

export interface BranchStat {
  branch: string;
  percentage: number;
  avgCTC: string;
}

export interface TopRecruiter {
  name: string;
  logo: string;
  offers: number;
}

export interface Stats {
  placementPercentage: number;
  totalPlaced: number;
  highestCTC: string;
  averageCTC: string;
  activeDrives: number;
  medianCTC: string;
  totalEligibleStudents: number;
  totalOffers: number;
  branchWiseStats: BranchStat[];
  topRecruiters: TopRecruiter[];
}

export interface MentorshipRequestData {
  alumniId: string;
  alumniName: string;
  topic: string;
  message: string;
}
