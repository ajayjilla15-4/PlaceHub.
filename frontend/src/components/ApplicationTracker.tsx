import React from 'react';
import {
  Calendar,
  Briefcase,
} from 'lucide-react';
import { Application } from '../types';

interface ApplicationTrackerProps {
  applications: Application[];
  onBrowseDrives: () => void;
}

const stages = ['Applied', 'Shortlisted', 'Interview Scheduled', 'Selected'];

export default function ApplicationTracker({ applications, onBrowseDrives }: ApplicationTrackerProps) {
  const getStageIndex = (status: string) => {
    if (status === 'Rejected') return -1;
    return stages.indexOf(status);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Selected':
        return <span className="badge badge-green">Offer Released 🎉</span>;
      case 'Interview Scheduled':
        return <span className="badge badge-purple">Interview Stage</span>;
      case 'Shortlisted':
        return <span className="badge badge-blue">Shortlisted for OA</span>;
      case 'Rejected':
        return <span className="badge badge-red">Application Closed</span>;
      default:
        return <span className="badge badge-amber">Under Review</span>;
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>
          My Campus Recruitment Applications
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          Real-time tracking of your placement applications, interview rounds, and selection status.
        </p>
      </div>

      {applications && applications.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {applications.map((app) => {
            const currentStageIdx = getStageIndex(app.status);

            return (
              <div key={app._id} className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a' }}>
                        {app.company}
                      </h3>
                      {getStatusBadge(app.status)}
                    </div>
                    <div style={{ color: '#475569', fontWeight: '600', fontSize: '0.95rem', marginTop: '2px' }}>
                      {app.jobTitle} • <span style={{ color: '#059669', fontWeight: '700' }}>{app.packageCTC}</span>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} />
                    <span>Applied on: {new Date(app.appliedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Progress Pipeline */}
                {app.status !== 'Rejected' ? (
                  <div style={{ margin: '20px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                      {/* Connecting Line */}
                      <div style={{
                        position: 'absolute',
                        top: '14px',
                        left: '20px',
                        right: '20px',
                        height: '3px',
                        background: '#e2e8f0',
                        zIndex: 1,
                      }}>
                        <div style={{
                          height: '100%',
                          background: '#10b981',
                          width: `${Math.max(0, (currentStageIdx / (stages.length - 1)) * 100)}%`,
                          transition: 'width 0.4s ease',
                        }} />
                      </div>

                      {stages.map((stg, i) => {
                        const isDone = i <= currentStageIdx;
                        const isCurrent = i === currentStageIdx;

                        return (
                          <div key={stg} style={{ position: 'relative', zIndex: 2, textAlign: 'center', minWidth: '70px' }}>
                            <div style={{
                              width: '30px',
                              height: '30px',
                              borderRadius: '50%',
                              background: isDone ? (isCurrent ? '#2563eb' : '#10b981') : '#ffffff',
                              border: isDone ? 'none' : '2px solid #cbd5e1',
                              color: isDone ? 'white' : '#94a3b8',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              margin: '0 auto 8px auto',
                              fontSize: '0.75rem',
                              fontWeight: '700',
                              boxShadow: isCurrent ? '0 0 0 4px rgba(37,99,235,0.2)' : 'none',
                            }}>
                              {isDone ? '✓' : i + 1}
                            </div>
                            <span style={{
                              fontSize: '0.75rem',
                              fontWeight: isCurrent ? '700' : '500',
                              color: isCurrent ? '#0f172a' : '#64748b',
                            }}>
                              {stg}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '10px', padding: '12px', color: '#991b1b', fontSize: '0.85rem' }}>
                    Status Update: The drive for this company has reached capacity or the profile was not shortlisted for subsequent rounds.
                  </div>
                )}

                {/* Notes from placement cell */}
                {app.notes && (
                  <div style={{
                    background: '#f8fafc',
                    borderRadius: '10px',
                    padding: '12px 16px',
                    borderLeft: '4px solid #3b82f6',
                    marginTop: '16px',
                    fontSize: '0.85rem',
                    color: '#334155',
                  }}>
                    <strong style={{ color: '#0f172a' }}>TPO Announcement / Update: </strong>
                    {app.notes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
          <Briefcase size={48} color="#cbd5e1" style={{ margin: '0 auto 16px auto' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1e293b' }}>No active applications yet</h3>
          <p style={{ fontSize: '0.9rem', marginTop: '6px', marginBottom: '16px' }}>
            Check out open placement and internship drives and apply directly.
          </p>
          <button onClick={onBrowseDrives} className="btn btn-primary" style={{ margin: '0 auto' }}>
            Explore Placement Drives
          </button>
        </div>
      )}
    </div>
  );
}
