import React, { useState } from 'react';
import {
  Search,
  ExternalLink,
  MessageSquare,
  Sparkles,
  CheckCircle,
  Send,
} from 'lucide-react';
import { Alumni, User, MentorshipRequestData } from '../types';

interface AlumniDirectoryProps {
  alumni: Alumni[];
  currentUser: User | null;
  onRequestMentorship: (data: MentorshipRequestData) => Promise<any>;
}

export default function AlumniDirectory({ alumni, currentUser: _currentUser, onRequestMentorship }: AlumniDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [selectedBatch, setSelectedBatch] = useState('All');
  const [mentorshipModalAlumni, setMentorshipModalAlumni] = useState<Alumni | null>(null);
  const [mentorshipTopic, setMentorshipTopic] = useState('Career Guidance');
  const [mentorshipMessage, setMentorshipMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const filteredAlumni = alumni.filter((alum) => {
    const matchesSearch =
      alum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (alum.company && alum.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (alum.designation && alum.designation.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCompany = selectedCompany === 'All' || alum.company === selectedCompany;
    const matchesBatch = selectedBatch === 'All' || alum.graduationYear === Number(selectedBatch);

    return matchesSearch && matchesCompany && matchesBatch;
  });

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mentorshipModalAlumni || !mentorshipMessage.trim()) return;

    try {
      setIsSending(true);
      await onRequestMentorship({
        alumniId: mentorshipModalAlumni._id,
        alumniName: mentorshipModalAlumni.name,
        topic: mentorshipTopic,
        message: mentorshipMessage,
      });

      setFeedback({
        type: 'success',
        text: `Mentorship request sent to ${mentorshipModalAlumni.name}! They will receive an email notification.`,
      });
      setMentorshipModalAlumni(null);
      setMentorshipMessage('');
      setTimeout(() => setFeedback(null), 5000);
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message || 'Failed to send mentorship request.' });
      setTimeout(() => setFeedback(null), 5000);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div>
      {/* Toast Alert */}
      {feedback && (
        <div style={{
          position: 'fixed',
          top: '85px',
          right: '24px',
          zIndex: 1000,
          background: feedback.type === 'success' ? '#10b981' : '#ef4444',
          color: 'white',
          padding: '14px 22px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.9rem',
          fontWeight: '600',
        }}>
          <CheckCircle size={18} />
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>
          College Alumni & Mentorship Network
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          Connect with graduates working at top tech firms, request internal referrals, and schedule mock interviews.
        </p>
      </div>

      {/* Filter Controls */}
      <div className="card" style={{ padding: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          <div style={{ position: 'relative', gridColumn: 'span 2' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search alumni by name, company (Google, Microsoft) or domain..."
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

          <div>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
                background: 'white',
              }}
            >
              <option value="All">All Companies</option>
              <option value="Google">Google</option>
              <option value="Microsoft">Microsoft</option>
              <option value="Amazon">Amazon</option>
              <option value="Atlassian">Atlassian</option>
            </select>
          </div>

          <div>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
                background: 'white',
              }}
            >
              <option value="All">All Graduation Batches</option>
              <option value="2024">Batch of 2024</option>
              <option value="2023">Batch of 2023</option>
              <option value="2022">Batch of 2022</option>
              <option value="2021">Batch of 2021</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alumni Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
        {filteredAlumni.map((alum) => (
          <div key={alum._id} className="card interactive-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '14px' }}>
                <img
                  src={alum.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'}
                  alt={alum.name}
                  style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #3b82f6' }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>{alum.name}</h3>
                    <span className="badge badge-green" style={{ fontSize: '0.68rem' }}>Alumni</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#2563eb' }}>
                    {alum.designation} @ {alum.company}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    Class of {alum.graduationYear} • {alum.branch}
                  </div>
                </div>
              </div>

              {alum.bio && (
                <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: '1.5', marginBottom: '14px', fontStyle: 'italic', background: '#f8fafc', padding: '10px 12px', borderRadius: '8px' }}>
                  "{alum.bio}"
                </p>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#059669', marginBottom: '16px', fontWeight: '600' }}>
                <Sparkles size={14} />
                <span>Open for 1:1 Mentorship & Referrals</span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px', display: 'flex', gap: '10px' }}>
              {alum.linkedin && (
                <a
                  href={alum.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                >
                  <ExternalLink size={14} color="#0077b5" />
                  LinkedIn
                </a>
              )}

              <button
                onClick={() => setMentorshipModalAlumni(alum)}
                className="btn btn-primary"
                style={{ flex: 1, padding: '8px 12px', fontSize: '0.8rem' }}
              >
                <MessageSquare size={15} />
                Request Mentorship
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mentorship Modal */}
      {mentorshipModalAlumni && (
        <div className="modal-backdrop" onClick={() => setMentorshipModalAlumni(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>
                  Connect with {mentorshipModalAlumni.name}
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
                  {mentorshipModalAlumni.designation} at {mentorshipModalAlumni.company}
                </p>
              </div>
              <button
                onClick={() => setMentorshipModalAlumni(null)}
                style={{ background: '#f1f5f9', borderRadius: '50%', width: '30px', height: '30px' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendRequest}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px' }}>
                  Select Topic
                </label>
                <select
                  value={mentorshipTopic}
                  onChange={(e) => setMentorshipTopic(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                >
                  <option value="Resume Review">Resume Review & ATS Feedback</option>
                  <option value="Referral Request">Internal Referral Request</option>
                  <option value="Mock Interview">Mock Interview (DSA / System Design)</option>
                  <option value="Career Guidance">General Career & Role Transition Advice</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px' }}>
                  Message to Alumni
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder={`Hi ${mentorshipModalAlumni.name.split(' ')[0]}, I am a pre-final year student interested in joining ${mentorshipModalAlumni.company}...`}
                  value={mentorshipMessage}
                  onChange={(e) => setMentorshipMessage(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setMentorshipModalAlumni(null)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSending}
                  className="btn btn-primary"
                >
                  <Send size={15} />
                  {isSending ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
