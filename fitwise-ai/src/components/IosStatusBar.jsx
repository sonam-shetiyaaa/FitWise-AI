import React, { useState, useEffect } from 'react';
import { iosFeedback } from '../utils/iosHaptics';
import { Search, Sliders, Moon, Wifi } from 'lucide-react';

export const IosStatusBar = ({ onOpenControlCenter, onOpenSpotlight, isDeviceFrame = false }) => {
  const [currentTime, setCurrentTime] = useState(() => {
    const d = new Date();
    const hours = d.getHours() % 12 || 12;
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  });

  const [batteryLevel, setBatteryLevel] = useState(98);
  const [isCharging, setIsCharging] = useState(false);

  // Live minute clock update
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const hours = d.getHours() % 12 || 12;
      const minutes = String(d.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };

    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Battery API if supported by browser
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      navigator.getBattery().then((battery) => {
        setBatteryLevel(Math.round(battery.level * 100));
        setIsCharging(battery.charging);

        const onLevelChange = () => setBatteryLevel(Math.round(battery.level * 100));
        const onChargeChange = () => setIsCharging(battery.charging);

        battery.addEventListener('levelchange', onLevelChange);
        battery.addEventListener('chargingchange', onChargeChange);

        return () => {
          battery.removeEventListener('levelchange', onLevelChange);
          battery.removeEventListener('chargingchange', onChargeChange);
        };
      }).catch(() => {});
    }
  }, []);

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
      {/* Left: Time & Location Indicator */}
      <div className="ios-status-left">
        <span className="ios-status-time">{currentTime}</span>
        <svg
          viewBox="0 0 24 24"
          width="10"
          height="10"
          fill="rgba(255, 255, 255, 0.75)"
          className="ios-location-icon"
          aria-hidden="true"
        >
          <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
        </svg>
      </div>

      {/* Center: Dynamic Sensor Aperture Notch / Slit */}
      <div className="ios-status-center" aria-hidden="true">
        <div className="ios-speaker-slit" />
      </div>

      {/* Right: Cellular, 5G/Wi-Fi, Battery & Quick Actions */}
      <div className="ios-status-right">
        {/* Quick Spotlight Search Icon */}
        <button
          onClick={handleSpotlight}
          className="ios-status-action-btn"
          title="Spotlight Search (⌘K)"
          aria-label="Spotlight Search"
        >
          <Search size={12} strokeWidth={2.4} />
        </button>

        {/* 4-Bar Cellular Signal */}
        <div className="ios-cellular-bars" title="5G Cellular Signal (Full)">
          <span className="cell-bar bar-1" />
          <span className="cell-bar bar-2" />
          <span className="cell-bar bar-3" />
          <span className="cell-bar bar-4" />
        </div>

        {/* Wi-Fi Icon */}
        <svg
          className="ios-wifi-icon"
          viewBox="0 0 24 24"
          width="13"
          height="13"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          title="Wi-Fi Connected"
          aria-hidden="true"
        >
          <path d="M5 12.55a11 11 0 0 1 14.08 0" />
          <path d="M1.42 9a16 16 0 0 1 21.16 0" />
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
          <line x1="12" y1="20" x2="12.01" y2="20" strokeWidth="3" />
        </svg>

        {/* Apple Battery Pill (Interactive -> opens Control Center) */}
        <div
          className="ios-battery-pill-wrap"
          onClick={handleControlCenter}
          title={`Battery ${batteryLevel}% · Tap for Control Center`}
        >
          <span className="ios-battery-pct">{batteryLevel}%</span>
          <div className="ios-battery-outer">
            <div
              className={`ios-battery-fill ${batteryLevel <= 20 ? 'low' : ''} ${isCharging ? 'charging' : ''}`}
              style={{ width: `${Math.min(100, Math.max(10, batteryLevel))}%` }}
            />
            {isCharging && (
              <svg viewBox="0 0 24 24" className="battery-bolt" fill="#ffffff" width="7" height="7">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            )}
          </div>
          <div className="ios-battery-terminal" />
        </div>

        {/* Control Center Pill Trigger */}
        <button
          onClick={handleControlCenter}
          className="ios-control-trigger-btn"
          title="Open iOS Control Center"
          aria-label="Open Control Center"
        >
          <Sliders size={12} strokeWidth={2.4} />
        </button>
      </div>

      <style>{`
        .ios-system-status-bar {
          width: 100%;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 22px;
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
          padding: 10px 24px 4px 24px;
          height: 44px;
          background: transparent;
          border-bottom: none;
        }

        /* Left */
        .ios-status-left {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
          font-size: 0.88rem;
          letter-spacing: -0.02em;
        }

        .ios-status-time {
          color: #ffffff;
          font-variant-numeric: tabular-nums;
        }

        .ios-location-icon {
          opacity: 0.8;
          transform: rotate(-45deg);
        }

        /* Center Speaker / Notch */
        .ios-status-center {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ios-speaker-slit {
          width: 52px;
          height: 4.5px;
          background: #111815;
          border-radius: 999px;
          border: 0.5px solid rgba(255, 255, 255, 0.12);
        }

        /* Right */
        .ios-status-right {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .ios-status-action-btn,
        .ios-control-trigger-btn {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          border: 0.5px solid rgba(255, 255, 255, 0.12);
          color: #cbd5e1;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
          padding: 0;
        }

        .ios-status-action-btn:hover,
        .ios-control-trigger-btn:hover {
          background: rgba(255, 255, 255, 0.18);
          color: #ffffff;
          transform: scale(1.08);
        }

        .ios-status-action-btn:active,
        .ios-control-trigger-btn:active {
          transform: scale(0.92);
        }

        /* Cellular 4-Bar */
        .ios-cellular-bars {
          display: flex;
          align-items: flex-end;
          gap: 1.5px;
          height: 10px;
          padding: 0 1px;
        }

        .cell-bar {
          width: 3px;
          background: #ffffff;
          border-radius: 1px;
        }

        .bar-1 { height: 3px; }
        .bar-2 { height: 5px; }
        .bar-3 { height: 7.5px; }
        .bar-4 { height: 10px; }

        /* Wi-Fi */
        .ios-wifi-icon {
          color: #ffffff;
          stroke: #ffffff;
        }

        /* Battery Pill */
        .ios-battery-pill-wrap {
          display: flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          padding: 2px 4px;
          border-radius: 6px;
          transition: background-color 0.15s ease;
        }

        .ios-battery-pill-wrap:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        .ios-battery-pct {
          font-size: 0.73rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
          letter-spacing: -0.02em;
        }

        .ios-battery-outer {
          width: 22px;
          height: 11.5px;
          border: 1.2px solid rgba(255, 255, 255, 0.65);
          border-radius: 3.5px;
          padding: 1.2px;
          display: flex;
          align-items: center;
          position: relative;
        }

        .ios-battery-fill {
          height: 100%;
          background: #30D158;
          border-radius: 1.8px;
          transition: width 0.3s ease;
        }

        .ios-battery-fill.low {
          background: #FF453A;
        }

        .ios-battery-terminal {
          width: 1.6px;
          height: 4.5px;
          background: rgba(255, 255, 255, 0.65);
          border-radius: 0 1.5px 1.5px 0;
          margin-left: -2px;
        }

        .battery-bolt {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }

        @media (max-width: 640px) {
          .ios-system-status-bar {
            padding: 0 14px;
            height: 34px;
          }

          .ios-speaker-slit {
            width: 36px;
          }

          .ios-battery-pct {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};
