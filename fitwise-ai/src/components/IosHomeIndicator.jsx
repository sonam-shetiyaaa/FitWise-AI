import React from 'react';

export const IosHomeIndicator = () => {
  return (
    <div className="ios-home-indicator-wrap" aria-hidden="true">
      <div className="ios-home-indicator-pill" />
      <style>{`
        .ios-home-indicator-wrap {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 24px;
          pointer-events: none;
          z-index: 9999;
          align-items: center;
          justify-content: center;
        }

        .ios-home-indicator-pill {
          width: 138px;
          height: 5px;
          background: rgba(255, 255, 255, 0.45);
          border-radius: 100px;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
          transition: background-color 0.2s ease;
        }

        @media (max-width: 900px) {
          .ios-home-indicator-wrap {
            display: flex;
          }
        }
      `}</style>
    </div>
  );
};
