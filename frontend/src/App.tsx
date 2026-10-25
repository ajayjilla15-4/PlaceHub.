import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StatsBanner from './components/StatsBanner';
import JobBoard from './components/JobBoard';
import ApplicationTracker from './components/ApplicationTracker';
import AlumniDirectory from './components/AlumniDirectory';
import InterviewExperienceHub from './components/InterviewExperienceHub';
import AnalyticsView from './components/AnalyticsView';
import AdminDashboard from './components/AdminDashboard';
import NewJobModal from './components/NewJobModal';
import { api } from './services/api';
import { Layers } from 'lucide-react';
import { User, Job, Application, Alumni, InterviewExperience, Stats, MentorshipRequestData } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('drives');
  const [currentUser, setCurrentUser] = useState<User>({
    _id: 'u_student_1',
    name: 'Rahul Sharma',
    email: 'rahul.student@college.edu',
    role: 'student',
    branch: 'Computer Science',
    cgpa: 8.9,
    graduationYear: 2026,
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
  });

  const [jobs, setJobs] = useState<Job[]>([]);
  const [myApplications, setMyApplications] = useState<Application[]>([]);
  const [allApplications, setAllApplications] = useState<Application[]>([]);
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [experiences, setExperiences] = useState<InterviewExperience[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isNewJobModalOpen, setIsNewJobModalOpen] = useState<boolean>(false);

  // Initial demo login for smooth experience
  const performDemoLogin = async (role: string) => {
    let email = 'rahul.student@college.edu';
    if (role === 'alumni') email = 'arjun.alumni@google.com';
    if (role === 'admin') email = 'tpo.admin@college.edu';

    try {
      const res = await api.login(email, 'password123');
      setCurrentUser(res.user);
      if (res.user.role === 'admin') {
        setActiveTab('admin');
      } else if (res.user.role === 'alumni') {
        setActiveTab('alumni');
      } else {
        setActiveTab('drives');
      }
      loadUserData(res.user);
    } catch (e: any) {
      console.warn('Demo login fetch failed, falling back:', e.message);
    }
  };

  const loadUserData = async (user: User | null) => {
    try {
      if (user?.role === 'admin') {
        const allApps = await api.getAllApplications();
        setAllApplications(allApps);
      } else {
        const myApps = await api.getMyApplications();
        setMyApplications(myApps);
      }
    } catch (e: any) {
      console.warn('Failed to load apps:', e.message);
    }
  };

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [jobsData, alumniData, expsData, statsData] = await Promise.all([
        api.getJobs(),
        api.getAlumni(),
        api.getExperiences(),
        api.getStats(),
      ]);

      setJobs(jobsData);
      setAlumni(alumniData);
      setExperiences(expsData);
      setStats(statsData);

      // Default demo login for student Rahul
      await performDemoLogin('student');
    } catch (err) {
      console.error('Data load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Handlers
  const handleApplyJob = async (jobId: string) => {
    const res = await api.applyJob(jobId);
    setMyApplications((prev) => [res.application, ...prev]);
    // Also update all applications if admin views
    setAllApplications((prev) => [res.application, ...prev]);
  };

  const handleCreateJob = async (jobData: Partial<Job>) => {
    const created = await api.createJob(jobData);
    setJobs((prev) => [created, ...prev]);
    setActiveTab('drives');
  };

  const handleUpdateAppStatus = async (appId: string, newStatus: string) => {
    await api.updateApplicationStatus(appId, newStatus);
    setAllApplications((prev) =>
      prev.map((a) => (a._id === appId ? { ...a, status: newStatus } : a))
    );
    setMyApplications((prev) =>
      prev.map((a) => (a._id === appId ? { ...a, status: newStatus } : a))
    );
  };

  const handleRequestMentorship = async (data: MentorshipRequestData) => {
    return await api.requestMentorship(data);
  };

  const handlePostExperience = async (data: Partial<InterviewExperience>) => {
    const created = await api.createExperience(data);
    setExperiences((prev) => [created, ...prev]);
  };

  const handleLikeExperience = async (id: string) => {
    const res = await api.likeExperience(id);
    setExperiences((prev) =>
      prev.map((e) => (e._id === id ? { ...e, likes: res.likes } : e))
    );
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onSelectDemoUser={performDemoLogin}
        onLogout={() => performDemoLogin('student')}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '32px 0 64px 0' }}>
        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
              <div style={{
                width: '36px',
                height: '36px',
                border: '3px solid #e2e8f0',
                borderTopColor: '#2563eb',
                borderRadius: '50%',
                margin: '0 auto 16px auto',
                animation: 'spin 1s linear infinite'
              }} />
              <p style={{ fontWeight: '600', fontSize: '0.95rem' }}>Loading placement records & live drives...</p>
            </div>
          ) : (
            <>
              {/* Top Placement Insights Banner (Visible on Drives & Stats) */}
              {(activeTab === 'drives' || activeTab === 'stats') && (
                <StatsBanner stats={stats} />
              )}

              {/* Active Tab View */}
              {activeTab === 'drives' && (
                <JobBoard
                  jobs={jobs}
                  currentUser={currentUser}
                  myApplications={myApplications}
                  onApplyJob={handleApplyJob}
                  onOpenNewJobModal={() => setIsNewJobModalOpen(true)}
                />
              )}

              {activeTab === 'applications' && (
                <ApplicationTracker
                  applications={myApplications}
                  onBrowseDrives={() => setActiveTab('drives')}
                />
              )}

              {activeTab === 'alumni' && (
                <AlumniDirectory
                  alumni={alumni}
                  currentUser={currentUser}
                  onRequestMentorship={handleRequestMentorship}
                />
              )}

              {activeTab === 'experiences' && (
                <InterviewExperienceHub
                  experiences={experiences}
                  currentUser={currentUser}
                  onLikeExperience={handleLikeExperience}
                  onPostExperience={handlePostExperience}
                />
              )}

              {activeTab === 'stats' && <AnalyticsView stats={stats} />}

              {activeTab === 'admin' && (
                <AdminDashboard
                  applications={allApplications}
                  jobs={jobs}
                  onUpdateAppStatus={handleUpdateAppStatus}
                  onOpenNewJobModal={() => setIsNewJobModalOpen(true)}
                />
              )}
            </>
          )}
        </div>
      </main>

      {/* New Drive Modal */}
      {isNewJobModalOpen && (
        <NewJobModal
          currentUser={currentUser}
          onClose={() => setIsNewJobModalOpen(false)}
          onCreateJob={handleCreateJob}
        />
      )}

      {/* Footer */}
      <footer style={{
        background: '#0f172a',
        color: '#94a3b8',
        borderTop: '1px solid #1e293b',
        padding: '32px 0',
        fontSize: '0.85rem',
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', fontWeight: '800', fontSize: '1.05rem', marginBottom: '4px' }}>
              <span>PlaceHub</span>
              <span className="badge badge-blue" style={{ fontSize: '0.65rem' }}>MERN Stack</span>
            </div>
            <p style={{ color: '#64748b' }}>
              College Placement & Alumni Engagement Portal • Built with React 19, TypeScript, Node.js & MongoDB
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8' }}>
              <Layers size={14} /> React 19 + TypeScript
            </span>
            <span>•</span>
            <span style={{ color: '#4ade80' }}>Node.js / Express Backend</span>
            <span>•</span>
            <span style={{ color: '#a78bfa' }}>MongoDB Database</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
