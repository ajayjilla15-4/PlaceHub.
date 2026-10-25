import React, { useState } from 'react';
import {
  Sparkles,
  Search,
} from 'lucide-react';
import { Application, Job } from '../types';

interface AdminDashboardProps {
  applications: Application[];
  jobs: Job[];
  onUpdateAppStatus: (appId: string, newStatus: string) => Promise<void>;
  onOpenNewJobModal: () => void;
}

export default function AdminDashboard({
  applications,
  jobs: _jobs,
  onUpdateAppStatus,
  onOpenNewJobModal,
}: AdminDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (appId: string, newStatus: string) => {
    setUpdatingId(appId);
    await onUpdateAppStatus(appId, newStatus);
    setUpdatingId(null);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-red">TPO Portal</span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>
              Training & Placement Officer (TPO) Control Center
            </h2>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Manage campus placement drives, shortlist student applicants, schedule interview rounds, and record offers.
          </p>
        </div>

        <button onClick={onOpenNewJobModal} className="btn btn-primary" style={{ padding: '10px 20px', borderRadius: '12px' }}>
          <Sparkles size={16} />
          Create New Placement Drive
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="card" style={{ padding: '18px' }}>
          <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '600' }}>TOTAL APPLICANTS</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a' }}>{applications.length}</div>
        </div>
        <div className="card" style={{ padding: '18px' }}>
          <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '600' }}>SHORTLISTED</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#2563eb' }}>
            {applications.filter((a) => a.status === 'Shortlisted').length}
          </div>
        </div>
        <div className="card" style={{ padding: '18px' }}>
          <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '600' }}>IN INTERVIEW ROUNDS</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#7c3aed' }}>
            {applications.filter((a) => a.status === 'Interview Scheduled').length}
          </div>
        </div>
        <div className="card" style={{ padding: '18px' }}>
          <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '600' }}>OFFERS EXTENDED</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#059669' }}>
            {applications.filter((a) => a.status === 'Selected').length}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: '16px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Filter by student name, company, or job role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '10px 14px 10px 42px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white' }}
          >
            <option value="All">All Application Stages</option>
            <option value="Applied">Applied</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Interview Scheduled">Interview Scheduled</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '14px 20px' }}>Student</th>
                <th style={{ padding: '14px 20px' }}>Company & Role</th>
                <th style={{ padding: '14px 20px' }}>CTC</th>
                <th style={{ padding: '14px 20px' }}>Date</th>
                <th style={{ padding: '14px 20px' }}>Current Status</th>
                <th style={{ padding: '14px 20px' }}>Update Stage</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.map((app) => (
                <tr key={app._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>{app.studentName}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{app.studentEmail}</div>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>{app.company}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{app.jobTitle}</div>
                  </td>
                  <td style={{ padding: '14px 20px', fontWeight: '700', color: '#059669' }}>
                    {app.packageCTC}
                  </td>
                  <td style={{ padding: '14px 20px', color: '#64748b', fontSize: '0.82rem' }}>
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span className={`badge ${
                      app.status === 'Selected' ? 'badge-green' :
                      app.status === 'Interview Scheduled' ? 'badge-purple' :
                      app.status === 'Shortlisted' ? 'badge-blue' :
                      app.status === 'Rejected' ? 'badge-red' : 'badge-amber'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <select
                      value={app.status}
                      disabled={updatingId === app._id}
                      onChange={(e) => handleStatusChange(app._id, e.target.value)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.82rem',
                        background: 'white',
                        fontWeight: '600',
                      }}
                    >
                      <option value="Applied">Applied</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Interview Scheduled">Interview Scheduled</option>
                      <option value="Selected">Selected</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
