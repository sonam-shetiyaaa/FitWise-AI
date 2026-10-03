import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Play, Pause, RotateCcw, Clock } from 'lucide-react';

export const RestTimerModal = ({
  isOpen,
  onClose,
  secondsLeft = 60,
  totalSeconds = 60,
  isRunning = false,
  isFinished = false,
  onTogglePauseResume,
  onReset,
  onSelectPreset
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const progressPercent = totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 0;

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  return createPortal(
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="timer-modal glass-panel-glow" onClick={(e) => e.stopPropagation()}>
        <div className="modal-top">
          <div className="modal-title-group">
            <Clock size={20} className="text-emerald" />
            <h3 className="modal-heading">Rest & Recovery Interval</h3>
          </div>
          <button className="btn-close-modal" onClick={onClose} aria-label="Close timer modal">
            <X size={20} />
          </button>
        </div>

        <div className="timer-dial-area">
          <div className="dial-circle">
            <svg className="timer-svg" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r="70"
                className="dial-bg-track"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                className={`dial-progress-track ${isFinished ? 'track-finished' : ''}`}
                style={{
                  strokeDasharray: 440,
                  strokeDashoffset: 440 - (440 * progressPercent) / 100
                }}
              />
            </svg>
            <div className="dial-time-display">
              <span className="big-time">{formatTime(secondsLeft)}</span>
              <span className="seconds-clear-badge">
                {secondsLeft} {secondsLeft === 1 ? 'second' : 'seconds'} remaining
              </span>
              <span className={`time-status ${isFinished ? 'status-finished' : ''}`}>
                {isFinished
                  ? "Time's up! Ready for Next Set!"
                  : isRunning
                  ? 'Resting...'
                  : secondsLeft === totalSeconds
                  ? 'Ready to Start'
                  : 'Paused'}
              </span>
            </div>
          </div>
        </div>

        {/* Presets */}
        <div className="timer-presets-label">Select Interval:</div>
        <div className="timer-presets">
          {[30, 45, 60, 90, 120].map((preset) => (
            <button
              key={preset}
              className={`preset-btn ${totalSeconds === preset ? 'active-preset' : ''}`}
              onClick={() => onSelectPreset && onSelectPreset(preset)}
              type="button"
            >
              {preset}s
            </button>
          ))}
        </div>

        {/* Controls: Reset and Pause / Resume */}
        <div className="timer-actions">
          <button
            className="btn btn-secondary btn-circle"
            onClick={onReset}
            title="Reset Timer"
            aria-label="Reset Timer"
            type="button"
            id="timer-reset-btn"
          >
            <RotateCcw size={18} />
          </button>

          <button
            className={`btn ${isRunning ? 'btn-secondary btn-pause' : 'btn-primary'} btn-large-control`}
            onClick={onTogglePauseResume}
            type="button"
            id="timer-pause-resume-btn"
          >
            {isRunning ? (
              <>
                <Pause size={20} />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play size={20} />
                <span>
                  {isFinished || secondsLeft === 0
                    ? 'Start Again'
                    : secondsLeft < totalSeconds
                    ? 'Resume'
                    : 'Start Rest'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(4, 7, 18, 0.78);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 16px;
        }
        .timer-modal {
          width: 100%;
          max-width: 410px;
          background: #111827;
          border-radius: 20px;
          padding: 26px;
          text-align: center;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.7);
        }
        .modal-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .modal-title-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .modal-heading {
          font-size: 1.15rem;
          font-weight: 700;
          color: #ffffff;
        }
        .text-emerald {
          color: #34d399;
        }
        .btn-close-modal {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--border-subtle);
          color: var(--text-muted);
          width: 34px;
          height: 34px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--ease-smooth);
        }
        .btn-close-modal:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.14);
        }
        .timer-dial-area {
          display: flex;
          justify-content: center;
          margin: 12px 0 20px;
        }
        .dial-circle {
          position: relative;
          width: 200px;
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .timer-svg {
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }
        .dial-bg-track {
          fill: none;
          stroke: rgba(255, 255, 255, 0.08);
          stroke-width: 9;
        }
        .dial-progress-track {
          fill: none;
          stroke: #10b981;
          stroke-width: 9;
          stroke-linecap: round;
          transition: stroke-dashoffset 0.3s ease, stroke 0.3s ease;
        }
        .dial-progress-track.track-finished {
          stroke: #38bdf8;
        }
        .dial-time-display {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 10px;
        }
        .big-time {
          font-family: var(--font-heading);
          font-size: 2.7rem;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.03em;
          line-height: 1;
        }
        .seconds-clear-badge {
          font-size: 0.82rem;
          font-weight: 700;
          color: #34d399;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.25);
          padding: 3px 10px;
          border-radius: 999px;
          margin: 6px 0 4px;
        }
        .time-status {
          font-size: 0.78rem;
          color: var(--text-muted);
          font-weight: 500;
        }
        .status-finished {
          color: #38bdf8;
          font-weight: 700;
        }
        .timer-presets-label {
          font-size: 0.76rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-dim);
          font-weight: 600;
          margin-bottom: 8px;
        }
        .timer-presets {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-bottom: 24px;
        }
        .preset-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          color: var(--text-muted);
          padding: 7px 13px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: var(--ease-smooth);
        }
        .preset-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.12);
        }
        .active-preset {
          background: rgba(16, 185, 129, 0.22);
          border-color: var(--border-glow);
          color: #34d399;
          font-weight: 700;
        }
        .timer-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
        }
        .btn-circle {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .btn-large-control {
          flex: 1;
          max-width: 220px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 1rem;
        }
        .btn-pause {
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.35);
        }
        .btn-pause:hover {
          background: rgba(245, 158, 11, 0.25);
          color: #ffffff;
        }
      `}</style>
    </div>,
    document.body
  );
};
