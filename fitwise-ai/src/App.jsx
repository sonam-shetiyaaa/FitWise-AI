import React, { useState, useEffect } from 'react';
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

// iOS System Components
import { AuthModal } from './components/AuthModal';
import { IosStatusBar } from './components/IosStatusBar';
import { IosHomeIndicator } from './components/IosHomeIndicator';
import { IosNotificationBanner } from './components/IosNotificationBanner';
import { ControlCenter } from './components/ControlCenter';
import { SpotlightSearch } from './components/SpotlightSearch';

const MainAppContent = () => {
  const { currentPage, navigateTo, toast, isLoggedIn, logout, user } = useApp();

  // Control Center & Spotlight State
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);

  // Keyboard shortcut: Cmd+K / Ctrl+K for iOS Spotlight Search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSpotlightOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  // If not logged in, show NutriFit Landing Page with iOS System frame
  if (!isLoggedIn && currentPage !== 'login') {
    return (
      <div className="nutrifit-root-wrapper ios-app-container">
        {/* iOS System Top Status Bar */}
        <IosStatusBar
          onOpenControlCenter={() => setIsControlCenterOpen(true)}
          onOpenSpotlight={() => setIsSpotlightOpen(true)}
        />

        {/* Actual Landing Page Content (Unchanged) */}
        <LandingPage />

        {/* Auth Modal, Home Indicator & iOS Push Notifications */}
        <AuthModal />
        <IosHomeIndicator onHomeClick={() => navigateTo('landing')} />

        {/* iOS Push Notification Banner */}
        {toast && <IosNotificationBanner toast={toast} />}

        {/* Control Center & Spotlight Overlays */}
        <ControlCenter
          isOpen={isControlCenterOpen}
          onClose={() => setIsControlCenterOpen(false)}
        />
        <SpotlightSearch
          isOpen={isSpotlightOpen}
          onClose={() => setIsSpotlightOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="nutrifit-app-shell ios-app-container">
      {/* iOS System Top Status Bar */}
      <IosStatusBar
        onOpenControlCenter={() => setIsControlCenterOpen(true)}
        onOpenSpotlight={() => setIsSpotlightOpen(true)}
      />

      {/* Top Horizontal Navigation Bar */}
      <Sidebar />

      {/* Main Content Area (Actual UI completely preserved) */}
      <main className="nutrifit-main-content">
        {renderActivePage()}
      </main>

      {/* Auth Modal, iOS Home Indicator & iOS Push Notifications */}
      <AuthModal />
      <IosHomeIndicator onHomeClick={() => navigateTo('dashboard')} />

      {/* iOS Push Notification Banner */}
      {toast && <IosNotificationBanner toast={toast} />}

      {/* Control Center & Spotlight Overlays */}
      <ControlCenter
        isOpen={isControlCenterOpen}
        onClose={() => setIsControlCenterOpen(false)}
      />
      <SpotlightSearch
        isOpen={isSpotlightOpen}
        onClose={() => setIsSpotlightOpen(false)}
      />

      <style>{`
        .ios-app-container {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          width: 100%;
          background: #000000;
          position: relative;
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "SF Pro", system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .nutrifit-app-shell {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          width: 100%;
          background: #000000;
          position: relative;
        }

        .nutrifit-main-content {
          flex: 1;
          width: 100%;
          min-width: 0;
          overflow-y: auto;
          background: #000000;
          padding-bottom: 96px;
          -webkit-overflow-scrolling: touch;
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
