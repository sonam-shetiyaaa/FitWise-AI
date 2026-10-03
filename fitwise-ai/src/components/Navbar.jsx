import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Dumbbell,
  Apple,
  TrendingUp,
  MessageSquare,
  LayoutDashboard,
  User,
  LogOut,
  LogIn,
  Menu,
  X,
  Flame,
  ChevronRight
} from 'lucide-react';

export const Navbar = () => {
  const { currentPage, navigateTo, isLoggedIn, user, logout, showToast } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'workout', label: 'Workout', icon: Dumbbell },
    { id: 'nutrition', label: 'Nutrition', icon: Apple },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'chatbot', label: 'AI Coach', icon: Sparkles, highlight: true },
  ];

  const handleNavClick = (pageId) => {
    if (!isLoggedIn && pageId !== 'landing' && pageId !== 'login') {
      navigateTo('login');
      if (showToast) {
        showToast(`Please sign in or register to access ${pageId.charAt(0).toUpperCase() + pageId.slice(1)}`, 'info');
      }
      setMobileMenuOpen(false);
      return;
    }
    navigateTo(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar-header">
      <div className="container nav-container">
        {/* Brand Logo */}
        <div className="brand-logo" onClick={() => handleNavClick(isLoggedIn ? 'dashboard' : 'landing')}>
          <div className="logo-icon-wrap">
            <Flame className="logo-flame-icon" size={22} />
          </div>
          <div className="brand-text">
            <span className="brand-title">FitWise <span className="brand-ai">AI</span></span>
            <span className="brand-subtitle">Smart Wellness</span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="desktop-nav">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`nav-item ${isActive ? 'nav-item-active' : ''} ${link.highlight ? 'nav-item-ai' : ''}`}
              >
                <Icon size={18} className="nav-icon" />
                <span>{link.label}</span>
                {link.highlight && <span className="ai-live-dot" />}
              </button>
            );
          })}
        </nav>

        {/* Right Action Area */}
        <div className="nav-actions">
          {isLoggedIn ? (
            <div className="user-profile-group">
              <button
                className={`profile-btn ${currentPage === 'profile-setup' ? 'profile-btn-active' : ''}`}
                onClick={() => handleNavClick('profile-setup')}
                title="Profile & Settings"
              >
                <div className="avatar-circle">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="user-info-text">
                  <span className="user-name">{user?.name || "Athlete"}</span>
                  <span className="user-goal">{user?.fitnessGoal ? user.fitnessGoal.split('&')[0] : 'Fitness'}</span>
                </div>
              </button>

              <button
                onClick={logout}
                className="btn-icon-logout"
                title="Sign Out"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="guest-actions">
              <button
                onClick={() => handleNavClick('login')}
                className="btn btn-secondary btn-sm"
              >
                <LogIn size={16} />
                <span>Log In</span>
              </button>
              <button
                onClick={() => handleNavClick('login')}
                className="btn btn-primary btn-sm"
              >
                <span>Get Started</span>
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer animate-fade-in">
          <div className="mobile-links-list">
            <button
              onClick={() => handleNavClick('landing')}
              className={`mobile-nav-link ${currentPage === 'landing' ? 'active' : ''}`}
            >
              <span>Home / Landing</span>
              <ChevronRight size={18} />
            </button>

            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`mobile-nav-link ${isActive ? 'active' : ''} ${link.highlight ? 'highlight' : ''}`}
                >
                  <div className="link-icon-title">
                    <Icon size={20} />
                    <span>{link.label}</span>
                  </div>
                  {link.highlight ? (
                    <span className="badge badge-emerald">AI Live</span>
                  ) : (
                    <ChevronRight size={18} />
                  )}
                </button>
              );
            })}

            <div className="mobile-divider" />

            {isLoggedIn ? (
              <>
                <button
                  onClick={() => handleNavClick('profile-setup')}
                  className={`mobile-nav-link ${currentPage === 'profile-setup' ? 'active' : ''}`}
                >
                  <div className="link-icon-title">
                    <User size={20} />
                    <span>Profile Setup & Goals</span>
                  </div>
                  <ChevronRight size={18} />
                </button>
                <button onClick={logout} className="mobile-nav-link text-danger">
                  <div className="link-icon-title">
                    <LogOut size={20} />
                    <span>Log Out ({user?.name || "Athlete"})</span>
                  </div>
                </button>
              </>
            ) : (
              <div className="mobile-auth-btns">
                <button onClick={() => handleNavClick('login')} className="btn btn-secondary w-full">
                  Log In
                </button>
                <button onClick={() => handleNavClick('login')} className="btn btn-primary w-full">
                  Get Started Free
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .navbar-header {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: rgba(10, 15, 29, 0.88);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-subtle);
          transition: var(--ease-smooth);
        }
        .nav-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 72px;
        }
        .brand-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          user-select: none;
        }
        .logo-icon-wrap {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);
          color: #031b10;
        }
        .brand-title {
          font-family: var(--font-heading);
          font-size: 1.35rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #ffffff;
          line-height: 1.1;
          display: block;
        }
        .brand-ai {
          background: linear-gradient(135deg, #34d399, #38bdf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .brand-subtitle {
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--text-dim);
          font-weight: 600;
          display: block;
        }
        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 10px;
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-family: var(--font-heading);
          font-size: 0.92rem;
          font-weight: 500;
          cursor: pointer;
          transition: var(--ease-smooth);
          position: relative;
        }
        .nav-item:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.05);
        }
        .nav-item-active {
          color: #34d399;
          background: rgba(16, 185, 129, 0.12);
          font-weight: 600;
        }
        .nav-item-ai {
          border: 1px solid rgba(16, 185, 129, 0.2);
        }
        .ai-live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #34d399;
          box-shadow: 0 0 8px #34d399;
          display: inline-block;
          animation: pulseGlow 1.8s infinite;
        }
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .user-profile-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .profile-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 4px 12px 4px 6px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          cursor: pointer;
          transition: var(--ease-smooth);
        }
        .profile-btn:hover, .profile-btn-active {
          background: rgba(16, 185, 129, 0.12);
          border-color: var(--border-glow);
        }
        .avatar-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #10b981, #06b6d4);
          color: #062b1a;
          font-weight: 700;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .user-info-text {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }
        .user-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: #ffffff;
          line-height: 1.1;
        }
        .user-goal {
          font-size: 0.7rem;
          color: var(--text-dim);
          max-width: 110px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .btn-icon-logout {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          color: var(--text-muted);
          width: 38px;
          height: 38px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--ease-smooth);
        }
        .btn-icon-logout:hover {
          color: #f43f5e;
          border-color: rgba(244, 63, 94, 0.4);
          background: rgba(244, 63, 94, 0.1);
        }
        .guest-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .mobile-toggle-btn {
          display: none;
          background: transparent;
          border: none;
          color: #ffffff;
          cursor: pointer;
          padding: 6px;
        }
        .mobile-drawer {
          display: none;
          position: absolute;
          top: 72px;
          left: 0;
          right: 0;
          background: #0d1326;
          border-bottom: 1px solid var(--border-subtle);
          padding: 16px 20px 24px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.7);
        }
        .mobile-links-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .mobile-nav-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 14px;
          border-radius: 12px;
          background: rgba(255,255,255,0.03);
          border: 1px solid transparent;
          color: var(--text-main);
          font-family: var(--font-heading);
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          text-align: left;
        }
        .mobile-nav-link.active {
          background: rgba(16, 185, 129, 0.15);
          border-color: var(--border-glow);
          color: #34d399;
        }
        .link-icon-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .text-danger {
          color: #f43f5e;
        }
        .mobile-divider {
          height: 1px;
          background: var(--border-subtle);
          margin: 10px 0;
        }
        .mobile-auth-btns {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 8px;
        }
        .w-full {
          width: 100%;
        }

        @media (max-width: 960px) {
          .desktop-nav {
            display: none;
          }
          .user-info-text {
            display: none;
          }
          .mobile-toggle-btn {
            display: flex;
            align-items: center;
          }
          .mobile-drawer {
            display: block;
          }
        }
      `}</style>
    </header>
  );
};
