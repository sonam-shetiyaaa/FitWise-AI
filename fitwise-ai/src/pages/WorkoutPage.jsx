import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { RestTimerModal } from '../components/RestTimerModal';
import {
  Dumbbell,
  Clock,
  Flame,
  CheckCircle,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Timer,
  Info,
  ChevronDown,
  ChevronUp,
  Award
} from 'lucide-react';

export const WorkoutPage = () => {
  const {
    workouts,
    toggleSetComplete,
    toggleWorkoutComplete,
    activeWorkoutCategory,
    setActiveWorkoutCategory,
    navigateTo,
    showToast
  } = useApp();

  const [selectedWorkoutId, setSelectedWorkoutId] = useState(workouts[0]?.id || 'push-hypertrophy');
  const [expandedExerciseId, setExpandedExerciseId] = useState(null);

  // Active workout
  const currentWorkout = workouts.find((w) => w.id === selectedWorkoutId) || workouts[0];

  // Category filter
  const categories = ['All', 'Push', 'Pull', 'Legs', 'Cardio'];
  const filteredWorkouts = activeWorkoutCategory === 'All'
    ? workouts
    : workouts.filter((w) => w.category.toLowerCase() === activeWorkoutCategory.toLowerCase());

  // Progress metrics for current workout
  const totalSets = currentWorkout.exercises?.reduce((acc, ex) => acc + ex.completedSets.length, 0) || 0;
  const completedSets = currentWorkout.exercises?.reduce(
    (acc, ex) => acc + ex.completedSets.filter(Boolean).length,
    0
  ) || 0;
  const workoutPercent = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

  // --- REST TIMER STATE & REFS ---
  const [isRestTimerOpen, setIsRestTimerOpen] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(60);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isTimerFinished, setIsTimerFinished] = useState(false);

  // Single interval reference to guarantee no concurrent multiple timers
  const timerRef = useRef(null);

  // Clear running timer helper
  const clearActiveInterval = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Start timer with given duration (or default)
  const startTimer = (duration) => {
    clearActiveInterval();

    const secs = Number(duration) > 0 ? Number(duration) : 60;
    setTotalSeconds(secs);
    setSecondsLeft(secs);
    setIsTimerRunning(true);
    setIsTimerFinished(false);
    setIsRestTimerOpen(true);

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearActiveInterval();
          setIsTimerRunning(false);
          setIsTimerFinished(true);
          showToast("⏰ Rest interval finished! Ready for your next set.", "info");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Toggle Pause / Resume
  const handleTogglePauseResume = () => {
    if (isTimerRunning) {
      // Pause
      clearActiveInterval();
      setIsTimerRunning(false);
    } else {
      // Resume / Start
      if (secondsLeft <= 0) {
        startTimer(totalSeconds);
      } else {
        clearActiveInterval();
        setIsTimerRunning(true);
        setIsTimerFinished(false);

        timerRef.current = setInterval(() => {
          setSecondsLeft((prev) => {
            if (prev <= 1) {
              clearActiveInterval();
              setIsTimerRunning(false);
              setIsTimerFinished(true);
              showToast("⏰ Rest interval finished! Ready for your next set.", "info");
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    }
  };

  // Reset timer
  const handleResetTimer = () => {
    clearActiveInterval();
    setSecondsLeft(totalSeconds);
    setIsTimerRunning(false);
    setIsTimerFinished(false);
  };

  // Select a preset button (30s, 45s, 60s, 90s, 120s)
  const handleSelectPreset = (preset) => {
    startTimer(preset);
  };

  // Parse rest seconds from exercise string (e.g. "75s rest" -> 75)
  const parseRestSeconds = (restStr) => {
    const match = (restStr || '').match(/\d+/);
    return match ? parseInt(match[0], 10) : 60;
  };

  // Clean up interval when component unmounts
  useEffect(() => {
    return () => {
      clearActiveInterval();
    };
  }, []);

  const toggleExpandExercise = (id) => {
    setExpandedExerciseId(expandedExerciseId === id ? null : id);
  };

  return (
    <div className="workout-page animate-fade-in">
      <div className="container">
        {/* Workout Category Selector Strip */}
        <div className="workout-top-bar">
          <div>
            <div className="pill-badge">
              <Dumbbell size={14} className="text-emerald" />
              <span>Hypertrophy & Conditioning Engine</span>
            </div>
            <h1 className="page-heading">Personalized Training Protocols</h1>
          </div>

          {/* Rest Timer Trigger Button */}
          <button
            onClick={() => {
              if (isTimerRunning || (!isTimerRunning && secondsLeft > 0 && secondsLeft < totalSeconds)) {
                setIsRestTimerOpen(true);
              } else {
                startTimer(60);
              }
            }}
            className={`btn ${isTimerRunning ? 'btn-primary' : 'btn-secondary'} btn-rest-timer-trigger`}
            id="start-rest-timer-btn"
            title="Start Rest Timer"
            type="button"
          >
            <Timer size={18} className={isTimerRunning ? '' : 'text-emerald'} />
            <span>
              {isTimerRunning
                ? `Resting: ${secondsLeft}s`
                : secondsLeft > 0 && secondsLeft < totalSeconds
                ? `Paused: ${secondsLeft}s (Open)`
                : 'Start Rest Timer'}
            </span>
          </button>
        </div>

        {/* Workout Switcher Cards */}
        <div className="category-filter-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-pill ${activeWorkoutCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveWorkoutCategory(cat)}
              type="button"
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="workout-select-strip">
          {filteredWorkouts.map((w) => (
            <div
              key={w.id}
              onClick={() => setSelectedWorkoutId(w.id)}
              className={`workout-tab-card glass-panel ${selectedWorkoutId === w.id ? 'active-workout-tab' : ''}`}
            >
              <div className="tab-card-header">
                <span className="badge badge-emerald">{w.category}</span>
                {w.completed && (
                  <span className="badge badge-emerald">Done</span>
                )}
              </div>
              <h4 className="tab-workout-title">{w.title}</h4>
              <div className="tab-meta">
                <span><Clock size={13} /> {w.duration}</span>
                <span><Flame size={13} className="text-orange" /> {w.caloriesBurn} kcal</span>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Workout Detail View */}
        <div className="workout-detail-hero glass-panel-glow">
          <div className="workout-hero-top">
            <div className="hero-text-area">
              <div className="hero-pill-row">
                <span className="badge badge-cyan">{currentWorkout.category} Protocol</span>
                <span className="badge badge-amber">{currentWorkout.difficulty}</span>
              </div>
              <h2 className="current-title">{currentWorkout.title}</h2>
              <p className="current-tagline">{currentWorkout.tagline}</p>

              <div className="current-stats-chips">
                <div className="stat-chip">
                  <Clock size={16} />
                  <span>{currentWorkout.duration}</span>
                </div>
                <div className="stat-chip">
                  <Flame size={16} className="text-orange" />
                  <span>{currentWorkout.caloriesBurn} kcal Burn</span>
                </div>
                <div className="stat-chip">
                  <Dumbbell size={16} className="text-emerald" />
                  <span>{currentWorkout.exercises?.length} Key Movements</span>
                </div>
              </div>
            </div>

            <div className="workout-completion-gauge">
              <div className="gauge-dial">
                <span className="gauge-percent">{workoutPercent}%</span>
                <span className="gauge-lbl">{completedSets}/{totalSets} Sets</span>
              </div>
              <button
                onClick={() => toggleWorkoutComplete(currentWorkout.id)}
                className={`btn ${currentWorkout.completed ? 'btn-secondary' : 'btn-primary'} btn-finish-workout`}
                type="button"
              >
                <CheckCircle size={18} />
                <span>{currentWorkout.completed ? 'Mark as In Progress' : 'Complete Workout'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Exercises List */}
        <div className="exercises-section">
          <div className="exercises-header">
            <h3 className="section-title-sm">Exercise Prescriptions & Tracking</h3>
            <span className="section-note">Check off each set as you finish to log volume and pace rest</span>
          </div>

          <div className="exercises-grid">
            {currentWorkout.exercises?.map((exercise, index) => {
              const isAllSetsDone = exercise.completedSets.every(Boolean);
              const isExpanded = expandedExerciseId === exercise.id;
              const restSecs = parseRestSeconds(exercise.rest);

              return (
                <div
                  key={exercise.id}
                  className={`exercise-card glass-panel ${isAllSetsDone ? 'exercise-card-done' : ''}`}
                >
                  <div className="exercise-card-top">
                    <div className="ex-index-badge">{index + 1}</div>
                    <div className="ex-main-info">
                      <div className="ex-title-row">
                        <h4 className="ex-name">{exercise.name}</h4>
                        <span className="badge badge-cyan">{exercise.muscle}</span>
                      </div>
                      <div className="ex-meta-specs">
                        <span className="meta-spec"><strong>Target:</strong> {exercise.targetWeight}</span>
                        <span className="meta-spec"><strong>Rep Scheme:</strong> {exercise.reps}</span>
                        <span className="meta-spec"><strong>Rest:</strong> {exercise.rest}</span>
                      </div>
                    </div>

                    <button
                      className="btn-expand-tips"
                      onClick={() => toggleExpandExercise(exercise.id)}
                      title="View AI Form Cue"
                      type="button"
                    >
                      <Info size={16} />
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>

                  {/* Expandable AI Form Cue */}
                  {isExpanded && (
                    <div className="ai-cue-box animate-fade-in">
                      <div className="ai-cue-header">
                        <Sparkles size={14} className="text-emerald" />
                        <span>AI Biomechanical Cue</span>
                      </div>
                      <p className="ai-cue-text">{exercise.tips}</p>
                    </div>
                  )}

                  {/* Interactive Sets Checklist */}
                  <div className="sets-check-strip">
                    <span className="sets-row-label">Track Sets:</span>
                    <div className="sets-interactive-list">
                      {exercise.completedSets.map((isDone, setIdx) => (
                        <button
                          key={setIdx}
                          onClick={() => toggleSetComplete(currentWorkout.id, exercise.id, setIdx)}
                          className={`set-toggle-chip ${isDone ? 'set-completed' : ''}`}
                          type="button"
                        >
                          <span className="set-num-label">Set {setIdx + 1}</span>
                          <span className="set-status-icon">
                            {isDone ? <CheckCircle size={14} /> : setIdx + 1}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Rest Timer Button on Exercise Card */}
                    <button
                      onClick={() => startTimer(restSecs)}
                      className={`btn-quick-timer ${isTimerRunning ? 'active-quick-timer' : ''}`}
                      title={`Start Rest Timer (${exercise.rest || '60s'})`}
                      aria-label={`Start Rest Timer (${exercise.rest || '60s'})`}
                      type="button"
                      id={`rest-timer-${exercise.id}`}
                    >
                      <Timer size={15} />
                      <span className="quick-timer-label">{restSecs}s</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Motivational Banner */}
        <div className="post-workout-card glass-panel">
          <Award size={28} className="text-emerald" />
          <div className="post-text">
            <h4>Optimize Post-Workout Hypertrophy</h4>
            <p>Ensure you hit your protein target within the next 90 minutes. Head to the Nutrition tab to record your post-training meal.</p>
          </div>
          <button onClick={() => navigateTo('nutrition')} className="btn btn-secondary btn-sm" type="button">
            Log Post-Workout Fuel
          </button>
        </div>
      </div>

      {/* Mini Floating Active Timer Bar (visible when modal is closed but timer is running or paused) */}
      {!isRestTimerOpen && (isTimerRunning || (secondsLeft > 0 && secondsLeft < totalSeconds)) && (
        <div className="mini-floating-timer animate-fade-in" id="mini-floating-rest-timer">
          <div className="mini-timer-content" onClick={() => setIsRestTimerOpen(true)}>
            <div className={`mini-timer-icon-wrap ${isTimerRunning ? 'pulse-anim' : ''}`}>
              <Timer size={18} />
            </div>
            <div className="mini-timer-text">
              <span className="mini-timer-status">{isTimerRunning ? 'Rest Interval' : 'Paused'}</span>
              <strong className="mini-timer-seconds">{secondsLeft}s remaining</strong>
            </div>
          </div>
          <div className="mini-timer-actions">
            <button
              className="mini-timer-btn"
              onClick={handleTogglePauseResume}
              title={isTimerRunning ? 'Pause timer' : 'Resume timer'}
              type="button"
            >
              {isTimerRunning ? <Pause size={15} /> : <Play size={15} />}
            </button>
            <button
              className="mini-timer-btn"
              onClick={handleResetTimer}
              title="Reset timer"
              type="button"
            >
              <RotateCcw size={15} />
            </button>
            <button
              className="mini-timer-expand-btn"
              onClick={() => setIsRestTimerOpen(true)}
              type="button"
            >
              Expand
            </button>
          </div>
        </div>
      )}

      {/* Rest Timer Modal */}
      <RestTimerModal
        isOpen={isRestTimerOpen}
        onClose={() => setIsRestTimerOpen(false)}
        secondsLeft={secondsLeft}
        totalSeconds={totalSeconds}
        isRunning={isTimerRunning}
        isFinished={isTimerFinished}
        onTogglePauseResume={handleTogglePauseResume}
        onReset={handleResetTimer}
        onSelectPreset={handleSelectPreset}
      />

      <style>{`
        .workout-page {
          padding: 36px 0 60px;
        }
        .workout-top-bar {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .btn-rest-timer-trigger {
          display: flex;
          align-items: center;
          gap: 8px;
          transition: var(--ease-smooth);
        }
        .category-filter-pills {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
          overflow-x: auto;
        }
        .filter-pill {
          padding: 6px 14px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          color: var(--text-muted);
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: 0.82rem;
          cursor: pointer;
          transition: var(--ease-smooth);
        }
        .filter-pill:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.08);
        }
        .filter-pill.active {
          background: rgba(16, 185, 129, 0.18);
          border-color: var(--border-glow);
          color: #34d399;
        }
        .workout-select-strip {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-bottom: 28px;
        }
        .workout-tab-card {
          padding: 16px;
          border-radius: 16px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .workout-tab-card:hover {
          transform: translateY(-2px);
          border-color: rgba(255, 255, 255, 0.15);
        }
        .active-workout-tab {
          border-color: var(--border-glow);
          background: rgba(16, 185, 129, 0.08);
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.15);
        }
        .tab-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .tab-workout-title {
          font-size: 0.96rem;
          font-weight: 700;
          line-height: 1.3;
        }
        .tab-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.75rem;
          color: var(--text-dim);
        }
        .tab-meta span {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* Detail Hero */
        .workout-detail-hero {
          padding: 32px;
          border-radius: 24px;
          margin-bottom: 36px;
        }
        .workout-hero-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
        }
        .hero-pill-row {
          display: flex;
          gap: 8px;
          margin-bottom: 10px;
        }
        .current-title {
          font-size: 2rem;
          margin-bottom: 6px;
        }
        .current-tagline {
          font-size: 0.95rem;
          color: var(--text-muted);
          margin-bottom: 16px;
        }
        .current-stats-chips {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .stat-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.05);
          padding: 6px 12px;
          border-radius: 10px;
          font-size: 0.82rem;
          color: var(--text-muted);
          font-weight: 600;
        }
        .workout-completion-gauge {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-subtle);
          padding: 20px 28px;
          border-radius: 18px;
        }
        .gauge-dial {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .gauge-percent {
          font-family: var(--font-heading);
          font-size: 2.2rem;
          font-weight: 800;
          color: #34d399;
          line-height: 1;
        }
        .gauge-lbl {
          font-size: 0.78rem;
          color: var(--text-dim);
          margin-top: 4px;
        }
        .btn-finish-workout {
          white-space: nowrap;
        }

        /* Exercises List */
        .exercises-section {
          margin-bottom: 36px;
        }
        .exercises-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 8px;
        }
        .section-title-sm {
          font-size: 1.35rem;
        }
        .section-note {
          font-size: 0.82rem;
          color: var(--text-dim);
        }
        .exercises-grid {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .exercise-card {
          padding: 20px 24px;
          border-radius: 18px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          transition: var(--ease-smooth);
        }
        .exercise-card-done {
          border-color: rgba(16, 185, 129, 0.35);
          background: rgba(16, 185, 129, 0.04);
        }
        .exercise-card-top {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }
        .ex-index-badge {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          color: #ffffff;
          font-family: var(--font-heading);
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .ex-main-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .ex-title-row {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .ex-name {
          font-size: 1.15rem;
          font-weight: 700;
        }
        .ex-meta-specs {
          display: flex;
          align-items: center;
          gap: 16px;
          font-size: 0.82rem;
          color: var(--text-muted);
          flex-wrap: wrap;
        }
        .meta-spec strong {
          color: #e2e8f0;
        }
        .btn-expand-tips {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          color: var(--text-dim);
          border-radius: 8px;
          padding: 6px 10px;
          display: flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          font-size: 0.78rem;
        }
        .btn-expand-tips:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.08);
        }
        .ai-cue-box {
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: 12px;
          padding: 12px 16px;
        }
        .ai-cue-header {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.76rem;
          font-weight: 700;
          text-transform: uppercase;
          color: #34d399;
          margin-bottom: 4px;
        }
        .ai-cue-text {
          font-size: 0.84rem;
          color: #e2e8f0;
          line-height: 1.5;
        }
        .sets-check-strip {
          display: flex;
          align-items: center;
          gap: 14px;
          padding-top: 14px;
          border-top: 1px solid var(--border-subtle);
          flex-wrap: wrap;
        }
        .sets-row-label {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-dim);
        }
        .sets-interactive-list {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .set-toggle-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          color: var(--text-muted);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--ease-smooth);
        }
        .set-toggle-chip:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
        }
        .set-toggle-chip.set-completed {
          background: rgba(16, 185, 129, 0.2);
          border-color: var(--border-glow);
          color: #34d399;
        }
        .btn-quick-timer {
          margin-left: auto;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          color: var(--text-muted);
          height: 34px;
          padding: 0 10px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: var(--ease-smooth);
        }
        .btn-quick-timer:hover, .active-quick-timer {
          color: #34d399;
          border-color: var(--border-glow);
          background: rgba(16, 185, 129, 0.12);
        }
        .quick-timer-label {
          font-size: 0.76rem;
          font-weight: 700;
        }
        .post-workout-card {
          padding: 24px 28px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }
        .post-text {
          flex: 1;
        }
        .post-text h4 {
          font-size: 1.1rem;
          margin-bottom: 4px;
        }
        .post-text p {
          font-size: 0.86rem;
          color: var(--text-muted);
        }

        /* Mini Floating Timer */
        .mini-floating-timer {
          position: fixed;
          bottom: 24px;
          left: 24px;
          z-index: 1000;
          background: rgba(17, 24, 39, 0.94);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid var(--border-glow);
          border-radius: 16px;
          padding: 10px 16px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
        }
        .mini-timer-content {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }
        .mini-timer-icon-wrap {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pulse-anim {
          animation: pulseGlow 1.5s infinite;
        }
        .mini-timer-text {
          display: flex;
          flex-direction: column;
        }
        .mini-timer-status {
          font-size: 0.7rem;
          color: var(--text-dim);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .mini-timer-seconds {
          font-size: 0.9rem;
          color: #ffffff;
          font-family: var(--font-heading);
        }
        .mini-timer-actions {
          display: flex;
          align-items: center;
          gap: 6px;
          border-left: 1px solid var(--border-subtle);
          padding-left: 12px;
        }
        .mini-timer-btn {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--border-subtle);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--ease-smooth);
        }
        .mini-timer-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.12);
        }
        .mini-timer-expand-btn {
          padding: 4px 10px;
          border-radius: 8px;
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid var(--border-glow);
          color: #34d399;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          transition: var(--ease-smooth);
        }
        .mini-timer-expand-btn:hover {
          background: rgba(16, 185, 129, 0.25);
          color: #ffffff;
        }

        @media (max-width: 960px) {
          .workout-select-strip {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 600px) {
          .workout-select-strip {
            grid-template-columns: 1fr;
          }
          .workout-hero-top {
            flex-direction: column;
            align-items: flex-start;
          }
          .workout-completion-gauge {
            width: 100%;
          }
          .mini-floating-timer {
            left: 16px;
            right: 16px;
            bottom: 80px;
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
};
