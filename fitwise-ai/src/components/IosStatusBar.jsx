import React from 'react';
import { iosFeedback } from '../utils/iosHaptics';
import { Search, Sliders } from 'lucide-react';

export const IosStatusBar = ({ onOpenControlCenter, onOpenSpotlight, isDeviceFrame = false }) => {
  // Tap status bar to scroll to top (native iOS behavior)
  const handleScrollTop = () => {
    iosFeedback.playIosClick(1400);
    iosFeedback.triggerHaptic('light');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const mainEl = document.querySelector('.nutrifit-main-content');
    if (mainEl) mainEl.scrollTo({ top: 0, behavior: 'smooth' });
    const frameContent = document.querySelector('.ios-device-screen-scroll');
    if (frameContent) frameContent.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleControlCenter = (e) => {
    e.stopPropagation();
    iosFeedback.playIosClick(1300);
    iosFeedback.triggerHaptic('medium');
    onOpenControlCenter?.();
  };

  const handleSpotlight = (e) => {
    e.stopPropagation();
    iosFeedback.playIosClick(1200);
    iosFeedback.triggerHaptic('light');
    onOpenSpotlight?.();
  };

  return (
    <div
      className={`ios-system-status-bar ${isDeviceFrame ? 'in-device-frame' : ''}`}
      onClick={handleScrollTop}
      title="Tap to scroll to top"
    >
      <div className="ios-status-actions-group">
        {/* Spotlight Search */}
        <button
          type="button"
          onClick={handleSpotlight}
          className="ios-status-pill-btn"
          title="Spotlight Search (⌘K / Ctrl+K)"
          aria-label="Spotlight Search"
        >
          <Search size={13} strokeWidth={2.4} />
          <span className="ios-pill-label">Spotlight Search</span>
          <kbd className="ios-pill-kbd">⌘K</kbd>
        </button>

        {/* iOS Control Centre */}
        <button
          type="button"
          onClick={handleControlCenter}
          className="ios-status-pill-btn ios-control-center-btn"
          title="Open iOS Control Centre"
          aria-label="Open iOS Control Centre"
        >
          <Sliders size={13} strokeWidth={2.4} />
          <span className="ios-pill-label">Control Centre</span>
        </button>
      </div>

      <style>{`
        .ios-system-status-bar {
          width: 100%;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding: 0 20px;
          background: rgba(8, 12, 10, 0.95);
          backdrop-filter: blur(24px) saturate(190%);
          -webkit-backdrop-filter: blur(24px) saturate(190%);
          color: #ffffff;
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro", system-ui, sans-serif;
          user-select: none;
          z-index: 900;
          cursor: pointer;
          position: sticky;
          top: 0;
          border-bottom: 0.5px solid rgba(255, 255, 255, 0.08);
          transition: background-color 0.2s ease;
        }

        .ios-system-status-bar:hover {
          background: rgba(12, 18, 15, 0.98);
        }

        .ios-system-status-bar.in-device-frame {
          padding: 10px 20px 4px 20px;
          height: 44px;
          background: transparent;
          border-bottom: none;
        }

        .ios-status-actions-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .ios-status-pill-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 11px;
          height: 27px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          border: 0.5px solid rgba(255, 255, 255, 0.14);
          color: #e2e8f0;
          font-size: 0.76rem;
          font-weight: 500;
          letter-spacing: -0.01em;
          cursor: pointer;
          transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          user-select: none;
        }

        .ios-status-pill-btn:hover {
          background: rgba(255, 255, 255, 0.16);
          border-color: rgba(255, 255, 255, 0.28);
          color: #ffffff;
          transform: translateY(-0.5px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
        }

        .ios-status-pill-btn:active {
          transform: scale(0.96);
          background: rgba(255, 255, 255, 0.2);
        }

        .ios-control-center-btn {
          background: rgba(16, 185, 129, 0.12);
          border-color: rgba(16, 185, 129, 0.25);
          color: #6ee7b7;
        }

        .ios-control-center-btn:hover {
          background: rgba(16, 185, 129, 0.2);
          border-color: rgba(16, 185, 129, 0.4);
          color: #a7f3d0;
        }

        .ios-pill-label {
          display: inline-block;
          white-space: nowrap;
        }

        .ios-pill-kbd {
          font-size: 0.62rem;
          font-family: inherit;
          padding: 1px 5px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.12);
          border: 0.5px solid rgba(255, 255, 255, 0.2);
          color: #cbd5e1;
          line-height: 1.1;
        }

        @media (max-width: 640px) {
          .ios-system-status-bar {
            padding: 0 12px;
            height: 34px;
          }

          .ios-pill-kbd {
            display: none;
          }

          .ios-pill-label {
            font-size: 0.72rem;
          }

          .ios-status-pill-btn {
            padding: 4px 8px;
            height: 25px;
          }
        }

        @media (max-width: 400px) {
          .ios-pill-label {
            display: none;
          }
          .ios-status-pill-btn {
            padding: 0;
            width: 26px;
            height: 26px;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};
