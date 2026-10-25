import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Briefcase,
} from 'lucide-react';
import { Job, User, Application } from '../types';

interface JobBoardProps {
  jobs: Job[];
  currentUser: User | null;
  myApplications: Application[];
  onApplyJob: (jobId: string) => Promise<void>;
  onOpenNewJobModal: () => void;
}

export default function JobBoard({
  jobs,
  currentUser,
  myApplications,
  onApplyJob,
  onOpenNewJobModal,
}: JobBoardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [selectedJobModal, setSelectedJobModal] = useState<Job | null>(null);
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Filter jobs
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === 'All' || job.type === selectedType;
    const matchesBranch =
      selectedBranch === 'All' ||
      !job.eligibleBranches ||
      job.eligibleBranches.includes(selectedBranch);

    return matchesSearch && matchesType && matchesBranch;
  });

  const isApplied = (jobId: string) => {
    return myApplications?.some((app) => app.jobId === jobId);
  };

  const handleApply = async (job: Job) => {
    // Check CGPA
    if (currentUser?.role === 'student' && currentUser?.cgpa && currentUser.cgpa < job.minCGPA) {
      setAlertMessage({
        type: 'error',
        text: `Application Blocked: Your CGPA is ${currentUser.cgpa}, but this drive requires a minimum of ${job.minCGPA} CGPA.`,
      });
      setTimeout(() => setAlertMessage(null), 5000);
      return;
    }

    try {
      setApplyingJobId(job._id);
      await onApplyJob(job._id);
      setAlertMessage({
        type: 'success',
        text: `Application submitted successfully to ${job.company} for "${job.title}"!`,
      });
      setTimeout(() => setAlertMessage(null), 5000);
    } catch (err: any) {
      setAlertMessage({ type: 'error', text: err.message || 'Failed to submit application.' });
      setTimeout(() => setAlertMessage(null), 5000);
    } finally {
      setApplyingJobId(null);
    }
  };

  return (
    <div>
      {/* Alert toast */}
      {alertMessage && (
        <div style={{
          position: 'fixed',
          top: '85px',
          right: '24px',
          zIndex: 1000,
          background: alertMessage.type === 'success' ? '#10b981' : '#ef4444',
          color: 'white',
          padding: '14px 22px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.9rem',
          fontWeight: '600',
          maxWidth: '450px',
        }}>
          {alertMessage.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
          <span>{alertMessage.text}</span>
        </div>
      )}

      {/* Header & Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px',
      }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>
            Active Campus Placement & Internship Drives
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Browse upcoming on-campus recruitment schedules, eligibility criteria, and CTC packages.
          </p>
        </div>

        {(currentUser?.role === 'admin' || currentUser?.role === 'alumni') && (
          <button
            onClick={onOpenNewJobModal}
            className="btn btn-primary"
            style={{ padding: '10px 20px', borderRadius: '12px' }}
          >
            <Sparkles size={16} />
            {currentUser?.role === 'admin' ? 'Post Campus Drive' : 'Post Alumni Referral'}
          </button>
        )}
      </div>

      {/* Search and Filters Bar */}
      <div className="card" style={{ padding: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', gridColumn: 'span 2' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by company (e.g. Google, Microsoft) or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px 11px 42px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
              }}
            />
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
                background: 'white',
              }}
            >
              <option value="All">All Job Types</option>
              <option value="Full-Time">Full-Time Placement</option>
              <option value="Internship">Summer Internship</option>
              <option value="Alumni Referral">Alumni Referral</option>
            </select>
          </div>

          {/* Branch Filter */}
          <div>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
                background: 'white',
              }}
            >
              <option value="All">All Engineering Branches</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics & Comm.">Electronics & Comm.</option>
              <option value="Electrical">Electrical</option>
              <option value="Mechanical">Mechanical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
        {filteredJobs.map((job) => {
          const applied = isApplied(job._id);
          const meetsCGPA = !currentUser?.cgpa || currentUser.cgpa >= job.minCGPA;

          return (
            <div
              key={job._id}
              className="card interactive-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderLeft: job.type === 'Alumni Referral' ? '4px solid #8b5cf6' : '4px solid #2563eb',
              }}
            >
              <div>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      border: '1px solid #f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#ffffff',
                      overflow: 'hidden',
                      padding: '4px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    }}>
                      <img
                        src={job.logo || 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&q=80&w=200'}
                        alt={job.company}
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&q=80&w=200';
                        }}
                      />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', lineHeight: '1.2' }}>
                        {job.title}
                      </h3>
                      <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#64748b' }}>
                        {job.company}
                      </span>
                    </div>
                  </div>

                  <span className={`badge ${job.type === 'Alumni Referral' ? 'badge-purple' : job.type === 'Internship' ? 'badge-amber' : 'badge-blue'}`}>
                    {job.type}
                  </span>
                </div>

                {/* Package & Location */}
                <div style={{
                  background: '#f8fafc',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  marginBottom: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '600' }}>Compensation (CTC)</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#059669' }}>{job.packageCTC}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '600' }}>Minimum CGPA</div>
                    <div style={{
                      fontSize: '0.95rem',
                      fontWeight: '700',
                      color: meetsCGPA ? '#0f172a' : '#ef4444',
                    }}>
                      {job.minCGPA}+ CGPA
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px', fontSize: '0.82rem', color: '#475569' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={15} color="#94a3b8" />
                    <span>{job.location}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={15} color="#94a3b8" />
                    <span>Deadline: {new Date(job.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>

                {/* Branches */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                  {job.eligibleBranches?.map((branch, i) => (
                    <span key={i} style={{
                      background: '#f1f5f9',
                      color: '#475569',
                      fontSize: '0.72rem',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      fontWeight: '500',
                    }}>
                      {branch}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions Footer */}
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setSelectedJobModal(job)}
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: '8px 12px', fontSize: '0.8rem' }}
                >
                  View Details
                </button>

                {currentUser?.role === 'student' ? (
                  applied ? (
                    <button
                      disabled
                      className="btn"
                      style={{
                        flex: 1,
                        background: '#ecfdf5',
                        color: '#059669',
                        border: '1px solid #a7f3d0',
                        fontSize: '0.8rem',
                        cursor: 'default',
                      }}
                    >
                      <CheckCircle size={15} /> Applied
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApply(job)}
                      disabled={applyingJobId === job._id}
                      className="btn btn-primary"
                      style={{
                        flex: 1,
                        fontSize: '0.8rem',
                        opacity: meetsCGPA ? 1 : 0.65,
                      }}
                    >
                      {applyingJobId === job._id ? 'Submitting...' : 'Apply Now'}
                      <ArrowRight size={14} />
                    </button>
                  )
                ) : (
                  <button
                    onClick={() => setSelectedJobModal(job)}
                    className="btn btn-primary"
                    style={{ flex: 1, fontSize: '0.8rem' }}
                  >
                    Manage Drive
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredJobs.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
          <Briefcase size={48} color="#cbd5e1" style={{ margin: '0 auto 16px auto' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1e293b' }}>No matching drives found</h3>
          <p style={{ fontSize: '0.9rem', marginTop: '6px' }}>Try adjusting your search criteria or branch filters.</p>
        </div>
      )}

      {/* Job Details Modal */}
      {selectedJobModal && (
        <div className="modal-backdrop" onClick={() => setSelectedJobModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <img
                  src={selectedJobModal.logo || 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&q=80&w=200'}
                  alt={selectedJobModal.company}
                  style={{ width: '56px', height: '56px', borderRadius: '12px', objectFit: 'contain', border: '1px solid #e2e8f0', padding: '6px' }}
                />
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: '800' }}>{selectedJobModal.title}</h3>
                  <div style={{ color: '#64748b', fontWeight: '600' }}>{selectedJobModal.company} • {selectedJobModal.location}</div>
                </div>
              </div>
              <button
                onClick={() => setSelectedJobModal(null)}
                style={{ background: '#f1f5f9', borderRadius: '50%', width: '32px', height: '32px', fontSize: '1.1rem' }}
              >
                ✕
              </button>
            </div>

            <div style={{ background: '#eff6ff', borderRadius: '12px', padding: '16px', marginBottom: '20px', display: 'flex', justifyContent: 'space-around' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>OFFERED CTC</div>
                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#2563eb' }}>{selectedJobModal.packageCTC}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>ELIGIBILITY</div>
                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a' }}>{selectedJobModal.minCGPA}+ CGPA</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>TYPE</div>
                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#7c3aed' }}>{selectedJobModal.type}</div>
              </div>
            </div>

            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '8px' }}>Job Description</h4>
            <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '20px' }}>
              {selectedJobModal.description}
            </p>

            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '8px' }}>Key Requirements</h4>
            <ul style={{ paddingLeft: '20px', color: '#475569', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '20px' }}>
              {selectedJobModal.requirements?.map((req, idx) => (
                <li key={idx}>{req}</li>
              ))}
            </ul>

            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '8px' }}>Selection Process & Rounds</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              {selectedJobModal.rounds?.map((round, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600' }}>
                  <span style={{ background: '#2563eb', color: 'white', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>
                    {idx + 1}
                  </span>
                  <span>{round}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setSelectedJobModal(null)} className="btn btn-secondary">
                Close
              </button>
              {currentUser?.role === 'student' && !isApplied(selectedJobModal._id) && (
                <button
                  onClick={() => {
                    handleApply(selectedJobModal);
                    setSelectedJobModal(null);
                  }}
                  className="btn btn-primary"
                >
                  Confirm & Apply
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
