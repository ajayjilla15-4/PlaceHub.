import React, { useState, useEffect } from 'react';

import Navbar from './components/Navbar';
import AuthPage from './components/AuthPage';
import StatsBanner from './components/StatsBanner';
import JobBoard from './components/JobBoard';
import ApplicationTracker from './components/ApplicationTracker';
import AlumniDirectory from './components/AlumniDirectory';
import InterviewExperienceHub from './components/InterviewExperienceHub';
import AnalyticsView from './components/AnalyticsView';
import AdminDashboard from './components/AdminDashboard';
import NewJobModal from './components/NewJobModal';

import {
  api,
  getStoredUser,
  removeAuthToken,
  removeStoredUser,
} from './services/api';

import { Layers } from 'lucide-react';

import {
  User,
  Job,
  Application,
  Alumni,
  InterviewExperience,
  Stats,
  MentorshipRequestData,
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState('drives');

  const [currentUser, setCurrentUser] = useState<User | null>(
    () => getStoredUser()
  );

  const [jobs, setJobs] = useState<Job[]>([]);
  const [myApplications, setMyApplications] = useState<Application[]>([]);
  const [allApplications, setAllApplications] = useState<Application[]>([]);
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [experiences, setExperiences] = useState<InterviewExperience[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);

  const [loading, setLoading] = useState(true);
  const [isNewJobModalOpen, setIsNewJobModalOpen] = useState(false);

  // Load public portal data.
  const loadAllData = async () => {
    try {
      setLoading(true);

      const [jobsData, alumniData, experiencesData, statsData] =
        await Promise.all([
          api.getJobs(),
          api.getAlumni(),
          api.getExperiences(),
          api.getStats(),
        ]);

      setJobs(jobsData);
      setAlumni(alumniData);
      setExperiences(experiencesData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load portal data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load applications for the signed-in user.
  const loadUserData = async (user: User) => {
    try {
      if (user.role === 'admin') {
        const applications = await api.getAllApplications();
        setAllApplications(applications);
      } else {
        const applications = await api.getMyApplications();
        setMyApplications(applications);
      }
    } catch (error) {
      console.error('Failed to load applications:', error);
    }
  };

  useEffect(() => {
    void loadAllData();
  }, []);

  // Handle successful login or registration.
  const handleAuthSuccess = async (user: User) => {
    setCurrentUser(user);

    if (user.role === 'admin') {
      setActiveTab('admin');
    } else if (user.role === 'alumni') {
      setActiveTab('alumni');
    } else {
      setActiveTab('drives');
    }

    await loadUserData(user);
  };

  // Logout and clear the local session.
  const handleLogout = () => {
    removeAuthToken();
    removeStoredUser();

    setCurrentUser(null);
    setMyApplications([]);
    setAllApplications([]);
    setIsNewJobModalOpen(false);
    setActiveTab('drives');
  };

  // Job application.
  const handleApplyJob = async (jobId: string) => {
    try {
      const result = await api.applyJob(jobId);
      setMyApplications((previous) => [
        result.application,
        ...previous,
      ]);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : 'Unable to apply for this job.'
      );
    }
  };

  // Create a placement drive.
  const handleCreateJob = async (jobData: Partial<Job>) => {
    try {
      const created = await api.createJob(jobData);
      setJobs((previous) => [created, ...previous]);
      setIsNewJobModalOpen(false);
      setActiveTab('drives');
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : 'Unable to create the placement drive.'
      );
    }
  };

  // Update application status.
  const handleUpdateAppStatus = async (
    applicationId: string,
    newStatus: string
  ) => {
    try {
      await api.updateApplicationStatus(applicationId, newStatus);

      setAllApplications((previous) =>
        previous.map((application) =>
          application._id === applicationId
            ? { ...application, status: newStatus }
            : application
        )
      );

      setMyApplications((previous) =>
        previous.map((application) =>
          application._id === applicationId
            ? { ...application, status: newStatus }
            : application
        )
      );
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : 'Unable to update the application.'
      );
    }
  };

  // Request alumni mentorship.
  const handleRequestMentorship = async (
    data: MentorshipRequestData
  ) => {
    return api.requestMentorship(data);
  };

  // Post interview experience.
  const handlePostExperience = async (
    data: Partial<InterviewExperience>
  ) => {
    try {
      const created = await api.createExperience(data);
      setExperiences((previous) => [created, ...previous]);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : 'Unable to post your experience.'
      );
    }
  };

  // Like interview experience.
  const handleLikeExperience = async (id: string) => {
    try {
      const result = await api.likeExperience(id);

      setExperiences((previous) =>
        previous.map((experience) =>
          experience._id === id
            ? { ...experience, likes: result.likes }
            : experience
        )
      );
    } catch (error) {
      console.error('Unable to like experience:', error);
    }
  };

  // Show login and registration to visitors.
  if (!currentUser) {
    return (
      <>
        <AuthPage onSuccess={handleAuthSuccess} />

        <footer
          style={{
            textAlign: 'center',
            padding: '24px',
            color: '#64748b',
            background: '#0f172a',
          }}
        >
          PlaceHub — College Placement & Alumni Engagement Portal
        </footer>
      </>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onSelectDemoUser={() => {
          // Demo role switching is disabled for authenticated accounts.
        }}
        onLogout={handleLogout}
      />

      <main style={{ flex: 1, padding: '32px 0 64px' }}>
        <div className="container">
          {loading ? (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 0',
                color: '#64748b',
              }}
            >
              Loading placement records and live drives...
            </div>
          ) : (
            <>
              {(activeTab === 'drives' || activeTab === 'stats') && (
                <StatsBanner stats={stats} />
              )}

              {activeTab === 'drives' && (
                <JobBoard
                  jobs={jobs}
                  currentUser={currentUser}
                  myApplications={myApplications}
                  onApplyJob={handleApplyJob}
                  onOpenNewJobModal={() => {
                    if (currentUser.role === 'admin') {
                      setIsNewJobModalOpen(true);
                    }
                  }}
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

              {activeTab === 'stats' && (
                <AnalyticsView stats={stats} />
              )}

              {activeTab === 'admin' && currentUser.role === 'admin' && (
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

      {isNewJobModalOpen && currentUser.role === 'admin' && (
        <NewJobModal
          currentUser={currentUser}
          onClose={() => setIsNewJobModalOpen(false)}
          onCreateJob={handleCreateJob}
        />
      )}

      <footer
        style={{
          background: '#0f172a',
          color: '#94a3b8',
          borderTop: '1px solid #1e293b',
          padding: '32px 0',
          fontSize: '0.85rem',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'white',
                fontWeight: 800,
                fontSize: '1.05rem',
                marginBottom: '4px',
              }}
            >
              <span>PlaceHub</span>
              <span className="badge badge-blue" style={{ fontSize: '0.65rem' }}>
                MERN Stack
              </span>
            </div>

            <p style={{ color: '#64748b' }}>
              College Placement & Alumni Engagement Portal • Built with React,
              TypeScript, Node.js and MongoDB
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            <span>
              <Layers size={14} style={{ verticalAlign: 'middle' }} /> React +
              TypeScript
            </span>
            <span>Node.js / Express</span>
            <span>MongoDB</span>
          </div>
        </div>
      </footer>
    </div>
  );
}