import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutGrid,
  MessageSquare,
  ClipboardList,
  Settings,
  LogOut
} from 'lucide-react';

export const Sidebar = () => {
  const { currentPage, navigateTo, user, logout } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'coach', label: 'AI Coach Chat', icon: MessageSquare },
    { id: 'plans', label: 'Meal & Workout Plans', icon: ClipboardList },
    { id: 'settings', label: 'Profile / Settings', icon: Settings },
  ];

  return (
    <aside className="nutrifit-sidebar">
      {/* Top Logo */}
      <div className="sidebar-brand-area" onClick={() => navigateTo('dashboard')}>
        <div className="nutrifit-logo-badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="#041f12" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" className="pulse-svg">
            <path d="M3 12h3.5l2-5 3.5 10 3-7 2 4h4" />
          </svg>
        </div>
        <span className="nutrifit-brand-name">NutriFit</span>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentPage === item.id ||
            (item.id === 'coach' && currentPage === 'chatbot') ||
            (item.id === 'settings' && currentPage === 'profile-setup');

          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={19} className="sidebar-icon" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <div className="user-email-text" title={user?.email || 'athlete@nutrifit.app'}>
          {user?.email || 'athlete@nutrifit.app'}
        </div>
        <button onClick={logout} className="sidebar-logout-btn">
          <LogOut size={16} />
          <span>Sign out</span>
        </button>
      </div>

      <style>{`
        .nutrifit-sidebar {
          width: 240px;
          min-width: 240px;
          background: #0a0f0d;
          border-right: 1px solid #141f19;
          display: flex;
          flex-direction: column;
          height: 100vh;
          position: sticky;
          top: 0;
          z-index: 100;
          padding: 24px 16px 20px;
          user-select: none;
        }

        .sidebar-brand-area {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 6px 10px 28px;
          cursor: pointer;
        }

        .nutrifit-logo-badge {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: #10b981;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 16px rgba(16, 185, 129, 0.35);
          flex-shrink: 0;
        }

        .pulse-svg {
          width: 20px;
          height: 20px;
        }

        .nutrifit-brand-name {
          font-family: var(--font-heading);
          font-size: 1.32rem;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.02em;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
        }

        .sidebar-nav-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid transparent;
          background: transparent;
          color: #94a3b8;
          font-family: var(--font-heading);
          font-size: 0.92rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.18s ease;
          text-align: left;
          width: 100%;
        }

        .sidebar-nav-item:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.04);
        }

        .sidebar-nav-item.active {
          color: #ffffff;
          background: #131d18;
          border-color: #1c2b22;
          font-weight: 600;
        }

        .sidebar-nav-item.active .sidebar-icon {
          color: #10b981;
        }

        .sidebar-icon {
          color: #64748b;
          transition: color 0.18s ease;
          flex-shrink: 0;
        }

        .sidebar-nav-item:hover .sidebar-icon {
          color: #e2e8f0;
        }

        .sidebar-footer {
          border-top: 1px solid #141f19;
          padding-top: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .user-email-text {
          font-size: 0.82rem;
          color: #64748b;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          padding: 0 4px;
        }

        .sidebar-logout-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          border-radius: 8px;
          background: transparent;
          border: none;
          color: #94a3b8;
          font-size: 0.88rem;
          cursor: pointer;
          transition: all 0.18s ease;
          text-align: left;
        }

        .sidebar-logout-btn:hover {
          color: #f87171;
          background: rgba(248, 113, 113, 0.08);
        }

        @media (max-width: 900px) {
          .nutrifit-sidebar {
            display: none;
          }
        }
      `}</style>
    </aside>
  );
};
