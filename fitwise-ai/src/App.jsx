import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ChatbotPage } from './pages/ChatbotPage';
import { PlansPage } from './pages/PlansPage';
import { ProfileSetupPage } from './pages/ProfileSetupPage';
import { WorkoutPage } from './pages/WorkoutPage';
import { NutritionPage } from './pages/NutritionPage';
import { ProgressPage } from './pages/ProgressPage';
import { AuthPage } from './pages/AuthPage';

import { AuthModal } from './components/AuthModal';

import {
  Menu,
  X,
  LayoutGrid,
  MessageSquare,
  ClipboardList,
  Settings,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Info
} from 'lucide-react';

const MainAppContent = () => {
  const { currentPage, navigateTo, toast, isLoggedIn, logout, user } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If not logged in, show NutriFit Landing Page (Screenshot 6 & 7)
  if (!isLoggedIn && currentPage !== 'login') {
    return (
      <div className="nutrifit-root-wrapper">
        <LandingPage />
        <AuthModal />
        {toast && (
          <div className="toast-container">
            <div className={`toast toast-${toast.type}`}>
              {toast.type === 'success' && <CheckCircle2 size={18} className="text-emerald" />}
              {toast.type === 'info' && <Info size={18} className="text-cyan" />}
              {toast.type === 'error' && <AlertCircle size={18} className="text-danger" />}
              <span>{toast.message}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  const renderActivePage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'coach':
      case 'chatbot':
        return <ChatbotPage />;
      case 'plans':
        return <PlansPage />;
      case 'settings':
      case 'profile-setup':
        return <ProfileSetupPage />;
      case 'workout':
        return <WorkoutPage />;
      case 'nutrition':
        return <NutritionPage />;
      case 'progress':
        return <ProgressPage />;
      case 'login':
        return <AuthPage />;
      default:
        return <DashboardPage />;
    }
  };

  const mobileNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'coach', label: 'AI Coach Chat', icon: MessageSquare },
    { id: 'plans', label: 'Meal & Workout Plans', icon: ClipboardList },
    { id: 'settings', label: 'Profile / Settings', icon: Settings },
  ];

  return (
    <div className="nutrifit-app-shell">
      {/* Desktop Left Sidebar (Screenshots 1-5) */}
      <Sidebar />

      {/* Mobile Top Header (only on <= 900px) */}
      <header className="mobile-app-header">
        <div className="mobile-brand-group" onClick={() => navigateTo('dashboard')}>
          <div className="nutrifit-logo-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="#041f12" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" className="pulse-svg">
              <path d="M3 12h3.5l2-5 3.5 10 3-7 2 4h4" />
            </svg>
          </div>
          <span className="mobile-brand-name">NutriFit</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="mobile-menu-trigger"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-top-row">
              <span className="drawer-user-email">{user?.email || 'athlete@nutrifit.app'}</span>
              <button onClick={() => setMobileMenuOpen(false)} className="drawer-close-btn">
                <X size={20} />
              </button>
            </div>
            <nav className="mobile-drawer-nav">
              {mobileNavItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  currentPage === item.id ||
                  (item.id === 'coach' && currentPage === 'chatbot') ||
                  (item.id === 'settings' && currentPage === 'profile-setup');
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      navigateTo(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`mobile-nav-btn ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={19} className="nav-btn-icon" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
            <div className="drawer-bottom">
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="mobile-logout-btn"
              >
                <LogOut size={16} />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="nutrifit-main-content">
        {renderActivePage()}
      </main>

      {/* Auth Modal & Toast Notifications */}
      <AuthModal />

      {toast && (
        <div className="toast-container">
          <div className={`toast toast-${toast.type}`}>
            {toast.type === 'success' && <CheckCircle2 size={18} className="text-emerald" />}
            {toast.type === 'info' && <Info size={18} className="text-cyan" />}
            {toast.type === 'error' && <AlertCircle size={18} className="text-danger" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <style>{`
        .nutrifit-app-shell {
          display: flex;
          min-height: 100vh;
          width: 100%;
          background: #090e0c;
          position: relative;
        }

        .nutrifit-main-content {
          flex: 1;
          min-width: 0;
          overflow-y: auto;
          background: #090e0c;
        }

        .mobile-app-header {
          display: none;
          position: sticky;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: #0a0f0d;
          border-bottom: 1px solid #141f19;
          padding: 0 20px;
          align-items: center;
          justify-content: space-between;
          z-index: 90;
        }

        .mobile-brand-group {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }

        .mobile-brand-name {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 800;
          color: #ffffff;
        }

        .mobile-menu-trigger {
          background: transparent;
          border: none;
          color: #ffffff;
          cursor: pointer;
          padding: 6px;
        }

        .mobile-drawer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          z-index: 1000;
          display: flex;
        }

        .mobile-drawer-panel {
          width: 280px;
          background: #0a0f0d;
          border-right: 1px solid #141f19;
          padding: 24px 18px;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .drawer-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 18px;
          border-bottom: 1px solid #141f19;
          margin-bottom: 16px;
        }

        .drawer-user-email {
          font-size: 0.85rem;
          color: #64748b;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .drawer-close-btn {
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
        }

        .mobile-drawer-nav {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
        }

        .mobile-nav-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 10px;
          border: 1px solid transparent;
          background: transparent;
          color: #94a3b8;
          font-family: var(--font-heading);
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          text-align: left;
        }

        .mobile-nav-btn.active {
          background: #131d18;
          border-color: #1c2b22;
          color: #ffffff;
          font-weight: 600;
        }

        .mobile-nav-btn.active .nav-btn-icon {
          color: #10b981;
        }

        .drawer-bottom {
          padding-top: 16px;
          border-top: 1px solid #141f19;
        }

        .mobile-logout-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 10px 12px;
          background: transparent;
          border: none;
          color: #f87171;
          font-size: 0.9rem;
          cursor: pointer;
        }

        @media (max-width: 900px) {
          .nutrifit-app-shell {
            flex-direction: column;
          }
          .mobile-app-header {
            display: flex;
          }
        }
      `}</style>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
