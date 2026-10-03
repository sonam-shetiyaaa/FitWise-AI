import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  X
} from 'lucide-react';

export const AuthModal = () => {
  const {
    authModalOpen,
    closeAuthModal,
    authModalTab,
    setAuthModalTab,
    login,
    register
  } = useApp();

  const isLoginTab = authModalTab === 'signin';

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (authModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [authModalOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && authModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [authModalOpen, closeAuthModal]);

  if (!authModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoginTab) {
      if (!email.trim()) {
        alert("Please enter your email address.");
        return;
      }
      login(email.trim(), password);
    } else {
      if (!name.trim()) {
        alert("Please enter your full name.");
        return;
      }
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      register({
        name: name.trim(),
        email: email.trim() || `${name.trim().toLowerCase().replace(/\s+/g, '.')}@fitwise.ai`
      });
    }
  };

  const handleDemoLogin = () => {
    login("alex.morgan@fitwise.ai", "demo1234", "Alex Morgan");
  };

  return createPortal(
    <div className="auth-modal-backdrop" onClick={closeAuthModal}>
      <div className="auth-modal-card glass-panel-glow" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          className="btn-close-modal"
          onClick={closeAuthModal}
          title="Close dialog"
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        {/* Brand Header */}
        <div className="auth-modal-header">
          <div className="auth-modal-icon">
            <Flame size={24} />
          </div>
          <h2 className="auth-modal-title">
            {isLoginTab ? 'Welcome Back' : 'Get Started with FitWise AI'}
          </h2>
          <p className="auth-modal-subtitle">
            {isLoginTab
              ? 'Existing user? Sign in to access your workout splits & nutrition plan.'
              : 'New athlete? Create your profile to generate custom AI workouts & macros.'}
          </p>
        </div>

        {/* Tab Switcher: Existing User vs New User */}
        <div className="tab-pill-box">
          <button
            type="button"
            className={`tab-pill-btn ${isLoginTab ? 'active' : ''}`}
            onClick={() => setAuthModalTab('signin')}
          >
            Existing User (Sign In)
          </button>
          <button
            type="button"
            className={`tab-pill-btn ${!isLoginTab ? 'active' : ''}`}
            onClick={() => setAuthModalTab('register')}
          >
            New User (Register)
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-modal-form">
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
                  onChange={(e) => setName(e.target.value)}
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
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <div className="label-with-link">
              <label className="form-label">Password *</label>
              {isLoginTab && (
                <span
                  className="forgot-link"
                  onClick={() => alert("Password reset link sent to your registered email (Demo mode).")}
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
                aria-label="Toggle password visibility"
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

          <button type="submit" className="btn btn-primary btn-lg w-full submit-btn">
            <span>{isLoginTab ? 'Sign In to Dashboard' : 'Create Account & Continue'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Demo Option */}
        <div className="demo-divider">
          <span>OR FAST 1-CLICK DEMO</span>
        </div>

        <button
          type="button"
          onClick={handleDemoLogin}
          className="btn btn-secondary w-full demo-btn"
        >
          <Sparkles size={18} className="text-emerald" />
          <span>Instant Demo Sign In (Alex Morgan)</span>
        </button>

        <p className="modal-privacy-note">
          By continuing, you agree to our Terms of Service & Privacy Policy.
        </p>
      </div>

      <style>{`
        .auth-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 2000;
          background: rgba(3, 7, 18, 0.82);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeIn 0.2s ease-out;
        }
        .auth-modal-card {
          width: 100%;
          max-width: 480px;
          max-height: 90vh;
          overflow-y: auto;
          background: #0d1424;
          border: 1px solid var(--border-glow);
          border-radius: 24px;
          padding: 32px 28px;
          position: relative;
          box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 35px rgba(16, 185, 129, 0.15);
          animation: modalScaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .btn-close-modal {
          position: absolute;
          top: 18px;
          right: 18px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--border-subtle);
          color: var(--text-muted);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--ease-smooth);
        }
        .btn-close-modal:hover {
          color: #ffffff;
          background: rgba(239, 68, 68, 0.2);
          border-color: rgba(239, 68, 68, 0.4);
        }
        .auth-modal-header {
          text-align: center;
          margin-bottom: 20px;
        }
        .auth-modal-icon {
          width: 46px;
          height: 46px;
          border-radius: 12px;
          background: linear-gradient(135deg, #10b981, #06b6d4);
          color: #031b10;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
          box-shadow: 0 8px 20px rgba(16, 185, 129, 0.35);
        }
        .auth-modal-title {
          font-family: var(--font-heading);
          font-size: 1.45rem;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 6px;
          letter-spacing: -0.02em;
        }
        .auth-modal-subtitle {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.45;
        }
        .tab-pill-box {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
          background: rgba(255, 255, 255, 0.04);
          padding: 5px;
          border-radius: 12px;
          border: 1px solid var(--border-subtle);
          margin-bottom: 22px;
        }
        .tab-pill-btn {
          padding: 10px 8px;
          font-family: var(--font-heading);
          font-size: 0.85rem;
          font-weight: 600;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: var(--text-muted);
          cursor: pointer;
          transition: var(--ease-smooth);
        }
        .tab-pill-btn.active {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.2));
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.35);
          box-shadow: 0 2px 10px rgba(16, 185, 129, 0.15);
        }
        .auth-modal-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
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
          letter-spacing: 0.01em;
        }
        .label-with-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .forgot-link {
          font-size: 0.78rem;
          color: #38bdf8;
          cursor: pointer;
          transition: var(--ease-smooth);
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
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          transition: var(--ease-smooth);
        }
        .pwd-toggle-btn:hover {
          color: #ffffff;
        }
        .remember-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          color: var(--text-muted);
          cursor: pointer;
        }
        .checkbox-label input {
          accent-color: #10b981;
        }
        .submit-btn {
          margin-top: 4px;
        }
        .demo-divider {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 18px 0 12px;
        }
        .demo-divider::before, .demo-divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid var(--border-subtle);
        }
        .demo-divider span {
          padding: 0 10px;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--text-dim);
        }
        .demo-btn {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          padding: 10px;
          font-size: 0.88rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-radius: 12px;
        }
        .demo-btn:hover {
          border-color: rgba(16, 185, 129, 0.4);
          background: rgba(16, 185, 129, 0.08);
        }
        .modal-privacy-note {
          text-align: center;
          font-size: 0.74rem;
          color: var(--text-dim);
          margin-top: 14px;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalScaleIn {
          from { opacity: 0; transform: scale(0.94) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @media (max-width: 500px) {
          .auth-modal-card {
            padding: 24px 18px;
          }
          .tab-pill-btn {
            font-size: 0.78rem;
            padding: 8px 4px;
          }
        }
      `}</style>
    </div>,
    document.body
  );
};
