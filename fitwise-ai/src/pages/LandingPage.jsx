import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Target,
  MessageSquare,
  Flame,
  ArrowRight
} from 'lucide-react';

export const LandingPage = () => {
  const { navigateTo, isLoggedIn, openAuthModal, login } = useApp();

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigateTo('dashboard');
    } else {
      // Instant demo login so user can immediately experience the dashboard!
      login('athlete@nutrifit.app', 'demo1234', 'Alex');
    }
  };

  return (
    <div className="nutrifit-landing-page">
      {/* Top Header */}
      <header className="landing-top-bar">
        <div className="landing-brand-area" onClick={() => navigateTo('landing')}>
          <div className="nutrifit-logo-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="#041f12" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" className="pulse-svg">
              <path d="M3 12h3.5l2-5 3.5 10 3-7 2 4h4" />
            </svg>
          </div>
          <span className="nutrifit-brand-name">NutriFit</span>
        </div>

        <div className="landing-auth-actions">
          <button
            onClick={() => {
              if (isLoggedIn) navigateTo('dashboard');
              else openAuthModal('signin');
            }}
            className="btn-landing-signin"
          >
            {isLoggedIn ? 'Dashboard' : 'Sign in'}
          </button>
          <button
            onClick={handleGetStarted}
            className="btn-landing-cta"
          >
            Get started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="landing-hero-container">
        <div className="hero-kicker">AI FITNESS & DIET COACH</div>

        <h1 className="hero-headline">
          Train smarter. <span className="headline-green">Eat with precision.</span>
        </h1>

        <p className="hero-subtext">
          NutriFit turns your body metrics into exact daily calories and macros — then a coach builds the workouts and meals to hit them.
        </p>

        <div className="hero-cta-wrap">
          <button onClick={handleGetStarted} className="btn-get-started">
            <span>Get started</span>
            <ArrowRight size={18} />
          </button>
        </div>

        {/* 3 Feature Cards */}
        <div className="landing-feature-cards">
          <div className="feature-card">
            <div className="feature-icon-wrap">
              <Target size={24} className="text-emerald" />
            </div>
            <h3 className="feature-title">Precision targets</h3>
            <p className="feature-desc">
              Mifflin–St Jeor BMR, TDEE and macro splits — real math, not guesses.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrap">
              <MessageSquare size={24} className="text-emerald" />
            </div>
            <h3 className="feature-title">AI coach</h3>
            <p className="feature-desc">
              Workouts and meals tailored to your numbers and diet.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrap">
              <Flame size={24} className="text-emerald" />
            </div>
            <h3 className="feature-title">Saved plans</h3>
            <p className="feature-desc">
              Keep the splits and meals you love in one place.
            </p>
          </div>
        </div>
      </main>

      <style>{`
        .nutrifit-landing-page {
          min-height: 100vh;
          background: #090e0c;
          background-image: 
            radial-gradient(circle at 10% 12%, rgba(16, 185, 129, 0.12) 0%, transparent 45%),
            radial-gradient(circle at 85% 85%, rgba(16, 185, 129, 0.05) 0%, transparent 50%);
          display: flex;
          flex-direction: column;
          color: #ffffff;
        }

        .landing-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 48px;
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
        }

        .landing-brand-area {
          display: flex;
          align-items: center;
          gap: 12px;
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
          box-shadow: 0 0 16px rgba(16, 185, 129, 0.4);
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

        .landing-auth-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .btn-landing-signin {
          background: transparent;
          border: none;
          color: #94a3b8;
          font-family: var(--font-heading);
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.18s ease;
          padding: 8px 14px;
        }

        .btn-landing-signin:hover {
          color: #ffffff;
        }

        .btn-landing-cta {
          background: #10b981;
          color: #042013;
          font-family: var(--font-heading);
          font-size: 0.92rem;
          font-weight: 700;
          padding: 8px 18px;
          border-radius: 9999px;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-landing-cta:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 18px rgba(16, 185, 129, 0.4);
        }

        .landing-hero-container {
          flex: 1;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 60px 48px 80px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
        }

        .hero-kicker {
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #10b981;
          margin-bottom: 24px;
        }

        .hero-headline {
          font-family: var(--font-heading);
          font-size: 4.8rem;
          font-weight: 800;
          line-height: 1.08;
          letter-spacing: -0.03em;
          color: #ffffff;
          max-width: 1000px;
          margin-bottom: 28px;
        }

        .headline-green {
          color: #10b981;
        }

        .hero-subtext {
          font-size: 1.25rem;
          line-height: 1.6;
          color: #94a3b8;
          max-width: 680px;
          margin-bottom: 40px;
        }

        .hero-cta-wrap {
          margin-bottom: 80px;
        }

        .btn-get-started {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #10b981;
          color: #042013;
          font-family: var(--font-heading);
          font-size: 1.05rem;
          font-weight: 700;
          padding: 14px 28px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 20px rgba(16, 185, 129, 0.35);
        }

        .btn-get-started:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(16, 185, 129, 0.5);
          background: #34d399;
        }

        .landing-feature-cards {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .feature-card {
          background: #111815;
          border: 1px solid #1a251f;
          border-radius: 18px;
          padding: 32px 28px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          transition: all 0.2s ease;
        }

        .feature-card:hover {
          border-color: #26382e;
          transform: translateY(-3px);
        }

        .feature-icon-wrap {
          margin-bottom: 20px;
          color: #10b981;
        }

        .text-emerald {
          color: #10b981;
        }

        .feature-title {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 10px;
        }

        .feature-desc {
          font-size: 0.95rem;
          color: #94a3b8;
          line-height: 1.55;
        }

        @media (max-width: 992px) {
          .landing-top-bar {
            padding: 20px 24px;
          }
          .landing-hero-container {
            padding: 40px 24px 60px;
          }
          .hero-headline {
            font-size: 3.4rem;
          }
          .landing-feature-cards {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }

        @media (max-width: 600px) {
          .landing-top-bar {
            padding: 14px 16px;
          }
          .landing-hero-container {
            padding: 24px 16px 80px;
          }
          .hero-kicker {
            font-size: 0.72rem;
            margin-bottom: 16px;
          }
          .hero-headline {
            font-size: 2.2rem;
            line-height: 1.15;
            margin-bottom: 18px;
          }
          .hero-subtext {
            font-size: 1rem;
            margin-bottom: 28px;
          }
          .hero-cta-wrap {
            width: 100%;
            margin-bottom: 44px;
          }
          .btn-get-started {
            width: 100%;
            justify-content: center;
          }
          .feature-card {
            padding: 22px 18px;
          }
        }
      `}</style>
    </div>
  );
};
