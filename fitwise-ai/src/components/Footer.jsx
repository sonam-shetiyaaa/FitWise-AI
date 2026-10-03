import React from 'react';
import { useApp } from '../context/AppContext';
import { Flame, Sparkles, Heart, Shield, Award, Activity } from 'lucide-react';

export const Footer = () => {
  const { navigateTo } = useApp();

  return (
    <footer className="footer-wrap">
      <div className="container footer-content">
        <div className="footer-top-grid">
          {/* Brand Info */}
          <div className="footer-col brand-col">
            <div className="footer-brand" onClick={() => navigateTo('landing')}>
              <div className="footer-logo-badge">
                <Flame size={20} />
              </div>
              <span className="footer-brand-title">FitWise <span className="ai-accent">AI</span></span>
            </div>
            <p className="footer-desc">
              Your Personal AI Fitness & Nutrition Companion. Engineered to provide adaptive workout routines, precision macronutrient calibration, and 24/7 intelligent coaching.
            </p>
            <div className="system-pill">
              <span className="green-pulse" />
              <span>AI Engine Operational • v2.4</span>
            </div>
          </div>

          {/* Quick Nav */}
          <div className="footer-col">
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-links">
              <li><button onClick={() => navigateTo('landing')}>Home</button></li>
              <li><button onClick={() => navigateTo('dashboard')}>Dashboard</button></li>
              <li><button onClick={() => navigateTo('workout')}>Workouts</button></li>
              <li><button onClick={() => navigateTo('nutrition')}>Nutrition</button></li>
              <li><button onClick={() => navigateTo('progress')}>Progress Tracking</button></li>
              <li><button onClick={() => navigateTo('chatbot')}>AI Coach</button></li>
            </ul>
          </div>

          {/* Account & Profile */}
          <div className="footer-col">
            <h4 className="footer-col-title">Personalization</h4>
            <ul className="footer-links">
              <li><button onClick={() => navigateTo('profile-setup')}>Profile Setup</button></li>
              <li><button onClick={() => navigateTo('login')}>Sign In / Register</button></li>
              <li><button onClick={() => navigateTo('workout')}>Exercise Library</button></li>
              <li><button onClick={() => navigateTo('nutrition')}>Meal Logger</button></li>
            </ul>
          </div>

          {/* Daily Coach Insight */}
          <div className="footer-col quote-col">
            <div className="coach-quote-box glass-panel">
              <div className="quote-header">
                <Sparkles size={16} className="quote-icon" />
                <span>Daily Coach Insight</span>
              </div>
              <p className="quote-text">
                "Progress is not linear, but consistency is exponential. Fuel your body with intention, respect your rest intervals, and let progressive overload do the work."
              </p>
              <div className="quote-author">— FitWise Intelligence Core</div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="copyright-text">
            © {new Date().getFullYear()} <strong>FitWise AI</strong>. Built with precision for athletic health, strength, and vitality.
          </div>
          <div className="footer-badges">
            <span className="f-badge"><Shield size={14} /> Private & Secure</span>
            <span className="f-badge"><Activity size={14} /> Adaptive AI</span>
            <span className="f-badge"><Award size={14} /> Science-Based</span>
          </div>
        </div>
      </div>

      <style>{`
        .footer-wrap {
          background: #070a14;
          border-top: 1px solid var(--border-subtle);
          padding: 60px 0 28px;
          margin-top: auto;
        }
        .footer-top-grid {
          display: grid;
          grid-template-columns: 2.2fr 1fr 1fr 2fr;
          gap: 40px;
          padding-bottom: 40px;
          border-bottom: 1px solid var(--border-subtle);
        }
        .footer-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          margin-bottom: 14px;
        }
        .footer-logo-badge {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: linear-gradient(135deg, #10b981, #06b6d4);
          color: #031b10;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .footer-brand-title {
          font-family: var(--font-heading);
          font-size: 1.3rem;
          font-weight: 800;
          color: #ffffff;
        }
        .ai-accent {
          background: linear-gradient(135deg, #34d399, #38bdf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .footer-desc {
          font-size: 0.88rem;
          line-height: 1.6;
          color: var(--text-muted);
          margin-bottom: 18px;
          max-width: 360px;
        }
        .system-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 4px 12px;
          border-radius: 999px;
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.2);
          font-size: 0.76rem;
          color: #34d399;
          font-weight: 600;
        }
        .green-pulse {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #34d399;
          box-shadow: 0 0 8px #34d399;
        }
        .footer-col-title {
          font-size: 0.95rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #ffffff;
          margin-bottom: 16px;
          font-weight: 600;
        }
        .footer-links {
          list-style: none;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .footer-links button {
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 0.9rem;
          cursor: pointer;
          padding: 0;
          text-align: left;
          font-family: var(--font-sans);
          transition: var(--ease-smooth);
        }
        .footer-links button:hover {
          color: #34d399;
          transform: translateX(3px);
        }
        .coach-quote-box {
          padding: 20px;
          border-radius: 14px;
          background: rgba(17, 24, 39, 0.6);
        }
        .quote-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
          font-weight: 700;
          color: #38bdf8;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 8px;
        }
        .quote-text {
          font-size: 0.86rem;
          font-style: italic;
          color: #cbd5e1;
          line-height: 1.5;
          margin-bottom: 10px;
        }
        .quote-author {
          font-size: 0.75rem;
          color: var(--text-dim);
          font-weight: 600;
        }
        .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .copyright-text {
          font-size: 0.85rem;
          color: var(--text-dim);
        }
        .copyright-text strong {
          color: var(--text-muted);
        }
        .footer-badges {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .f-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          color: var(--text-dim);
        }

        @media (max-width: 992px) {
          .footer-top-grid {
            grid-template-columns: 1fr 1fr;
            gap: 32px;
          }
          .brand-col {
            grid-column: span 2;
          }
          .quote-col {
            grid-column: span 2;
          }
        }
        @media (max-width: 600px) {
          .footer-top-grid {
            grid-template-columns: 1fr;
          }
          .brand-col, .quote-col {
            grid-column: span 1;
          }
          .footer-bottom {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </footer>
  );
};
