import React, { useState } from 'react';
import {
  GraduationCap,
  Briefcase,
  Users,
  BookOpen,
  BarChart3,
  UserCheck,
  ShieldAlert,
  ChevronDown,
  CheckCircle,
} from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User | null;
  onSelectDemoUser: (role: string) => void;
  onLogout: () => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  currentUser,
  onSelectDemoUser,
  onLogout: _onLogout,
}: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header style={{
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backdropFilter: 'blur(8px)',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px',
      }}>
        {/* Logo */}
        <div
          onClick={() => setActiveTab('drives')}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            color: 'white',
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(37,99,235,0.25)',
          }}>
            <GraduationCap size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em' }}>
                PlaceHub
              </span>
              <span className="badge badge-blue" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                Campus Edition
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '500' }}>
              Placement & Alumni Portal
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            onClick={() => setActiveTab('drives')}
            className="btn"
            style={{
              background: activeTab === 'drives' ? '#eff6ff' : 'transparent',
              color: activeTab === 'drives' ? '#2563eb' : '#475569',
              fontWeight: activeTab === 'drives' ? '700' : '500',
            }}
          >
            <Briefcase size={17} />
            Placement Drives
          </button>

          <button
            onClick={() => setActiveTab('alumni')}
            className="btn"
            style={{
              background: activeTab === 'alumni' ? '#eff6ff' : 'transparent',
              color: activeTab === 'alumni' ? '#2563eb' : '#475569',
              fontWeight: activeTab === 'alumni' ? '700' : '500',
            }}
          >
            <Users size={17} />
            Alumni Network
          </button>

          <button
            onClick={() => setActiveTab('experiences')}
            className="btn"
            style={{
              background: activeTab === 'experiences' ? '#eff6ff' : 'transparent',
              color: activeTab === 'experiences' ? '#2563eb' : '#475569',
              fontWeight: activeTab === 'experiences' ? '700' : '500',
            }}
          >
            <BookOpen size={17} />
            Interview Experiences
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className="btn"
            style={{
              background: activeTab === 'stats' ? '#eff6ff' : 'transparent',
              color: activeTab === 'stats' ? '#2563eb' : '#475569',
              fontWeight: activeTab === 'stats' ? '700' : '500',
            }}
          >
            <BarChart3 size={17} />
            Placement Analytics
          </button>

          {currentUser?.role === 'student' && (
            <button
              onClick={() => setActiveTab('applications')}
              className="btn"
              style={{
                background: activeTab === 'applications' ? '#eff6ff' : 'transparent',
                color: activeTab === 'applications' ? '#2563eb' : '#475569',
                fontWeight: activeTab === 'applications' ? '700' : '500',
              }}
            >
              <UserCheck size={17} />
              My Applications
            </button>
          )}

          {currentUser?.role === 'admin' && (
            <button
              onClick={() => setActiveTab('admin')}
              className="btn"
              style={{
                background: activeTab === 'admin' ? '#fef2f2' : 'transparent',
                color: activeTab === 'admin' ? '#ef4444' : '#475569',
                fontWeight: activeTab === 'admin' ? '700' : '500',
              }}
            >
              <ShieldAlert size={17} />
              TPO Admin Hub
            </button>
          )}
        </nav>

        {/* User Account / Role Switcher */}
        <div style={{ position: 'relative' }}>
          <div
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 12px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              cursor: 'pointer',
              background: '#f8fafc',
            }}
          >
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
              alt={currentUser?.name}
              style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div style={{ textAlign: 'left', lineHeight: '1.2' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0f172a' }}>
                {currentUser?.name || 'Rahul Sharma'}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'capitalize' }}>
                {currentUser?.role === 'admin' ? 'TPO Officer' : currentUser?.role}
              </div>
            </div>
            <ChevronDown size={15} color="#94a3b8" />
          </div>

          {/* Quick Demo Role Switcher Dropdown */}
          {dropdownOpen && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '50px',
              width: '280px',
              background: 'white',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
              padding: '12px',
              zIndex: 100,
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', padding: '4px 8px 8px 8px', borderBottom: '1px solid #f1f5f9' }}>
                Quick Demo Switcher
              </div>

              <div
                onClick={() => { onSelectDemoUser('student'); setDropdownOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  background: currentUser?.role === 'student' ? '#eff6ff' : 'transparent',
                }}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563eb' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>Rahul Sharma</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Student (CGPA 8.9)</div>
                </div>
                {currentUser?.role === 'student' && <CheckCircle size={16} color="#2563eb" />}
              </div>

              <div
                onClick={() => { onSelectDemoUser('alumni'); setDropdownOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  background: currentUser?.role === 'alumni' ? '#ecfdf5' : 'transparent',
                }}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>Arjun Mehta</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Alumni (SDE @ Google)</div>
                </div>
                {currentUser?.role === 'alumni' && <CheckCircle size={16} color="#10b981" />}
              </div>

              <div
                onClick={() => { onSelectDemoUser('admin'); setDropdownOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  background: currentUser?.role === 'admin' ? '#fef2f2' : 'transparent',
                }}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>Dr. Ramesh Kulkarni</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Placement Officer (TPO)</div>
                </div>
                {currentUser?.role === 'admin' && <CheckCircle size={16} color="#ef4444" />}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
