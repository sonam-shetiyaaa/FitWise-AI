import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  Award,
  CheckCircle2,
  Calendar,
  Droplets,
  Flame,
  Scale,
  Sparkles,
  Trophy,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Target
} from 'lucide-react';

export const ProgressPage = () => {
  const { progress, user } = useApp();
  const [selectedRange, setSelectedRange] = useState('8W');

  const weightData = progress.weightHistory;
  const minWeight = 71;
  const maxWeight = 79;
  const chartHeight = 200;
  const chartWidth = 600;

  // Compute SVG coordinates for weight chart
  const getCoordinates = () => {
    const stepX = chartWidth / (weightData.length - 1);
    return weightData.map((d, i) => {
      const x = i * stepX;
      const y = chartHeight - ((d.weight - minWeight) / (maxWeight - minWeight)) * chartHeight;
      return { x, y, ...d };
    });
  };

  const points = getCoordinates();
  const pathD = points.reduce((acc, pt, i) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    // smooth curve
    const prev = points[i - 1];
    const cX = (prev.x + pt.x) / 2;
    return `${acc} C ${cX} ${prev.y}, ${cX} ${pt.y}, ${pt.x} ${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`;

  return (
    <div className="progress-page animate-fade-in">
      <div className="container">
        {/* Header */}
        <div className="progress-top-bar">
          <div>
            <div className="pill-badge">
              <TrendingUp size={14} className="text-emerald" />
              <span>Biometric & Athletic Analytics</span>
            </div>
            <h1 className="page-heading">Your Transformation Milestones</h1>
            <p className="page-sub">
              Tracking consistent progress towards <strong>{user.fitnessGoal}</strong>.
            </p>
          </div>

          <div className="time-range-toggle">
            {['4W', '8W', '3M', '6M'].map((range) => (
              <button
                key={range}
                className={`range-pill ${selectedRange === range ? 'active' : ''}`}
                onClick={() => setSelectedRange(range)}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Primary Goal Metric Rings */}
        <div className="goals-metrics-grid">
          <div className="goal-metric-card glass-panel">
            <div className="goal-top-row">
              <span className="goal-icon-wrap icon-emerald"><Scale size={18} /></span>
              <span className="badge badge-emerald">On Track</span>
            </div>
            <div className="goal-numbers">
              <span className="goal-current">{progress.currentWeight} <small>kg</small></span>
              <span className="goal-target">Target: {progress.targetWeight} kg</span>
            </div>
            <div className="goal-progress-bar">
              <div className="goal-fill bg-emerald" style={{ width: '70%' }} />
            </div>
            <div className="goal-delta-row">
              <span className="text-emerald"><ArrowDownRight size={14} /> -3.5 kg lost</span>
              <span>70% to goal</span>
            </div>
          </div>

          <div className="goal-metric-card glass-panel">
            <div className="goal-top-row">
              <span className="goal-icon-wrap icon-cyan"><Activity size={18} /></span>
              <span className="badge badge-cyan">-3.7% Drop</span>
            </div>
            <div className="goal-numbers">
              <span className="goal-current">{progress.bodyMetrics.bodyFat.current}%</span>
              <span className="goal-target">Target: {progress.bodyMetrics.bodyFat.target}%</span>
            </div>
            <div className="goal-progress-bar">
              <div className="goal-fill bg-cyan" style={{ width: '62%' }} />
            </div>
            <div className="goal-delta-row">
              <span className="text-cyan"><ArrowDownRight size={14} /> From 19.5% start</span>
              <span>62% to goal</span>
            </div>
          </div>

          <div className="goal-metric-card glass-panel">
            <div className="goal-top-row">
              <span className="goal-icon-wrap icon-amber"><Flame size={18} /></span>
              <span className="badge badge-amber">+1.6 kg Lean</span>
            </div>
            <div className="goal-numbers">
              <span className="goal-current">{progress.bodyMetrics.muscleMass.current} <small>kg</small></span>
              <span className="goal-target">Target: {progress.bodyMetrics.muscleMass.target} kg</span>
            </div>
            <div className="goal-progress-bar">
              <div className="goal-fill bg-amber" style={{ width: '80%' }} />
            </div>
            <div className="goal-delta-row">
              <span className="text-amber"><ArrowUpRight size={14} /> Hypertrophy</span>
              <span>80% to goal</span>
            </div>
          </div>

          <div className="goal-metric-card glass-panel">
            <div className="goal-top-row">
              <span className="goal-icon-wrap icon-purple"><Trophy size={18} /></span>
              <span className="badge badge-purple">14-Day Streak</span>
            </div>
            <div className="goal-numbers">
              <span className="goal-current">{progress.workoutStreak} <small>Days</small></span>
              <span className="goal-target">Target: 30 Days</span>
            </div>
            <div className="goal-progress-bar">
              <div className="goal-fill bg-purple" style={{ width: '47%' }} />
            </div>
            <div className="goal-delta-row">
              <span className="text-purple">100% Weekly adherence</span>
              <span>47% to goal</span>
            </div>
          </div>
        </div>

        {/* SECTION 1: WEIGHT PROGRESS CHART */}
        <div className="chart-panel-card glass-panel-glow">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Weight Trajectory & Trendline</h3>
              <p className="chart-sub">Consistent steady decrease in accordance with your 500 kcal deficit protocol</p>
            </div>
            <div className="chart-legend">
              <span className="legend-item"><span className="legend-dot dot-emerald" /> Actual Bodyweight</span>
              <span className="legend-item"><span className="legend-dot dot-cyan" /> 72.0 kg Goal Line</span>
            </div>
          </div>

          <div className="svg-chart-container">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="weight-svg-chart">
              <defs>
                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="50" x2={chartWidth} y2="50" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
              <line x1="0" y1="100" x2={chartWidth} y2="100" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
              <line x1="0" y1="150" x2={chartWidth} y2="150" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />

              {/* Target Line (72kg) */}
              <line
                x1="0"
                y1={chartHeight - ((72.0 - minWeight) / (maxWeight - minWeight)) * chartHeight}
                x2={chartWidth}
                y2={chartHeight - ((72.0 - minWeight) / (maxWeight - minWeight)) * chartHeight}
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeDasharray="6 4"
                opacity="0.8"
              />

              {/* Area Gradient */}
              <path d={areaD} fill="url(#chartGradient)" />

              {/* Main Line */}
              <path d={pathD} fill="none" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" />

              {/* Data Points */}
              {points.map((pt, i) => (
                <g key={i}>
                  <circle cx={pt.x} cy={pt.y} r="5" fill="#0f172a" stroke="#34d399" strokeWidth="2.5" />
                  <text
                    x={pt.x}
                    y={pt.y - 12}
                    textAnchor="middle"
                    fill="#cbd5e1"
                    fontSize="11"
                    fontFamily="Outfit, sans-serif"
                    fontWeight="600"
                  >
                    {pt.weight}kg
                  </text>
                  <text
                    x={pt.x}
                    y={chartHeight - 4}
                    textAnchor="middle"
                    fill="#64748b"
                    fontSize="10"
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    {pt.week}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* SECTION 2 & 3: WORKOUT COMPLETION & WATER INTAKE */}
        <div className="progress-dual-grid">
          {/* Workout Completion */}
          <div className="dual-card glass-panel">
            <div className="dual-header">
              <div className="dual-title-group">
                <Calendar size={18} className="text-emerald" />
                <h3 className="dual-heading">Workout Completion & Streak</h3>
              </div>
              <span className="badge badge-emerald">6 / 7 Days Active</span>
            </div>

            <p className="dual-sub">Weekly compliance ensures progressive mechanical overload and cardiovascular adaptation.</p>

            <div className="weekly-calendar-row">
              {progress.weeklyCompletion.map((day, idx) => {
                const isRest = day.status === 'rest';
                return (
                  <div key={idx} className={`day-card ${isRest ? 'day-rest' : 'day-completed'}`}>
                    <span className="day-name">{day.day}</span>
                    <div className="day-status-bubble">
                      {isRest ? <span className="rest-dot" /> : <CheckCircle2 size={16} />}
                    </div>
                    <span className="day-mins">{day.minutes}m</span>
                    <span className="day-focus">{day.title.split(' ')[0]}</span>
                  </div>
                );
              })}
            </div>

            <div className="consistency-quote">
              <Sparkles size={14} className="text-emerald" />
              <span>You have completed 92% of scheduled workouts over the last 30 days!</span>
            </div>
          </div>

          {/* Water Intake History */}
          <div className="dual-card glass-panel">
            <div className="dual-header">
              <div className="dual-title-group">
                <Droplets size={18} className="text-cyan" />
                <h3 className="dual-heading">Hydration History (7 Days)</h3>
              </div>
              <span className="badge badge-cyan">3.5L Target</span>
            </div>

            <p className="dual-sub">Adequate hydration improves cellular protein synthesis and glycogen loading.</p>

            {/* Bar Chart */}
            <div className="water-barchart-container">
              {progress.waterHistory.map((w, idx) => {
                const barHeight = Math.min(100, Math.round((w.amount / 4.0) * 100));
                const hitTarget = w.amount >= w.target;
                return (
                  <div key={idx} className="water-bar-column">
                    <span className="bar-liters-lbl">{w.amount}L</span>
                    <div className="bar-track">
                      <div
                        className={`bar-fill ${hitTarget ? 'bar-hit' : 'bar-sub'}`}
                        style={{ height: `${barHeight}%` }}
                      />
                    </div>
                    <span className="bar-day-lbl">{w.day}</span>
                  </div>
                );
              })}
            </div>

            <div className="consistency-quote">
              <Sparkles size={14} className="text-cyan" />
              <span>Average hydration this week: <strong>3.52 Liters / Day</strong> (Target Hit 6/7 Days).</span>
            </div>
          </div>
        </div>

        {/* SECTION 4: UNLOCKED ATHLETE ACHIEVEMENTS */}
        <div className="achievements-section">
          <div className="section-header-row">
            <div>
              <h3 className="section-title-sm">Unlocked Badges & Milestones</h3>
              <p className="section-note">Achievements rewarded based on verified fitness & nutrition consistency.</p>
            </div>
            <span className="badge badge-emerald">4 / 5 Unlocked</span>
          </div>

          <div className="achievements-grid">
            {progress.achievements.map((badge) => (
              <div
                key={badge.id}
                className={`achievement-card glass-panel ${badge.unlocked ? 'badge-unlocked' : 'badge-locked'}`}
              >
                <div className={`badge-icon-box ${badge.unlocked ? 'icon-unlocked' : 'icon-locked'}`}>
                  {badge.icon === 'Flame' && <Flame size={22} />}
                  {badge.icon === 'Droplets' && <Droplets size={22} />}
                  {badge.icon === 'Trophy' && <Trophy size={22} />}
                  {badge.icon === 'Target' && <Target size={22} />}
                  {badge.icon === 'Award' && <Award size={22} />}
                </div>
                <div className="achievement-info">
                  <div className="achievement-title-row">
                    <h4 className="achievement-title">{badge.title}</h4>
                    {badge.unlocked && <span className="badge badge-emerald">Unlocked</span>}
                  </div>
                  <p className="achievement-desc">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .progress-page {
          padding: 36px 0 60px;
        }
        .progress-top-bar {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 28px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .time-range-toggle {
          display: flex;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          padding: 4px;
          border-radius: 12px;
          gap: 4px;
        }
        .range-pill {
          padding: 6px 14px;
          border: none;
          background: transparent;
          color: var(--text-muted);
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: 0.82rem;
          border-radius: 8px;
          cursor: pointer;
          transition: var(--ease-smooth);
        }
        .range-pill.active {
          background: #1e293b;
          color: #ffffff;
        }
        .goals-metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
          margin-bottom: 28px;
        }
        .goal-metric-card {
          padding: 20px;
          border-radius: 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .goal-top-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .goal-icon-wrap {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .icon-emerald {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }
        .icon-cyan {
          background: rgba(6, 182, 212, 0.15);
          color: #38bdf8;
          border: 1px solid rgba(6, 182, 212, 0.3);
        }
        .icon-amber {
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }
        .icon-purple {
          background: rgba(168, 85, 247, 0.15);
          color: #c084fc;
          border: 1px solid rgba(168, 85, 247, 0.3);
        }
        .goal-numbers {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .goal-current {
          font-family: var(--font-heading);
          font-size: 1.6rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1;
        }
        .goal-current small {
          font-size: 0.9rem;
          color: var(--text-dim);
        }
        .goal-target {
          font-size: 0.78rem;
          color: var(--text-dim);
        }
        .goal-progress-bar {
          height: 6px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 999px;
          overflow: hidden;
        }
        .goal-fill {
          height: 100%;
          border-radius: 999px;
        }
        .goal-delta-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: var(--text-dim);
        }
        .chart-panel-card {
          padding: 30px;
          border-radius: 24px;
          margin-bottom: 28px;
        }
        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .chart-title {
          font-size: 1.4rem;
          margin-bottom: 4px;
        }
        .chart-sub {
          font-size: 0.88rem;
          color: var(--text-muted);
        }
        .chart-legend {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
          color: var(--text-muted);
        }
        .legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .dot-emerald { background: #10b981; }
        .dot-cyan { background: #38bdf8; }
        .svg-chart-container {
          width: 100%;
          overflow-x: auto;
        }
        .weight-svg-chart {
          width: 100%;
          height: 200px;
          overflow: visible;
        }
        .progress-dual-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 36px;
        }
        .dual-card {
          padding: 26px;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .dual-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .dual-title-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .dual-heading {
          font-size: 1.15rem;
        }
        .dual-sub {
          font-size: 0.84rem;
          color: var(--text-muted);
        }
        .weekly-calendar-row {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 8px;
        }
        .day-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          padding: 10px 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          text-align: center;
        }
        .day-completed {
          background: rgba(16, 185, 129, 0.08);
          border-color: rgba(16, 185, 129, 0.25);
        }
        .day-completed .day-status-bubble {
          color: #34d399;
        }
        .day-rest {
          background: rgba(255, 255, 255, 0.02);
          opacity: 0.75;
        }
        .rest-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #64748b;
        }
        .day-name {
          font-size: 0.75rem;
          font-weight: 700;
          color: #ffffff;
        }
        .day-mins {
          font-size: 0.7rem;
          color: var(--text-dim);
        }
        .day-focus {
          font-size: 0.65rem;
          color: var(--text-dim);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 100%;
        }
        .water-barchart-container {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 10px;
          height: 140px;
          align-items: flex-end;
          padding: 10px 0;
        }
        .water-bar-column {
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
          justify-content: flex-end;
          gap: 6px;
        }
        .bar-liters-lbl {
          font-size: 0.7rem;
          color: #cbd5e1;
          font-weight: 600;
        }
        .bar-track {
          width: 24px;
          height: 80px;
          background: rgba(255, 255, 255, 0.06);
          border-radius: 6px;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
        }
        .bar-fill {
          width: 100%;
          border-radius: 6px;
          transition: height 0.4s ease;
        }
        .bar-hit {
          background: linear-gradient(180deg, #38bdf8 0%, #0284c7 100%);
        }
        .bar-sub {
          background: linear-gradient(180deg, #0284c7 0%, #0369a1 100%);
          opacity: 0.7;
        }
        .bar-day-lbl {
          font-size: 0.72rem;
          color: var(--text-dim);
          font-weight: 600;
        }
        .consistency-quote {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
          color: var(--text-muted);
          background: rgba(255, 255, 255, 0.02);
          padding: 8px 12px;
          border-radius: 10px;
        }
        .achievements-section {
          margin-top: 10px;
        }
        .section-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 20px;
        }
        .achievements-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        .achievement-card {
          padding: 18px 22px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .badge-locked {
          opacity: 0.5;
        }
        .badge-icon-box {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .icon-unlocked {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }
        .icon-locked {
          background: rgba(255, 255, 255, 0.05);
          color: #64748b;
        }
        .achievement-info {
          flex: 1;
        }
        .achievement-title-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }
        .achievement-title {
          font-size: 1.05rem;
        }
        .achievement-desc {
          font-size: 0.82rem;
          color: var(--text-muted);
        }

        @media (max-width: 1024px) {
          .goals-metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .progress-dual-grid {
            grid-template-columns: 1fr;
          }
          .achievements-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 600px) {
          .goals-metrics-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
