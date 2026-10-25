import React, { useState } from 'react';
import {
  ThumbsUp,
  Sparkles,
  Search,
  PlusCircle,
  Send,
} from 'lucide-react';
import { InterviewExperience, User } from '../types';

interface InterviewExperienceHubProps {
  experiences: InterviewExperience[];
  currentUser: User | null;
  onLikeExperience: (id: string) => Promise<void>;
  onPostExperience: (data: Partial<InterviewExperience>) => Promise<void>;
}

export default function InterviewExperienceHub({
  experiences,
  currentUser: _currentUser,
  onLikeExperience,
  onPostExperience,
}: InterviewExperienceHubProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [packageCTC, setPackageCTC] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [tips, setTips] = useState('');
  const [round1, setRound1] = useState('');
  const [round2, setRound2] = useState('');

  const filteredExps = experiences.filter((exp) => {
    return (
      exp.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.tips.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !role || !tips) return;

    await onPostExperience({
      company,
      role,
      packageCTC,
      difficulty,
      tips,
      rounds: [
        { roundName: 'Round 1: Online Assessment / Screening', details: round1 || 'DSA & Coding problem set' },
        { roundName: 'Round 2: Technical & Domain', details: round2 || 'System Design, Projects & Problem Solving' },
      ],
    });

    setModalOpen(false);
    setCompany('');
    setRole('');
    setPackageCTC('');
    setTips('');
    setRound1('');
    setRound2('');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>
            Campus Interview Experiences & Questions Archive
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Genuine round-by-round interview debriefs, question patterns, and preparation tips from placed seniors.
          </p>
        </div>

        <button onClick={() => setModalOpen(true)} className="btn btn-primary" style={{ padding: '10px 20px', borderRadius: '12px' }}>
          <PlusCircle size={16} />
          Share Your Experience
        </button>
      </div>

      {/* Search */}
      <div className="card" style={{ padding: '16px', marginBottom: '24px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search interview archives by company (Google, Microsoft) or keywords..."
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
      </div>

      {/* Experiences List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {filteredExps.map((exp) => (
          <div key={exp._id} className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>
                    {exp.company}
                  </h3>
                  <span className="badge badge-green">Offered ({exp.packageCTC})</span>
                  <span className={`badge ${exp.difficulty === 'Hard' ? 'badge-red' : exp.difficulty === 'Medium' ? 'badge-amber' : 'badge-blue'}`}>
                    {exp.difficulty} Difficulty
                  </span>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#475569', fontWeight: '600', marginTop: '4px' }}>
                  {exp.role} • Shared by <strong style={{ color: '#0f172a' }}>{exp.authorName}</strong> (Batch of {exp.batch})
                </div>
              </div>

              <button
                onClick={() => onLikeExperience(exp._id)}
                className="btn btn-secondary"
                style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '20px' }}
              >
                <ThumbsUp size={14} color="#2563eb" />
                <span>Helpful ({exp.likes || 0})</span>
              </button>
            </div>

            {/* Rounds */}
            <div style={{ marginBottom: '18px' }}>
              <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                Interview Rounds Breakdown
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {exp.rounds?.map((r, i) => (
                  <div key={i} style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '10px', borderLeft: '3px solid #2563eb' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0f172a', marginBottom: '3px' }}>
                      {r.roundName}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: '1.5' }}>
                      {r.details}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Candidate Tips */}
            <div style={{ background: '#eff6ff', borderRadius: '10px', padding: '14px 18px', border: '1px solid #dbeafe' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '700', color: '#1e40af', marginBottom: '4px' }}>
                <Sparkles size={16} />
                <span>Senior Advice & Winning Strategy</span>
              </div>
              <p style={{ fontSize: '0.86rem', color: '#1e3a8a', lineHeight: '1.5' }}>
                "{exp.tips}"
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Share Experience Modal */}
      {modalOpen && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Share Your Placement Experience</h3>
              <button onClick={() => setModalOpen(false)} style={{ background: '#f1f5f9', borderRadius: '50%', width: '30px', height: '30px' }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amazon"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>Job Role</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SDE-1 / Data Analyst"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>Package CTC</label>
                  <input
                    type="text"
                    placeholder="e.g. 18 LPA"
                    value={packageCTC}
                    onChange={(e) => setPackageCTC(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>Interview Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>Round 1 Details (OA / Coding)</label>
                <input
                  type="text"
                  placeholder="Questions asked, topics covered..."
                  value={round1}
                  onChange={(e) => setRound1(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>Round 2 Details (Technical / Projects)</label>
                <input
                  type="text"
                  placeholder="System design, project deep dive, questions..."
                  value={round2}
                  onChange={(e) => setRound2(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>Preparation Tips & Recommendations</label>
                <textarea
                  rows={3}
                  required
                  placeholder="What should juniors prepare? Any specific platform or topic to focus on?"
                  value={tips}
                  onChange={(e) => setTips(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Send size={15} /> Publish Experience
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
