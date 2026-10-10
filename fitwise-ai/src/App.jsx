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
import { IosHomeIndicator } from './components/IosHomeIndicator';

import {
  CheckCircle2,
  AlertCircle,
  Info
} from 'lucide-react';

const MainAppContent = () => {
  const { currentPage, navigateTo, toast, isLoggedIn, logout, user } = useApp();

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

  return (
    <div className="nutrifit-app-shell">
      {/* Top Horizontal Navigation Bar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="nutrifit-main-content">
        {renderActivePage()}
      </main>

      {/* Auth Modal, iOS Home Indicator & Toast Notifications */}
      <AuthModal />
      <IosHomeIndicator />

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
          flex-direction: column;
          min-height: 100vh;
          width: 100%;
          background: #090e0c;
          position: relative;
        }

        .nutrifit-main-content {
          flex: 1;
          width: 100%;
          min-width: 0;
          overflow-y: auto;
          background: #090e0c;
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
