import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { iosFeedback } from '../utils/iosHaptics';
import {
  Activity,
  Heart,
  Volume2,
  VolumeX,
  Moon,
  Sparkles,
  Sliders,
  Check,
  X,
  Flame,
  ShieldAlert,
  Clock,
  Compass
} from 'lucide-react';

export const ControlCenter = ({ isOpen, onClose }) => {
  const { user, updateProfile, showToast } = useApp();
  const [soundEnabled, setSoundEnabled] = useState(iosFeedback.isSoundEnabled());
  const [activeFocus, setActiveFocus] = useState(user?.fitnessGoal || 'Muscle Hypertrophy');
  const [oledMode, setOledMode] = useState(() => {
    try {
      return localStorage.getItem('nutrifit_oled_mode') === 'true';
    } catch (e) {
      return false;
    }
  });

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const toggleSound = () => {
    const updated = iosFeedback.toggleSound();
    setSoundEnabled(updated);
  };

  const handleFocusChange = (goal) => {
    iosFeedback.playIosClick(1300);
    iosFeedback.triggerHaptic('medium');
    setActiveFocus(goal);
    if (updateProfile) {
      updateProfile({ goal, fitnessGoal: goal });
    }
    showToast?.(`Focus set to ${goal}`, 'info');
  };

  const toggleOledMode = () => {
    iosFeedback.playIosClick(1100);
    iosFeedback.triggerHaptic('light');
    const newMode = !oledMode;
    setOledMode(newMode);
    try {
      localStorage.setItem('nutrifit_oled_mode', String(newMode));
    } catch (e) {}

    // Apply or remove pure OLED black class on body
    if (newMode) {
      document.body.classList.add('oled-pure-black');
    } else {
      document.body.classList.remove('oled-pure-black');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="control-center-backdrop" role="dialog" aria-modal="true">
      <div ref={menuRef} className="control-center-panel animate-fade-in">
        {/* Header */}
        <div className="cc-header">
          <div className="cc-title-group">
            <Sliders size={16} className="text-emerald" />
            <span className="cc-title">CONTROL CENTER</span>
          </div>
          <button onClick={onClose} className="cc-close-btn" aria-label="Close Control Center">
            <X size={16} />
          </button>
        </div>

        {/* 2x2 Grid of Control Modules */}
        <div className="cc-modules-grid">
          {/* Module 1: Apple Health Sync Tile */}
          <div className="cc-tile cc-health-tile">
            <div className="cc-tile-top">
              <div className="cc-icon-circle health-circle">
                <Heart size={16} className="heart-pulse" />
              </div>
              <span className="cc-status-pill">Connected</span>
            </div>
            <div className="cc-tile-body">
              <span className="cc-tile-label">Apple Health</span>
              <strong className="cc-tile-val">8,420 steps</strong>
              <span className="cc-tile-sub">482 active kcal</span>
            </div>
          </div>

          {/* Module 2: Display & Ambiance Tile */}
          <div className="cc-tile cc-toggle-tile" onClick={toggleOledMode}>
            <div className="cc-tile-top">
              <div className={`cc-icon-circle ${oledMode ? 'active-circle' : ''}`}>
                <Moon size={16} />
              </div>
              <span className={`toggle-dot ${oledMode ? 'active' : ''}`} />
            </div>
            <div className="cc-tile-body">
              <span className="cc-tile-label">Display Mode</span>
              <strong className="cc-tile-val">{oledMode ? 'OLED Pitch Black' : 'Midnight Emerald'}</strong>
              <span className="cc-tile-sub">Tap to toggle</span>
            </div>
          </div>

          {/* Module 3: Taptic Engine & System Click Sound */}
          <div className="cc-tile cc-toggle-tile" onClick={toggleSound}>
            <div className="cc-tile-top">
              <div className={`cc-icon-circle ${soundEnabled ? 'active-circle' : ''}`}>
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </div>
              <span className={`toggle-dot ${soundEnabled ? 'active' : ''}`} />
            </div>
            <div className="cc-tile-body">
              <span className="cc-tile-label">iOS Taptic Clicks</span>
              <strong className="cc-tile-val">{soundEnabled ? 'Sound On' : 'Muted'}</strong>
              <span className="cc-tile-sub">Apple UI micro-audio</span>
            </div>
          </div>

          {/* Module 4: Live Activity Status */}
          <div className="cc-tile cc-activity-tile">
            <div className="cc-tile-top">
              <div className="cc-icon-circle activity-circle">
                <Activity size={16} />
              </div>
              <span className="cc-status-pill emerald">Live</span>
            </div>
            <div className="cc-tile-body">
              <span className="cc-tile-label">Daily Target</span>
              <strong className="cc-tile-val">76% reached</strong>
              <span className="cc-tile-sub">2,985 kcal goal</span>
            </div>
          </div>
        </div>

        {/* Apple Focus Mode Selector */}
        <div className="cc-focus-section">
          <div className="focus-header">
            <Compass size={14} className="text-emerald" />
            <span className="focus-title">FITNESS FOCUS MODE</span>
          </div>

          <div className="focus-chips-row">
            {[
              { id: 'Muscle Hypertrophy', label: 'Hypertrophy' },
              { id: 'Fat Loss', label: 'Fat Loss' },
              { id: 'Maintenance', label: 'Maintenance' },
              { id: 'Strength & Power', label: 'Strength' }
            ].map((f) => {
              const isSelected = activeFocus === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => handleFocusChange(f.id)}
                  className={`focus-chip ${isSelected ? 'active' : ''}`}
                >
                  {isSelected && <Check size={13} className="text-emerald" />}
                  <span>{f.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .control-center-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 1500;
          display: flex;
          align-items: flex-start;
          justify-content: flex-end;
          padding: 80px 28px 0 0;
        }

        .control-center-panel {
          width: 360px;
          background: rgba(12, 18, 14, 0.95);
          backdrop-filter: blur(32px) saturate(200%);
          -webkit-backdrop-filter: blur(32px) saturate(200%);
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 26px;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.08);
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          animation: ccSlideDown 0.28s cubic-bezier(0.32, 0.72, 0, 1);
        }

        @keyframes ccSlideDown {
          from {
            opacity: 0;
            transform: translateY(-16px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .cc-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 4px;
        }

        .cc-title-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .cc-title {
          font-family: var(--font-heading);
          font-size: 0.76rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #94a3b8;
        }

        .cc-close-btn {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #94a3b8;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .cc-close-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.15);
        }

        /* 2x2 Grid */
        .cc-modules-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .cc-tile {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          cursor: pointer;
          transition: all 0.18s cubic-bezier(0.32, 0.72, 0, 1);
        }

        .cc-tile:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.18);
        }

        .cc-tile:active {
          transform: scale(0.96);
        }

        .cc-tile-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .cc-icon-circle {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          transition: all 0.18s ease;
        }

        .cc-icon-circle.active-circle {
          background: #10b981;
          color: #041f12;
        }

        .health-circle {
          background: rgba(244, 63, 94, 0.15);
          color: #fb7185;
        }

        .activity-circle {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
        }

        .heart-pulse {
          animation: heartBeat 1.4s infinite ease-in-out;
        }

        @keyframes heartBeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.18); }
        }

        .cc-status-pill {
          font-size: 0.68rem;
          font-weight: 700;
          color: #94a3b8;
          background: rgba(255, 255, 255, 0.06);
          padding: 2px 7px;
          border-radius: 9999px;
        }

        .cc-status-pill.emerald {
          color: #10b981;
          background: rgba(16, 185, 129, 0.12);
        }

        .toggle-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #475569;
        }

        .toggle-dot.active {
          background: #10b981;
          box-shadow: 0 0 8px #10b981;
        }

        .cc-tile-body {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .cc-tile-label {
          font-size: 0.74rem;
          color: #64748b;
          font-weight: 600;
        }

        .cc-tile-val {
          font-family: var(--font-heading);
          font-size: 0.96rem;
          font-weight: 700;
          color: #ffffff;
        }

        .cc-tile-sub {
          font-size: 0.72rem;
          color: #94a3b8;
        }

        /* Focus Section */
        .cc-focus-section {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .focus-header {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .focus-title {
          font-family: var(--font-heading);
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          color: #94a3b8;
        }

        .focus-chips-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .focus-chip {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 10px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #94a3b8;
          font-family: var(--font-heading);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .focus-chip:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.09);
        }

        .focus-chip.active {
          background: #122219;
          border-color: #1c3527;
          color: #ffffff;
          font-weight: 700;
        }

        .focus-chip:active {
          transform: scale(0.96);
        }

        @media (max-width: 640px) {
          .control-center-backdrop {
            padding: 70px 14px 0 14px;
            justify-content: center;
          }
          .control-center-panel {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};
