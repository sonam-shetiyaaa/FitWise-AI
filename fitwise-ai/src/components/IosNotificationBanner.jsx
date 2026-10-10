import React, { useEffect } from 'react';
import { iosFeedback } from '../utils/iosHaptics';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const IosNotificationBanner = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (toast) {
      iosFeedback.playIosClick(1450);
      iosFeedback.triggerHaptic(toast.type === 'error' ? 'error' : 'success');
    }
  }, [toast]);

  if (!toast) return null;

  return (
    <div className="ios-banner-container" role="status" aria-live="polite">
      <div className="ios-glass-banner" onClick={onDismiss}>
        {/* Top App Identity Row */}
        <div className="ios-banner-top">
          <div className="ios-banner-app">
            <div className="ios-mini-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="#041f12" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mini-pulse-svg">
                <path d="M3 12h3.5l2-5 3.5 10 3-7 2 4h4" />
              </svg>
            </div>
            <span className="ios-app-title">NUTRIFIT</span>
          </div>

          <div className="ios-banner-meta">
            <span className="ios-timestamp">now</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDismiss?.();
              }}
              className="ios-dismiss-btn"
              aria-label="Dismiss notification"
            >
              <X size={13} />
            </button>
          </div>
        </div>

        {/* Banner Message Content */}
        <div className="ios-banner-body">
          {toast.type === 'success' && <CheckCircle2 size={16} className="text-emerald banner-icon" />}
          {toast.type === 'info' && <Info size={16} className="text-cyan banner-icon" />}
          {toast.type === 'error' && <AlertCircle size={16} className="text-danger banner-icon" />}
          <span className="ios-banner-text">{toast.message}</span>
        </div>
      </div>

      <style>{`
        .ios-banner-container {
          position: fixed;
          top: 18px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10000;
          width: 90%;
          max-width: 440px;
          pointer-events: auto;
          user-select: none;
        }

        .ios-glass-banner {
          background: rgba(14, 22, 17, 0.94);
          backdrop-filter: blur(28px) saturate(190%);
          -webkit-backdrop-filter: blur(28px) saturate(190%);
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 20px;
          padding: 12px 16px;
          box-shadow: 0 16px 45px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.08);
          display: flex;
          flex-direction: column;
          gap: 6px;
          cursor: pointer;
          animation: iosBannerSlideDown 0.35s cubic-bezier(0.32, 0.72, 0, 1) forwards;
          transition: transform 0.15s ease;
        }

        .ios-glass-banner:hover {
          transform: translateY(2px);
        }

        .ios-glass-banner:active {
          transform: scale(0.98);
        }

        @keyframes iosBannerSlideDown {
          from {
            opacity: 0;
            transform: translateY(-24px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .ios-banner-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .ios-banner-app {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .ios-mini-badge {
          width: 18px;
          height: 18px;
          border-radius: 5px;
          background: #10b981;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
        }

        .mini-pulse-svg {
          width: 12px;
          height: 12px;
        }

        .ios-app-title {
          font-family: var(--font-heading);
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #94a3b8;
        }

        .ios-banner-meta {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .ios-timestamp {
          font-size: 0.72rem;
          color: #64748b;
          font-weight: 500;
        }

        .ios-dismiss-btn {
          background: rgba(255, 255, 255, 0.08);
          border: none;
          color: #94a3b8;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .ios-dismiss-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.16);
        }

        .ios-banner-body {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .banner-icon {
          flex-shrink: 0;
        }

        .ios-banner-text {
          font-family: var(--font-heading);
          font-size: 0.88rem;
          font-weight: 600;
          color: #ffffff;
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
};
