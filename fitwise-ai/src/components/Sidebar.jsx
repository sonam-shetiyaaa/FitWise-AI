import React from 'react';
import { useApp } from '../context/AppContext';
import { DynamicIsland } from './DynamicIsland';
import { iosFeedback } from '../utils/iosHaptics';
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

  const userEmail = user?.email || 'alex.morgan@fitwise.ai';
  const userName = user?.name || 'Alex';
  const userInitial = (user?.name?.charAt(0) || userEmail.charAt(0) || 'A').toUpperCase();

  const handleNavClick = (id) => {
    iosFeedback.playIosClick(1200);
    iosFeedback.triggerHaptic('selection');
    navigateTo(id);
  };

  const handleBrandClick = () => {
    iosFeedback.playIosClick(1300);
    iosFeedback.triggerHaptic('light');
    navigateTo('dashboard');
  };

  const handleLogout = () => {
    iosFeedback.playIosClick(850);
    iosFeedback.triggerHaptic('medium');
    logout();
  };

  return (
    <header className="nutrifit-top-navbar">
      <div className="top-navbar-container">
        {/* Left: Brand Area */}
        <div className="top-brand-area" onClick={handleBrandClick} title="NutriFit Dashboard">
          <div className="nutrifit-logo-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="#041f12" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" className="pulse-svg">
              <path d="M3 12h3.5l2-5 3.5 10 3-7 2 4h4" />
            </svg>
          </div>
          <span className="nutrifit-brand-name">NutriFit</span>
        </div>

        {/* Center: The 4 Navigation Tabs Horizontally Side by Side */}
        <nav className="top-nav-items" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentPage === item.id ||
              (item.id === 'coach' && currentPage === 'chatbot') ||
              (item.id === 'settings' && currentPage === 'profile-setup');

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`top-nav-item ${isActive ? 'active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={18} className="top-nav-icon" />
                <span className="top-nav-label">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* iOS Dynamic Island Live Activity */}
        <div className="top-island-wrapper">
          <DynamicIsland />
        </div>

        {/* Right: User Email & Sign Out */}
        <div className="top-nav-right">
          <div className="top-user-pill" title={userEmail}>
            <div className="top-user-avatar">
              {userInitial}
            </div>
            <span className="top-user-email">{userEmail}</span>
          </div>

          <button onClick={handleLogout} className="top-logout-btn" title="Sign out of NutriFit">
            <LogOut size={15} />
            <span className="logout-text">Sign out</span>
          </button>
        </div>
      </div>

      <style>{`
        .nutrifit-top-navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          width: 100%;
          background: rgba(10, 15, 13, 0.94);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border-bottom: 1px solid #142019;
          user-select: none;
        }

        .top-navbar-container {
          max-width: 1440px;
          margin: 0 auto;
          height: 68px;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          position: relative;
        }

        /* Brand */
        .top-brand-area {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          flex-shrink: 0;
          transition: opacity 0.18s ease;
        }

        .top-brand-area:hover {
          opacity: 0.9;
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
          font-size: 1.35rem;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.02em;
        }

        /* Nav Tabs - Horizontally Side by Side */
        .top-nav-items {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(18, 28, 23, 0.55);
          padding: 5px 6px;
          border-radius: 14px;
          border: 1px solid #16241c;
          overflow-x: auto;
          scrollbar-width: none;
        }

        .top-nav-items::-webkit-scrollbar {
          display: none;
        }

        .top-nav-item {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 8px 16px;
          border-radius: 10px;
          border: 1px solid transparent;
          background: transparent;
          color: #94a3b8;
          font-family: var(--font-heading);
          font-size: 0.91rem;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .top-nav-item:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.06);
        }

        .top-nav-item.active {
          color: #ffffff;
          background: linear-gradient(180deg, #132219 0%, #0d1712 100%);
          border-color: #1c3024;
          font-weight: 600;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }

        .top-nav-icon {
          color: #64748b;
          transition: color 0.18s ease;
          flex-shrink: 0;
        }

        .top-nav-item:hover .top-nav-icon {
          color: #cbd5e1;
        }

        .top-nav-item.active .top-nav-icon {
          color: #10b981;
          filter: drop-shadow(0 0 6px rgba(16, 185, 129, 0.4));
        }

        .top-nav-label {
          letter-spacing: -0.01em;
        }

        /* iOS Dynamic Island Wrapper */
        .top-island-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        /* Right Actions */
        .top-nav-right {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        .top-user-pill {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 4px 12px 4px 5px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid #16241c;
          border-radius: 9999px;
        }

        .top-user-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #111e16;
          border: 1.5px solid #10b981;
          color: #10b981;
          font-size: 0.78rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }


        .top-user-email {
          font-size: 0.82rem;
          color: #94a3b8;
          max-width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .top-logout-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 7px 14px;
          border-radius: 9999px;
          background: rgba(248, 113, 113, 0.06);
          border: 1px solid rgba(248, 113, 113, 0.2);
          color: #f87171;
          font-family: var(--font-heading);
          font-size: 0.84rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.18s ease;
        }

        .top-logout-btn:hover {
          background: rgba(248, 113, 113, 0.14);
          border-color: rgba(248, 113, 113, 0.35);
          color: #fca5a5;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1200px) {
          .top-user-email {
            display: none;
          }
          .top-user-pill {
            padding: 3px;
            background: transparent;
            border: none;
          }
        }

        @media (max-width: 980px) {
          .top-navbar-container {
            padding: 0 16px;
            gap: 10px;
          }

          .top-nav-item {
            padding: 7px 12px;
            font-size: 0.88rem;
          }
        }

        @media (max-width: 768px) {
          .nutrifit-top-navbar {
            padding: 0;
            height: 56px;
          }

          .top-navbar-container {
            height: 56px;
            flex-wrap: nowrap;
            gap: 8px;
            padding: 0 12px;
            justify-content: space-between;
          }

          /* On mobile, tabs are cleanly moved to iOS Bottom Tab Bar */
          .top-nav-items {
            display: none !important;
          }

          .top-brand-area {
            gap: 8px;
          }

          .nutrifit-logo-badge {
            width: 30px;
            height: 30px;
            border-radius: 8px;
          }

          .pulse-svg {
            width: 16px;
            height: 16px;
          }

          .nutrifit-brand-name {
            font-size: 1.15rem;
          }

          .top-island-wrapper {
            flex: 1;
            display: flex;
            justify-content: center;
            max-width: 190px;
          }

          .top-nav-right {
            gap: 6px;
          }

          .top-logout-btn .logout-text {
            display: none;
          }

          .top-logout-btn {
            padding: 6px;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            justify-content: center;
          }
        }

        @media (max-width: 440px) {
          .nutrifit-brand-name {
            font-size: 1.05rem;
          }

          .top-navbar-container {
            padding: 0 10px;
          }
        }
      `}</style>
    </header>
  );
};

export const TopNav = Sidebar;
