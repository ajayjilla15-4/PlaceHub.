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
  getAuthToken,
  clearAuthSession,
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

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [jobs, setJobs] = useState<Job[]>([]);
  const [myApplications, setMyApplications] = useState<Application[]>([]);
  const [allApplications, setAllApplications] = useState<Application[]>([]);
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [experiences, setExperiences] = useState<InterviewExperience[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);

  const [loading, setLoading] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);
  const [isNewJobModalOpen, setIsNewJobModalOpen] = useState(false);

  // Load public portal data.
  const loadAllData = async () => {
    try {
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

  // Load application data for the authenticated user.
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

  // Verify any previously stored login with the backend.
  useEffect(() => {
    let cancelled = false;

    const initializeApp = async () => {
      try {
        const token = getAuthToken();
        const storedUser = getStoredUser();

        if (!token || !storedUser) {
          clearAuthSession();
          return;
        }

        const response = await api.getProfile();

        if (cancelled) return;

        if (!response?.user) {
          clearAuthSession();
          return;
        }

        setCurrentUser(response.user);

        if (response.user.role === 'admin') {
          setActiveTab('admin');
        } else if (response.user.role === 'alumni') {
          setActiveTab('alumni');
        } else {
          setActiveTab('drives');
        }

        await loadUserData(response.user);
      } catch (error) {
        if (!cancelled) {
          console.warn('Saved session could not be verified:', error);
          clearAuthSession();
          setCurrentUser(null);
        }
      } finally {
        if (!cancelled) {
          setAuthChecking(false);
        }
      }
    };

    void initializeApp();
    void loadAllData();

    return () => {
      cancelled = true;
    };
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
    clearAuthSession();

    setCurrentUser(null);
    setMyApplications([]);
    setAllApplications([]);
    setIsNewJobModalOpen(false);
    setActiveTab('drives');
  };

  // Apply for a placement job.
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

  // Update an application status.
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

  // Post an interview experience.
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

  // Like an interview experience.
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

  // Show a loading screen while verifying an existing session.
  if (authChecking) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '12px',
          color: '#475569',
          background: '#f8fafc',
        }}
      >
        <GraduationCapFallback />
        <p>Checking your PlaceHub session...</p>
      </div>
    );
  }

  // Visitors without a valid session see the login page.
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
        onSelectDemoUser={() => { }}
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
              <span
                className="badge badge-blue"
                style={{ fontSize: '0.65rem' }}
              >
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

// Simple loading icon.
function GraduationCapFallback() {
  return (
    <div
      style={{
        width: '48px',
        height: '48px',
        borderRadius: '14px',
        background: '#dbeafe',
        color: '#2563eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        fontWeight: 800,
      }}
    >
      P
    </div>
  );
}