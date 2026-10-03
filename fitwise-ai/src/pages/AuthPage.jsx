import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Flame,
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

export const AuthPage = () => {
  const { login, register, navigateTo } = useApp();
  const [isLoginTab, setIsLoginTab] = useState(true);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoginTab) {
      login(email || "alex.morgan@fitwise.ai", password);
    } else {
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      register({
        name: name || "Alex Morgan",
        email: email || "alex.morgan@fitwise.ai"
      });
    }
  };

  const handleDemoLogin = () => {
    login("alex.morgan@fitwise.ai", "demo1234");
  };

  return (
    <div className="auth-page">
      <div className="container auth-container">
        <div className="auth-card glass-panel-glow">
          {/* Logo Brand Header */}
          <div className="auth-brand">
            <div className="auth-logo-icon">
              <Flame size={24} />
            </div>
            <h2 className="auth-title">
              {isLoginTab ? 'Welcome Back' : 'Create Your Account'}
            </h2>
            <p className="auth-subtitle">
              {isLoginTab
                ? 'Sign in to access your personalized workout splits & nutrition targets'
                : 'Join FitWise AI to generate your custom fitness & nutrition plan'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="tab-pill-box">
            <button
              type="button"
              className={`tab-pill-btn ${isLoginTab ? 'active' : ''}`}
              onClick={() => setIsLoginTab(true)}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`tab-pill-btn ${!isLoginTab ? 'active' : ''}`}
              onClick={() => setIsLoginTab(false)}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            {!isLoginTab && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="input-with-icon">
                  <User size={18} className="input-icon" />
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="Alex Morgan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  required
                  className="form-input"
                  placeholder="alex.morgan@fitwise.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <div className="label-with-link">
                <label className="form-label">Password</label>
                {isLoginTab && (
                  <span
                    className="forgot-link"
                    onClick={() => alert("Password reset link sent to registered email (Demo mode).")}
                  >
                    Forgot Password?
                  </span>
                )}
              </div>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="form-input"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="pwd-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {!isLoginTab && (
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="form-input"
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            )}

            {isLoginTab && (
              <div className="remember-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me for 30 days</span>
                </label>
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-lg w-full">
              <span>{isLoginTab ? 'Sign In to Dashboard' : 'Continue to Profile Setup'}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="demo-divider">
            <span>OR FAST DEMO EXPLORATION</span>
          </div>

          <button
            type="button"
            onClick={handleDemoLogin}
            className="btn btn-secondary w-full demo-btn"
          >
            <Sparkles size={18} className="text-emerald" />
            <span>Instant Demo Sign In (Alex Morgan)</span>
          </button>

          <p className="privacy-note">
            By signing in, you agree to our Terms of Service & Privacy Policy.
          </p>
        </div>
      </div>

      <style>{`
        .auth-page {
          min-height: calc(100vh - 150px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 16px;
        }
        .auth-container {
          display: flex;
          justify-content: center;
        }
        .auth-card {
          width: 100%;
          max-width: 480px;
          padding: 38px 32px;
          border-radius: 24px;
        }
        .auth-brand {
          text-align: center;
          margin-bottom: 24px;
        }
        .auth-logo-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: linear-gradient(135deg, #10b981, #06b6d4);
          color: #031b10;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          box-shadow: 0 4px 16px rgba(16, 185, 129, 0.4);
        }
        .auth-title {
          font-size: 1.8rem;
          margin-bottom: 8px;
        }
        .auth-subtitle {
          font-size: 0.88rem;
          color: var(--text-muted);
          line-height: 1.5;
        }
        .tab-pill-box {
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: rgba(255, 255, 255, 0.05);
          padding: 4px;
          border-radius: 12px;
          margin-bottom: 24px;
          border: 1px solid var(--border-subtle);
        }
        .tab-pill-btn {
          padding: 10px;
          border: none;
          background: transparent;
          color: var(--text-muted);
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: 0.92rem;
          border-radius: 8px;
          cursor: pointer;
          transition: var(--ease-smooth);
        }
        .tab-pill-btn.active {
          background: #1e293b;
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .label-with-link {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .forgot-link {
          font-size: 0.78rem;
          color: #38bdf8;
          cursor: pointer;
        }
        .forgot-link:hover {
          text-decoration: underline;
        }
        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-icon {
          position: absolute;
          left: 14px;
          color: var(--text-dim);
          pointer-events: none;
        }
        .input-with-icon .form-input {
          padding-left: 42px;
          padding-right: 42px;
          width: 100%;
        }
        .pwd-toggle-btn {
          position: absolute;
          right: 12px;
          background: transparent;
          border: none;
          color: var(--text-dim);
          cursor: pointer;
          padding: 4px;
          display: flex;
        }
        .pwd-toggle-btn:hover {
          color: #ffffff;
        }
        .remember-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.85rem;
        }
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-muted);
          cursor: pointer;
        }
        .checkbox-label input {
          accent-color: var(--primary);
        }
        .demo-divider {
          position: relative;
          text-align: center;
          margin: 24px 0 16px;
        }
        .demo-divider::before {
          content: "";
          position: absolute;
          left: 0;
          top: 50%;
          width: 100%;
          height: 1px;
          background: var(--border-subtle);
        }
        .demo-divider span {
          position: relative;
          background: #111827;
          padding: 0 12px;
          font-size: 0.72rem;
          letter-spacing: 0.08em;
          color: var(--text-dim);
          font-weight: 700;
        }
        .demo-btn {
          background: rgba(16, 185, 129, 0.08);
          border-color: rgba(16, 185, 129, 0.25);
          color: #34d399;
          font-size: 0.9rem;
        }
        .demo-btn:hover {
          background: rgba(16, 185, 129, 0.16);
        }
        .privacy-note {
          font-size: 0.75rem;
          color: var(--text-dim);
          text-align: center;
          margin-top: 18px;
        }
      `}</style>
    </div>
  );
};
