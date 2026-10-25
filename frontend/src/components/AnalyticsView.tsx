import React from 'react';
import { BarChart3, Building } from 'lucide-react';
import { Stats } from '../types';

interface AnalyticsViewProps {
  stats: Stats | null;
}

export default function AnalyticsView({ stats }: AnalyticsViewProps) {
  if (!stats) return null;

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>
          Placement Statistics & Recruitment Intelligence
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          Comprehensive placement analytics, department performance, and compensation distributions.
        </p>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Department Placement Breakdown */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <BarChart3 size={20} color="#2563eb" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>Branch-wise Placement %</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {stats.branchWiseStats?.map((b) => (
              <div key={b.branch}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: '700', marginBottom: '6px' }}>
                  <span>{b.branch} Engineering</span>
                  <span style={{ color: '#059669' }}>{b.percentage}% Placed ({b.avgCTC} avg)</span>
                </div>
                <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #3b82f6, #10b981)',
                    width: `${b.percentage}%`,
                    borderRadius: '999px',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Recruiters */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <Building size={20} color="#7c3aed" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>Top Recruiting Partners</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px' }}>
            {stats.topRecruiters?.map((rec) => (
              <div key={rec.name} style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px 12px',
                textAlign: 'center',
              }}>
                <div style={{ height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                  <img
                    src={rec.logo}
                    alt={rec.name}
                    style={{ maxHeight: '28px', maxWidth: '80px', objectFit: 'contain' }}
                  />
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0f172a' }}>{rec.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: '600', marginTop: '2px' }}>
                  {rec.offers} Offers
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary KPI Highlights */}
      <div className="card" style={{ marginTop: '24px', background: 'linear-gradient(135deg, #f8fafc, #edf2f7)', border: '1px solid #cbd5e1' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '16px' }}>
          Placement Season Summary Highlights
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700' }}>TOTAL ELIGIBLE</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>{stats.totalEligibleStudents} Students</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700' }}>TOTAL OFFERS RELEASED</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#2563eb' }}>{stats.totalOffers} Offers</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700' }}>MEDIAN CTC</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#059669' }}>{stats.medianCTC}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700' }}>PLACEMENT SUCCESS</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#7c3aed' }}>{stats.placementPercentage}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
