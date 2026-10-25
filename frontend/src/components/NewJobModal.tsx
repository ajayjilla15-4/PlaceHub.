import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { User, Job } from '../types';

interface NewJobModalProps {
  currentUser: User | null;
  onClose: () => void;
  onCreateJob: (jobData: Partial<Job>) => Promise<void>;
}

export default function NewJobModal({ currentUser, onClose, onCreateJob }: NewJobModalProps) {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState(currentUser?.company || '');
  const [packageCTC, setPackageCTC] = useState('');
  const [minCGPA, setMinCGPA] = useState('7.0');
  const [type, setType] = useState(currentUser?.role === 'alumni' ? 'Alumni Referral' : 'Full-Time');
  const [location, setLocation] = useState('Bangalore / Hyderabad, India');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [selectedBranches, setSelectedBranches] = useState<string[]>([
    'Computer Science',
    'Information Technology',
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const branches = [
    'Computer Science',
    'Information Technology',
    'Electronics & Comm.',
    'Electrical',
    'Mechanical',
    'Civil',
  ];

  const handleBranchToggle = (branch: string) => {
    if (selectedBranches.includes(branch)) {
      setSelectedBranches(selectedBranches.filter((b) => b !== branch));
    } else {
      setSelectedBranches([...selectedBranches, branch]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !company || !packageCTC) return;

    try {
      setIsSubmitting(true);
      await onCreateJob({
        title,
        company,
        packageCTC,
        minCGPA: Number(minCGPA),
        type,
        location,
        description: description || 'Campus placement drive for final year candidates.',
        eligibleBranches: selectedBranches,
        deadline: deadline || new Date(Date.now() + 14 * 86400000).toISOString(),
        rounds: ['Resume Screening', 'Online Assessment', 'Technical Interview', 'HR Round'],
      });
      onClose();
    } catch (err: any) {
      alert(err.message || 'Error posting drive');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800' }}>
              {currentUser?.role === 'admin' ? 'Publish Campus Placement Drive' : 'Post Alumni Referral Opportunity'}
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Create an official recruitment opening for students to apply directly.
            </p>
          </div>
          <button onClick={onClose} style={{ background: '#f1f5f9', borderRadius: '50%', width: '32px', height: '32px' }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>
                Job Role / Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Software Engineer - Cloud"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>
                Hiring Organization / Company
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Oracle, Goldman Sachs"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>
                Package (CTC)
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 22.0 LPA"
                value={packageCTC}
                onChange={(e) => setPackageCTC(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>
                Minimum CGPA
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={minCGPA}
                onChange={(e) => setMinCGPA(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>
                Drive Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Internship">Internship</option>
                <option value="Alumni Referral">Alumni Referral</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>
                Job Location
              </label>
              <input
                type="text"
                placeholder="e.g. Bangalore / Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>
                Application Deadline
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>
              Eligible Engineering Branches
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {branches.map((b) => {
                const selected = selectedBranches.includes(b);
                return (
                  <button
                    type="button"
                    key={b}
                    onClick={() => handleBranchToggle(b)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      border: selected ? '1px solid #2563eb' : '1px solid #cbd5e1',
                      background: selected ? '#eff6ff' : 'white',
                      color: selected ? '#2563eb' : '#475569',
                    }}
                  >
                    {selected ? '✓ ' : ''}{b}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>
              Job Overview & Qualifications
            </label>
            <textarea
              rows={3}
              placeholder="Outline roles, responsibilities, technical stacks..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
              <Sparkles size={15} />
              {isSubmitting ? 'Publishing...' : 'Publish Drive'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
