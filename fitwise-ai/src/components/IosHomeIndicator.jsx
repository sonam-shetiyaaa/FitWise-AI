import React from 'react';
import { useApp } from '../context/AppContext';
import { iosFeedback } from '../utils/iosHaptics';

export const IosHomeIndicator = ({ onHomeClick }) => {
  const { navigateTo } = useApp?.() || {};

  const handleClick = () => {
    iosFeedback.playIosClick(1400);
    iosFeedback.triggerHaptic('light');
    if (onHomeClick) {
      onHomeClick();
    } else if (navigateTo) {
      navigateTo('dashboard');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const mainEl = document.querySelector('.nutrifit-main-content');
    if (mainEl) mainEl.scrollTo({ top: 0, behavior: 'smooth' });
    const frameScroll = document.querySelector('.ios-device-screen-scroll');
    if (frameScroll) frameScroll.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="ios-home-indicator-wrap" onClick={handleClick} title="iOS Home Bar · Tap to return Home">
      <div className="ios-home-indicator-pill" />
      <style>{`
        .ios-home-indicator-wrap {
          display: flex;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 16px;
          padding-bottom: 4px;
          z-index: 9990;
          align-items: flex-end;
          justify-content: center;
          cursor: pointer;
          pointer-events: auto;
          user-select: none;
        }

        .ios-home-indicator-pill {
          width: 140px;
          height: 5px;
          background: rgba(255, 255, 255, 0.55);
          border-radius: 100px;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
          transition: all 0.2s cubic-bezier(0.32, 0.72, 0, 1);
        }

        .ios-home-indicator-wrap:hover .ios-home-indicator-pill {
          background: rgba(255, 255, 255, 0.9);
          width: 154px;
          transform: translateY(-2px);
          box-shadow: 0 2px 10px rgba(48, 209, 88, 0.4);
        }

        .ios-home-indicator-wrap:active .ios-home-indicator-pill {
          transform: scale(0.92) translateY(-1px);
        }

        @media (max-width: 640px) {
          .ios-home-indicator-pill {
            width: 124px;
            height: 4.5px;
          }
        }
      `}</style>
    </div>
  );
};
