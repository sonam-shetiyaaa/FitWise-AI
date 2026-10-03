import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Dumbbell,
  Apple,
  TrendingUp,
  Droplets,
  Flame,
  ArrowRight,
  CheckCircle2,
  Clock,
  Plus,
  Minus,
  MessageSquare,
  Activity,
  Calendar,
  Zap,
  Target
} from 'lucide-react';

export const DashboardPage = () => {
  const {
    user,
    workouts,
    nutrition,
    waterConsumed,
    waterTarget,
    addWater,
    removeWater,
    progress,
    navigateTo,
    sendChatMessage
  } = useApp();

  // Find today's workout (first workout)
  const todaysWorkout = workouts[0] || {};
  const completedExercisesCount = todaysWorkout.exercises?.filter(
    (ex) => ex.completedSets.every(Boolean)
  ).length || 0;
  const totalExercisesCount = todaysWorkout.exercises?.length || 0;

  // Calculate nutrition totals
  const totalCaloriesConsumed = Object.values(nutrition.meals).reduce(
    (acc, meal) => acc + meal.totalCalories,
    0
  );
  const totalProteinConsumed = Object.values(nutrition.meals).reduce(
    (acc, meal) => acc + meal.protein,
    0
  );
  const totalCarbsConsumed = Object.values(nutrition.meals).reduce(
    (acc, meal) => acc + meal.carbs,
    0
  );
  const totalFatConsumed = Object.values(nutrition.meals).reduce(
    (acc, meal) => acc + meal.fat,
    0
  );

  const calorieBudget = nutrition.dailyTarget.calories;
  const caloriesRemaining = Math.max(0, calorieBudget - totalCaloriesConsumed);
  const caloriePercent = Math.min(100, Math.round((totalCaloriesConsumed / calorieBudget) * 100));
  const waterPercent = Math.min(100, Math.round((waterConsumed / waterTarget) * 100));

  // Time-based personalized greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const handlePromptClick = (promptText) => {
    sendChatMessage(promptText);
    navigateTo('chatbot');
  };

  return (
    <div className="dashboard-page animate-fade-in">
      <div className="container">
        {/* Top Banner: Personalized Greeting & Streak */}
        <div className="greeting-card glass-panel-glow">
          <div className="greeting-info">
            <div className="streak-badge">
              <Flame size={16} className="text-orange" />
              <span>{progress.workoutStreak}-Day Streak Active</span>
            </div>
            <h1 className="greeting-title">
              {getGreeting()}, <span className="text-gradient">{user.name.split(' ')[0]}</span>!
            </h1>
            <p className="greeting-desc">
              Your body is dialed in for <strong>{user.fitnessGoal}</strong>. Today's focus is mechanical tension, clean hydration, and quality rest.
            </p>
          </div>

          <div className="quick-action-ai">
            <button
              onClick={() => navigateTo('chatbot')}
              className="btn btn-primary btn-chat-quick"
            >
              <Sparkles size={18} />
              <span>Ask AI Coach</span>
            </button>
          </div>
        </div>

        {/* Dashboard Grid: 4 Core Pillars */}
        <div className="dashboard-grid">
          {/* Pillar 1: Today's Workout */}
          <div className="dash-card glass-panel workout-dash-card">
            <div className="dash-card-header">
              <div className="card-title-group">
                <div className="icon-badge icon-badge-cyan">
                  <Dumbbell size={20} />
                </div>
                <div>
                  <h3 className="card-heading">Today's Workout</h3>
                  <span className="card-sub">{todaysWorkout.category} Day • {todaysWorkout.duration}</span>
                </div>
              </div>
              <span className={`badge ${todaysWorkout.completed ? 'badge-emerald' : 'badge-amber'}`}>
                {todaysWorkout.completed ? 'Completed' : 'In Progress'}
              </span>
            </div>

            <div className="workout-body-preview">
              <h4 className="workout-routine-name">{todaysWorkout.title}</h4>
              <p className="workout-tagline">{todaysWorkout.tagline}</p>

              <div className="workout-meta-pills">
                <span className="meta-pill"><Flame size={14} className="text-orange" /> {todaysWorkout.caloriesBurn} kcal</span>
                <span className="meta-pill"><Clock size={14} /> {todaysWorkout.duration}</span>
                <span className="meta-pill"><Activity size={14} /> {todaysWorkout.difficulty}</span>
              </div>

              {/* Exercises preview snippet */}
              <div className="exercise-snippet-list">
                {todaysWorkout.exercises?.slice(0, 3).map((ex, i) => (
                  <div key={ex.id} className="exercise-snippet-item">
                    <span className="ex-num">{i + 1}</span>
                    <span className="ex-name">{ex.name}</span>
                    <span className="ex-sets">{ex.sets} sets • {ex.reps}</span>
                  </div>
                ))}
                {totalExercisesCount > 3 && (
                  <div className="more-exercises-hint">
                    +{totalExercisesCount - 3} more exercises in this routine
                  </div>
                )}
              </div>
            </div>

            <div className="dash-card-footer">
              <button onClick={() => navigateTo('workout')} className="btn btn-secondary w-full">
                <span>{todaysWorkout.completed ? 'View Completed Routine' : 'Start Today\'s Workout'}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Pillar 2: Nutrition Summary */}
          <div className="dash-card glass-panel nutrition-dash-card">
            <div className="dash-card-header">
              <div className="card-title-group">
                <div className="icon-badge icon-badge-amber">
                  <Apple size={20} />
                </div>
                <div>
                  <h3 className="card-heading">Nutrition Summary</h3>
                  <span className="card-sub">{totalCaloriesConsumed} / {calorieBudget} kcal</span>
                </div>
              </div>
              <span className="badge badge-amber">{caloriePercent}% Budget</span>
            </div>

            <div className="calories-ring-overview">
              <div className="cal-stat-circle">
                <span className="cal-big-num">{caloriesRemaining}</span>
                <span className="cal-rem-lbl">kcal remaining</span>
              </div>

              <div className="cal-progress-bar-wrap">
                <div className="cal-bar-bg">
                  <div
                    className="cal-bar-fill"
                    style={{ width: `${caloriePercent}%` }}
                  />
                </div>
                <div className="cal-bar-labels">
                  <span>Logged: {totalCaloriesConsumed} kcal</span>
                  <span>Goal: {calorieBudget} kcal</span>
                </div>
              </div>
            </div>

            {/* Macros Breakdown */}
            <div className="dash-macros-grid">
              <div className="macro-chip">
                <span className="macro-lbl text-protein">Protein</span>
                <span className="macro-val">{totalProteinConsumed}g</span>
                <span className="macro-target">/ {nutrition.dailyTarget.protein}g</span>
                <div className="mini-meter"><div style={{ width: `${Math.min(100, (totalProteinConsumed / nutrition.dailyTarget.protein) * 100)}%` }} className="bg-emerald" /></div>
              </div>

              <div className="macro-chip">
                <span className="macro-lbl text-carbs">Carbs</span>
                <span className="macro-val">{totalCarbsConsumed}g</span>
                <span className="macro-target">/ {nutrition.dailyTarget.carbs}g</span>
                <div className="mini-meter"><div style={{ width: `${Math.min(100, (totalCarbsConsumed / nutrition.dailyTarget.carbs) * 100)}%` }} className="bg-cyan" /></div>
              </div>

              <div className="macro-chip">
                <span className="macro-lbl text-fat">Fats</span>
                <span className="macro-val">{totalFatConsumed}g</span>
                <span className="macro-target">/ {nutrition.dailyTarget.fat}g</span>
                <div className="mini-meter"><div style={{ width: `${Math.min(100, (totalFatConsumed / nutrition.dailyTarget.fat) * 100)}%` }} className="bg-amber" /></div>
              </div>
            </div>

            <div className="dash-card-footer">
              <button onClick={() => navigateTo('nutrition')} className="btn btn-secondary w-full">
                <span>View Meals & Log Food</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Pillar 3: Water Intake Tracker */}
          <div className="dash-card glass-panel water-dash-card">
            <div className="dash-card-header">
              <div className="card-title-group">
                <div className="icon-badge icon-badge-blue">
                  <Droplets size={20} />
                </div>
                <div>
                  <h3 className="card-heading">Water Intake</h3>
                  <span className="card-sub">{waterConsumed}L / {waterTarget}L Target</span>
                </div>
              </div>
              <span className="badge badge-cyan">{waterPercent}% Hydrated</span>
            </div>

            <div className="water-tracker-body">
              <div className="water-gauge-container">
                <div className="water-flask-visual">
                  <div
                    className="water-flask-level"
                    style={{ height: `${waterPercent}%` }}
                  />
                  <div className="flask-center-text">
                    <span className="flask-liters">{waterConsumed}</span>
                    <span className="flask-unit">LITERS</span>
                  </div>
                </div>

                <div className="water-quick-buttons">
                  <button
                    onClick={() => addWater(0.25)}
                    className="btn btn-outline btn-water-add"
                  >
                    <Plus size={16} />
                    <span>+250ml Glass</span>
                  </button>

                  <button
                    onClick={() => addWater(0.5)}
                    className="btn btn-outline btn-water-add"
                  >
                    <Plus size={16} />
                    <span>+500ml Shaker</span>
                  </button>

                  <button
                    onClick={() => removeWater(0.25)}
                    className="btn btn-secondary btn-water-sub"
                    title="Undo 250ml"
                  >
                    <Minus size={16} />
                    <span>-250ml</span>
                  </button>
                </div>
              </div>

              <div className="water-reminder-tip">
                <Sparkles size={14} className="text-cyan" />
                <span>Optimal athletic recovery requires ~0.5L water per hour of resistance training.</span>
              </div>
            </div>
          </div>

          {/* Pillar 4: Progress Summary */}
          <div className="dash-card glass-panel progress-dash-card">
            <div className="dash-card-header">
              <div className="card-title-group">
                <div className="icon-badge icon-badge-purple">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <h3 className="card-heading">Progress Summary</h3>
                  <span className="card-sub">Weight & Consistency</span>
                </div>
              </div>
              <span className="badge badge-purple">On Track</span>
            </div>

            <div className="progress-metrics-row">
              <div className="metric-tile">
                <span className="tile-lbl">Current Weight</span>
                <span className="tile-val">{progress.currentWeight} <small>kg</small></span>
                <span className="tile-diff text-emerald">-3.5 kg total</span>
              </div>

              <div className="metric-tile">
                <span className="tile-lbl">Target Goal</span>
                <span className="tile-val">{progress.targetWeight} <small>kg</small></span>
                <span className="tile-diff text-cyan">2.5 kg remaining</span>
              </div>

              <div className="metric-tile">
                <span className="tile-lbl">Body Fat %</span>
                <span className="tile-val">{progress.bodyMetrics.bodyFat.current}%</span>
                <span className="tile-diff text-emerald">-3.7% vs start</span>
              </div>
            </div>

            {/* Mini SVG Sparkline */}
            <div className="sparkline-container">
              <span className="sparkline-title">Weight Loss Trajectory (8-Week Trend)</span>
              <svg className="sparkline-svg" viewBox="0 0 300 60">
                <defs>
                  <linearGradient id="sparkGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 10 15 Q 50 20, 90 28 T 170 38 T 240 45 T 290 50"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M 10 15 Q 50 20, 90 28 T 170 38 T 240 45 T 290 50 L 290 60 L 10 60 Z"
                  fill="url(#sparkGrad)"
                />
                <circle cx="290" cy="50" r="4" fill="#34d399" />
              </svg>
            </div>

            <div className="dash-card-footer">
              <button onClick={() => navigateTo('progress')} className="btn btn-secondary w-full">
                <span>View Full Analytics & Charts</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* AI Coach Suggestion Prompts Bar */}
        <div className="ai-coach-banner glass-panel-glow">
          <div className="ai-banner-content">
            <div className="ai-banner-header">
              <div className="ai-pulse-icon">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="ai-banner-title">Need Real-Time Coaching Adjustments?</h3>
                <p className="ai-banner-sub">
                  Tap any recommendation to instantly query your FitWise AI Coach with contextual recommendations.
                </p>
              </div>
            </div>

            <div className="prompt-chips-row">
              <button
                className="prompt-chip"
                onClick={() => handlePromptClick("What is the optimal post-workout meal for muscle protein synthesis?")}
              >
                🥩 Optimal Post-Workout Meal
              </button>
              <button
                className="prompt-chip"
                onClick={() => handlePromptClick("Can you create a 30-minute high-energy dumbbells-only upper body routine?")}
              >
                ⚡ 30-Min Dumbbell Upper Routine
              </button>
              <button
                className="prompt-chip"
                onClick={() => handlePromptClick("How should I adjust my macros if I want to lose 0.5kg this week?")}
              >
                ⚖️ 0.5kg Fat Loss Macro Strategy
              </button>
              <button
                className="prompt-chip"
                onClick={() => handlePromptClick("My knees feel slight discomfort during squats. What form cues help?")}
              >
                🦵 Squat Knee Discomfort Form Cues
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-page {
          padding: 36px 0 60px;
        }
        .greeting-card {
          padding: 32px 36px;
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 32px;
          gap: 24px;
        }
        .streak-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: 999px;
          background: rgba(249, 115, 22, 0.12);
          border: 1px solid rgba(249, 115, 22, 0.3);
          color: #fb923c;
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 10px;
        }
        .text-orange {
          color: #f97316;
        }
        .greeting-title {
          font-size: 2.2rem;
          margin-bottom: 8px;
        }
        .greeting-desc {
          font-size: 0.98rem;
          color: var(--text-muted);
          max-width: 650px;
          line-height: 1.5;
        }
        .btn-chat-quick {
          white-space: nowrap;
          box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4);
        }
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
          margin-bottom: 32px;
        }
        .dash-card {
          padding: 28px;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 20px;
        }
        .dash-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .card-title-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .icon-badge {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .icon-badge-cyan {
          background: rgba(6, 182, 212, 0.15);
          color: #38bdf8;
          border: 1px solid rgba(6, 182, 212, 0.3);
        }
        .icon-badge-amber {
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }
        .icon-badge-blue {
          background: rgba(56, 189, 248, 0.15);
          color: #38bdf8;
          border: 1px solid rgba(56, 189, 248, 0.3);
        }
        .icon-badge-purple {
          background: rgba(168, 85, 247, 0.15);
          color: #c084fc;
          border: 1px solid rgba(168, 85, 247, 0.3);
        }
        .card-heading {
          font-size: 1.15rem;
          line-height: 1.2;
        }
        .card-sub {
          font-size: 0.78rem;
          color: var(--text-dim);
          font-weight: 500;
        }
        .workout-routine-name {
          font-size: 1.25rem;
          margin-bottom: 4px;
        }
        .workout-tagline {
          font-size: 0.86rem;
          color: var(--text-muted);
          margin-bottom: 12px;
        }
        .workout-meta-pills {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }
        .meta-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.05);
          font-size: 0.78rem;
          color: var(--text-muted);
          font-weight: 600;
        }
        .exercise-snippet-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .exercise-snippet-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.03);
          font-size: 0.84rem;
        }
        .ex-num {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.72rem;
          color: var(--text-muted);
        }
        .ex-name {
          color: #ffffff;
          font-weight: 600;
          flex: 1;
        }
        .ex-sets {
          color: var(--text-dim);
          font-size: 0.78rem;
        }
        .more-exercises-hint {
          font-size: 0.78rem;
          color: var(--text-dim);
          text-align: center;
          margin-top: 4px;
        }
        .calories-ring-overview {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 16px;
        }
        .cal-stat-circle {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-width: 110px;
          height: 110px;
          border-radius: 50%;
          border: 3px solid #f59e0b;
          background: rgba(245, 158, 11, 0.06);
        }
        .cal-big-num {
          font-family: var(--font-heading);
          font-size: 1.8rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1;
        }
        .cal-rem-lbl {
          font-size: 0.72rem;
          text-transform: uppercase;
          color: #fbbf24;
          font-weight: 600;
          margin-top: 2px;
        }
        .cal-progress-bar-wrap {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .cal-bar-bg {
          height: 10px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 999px;
          overflow: hidden;
        }
        .cal-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #f59e0b, #f97316);
          border-radius: 999px;
          transition: width 0.4s ease;
        }
        .cal-bar-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.78rem;
          color: var(--text-dim);
        }
        .dash-macros-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        .macro-chip {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .macro-lbl {
          font-size: 0.74rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .macro-val {
          font-family: var(--font-heading);
          font-size: 1.1rem;
          font-weight: 800;
          color: #ffffff;
        }
        .macro-target {
          font-size: 0.7rem;
          color: var(--text-dim);
        }
        .mini-meter {
          height: 4px;
          background: rgba(255, 255, 255, 0.06);
          border-radius: 999px;
          overflow: hidden;
          margin-top: 4px;
        }
        .mini-meter div {
          height: 100%;
        }
        .bg-emerald { background: #10b981; }
        .bg-cyan { background: #38bdf8; }
        .bg-amber { background: #f59e0b; }
        .text-protein { color: #34d399; }
        .text-carbs { color: #38bdf8; }
        .text-fat { color: #fbbf24; }

        /* Water Section */
        .water-gauge-container {
          display: flex;
          align-items: center;
          gap: 28px;
          margin-bottom: 14px;
        }
        .water-flask-visual {
          width: 80px;
          height: 120px;
          border: 2px solid rgba(56, 189, 248, 0.4);
          border-radius: 16px;
          position: relative;
          overflow: hidden;
          background: rgba(56, 189, 248, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .water-flask-level {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(180deg, #38bdf8 0%, #0284c7 100%);
          opacity: 0.55;
          transition: height 0.4s ease;
        }
        .flask-center-text {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .flask-liters {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 800;
          color: #ffffff;
        }
        .flask-unit {
          font-size: 0.65rem;
          letter-spacing: 0.08em;
          color: #e0f2fe;
          font-weight: 700;
        }
        .water-quick-buttons {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .btn-water-add {
          justify-content: flex-start;
          padding: 8px 12px;
          font-size: 0.85rem;
        }
        .btn-water-sub {
          justify-content: flex-start;
          padding: 6px 12px;
          font-size: 0.8rem;
          color: var(--text-dim);
        }
        .water-reminder-tip {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.78rem;
          color: var(--text-muted);
          background: rgba(255, 255, 255, 0.03);
          padding: 8px 12px;
          border-radius: 8px;
        }
        .text-cyan { color: #38bdf8; }

        /* Progress Card */
        .progress-metrics-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 14px;
        }
        .metric-tile {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .tile-lbl {
          font-size: 0.72rem;
          color: var(--text-dim);
          text-transform: uppercase;
        }
        .tile-val {
          font-family: var(--font-heading);
          font-size: 1.15rem;
          font-weight: 800;
          color: #ffffff;
        }
        .tile-val small {
          font-size: 0.75rem;
          color: var(--text-dim);
        }
        .tile-diff {
          font-size: 0.72rem;
          font-weight: 600;
        }
        .sparkline-container {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .sparkline-title {
          font-size: 0.75rem;
          color: var(--text-dim);
          font-weight: 600;
        }
        .sparkline-svg {
          width: 100%;
          height: 60px;
        }

        /* AI Coach Spotlight Banner */
        .ai-coach-banner {
          padding: 28px 32px;
          border-radius: 20px;
        }
        .ai-banner-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }
        .ai-pulse-icon {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          background: linear-gradient(135deg, #10b981, #06b6d4);
          color: #031b10;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
        }
        .ai-banner-title {
          font-size: 1.25rem;
          margin-bottom: 4px;
        }
        .ai-banner-sub {
          font-size: 0.88rem;
          color: var(--text-muted);
        }
        .prompt-chips-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .prompt-chip {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          color: #e2e8f0;
          padding: 8px 14px;
          border-radius: 999px;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: var(--ease-smooth);
        }
        .prompt-chip:hover {
          background: rgba(16, 185, 129, 0.15);
          border-color: var(--border-glow);
          color: #34d399;
          transform: translateY(-2px);
        }

        @media (max-width: 960px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
          .greeting-card {
            flex-direction: column;
            align-items: flex-start;
          }
          .btn-chat-quick {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};
