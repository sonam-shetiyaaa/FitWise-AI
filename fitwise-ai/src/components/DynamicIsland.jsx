import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { calculateTargets } from '../utils/nutritionCalculations';
import { iosFeedback } from '../utils/iosHaptics';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Clock,
  ArrowRight,
  X,
  Flame,
  Check
} from 'lucide-react';

export const DynamicIsland = () => {
  const { user, navigateTo, currentPage } = useApp();
  const [isExpanded, setIsExpanded] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(iosFeedback.isSoundEnabled());

  // Dynamic Island Built-in iOS Rest Timer
  const [restSecondsLeft, setRestSecondsLeft] = useState(60);
  const [restTotalSeconds, setRestTotalSeconds] = useState(60);
  const [isRestRunning, setIsRestRunning] = useState(false);
  const timerIntervalRef = useRef(null);
  const islandRef = useRef(null);

  const targets = calculateTargets(user || {});

  // Handle outside clicks to collapse the island
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (islandRef.current && !islandRef.current.contains(e.target)) {
        if (isExpanded) {
          iosFeedback.triggerHaptic('light');
          setIsExpanded(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExpanded]);

  // Timer interval handling
  useEffect(() => {
    if (isRestRunning) {
      timerIntervalRef.current = setInterval(() => {
        setRestSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            setIsRestRunning(false);
            iosFeedback.playIosChime();
            iosFeedback.triggerHaptic('success');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerIntervalRef.current);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [isRestRunning]);

  const toggleExpand = () => {
    iosFeedback.playIosClick(isExpanded ? 1100 : 1350);
    iosFeedback.triggerHaptic(isExpanded ? 'light' : 'medium');
    setIsExpanded((prev) => !prev);
  };

  const handleToggleSound = (e) => {
    e.stopPropagation();
    const updated = iosFeedback.toggleSound();
    setSoundEnabled(updated);
  };

  const toggleRestTimer = (e) => {
    e.stopPropagation();
    iosFeedback.playIosClick(isRestRunning ? 900 : 1500);
    iosFeedback.triggerHaptic('medium');
    if (restSecondsLeft === 0) {
      setRestSecondsLeft(restTotalSeconds);
      setIsRestRunning(true);
    } else {
      setIsRestRunning(!isRestRunning);
    }
  };

  const resetRestTimer = (e) => {
    e.stopPropagation();
    iosFeedback.playIosClick(800);
    iosFeedback.triggerHaptic('light');
    setIsRestRunning(false);
    setRestSecondsLeft(restTotalSeconds);
  };

  const selectRestPreset = (seconds, e) => {
    e?.stopPropagation();
    iosFeedback.playIosClick(1200);
    iosFeedback.triggerHaptic('selection');
    setRestTotalSeconds(seconds);
    setRestSecondsLeft(seconds);
    setIsRestRunning(true);
  };

  const formatRestTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  const timerProgress = restTotalSeconds > 0
    ? ((restTotalSeconds - restSecondsLeft) / restTotalSeconds) * 100
    : 0;

  return (
    <div
      ref={islandRef}
      className={`ios-dynamic-island ${isExpanded ? 'expanded' : 'compact'}`}
      onClick={!isExpanded ? toggleExpand : undefined}
      role="region"
      aria-label="iOS Dynamic Island Live Activity"
    >
      {!isExpanded ? (
        /* Compact Pill State (Standard iOS Dynamic Island) */
        <div className="island-compact-view">
          <div className="island-compact-left">
            <span className={`island-pulse-dot ${isRestRunning ? 'timer-pulse' : ''}`} />
            {isRestRunning ? (
              <Clock size={13} className="text-emerald" />
            ) : (
              <Flame size={13} className="text-emerald" />
            )}
          </div>

          <div className="island-compact-center">
            {isRestRunning ? (
              <span className="compact-timer-text">{formatRestTime(restSecondsLeft)}</span>
            ) : (
              <span className="compact-kicker">NutriFit Live</span>
            )}
          </div>

          <div className="island-compact-right">
            <span className="compact-target-badge">
              {isRestRunning ? 'RESTING' : `${targets.targetCalories} kcal`}
            </span>
          </div>
        </div>
      ) : (
        /* Expanded Live Activity View */
        <div className="island-expanded-view animate-fade-in">
          {/* Header */}
          <div className="island-header">
            <div className="island-badge-group">
              <span className="island-live-indicator" />
              <span className="island-title">LIVE ACTIVITY</span>
            </div>

            <div className="island-header-actions">
              <button
                onClick={handleToggleSound}
                className="island-icon-btn"
                title={soundEnabled ? 'Mute iOS Click Audio' : 'Enable iOS Click Audio'}
                aria-label="Toggle iOS Audio"
              >
                {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
              </button>
              <button
                onClick={toggleExpand}
                className="island-icon-btn close-btn"
                title="Collapse Dynamic Island"
                aria-label="Close"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Activity Metrics Grid */}
          <div className="island-metrics-grid">
            {/* Calories Card */}
            <div className="island-metric-card">
              <span className="metric-tag">DAILY TARGET</span>
              <div className="metric-val-row">
                <strong className="metric-primary-val">{targets.targetCalories.toLocaleString()}</strong>
                <span className="metric-unit">kcal</span>
              </div>
              <span className="metric-sub">{targets.goalLabel || 'Hypertrophy'}</span>
            </div>

            {/* Protein Card */}
            <div className="island-metric-card">
              <span className="metric-tag">PROTEIN SPLIT</span>
              <div className="metric-val-row">
                <strong className="metric-primary-val protein-text">{targets.protein.grams}g</strong>
                <span className="metric-unit">{targets.protein.percent}%</span>
              </div>
              <span className="metric-sub">{targets.protein.perKg} target</span>
            </div>
          </div>

          {/* Integrated iOS Rest Interval Timer */}
          <div className="island-timer-section">
            <div className="timer-section-head">
              <span className="timer-section-label">Rest & Recovery Interval</span>
              <span className="timer-badge">
                {isRestRunning ? 'Counting Down' : restSecondsLeft === 0 ? 'Finished' : 'Standby'}
              </span>
            </div>

            <div className="timer-control-row">
              <div className="timer-countdown-display">
                <span className="timer-digits">{formatRestTime(restSecondsLeft)}</span>
              </div>

              {/* Preset Interval Buttons */}
              <div className="timer-presets-group">
                {[30, 60, 90].map((preset) => (
                  <button
                    key={preset}
                    onClick={(e) => selectRestPreset(preset, e)}
                    className={`island-preset-chip ${restTotalSeconds === preset ? 'active' : ''}`}
                  >
                    {preset}s
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="timer-btns-group">
                <button
                  onClick={toggleRestTimer}
                  className={`island-action-btn ${isRestRunning ? 'btn-pause' : 'btn-play'}`}
                  title={isRestRunning ? 'Pause interval' : 'Start interval'}
                >
                  {isRestRunning ? <Pause size={14} /> : <Play size={14} />}
                </button>
                <button
                  onClick={resetRestTimer}
                  className="island-action-btn btn-reset"
                  title="Reset interval"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>

            {/* iOS Progress Bar */}
            <div className="island-progress-track">
              <div
                className="island-progress-fill"
                style={{ width: `${timerProgress}%` }}
              />
            </div>
          </div>

          {/* Footer Quick Action */}
          <div className="island-footer-action">
            <button
              onClick={() => {
                iosFeedback.triggerHaptic('medium');
                setIsExpanded(false);
                navigateTo('coach');
              }}
              className="island-coach-btn"
            >
              <Sparkles size={14} className="text-emerald" />
              <span>Ask AI Coach for advice</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        /* iOS Dynamic Island Container */
        .ios-dynamic-island {
          background: #000000;
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #ffffff;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.22);
          transition: all 0.38s cubic-bezier(0.32, 0.72, 0, 1);
          user-select: none;
          position: relative;
          z-index: 120;
        }

        /* Compact Pill State */
        .ios-dynamic-island.compact {
          height: 36px;
          min-width: 190px;
          max-width: 250px;
          border-radius: 9999px;
          padding: 0 14px;
          display: flex;
          align-items: center;
          cursor: pointer;
        }

        .ios-dynamic-island.compact:hover {
          background: #070a08;
          border-color: rgba(16, 185, 129, 0.45);
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.8), 0 0 14px rgba(16, 185, 129, 0.25);
          transform: translateY(-1px) scale(1.02);
        }

        .ios-dynamic-island.compact:active {
          transform: scale(0.97);
          transition: transform 0.1s cubic-bezier(0.32, 0.72, 0, 1);
        }

        .island-compact-view {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .island-compact-left {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .island-pulse-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 8px #10b981;
        }

        .island-pulse-dot.timer-pulse {
          animation: iosPulse 1.2s infinite ease-in-out;
          background: #eab308;
          box-shadow: 0 0 8px #eab308;
        }

        @keyframes iosPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }

        .compact-kicker {
          font-family: var(--font-heading);
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: -0.01em;
          color: #e2e8f0;
          white-space: nowrap;
        }

        .compact-timer-text {
          font-family: var(--font-heading);
          font-size: 0.82rem;
          font-weight: 800;
          color: #facc15;
          letter-spacing: 0.02em;
        }

        .compact-target-badge {
          font-size: 0.76rem;
          font-weight: 700;
          color: #10b981;
          background: rgba(16, 185, 129, 0.14);
          padding: 2px 7px;
          border-radius: 9999px;
          border: 1px solid rgba(16, 185, 129, 0.25);
          white-space: nowrap;
        }

        /* Expanded Mode (iOS Live Activity Card) */
        .ios-dynamic-island.expanded {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 380px;
          border-radius: 26px;
          padding: 18px 20px 16px;
          background: rgba(0, 0, 0, 0.96);
          backdrop-filter: blur(28px) saturate(190%);
          -webkit-backdrop-filter: blur(28px) saturate(190%);
          border: 1px solid rgba(255, 255, 255, 0.18);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.08);
          animation: iosSpringExpand 0.35s cubic-bezier(0.32, 0.72, 0, 1) forwards;
        }

        @keyframes iosSpringExpand {
          from {
            opacity: 0;
            transform: translateX(-50%) scale(0.92);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) scale(1);
          }
        }

        .island-expanded-view {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .island-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .island-badge-group {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .island-live-indicator {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 8px #10b981;
          animation: iosPulse 1.4s infinite;
        }

        .island-title {
          font-family: var(--font-heading);
          font-size: 0.73rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #94a3b8;
        }

        .island-header-actions {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .island-icon-btn {
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
          transition: all 0.15s ease;
        }

        .island-icon-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          color: #ffffff;
        }

        .island-icon-btn:active {
          transform: scale(0.92);
        }

        /* Metrics */
        .island-metrics-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .island-metric-card {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 10px 12px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .metric-tag {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: #64748b;
        }

        .metric-val-row {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }

        .metric-primary-val {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 800;
          color: #ffffff;
        }

        .protein-text {
          color: #34d399;
        }

        .metric-unit {
          font-size: 0.78rem;
          color: #94a3b8;
          font-weight: 500;
        }

        .metric-sub {
          font-size: 0.72rem;
          color: #64748b;
        }

        /* Timer Section */
        .island-timer-section {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .timer-section-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .timer-section-label {
          font-size: 0.78rem;
          font-weight: 600;
          color: #94a3b8;
        }

        .timer-badge {
          font-size: 0.68rem;
          font-weight: 700;
          color: #facc15;
          text-transform: uppercase;
        }

        .timer-control-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .timer-countdown-display {
          font-family: var(--font-heading);
          font-size: 1.35rem;
          font-weight: 800;
          color: #ffffff;
          min-width: 58px;
        }

        .timer-presets-group {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .island-preset-chip {
          padding: 4px 8px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #94a3b8;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .island-preset-chip:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.12);
        }

        .island-preset-chip.active {
          background: #10b981;
          color: #041d11;
          border-color: #10b981;
          font-weight: 700;
        }

        .island-preset-chip:active {
          transform: scale(0.94);
        }

        .timer-btns-group {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .island-action-btn {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.12s ease;
        }

        .btn-play {
          background: #10b981;
          color: #041d11;
        }

        .btn-pause {
          background: #eab308;
          color: #2b1f02;
        }

        .btn-reset {
          background: rgba(255, 255, 255, 0.09);
          color: #94a3b8;
        }

        .island-action-btn:hover {
          filter: brightness(1.1);
        }

        .island-action-btn:active {
          transform: scale(0.9);
        }

        .island-progress-track {
          width: 100%;
          height: 4px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 9999px;
          overflow: hidden;
        }

        .island-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #10b981, #34d399);
          border-radius: 9999px;
          transition: width 0.3s linear;
        }

        /* Footer */
        .island-coach-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          border-radius: 14px;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.28);
          color: #ffffff;
          font-family: var(--font-heading);
          font-size: 0.84rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s ease;
        }

        .island-coach-btn:hover {
          background: rgba(16, 185, 129, 0.2);
          border-color: rgba(16, 185, 129, 0.45);
        }

        .island-coach-btn:active {
          transform: scale(0.98);
        }

        @media (max-width: 640px) {
          .ios-dynamic-island.expanded {
            width: calc(100vw - 28px);
          }
        }
      `}</style>
    </div>
  );
};
