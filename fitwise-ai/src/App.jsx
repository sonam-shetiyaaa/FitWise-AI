import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { ProfileSetupPage } from './pages/ProfileSetupPage';
import { DashboardPage } from './pages/DashboardPage';
import { WorkoutPage } from './pages/WorkoutPage';
import { NutritionPage } from './pages/NutritionPage';
import { ProgressPage } from './pages/ProgressPage';
import { ChatbotPage } from './pages/ChatbotPage';

// Floating Chat trigger icon
import { Sparkles, CheckCircle2, AlertCircle, Info } from 'lucide-react';

const MainAppContent = () => {
  const { currentPage, navigateTo, toast } = useApp();

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage />;
      case 'login':
        return <AuthPage />;
      case 'profile-setup':
        return <ProfileSetupPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'workout':
        return <WorkoutPage />;
      case 'nutrition':
        return <NutritionPage />;
      case 'progress':
        return <ProgressPage />;
      case 'chatbot':
        return <ChatbotPage />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="fitwise-app-wrapper">
      <Navbar />

      <main className="main-content-area">
        {renderCurrentPage()}
      </main>

      {/* Floating AI Coach Trigger Button (visible when not on chatbot or auth page) */}
      {currentPage !== 'chatbot' && currentPage !== 'login' && (
        <button
          className="floating-ai-button"
          onClick={() => navigateTo('chatbot')}
          title="Open AI Fitness Coach"
          aria-label="Open AI Fitness Coach"
        >
          <div className="floating-btn-glow" />
          <Sparkles size={22} className="floating-sparkle" />
          <span className="floating-btn-text">AI Coach</span>
        </button>
      )}

      {/* Global Toast Notification */}
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

      <Footer />

      <style>{`
        .fitwise-app-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .main-content-area {
          flex: 1;
        }
        .floating-ai-button {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 900;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 20px;
          border-radius: 999px;
          background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
          color: #02170e;
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 0.95rem;
          border: none;
          cursor: pointer;
          box-shadow: 0 8px 30px rgba(16, 185, 129, 0.45);
          transition: var(--ease-smooth);
        }
        .floating-ai-button:hover {
          transform: translateY(-4px) scale(1.03);
          box-shadow: 0 12px 40px rgba(16, 185, 129, 0.6);
        }
        .floating-btn-glow {
          position: absolute;
          inset: -3px;
          border-radius: 999px;
          background: linear-gradient(135deg, #10b981, #38bdf8);
          opacity: 0.5;
          z-index: -1;
          filter: blur(8px);
          animation: pulseGlow 2s infinite;
        }
        .floating-sparkle {
          animation: spinSlow 8s linear infinite;
        }
        @keyframes spinSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @media (max-width: 600px) {
          .floating-ai-button {
            bottom: 20px;
            right: 20px;
            padding: 10px 16px;
            font-size: 0.85rem;
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
