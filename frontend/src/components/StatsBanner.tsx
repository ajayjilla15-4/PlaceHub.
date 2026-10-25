import React from 'react';
import { TrendingUp, Award, Building2, Users2, Sparkles, CheckCircle2 } from 'lucide-react';
import { Stats } from '../types';

interface StatsBannerProps {
  stats: Stats | null;
}

export default function StatsBanner({ stats }: StatsBannerProps) {
  if (!stats) return null;

  return (
    <div style={{ marginBottom: '32px' }}>
      {/* Hero Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        borderRadius: '20px',
        padding: '32px',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 25px -5px rgba(15, 23, 42, 0.25)',
        marginBottom: '24px',
      }}>
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '240px',
          height: '240px',
          background: 'radial-gradient(circle, rgba(37,99,235,0.4) 0%, rgba(37,99,235,0) 70%)',
          borderRadius: '50%',
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 2, flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ maxWidth: '650px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.1)', padding: '6px 14px', borderRadius: '999px', fontSize: '0.8rem', marginBottom: '12px', backdropFilter: 'blur(4px)' }}>
              <Sparkles size={14} color="#60a5fa" />
              <span>Campus Placement Season 2025–2026 Live</span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', lineHeight: '1.2', letterSpacing: '-0.02em', marginBottom: '10px' }}>
              Your Gateway to Dream Careers & Alumni Mentorship
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.5' }}>
              Connect directly with Tier-1 recruiters, get alumni referrals, practice verified interview experiences, and fast-track your placements.
            </p>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '16px',
            padding: '20px 28px',
            backdropFilter: 'blur(10px)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.05em' }}>
              Overall Placement Rate
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#38bdf8', margin: '4px 0' }}>
              {stats.placementPercentage || 92.1}%
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#4ade80', justifyContent: 'center' }}>
              <CheckCircle2 size={14} />
              <span>{stats.totalPlaced || 442} Students Placed</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
      }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
          <div style={{ background: '#ecfdf5', color: '#059669', padding: '14px', borderRadius: '14px' }}>
            <Award size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Highest Package</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a' }}>{stats.highestCTC || '54.0 LPA'}</div>
            <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '600' }}>International Tier-1</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
          <div style={{ background: '#eff6ff', color: '#2563eb', padding: '14px', borderRadius: '14px' }}>
            <TrendingUp size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Average Package</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a' }}>{stats.averageCTC || '14.2 LPA'}</div>
            <div style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: '600' }}>Across All Branches</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
          <div style={{ background: '#fffbeb', color: '#d97706', padding: '14px', borderRadius: '14px' }}>
            <Building2 size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Active Drives</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a' }}>{stats.activeDrives || 4} Open</div>
            <div style={{ fontSize: '0.75rem', color: '#d97706', fontWeight: '600' }}>Apply before deadline</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
          <div style={{ background: '#f5f3ff', color: '#7c3aed', padding: '14px', borderRadius: '14px' }}>
            <Users2 size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Alumni Mentors</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a' }}>500+ Connected</div>
            <div style={{ fontSize: '0.75rem', color: '#7c3aed', fontWeight: '600' }}>FAANG & Top MNCs</div>
          </div>
        </div>
      </div>
    </div>
  );
}
