import React, { useState } from 'react';
import {
  GraduationCap,
  Briefcase,
  Users,
  BookOpen,
  BarChart3,
  ChevronDown,
  LogOut,
} from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User | null;
  onSelectDemoUser: (role: string) => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onLogout,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navItems = [
    {
      id: 'drives',
      label: 'Placement Drives',
      icon: Briefcase,
      roles: ['student', 'alumni', 'admin'],
    },
    {
      id: 'applications',
      label: 'My Applications',
      icon: BookOpen,
      roles: ['student'],
    },
    {
      id: 'alumni',
      label: 'Alumni Network',
      icon: Users,
      roles: ['student', 'alumni', 'admin'],
    },
    {
      id: 'interviews',
      label: 'Interview Experiences',
      icon: GraduationCap,
      roles: ['student', 'alumni', 'admin'],
    },
    {
      id: 'dashboard',
      label: 'Admin Dashboard',
      icon: BarChart3,
      roles: ['admin'],
    },
  ];

  const visibleNavItems = navItems.filter((item) =>
    currentUser ? item.roles.includes(currentUser.role) : false
  );

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'TPO Officer';
      case 'student':
        return 'Student';
      case 'alumni':
        return 'Alumni';
      default:
        return role;
    }
  };

  return (
    <header
      style={{
        width: '100%',
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '12px 24px',
          minHeight: '76px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          flexWrap: 'wrap',
        }}
      >
        {/* PlaceHub Logo */}
        <button
          type="button"
          onClick={() => setActiveTab('drives')}
          aria-label="Go to Placement Drives"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            padding: 0,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: '#2563eb',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <GraduationCap size={25} />
          </div>

          <div style={{ textAlign: 'left' }}>
            <div
              style={{
                fontSize: '1.35rem',
                fontWeight: 800,
                color: '#0f172a',
                lineHeight: 1.2,
              }}
            >
              PlaceHub
            </div>

            <div
              style={{
                fontSize: '0.7rem',
                color: '#64748b',
                fontWeight: 500,
              }}
            >
              Placement & Alumni Portal
            </div>
          </div>
        </button>

        {/* Navigation Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            flexWrap: 'wrap',
            flex: 1,
          }}
        >
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  setDropdownOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '10px 12px',
                  border: 'none',
                  borderRadius: '10px',
                  background: isActive ? '#eff6ff' : 'transparent',
                  color: isActive ? '#2563eb' : '#475569',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon size={17} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <button
            type="button"
            onClick={() => setDropdownOpen((open) => !open)}
            aria-expanded={dropdownOpen}
            aria-label="Open user menu"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '7px 10px',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              background: '#ffffff',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: '#dbeafe',
                color: '#1d4ed8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                fontWeight: 800,
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                currentUser?.name?.charAt(0).toUpperCase() || 'U'
              )}
            </div>

            <div style={{ textAlign: 'left', maxWidth: '150px' }}>
              <div
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#0f172a',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {currentUser?.name || 'User'}
              </div>

              <div
                style={{
                  fontSize: '0.72rem',
                  color: '#64748b',
                  marginTop: '2px',
                }}
              >
                {currentUser ? getRoleLabel(currentUser.role) : ''}
              </div>
            </div>

            <ChevronDown
              size={16}
              color="#64748b"
              style={{
                transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
              }}
            />
          </button>

          {/* Profile Dropdown: User Information and Logout Only */}
          {dropdownOpen && (
            <>
              <button
                type="button"
                aria-label="Close user menu"
                onClick={() => setDropdownOpen(false)}
                style={{
                  position: 'fixed',
                  inset: 0,
                  zIndex: 99,
                  border: 'none',
                  background: 'transparent',
                }}
              />

              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 10px)',
                  width: '240px',
                  background: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.12)',
                  padding: '12px',
                  zIndex: 100,
                }}
              >
                {/* User Information */}
                <div
                  style={{
                    padding: '8px',
                    borderBottom: '1px solid #e2e8f0',
                    marginBottom: '8px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: '#0f172a',
                      overflowWrap: 'anywhere',
                    }}
                  >
                    {currentUser?.name || 'User'}
                  </div>

                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: '#64748b',
                      marginTop: '4px',
                    }}
                  >
                    {currentUser
                      ? getRoleLabel(currentUser.role)
                      : 'User'}
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false);
                    onLogout();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '11px 10px',
                    border: 'none',
                    borderRadius: '10px',
                    background: 'transparent',
                    color: '#dc2626',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#fef2f2';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <LogOut size={17} />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;