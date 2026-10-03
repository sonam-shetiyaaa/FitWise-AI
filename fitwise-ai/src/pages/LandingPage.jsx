import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Dumbbell,
  Apple,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  Award,
  CheckCircle2,
  Users,
  Flame,
  Clock,
  Compass
} from 'lucide-react';

export const LandingPage = () => {
  const { navigateTo, isLoggedIn, openAuthModal } = useApp();

  const features = [
    {
      icon: Sparkles,
      color: "emerald",
      badge: "Intelligent Guidance",
      title: "AI Coaching",
      desc: "Hyper-personalized advice calibrated to your biomechanics, recovery capacity, and evolving metabolic rate 24/7."
    },
    {
      icon: Dumbbell,
      color: "cyan",
      badge: "Adaptive Workouts",
      title: "Personalized Workouts",
      desc: "Auto-adjusting split routines with target sets, reps, load progression, and rest timers customized to your gym or home setup."
    },
    {
      icon: Apple,
      color: "amber",
      badge: "Macro Precision",
      title: "Nutrition Guidance",
      desc: "Dynamic calorie and macro targeting with curated meal breakdowns for breakfast, lunch, dinner, and snacks matching your dietary preferences."
    },
    {
      icon: TrendingUp,
      color: "purple",
      badge: "Visual Metrics",
      title: "Progress Tracking",
      desc: "Comprehensive visual dashboards for body composition, strength volume milestones, hydration habits, and workout completion streaks."
    }
  ];

  const highlights = [
    { label: "Active Athletes Coached", value: "48,000+" },
    { label: "Personalized Workouts Generated", value: "1.2 Million" },
    { label: "Macro Accuracy Rate", value: "99.4%" },
    { label: "Average Goal Attainment", value: "3.2x Faster" }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-badge-pill">
            <span className="pill-dot" />
            <Sparkles size={14} className="text-emerald" />
            <span>Next-Generation AI Fitness & Nutrition Intelligence</span>
          </div>

          <h1 className="hero-title">
            Your Personal <span className="text-gradient">AI Fitness & Nutrition</span> Companion
          </h1>

          <p className="hero-description">
            FitWise AI is your intelligent health companion. Engineered to craft precision workout splits, scientifically balanced meal plans, and real-time coaching tailored to your body and lifestyle.
          </p>

          <div className="hero-actions">
            <button
              onClick={() => {
                if (isLoggedIn) navigateTo('dashboard');
                else openAuthModal('register');
              }}
              className="btn btn-primary btn-lg hero-cta-btn"
            >
              <span>Get Started</span>
              <ArrowRight size={20} />
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('features-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn btn-secondary btn-lg"
            >
              <Compass size={18} />
              <span>Explore Features</span>
            </button>
          </div>

          {/* Quick Athlete Stats */}
          <div className="stats-strip glass-panel">
            {highlights.map((item, idx) => (
              <div key={idx} className="stat-card">
                <span className="stat-number">{item.value}</span>
                <span className="stat-label">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section id="features-section" className="features-section">
        <div className="container">
          <div className="section-header">
            <div className="section-pill">
              <Zap size={14} /> Core Capabilities
            </div>
            <h2 className="section-title">Everything You Need to Transform Your Body</h2>
            <p className="section-subtitle">
              Built on evidence-based sports science and intelligent personalization algorithms.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feat, index) => {
              const Icon = feat.icon;
              return (
                <div
                  key={index}
                  className="feature-card glass-panel"
                  onClick={() => {
                    if (!isLoggedIn) {
                      openAuthModal('signin');
                      return;
                    }
                    if (feat.title === "AI Coaching") navigateTo('chatbot');
                    else if (feat.title === "Personalized Workouts") navigateTo('workout');
                    else if (feat.title === "Nutrition Guidance") navigateTo('nutrition');
                    else navigateTo('progress');
                  }}
                >
                  <div className={`feature-icon-box icon-${feat.color}`}>
                    <Icon size={26} />
                  </div>
                  <span className={`badge badge-${feat.color}`}>{feat.badge}</span>
                  <h3 className="feature-name">{feat.title}</h3>
                  <p className="feature-desc">{feat.desc}</p>

                  <div className="feature-link">
                    <span>Try {feat.title}</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <div className="section-pill">
              <Activity size={14} /> Seamless 3-Step Journey
            </div>
            <h2 className="section-title">How FitWise AI Elevates Your Training</h2>
          </div>

          <div className="steps-grid">
            <div className="step-card glass-panel">
              <div className="step-num">01</div>
              <h4 className="step-title">Build Your Athletic Profile</h4>
              <p className="step-text">
                Specify your height, weight, activity habits, dietary preferences, target goals, and available equipment in minutes.
              </p>
            </div>

            <div className="step-card glass-panel">
              <div className="step-num">02</div>
              <h4 className="step-title">Receive Daily AI Protocols</h4>
              <p className="step-text">
                FitWise AI constructs your daily workout sets, rest intervals, calorie budget, and micronutrient-dense meal plans automatically.
              </p>
            </div>

            <div className="step-card glass-panel">
              <div className="step-num">03</div>
              <h4 className="step-title">Track, Adapt & Triumph</h4>
              <p className="step-text">
                Log completed reps, monitor hydration in real time, and chat with your AI Coach whenever your schedule or motivation shifts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card glass-panel-glow">
            <div className="cta-text-content">
              <span className="badge badge-emerald">Free Instant Access</span>
              <h2 className="cta-title">Ready to Experience Intelligent Wellness?</h2>
              <p className="cta-desc">
                Join thousands of athletes, busy professionals, and fitness enthusiasts crushing their goals with FitWise AI.
              </p>
              <div className="cta-buttons">
                <button
                  onClick={() => {
                    if (isLoggedIn) navigateTo('dashboard');
                    else openAuthModal('register');
                  }}
                  className="btn btn-primary btn-lg"
                >
                  <span>Start Your Personalized Plan</span>
                  <ArrowRight size={20} />
                </button>
                <button
                  onClick={() => {
                    if (isLoggedIn) navigateTo('dashboard');
                    else openAuthModal('signin');
                  }}
                  className="btn btn-secondary btn-lg"
                >
                  <span>Sign In & Live Dashboard</span>
                </button>
              </div>
            </div>
            <div className="cta-benefits">
              <div className="benefit-item">
                <CheckCircle2 size={18} className="text-emerald" />
                <span>Zero complex spreadsheets</span>
              </div>
              <div className="benefit-item">
                <CheckCircle2 size={18} className="text-emerald" />
                <span>Real-time progressive overload tracking</span>
              </div>
              <div className="benefit-item">
                <CheckCircle2 size={18} className="text-emerald" />
                <span>Custom dietary & cuisine adaptations</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .landing-page {
          display: flex;
          flex-direction: column;
          gap: 60px;
          padding-bottom: 60px;
        }
        .hero-section {
          padding: 80px 0 30px;
          text-align: center;
          position: relative;
        }
        .hero-container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .hero-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 18px;
          border-radius: 999px;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.25);
          font-size: 0.85rem;
          font-weight: 600;
          color: #34d399;
          margin-bottom: 24px;
        }
        .pill-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #34d399;
          animation: pulseGlow 1.8s infinite;
        }
        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          max-width: 900px;
          margin-bottom: 22px;
          line-height: 1.15;
          letter-spacing: -0.03em;
        }
        .text-gradient {
          background: linear-gradient(135deg, #10b981 10%, #38bdf8 80%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-description {
          font-size: 1.18rem;
          color: var(--text-muted);
          max-width: 720px;
          line-height: 1.65;
          margin-bottom: 36px;
        }
        .hero-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-bottom: 60px;
          flex-wrap: wrap;
        }
        .stats-strip {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          padding: 24px;
          gap: 20px;
          text-align: center;
        }
        .stat-card {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .stat-number {
          font-family: var(--font-heading);
          font-size: 2.2rem;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.02em;
        }
        .stat-label {
          font-size: 0.82rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-dim);
          font-weight: 600;
        }

        /* Section Header */
        .section-header {
          text-align: center;
          margin-bottom: 48px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        .section-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #38bdf8;
          background: rgba(56, 189, 248, 0.12);
          border: 1px solid rgba(56, 189, 248, 0.25);
          padding: 4px 12px;
          border-radius: 999px;
        }
        .section-title {
          font-size: 2.3rem;
          font-weight: 800;
        }
        .section-subtitle {
          font-size: 1rem;
          color: var(--text-muted);
          max-width: 600px;
        }

        /* Features Grid */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        .feature-card {
          padding: 32px 24px;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          cursor: pointer;
          position: relative;
        }
        .feature-card:hover {
          transform: translateY(-6px);
          border-color: var(--border-glow);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
        }
        .feature-icon-box {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }
        .icon-emerald {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }
        .icon-cyan {
          background: rgba(6, 182, 212, 0.15);
          color: #38bdf8;
          border: 1px solid rgba(6, 182, 212, 0.3);
        }
        .icon-amber {
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }
        .icon-purple {
          background: rgba(168, 85, 247, 0.15);
          color: #c084fc;
          border: 1px solid rgba(168, 85, 247, 0.3);
        }
        .feature-name {
          font-size: 1.3rem;
          margin: 14px 0 10px;
        }
        .feature-desc {
          font-size: 0.9rem;
          line-height: 1.55;
          margin-bottom: 24px;
        }
        .feature-link {
          margin-top: auto;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          font-weight: 700;
          color: #34d399;
          font-family: var(--font-heading);
        }

        /* Steps */
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .step-card {
          padding: 32px 28px;
          position: relative;
        }
        .step-num {
          font-family: var(--font-heading);
          font-size: 2.8rem;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.08);
          line-height: 1;
          margin-bottom: 12px;
        }
        .step-title {
          font-size: 1.15rem;
          margin-bottom: 10px;
        }
        .step-text {
          font-size: 0.9rem;
          line-height: 1.6;
        }

        /* CTA */
        .cta-card {
          padding: 48px;
          border-radius: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 40px;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.08) 100%), #111827;
        }
        .cta-title {
          font-size: 2.2rem;
          margin: 12px 0;
        }
        .cta-desc {
          font-size: 1.05rem;
          max-width: 580px;
          margin-bottom: 28px;
        }
        .cta-buttons {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }
        .cta-benefits {
          display: flex;
          flex-direction: column;
          gap: 14px;
          border-left: 1px solid var(--border-subtle);
          padding-left: 36px;
          min-width: 280px;
        }
        .benefit-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.92rem;
          color: #e2e8f0;
          font-weight: 500;
        }

        @media (max-width: 1024px) {
          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .stats-strip {
            grid-template-columns: repeat(2, 1fr);
          }
          .cta-card {
            flex-direction: column;
            align-items: flex-start;
          }
          .cta-benefits {
            border-left: none;
            padding-left: 0;
            border-top: 1px solid var(--border-subtle);
            padding-top: 20px;
            width: 100%;
          }
        }
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.4rem;
          }
          .features-grid {
            grid-template-columns: 1fr;
          }
          .steps-grid {
            grid-template-columns: 1fr;
          }
          .stats-strip {
            grid-template-columns: 1fr 1fr;
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
};
