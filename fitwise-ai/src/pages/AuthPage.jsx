import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Flame,
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  ArrowLeft
} from 'lucide-react';

export const AuthPage = () => {
  const { login, register, resetPassword, navigateTo } = useApp();
  const [isLoginTab, setIsLoginTab] = useState(true);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Forgot password & feedback states
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Clear errors when switching tabs
  useEffect(() => {
    setAuthError('');
    setAuthSuccess('');
    setIsForgotMode(false);
  }, [isLoginTab]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (isLoginTab) {
      if (!email.trim()) {
        setAuthError("Please enter your email address.");
        return;
      }
      if (!password) {
        setAuthError("Please enter your password.");
        return;
      }
      const result = login(email.trim(), password, null, rememberMe);
      if (result && !result.success) {
        setAuthError(result.error);
      }
    } else {
      if (!name.trim()) {
        setAuthError("Please enter your full name.");
        return;
      }
      if (!email.trim()) {
        setAuthError("Please enter your email address.");
        return;
      }
      if (!password) {
        setAuthError("Please enter a password.");
        return;
      }
      if (password.length < 6) {
        setAuthError("Password must be at least 6 characters long.");
        return;
      }
      if (password !== confirmPassword) {
        setAuthError("Passwords do not match. Please verify both passwords.");
        return;
      }
      const result = register({
        name: name.trim(),
        email: email.trim(),
        password: password
      });
      if (result && !result.success) {
        setAuthError(result.error);
      }
    }
  };

  const handleResetPasswordSubmit = (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (!email.trim()) {
      setAuthError("Please enter your registered email address.");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setAuthError("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setAuthError("Passwords do not match. Please re-enter.");
      return;
    }

    const res = resetPassword(email.trim(), newPassword);
    if (res.success) {
      setAuthSuccess(res.message);
      setPassword(newPassword);
      setTimeout(() => {
        setIsForgotMode(false);
        setIsLoginTab(true);
        setAuthError('');
      }, 1500);
    } else {
      setAuthError(res.error);
    }
  };

  const handleDemoLogin = () => {
    setAuthError('');
    setAuthSuccess('');
    setEmail("alex.morgan@fitwise.ai");
    setPassword("demo1234");
    login("alex.morgan@fitwise.ai", "demo1234", "Alex Morgan");
  };

  return (
    <div className="auth-page">
      <div className="container auth-container">
        <div className="auth-card glass-panel-glow">
          {/* Logo Brand Header */}
          <div className="auth-brand">
            <div className="auth-logo-icon">
              {isForgotMode ? <KeyRound size={24} /> : <Flame size={24} />}
            </div>
            <h2 className="auth-title">
              {isForgotMode
                ? 'Reset Your Password'
                : isLoginTab
                ? 'Welcome Back'
                : 'Create Your Account'}
            </h2>
            <p className="auth-subtitle">
              {isForgotMode
                ? 'Enter your registered email and choose a new password.'
                : isLoginTab
                ? 'Sign in to access your personalized workout splits & nutrition targets'
                : 'Join FitWise AI to generate your custom fitness & nutrition plan'}
            </p>
          </div>

          {/* Tab Switcher (only when not in forgot password mode) */}
          {!isForgotMode && (
            <div className="tab-pill-box">
              <button
                type="button"
                className={`tab-pill-btn ${isLoginTab ? 'active' : ''}`}
                onClick={() => {
                  setIsLoginTab(true);
                  setAuthError('');
                  setAuthSuccess('');
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`tab-pill-btn ${!isLoginTab ? 'active' : ''}`}
                onClick={() => {
                  setIsLoginTab(false);
                  setAuthError('');
                  setAuthSuccess('');
                }}
              >
                Register
              </button>
            </div>
          )}

          {/* Inline Feedback Alerts */}
          {authError && (
            <div className="auth-alert-box auth-alert-error">
              <AlertCircle size={18} className="auth-alert-icon" />
              <div className="auth-alert-content">
                <span className="auth-alert-text">{authError}</span>
                {authError.includes('already exists') && (
                  <button
                    type="button"
                    className="auth-alert-action-btn"
                    onClick={() => {
                      setIsLoginTab(true);
                      setAuthError('');
                    }}
                  >
                    Click here to Sign In &rarr;
                  </button>
                )}
                {authError.includes('No account found') && (
                  <button
                    type="button"
                    className="auth-alert-action-btn"
                    onClick={() => {
                      setIsLoginTab(false);
                      setAuthError('');
                    }}
                  >
                    Click here to Register &rarr;
                  </button>
                )}
              </div>
            </div>
          )}

          {authSuccess && (
            <div className="auth-alert-box auth-alert-success">
              <CheckCircle2 size={18} className="auth-alert-icon" />
              <span className="auth-alert-text">{authSuccess}</span>
            </div>
          )}

          {/* Form: Forgot Password Mode */}
          {isForgotMode ? (
            <form onSubmit={handleResetPasswordSubmit} className="auth-form">
              <div className="form-group">
                <label className="form-label">Registered Email Address *</label>
                <div className="input-with-icon">
                  <Mail size={18} className="input-icon" />
                  <input
                    type="email"
                    required
                    className="form-input"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (authError) setAuthError('');
                    }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">New Password (min 6 characters) *</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="form-input"
                    placeholder="••••••••••••"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (authError) setAuthError('');
                    }}
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

              <div className="form-group">
                <label className="form-label">Confirm New Password *</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="form-input"
                    placeholder="••••••••••••"
                    value={confirmNewPassword}
                    onChange={(e) => {
                      setConfirmNewPassword(e.target.value);
                      if (authError) setAuthError('');
                    }}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg w-full">
                <span>Update Password & Continue</span>
                <ArrowRight size={18} />
              </button>

              <button
                type="button"
                className="btn btn-secondary w-full"
                style={{ marginTop: '8px' }}
                onClick={() => {
                  setIsForgotMode(false);
                  setAuthError('');
                  setAuthSuccess('');
                }}
              >
                <ArrowLeft size={16} />
                <span>Back to Sign In</span>
              </button>
            </form>
          ) : (
            /* Form: Sign In / Register */
            <form onSubmit={handleSubmit} className="auth-form">
              {!isLoginTab && (
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <div className="input-with-icon">
                    <User size={18} className="input-icon" />
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="e.g. John Doe"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (authError) setAuthError('');
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <div className="input-with-icon">
                  <Mail size={18} className="input-icon" />
                  <input
                    type="email"
                    required
                    className="form-input"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (authError) setAuthError('');
                    }}
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="label-with-link">
                  <label className="form-label">
                    {isLoginTab ? 'Password *' : 'Create Password (min 6 characters) *'}
                  </label>
                  {isLoginTab && (
                    <span
                      className="forgot-link"
                      onClick={() => {
                        setIsForgotMode(true);
                        setAuthError('');
                        setAuthSuccess('');
                      }}
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
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (authError) setAuthError('');
                    }}
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
                  <label className="form-label">Confirm Password *</label>
                  <div className="input-with-icon">
                    <Lock size={18} className="input-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      className="form-input"
                      placeholder="••••••••••••"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (authError) setAuthError('');
                      }}
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
          )}

          {/* Quick Demo Login Option (only when not in forgot password mode) */}
          {!isForgotMode && (
            <>
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
            </>
          )}

          <div className="landing-link-wrap">
            <button
              type="button"
              onClick={() => navigateTo('landing')}
              className="btn-link-landing"
            >
              ← Explore FitWise AI Overview & Features
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .landing-link-wrap {
          text-align: center;
          margin-top: 14px;
        }
        .btn-link-landing {
          background: none;
          border: none;
          color: var(--text-dim);
          font-size: 0.85rem;
          cursor: pointer;
          transition: var(--ease-smooth);
        }
        .btn-link-landing:hover {
          color: #34d399;
          text-decoration: underline;
        }
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
          width: 100%;
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

        /* Alert Banners */
        .auth-alert-box {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 14px;
          border-radius: 12px;
          margin-bottom: 18px;
          font-size: 0.84rem;
          line-height: 1.4;
          animation: fadeIn 0.2s ease-out;
        }
        .auth-alert-error {
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.4);
          color: #fca5a5;
        }
        .auth-alert-success {
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.4);
          color: #86efac;
        }
        .auth-alert-icon {
          flex-shrink: 0;
          margin-top: 1px;
        }
        .auth-alert-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .auth-alert-text {
          font-weight: 500;
        }
        .auth-alert-action-btn {
          background: none;
          border: none;
          color: #38bdf8;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          padding: 0;
          text-align: left;
          text-decoration: underline;
        }
        .auth-alert-action-btn:hover {
          color: #7dd3fc;
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
        .form-label {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-main);
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
          transition: var(--ease-smooth);
        }
        .forgot-link:hover {
          text-decoration: underline;
          color: #7dd3fc;
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
        .form-input {
          width: 100%;
          padding: 11px 42px 11px 42px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          color: #ffffff;
          font-size: 0.92rem;
          font-family: var(--font-sans);
          transition: var(--ease-smooth);
        }
        .form-input:focus {
          outline: none;
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.06);
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
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
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};
