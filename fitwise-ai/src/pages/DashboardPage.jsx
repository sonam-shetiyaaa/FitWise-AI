import React from 'react';
import { useApp } from '../context/AppContext';
import { calculateTargets } from '../utils/nutritionCalculations';
import { ArrowRight } from 'lucide-react';

export const DashboardPage = () => {
  const { user, navigateTo } = useApp();

  // Dynamically calculate based on user's active profile
  const targets = calculateTargets(user || {});

  // Progress ring calculations
  // Calorie target circle: size 210, r=85, stroke=14
  const radiusCal = 88;
  const circCal = 2 * Math.PI * radiusCal;
  // Let progress fill around 75% for aesthetic completion ring
  const strokeDashoffsetCal = circCal * (1 - 0.76);

  // Macro circles: size 110, r=42, stroke=8
  const radiusMacro = 44;
  const circMacro = 2 * Math.PI * radiusMacro;

  const proteinOffset = circMacro * (1 - targets.protein.percent / 100);
  const carbsOffset = circMacro * (1 - targets.carbs.percent / 100);
  const fatsOffset = circMacro * (1 - targets.fats.percent / 100);

  const goalText = (targets.goalLabel || 'Muscle Hypertrophy').toUpperCase();
  const activityText = (targets.activityLabel || 'Moderately Active').toUpperCase();

  const offsetSign = targets.offset > 0 ? `+${targets.offset}` : `${targets.offset}`;
  const offsetNotice = targets.offset === 0 ? 'at maintenance' : `${offsetSign} kcal from maintenance`;

  return (
    <div className="nutrifit-dashboard animate-fade-in">
      {/* Subtitle kicker & Greeting */}
      <header className="dashboard-header">
        <div className="dashboard-kicker">
          {goalText} · {activityText}
        </div>
        <h1 className="dashboard-greeting">
          Hey {user?.name ? user.name.split(' ')[0] : 'Alex'}
        </h1>
      </header>

      {/* Main Grid: Calorie Target & Macro Split */}
      <div className="dashboard-hero-grid">
        {/* Card 1: Daily Calorie Target */}
        <div className="nutrifit-card calorie-target-card">
          <div className="card-kicker-title">DAILY CALORIE TARGET</div>

          <div className="calorie-ring-wrap">
            <svg className="calorie-svg" width="220" height="220" viewBox="0 0 220 220">
              {/* Background circle */}
              <circle
                cx="110"
                cy="110"
                r={radiusCal}
                fill="none"
                stroke="#15201a"
                strokeWidth="14"
              />
              {/* Progress arc */}
              <circle
                cx="110"
                cy="110"
                r={radiusCal}
                fill="none"
                stroke="#10b981"
                strokeWidth="14"
                strokeDasharray={circCal}
                strokeDashoffset={strokeDashoffsetCal}
                strokeLinecap="round"
                transform="rotate(-90 110 110)"
              />
            </svg>

            <div className="calorie-center-info">
              <span className="calorie-number">
                {targets.targetCalories.toLocaleString()}
              </span>
              <span className="calorie-unit">kcal / day</span>
            </div>
          </div>

          <div className="calorie-card-footer">
            {offsetNotice}
          </div>
        </div>

        {/* Card 2: Macro Split */}
        <div className="nutrifit-card macro-split-card">
          <div className="card-kicker-title">MACRO SPLIT</div>

          <div className="macro-gauges-row">
            {/* Protein */}
            <div className="macro-gauge-col">
              <div className="mini-ring-wrap">
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r={radiusMacro}
                    fill="none"
                    stroke="#16201a"
                    strokeWidth="8"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r={radiusMacro}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="8"
                    strokeDasharray={circMacro}
                    strokeDashoffset={proteinOffset}
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                  />
                </svg>
                <div className="mini-ring-center">
                  <span className="mini-ring-val">{targets.protein.grams}g</span>
                  <span className="mini-ring-label">Protein</span>
                </div>
              </div>
              <span className="macro-sub-stat">
                {targets.protein.percent}% · {targets.protein.perKg}
              </span>
            </div>

            {/* Carbs */}
            <div className="macro-gauge-col">
              <div className="mini-ring-wrap">
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r={radiusMacro}
                    fill="none"
                    stroke="#1e2216"
                    strokeWidth="8"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r={radiusMacro}
                    fill="none"
                    stroke="#eab308"
                    strokeWidth="8"
                    strokeDasharray={circMacro}
                    strokeDashoffset={carbsOffset}
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                  />
                </svg>
                <div className="mini-ring-center">
                  <span className="mini-ring-val">{targets.carbs.grams}g</span>
                  <span className="mini-ring-label">Carbs</span>
                </div>
              </div>
              <span className="macro-sub-stat">
                {targets.carbs.percent}% · remainder
              </span>
            </div>

            {/* Fats */}
            <div className="macro-gauge-col">
              <div className="mini-ring-wrap">
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r={radiusMacro}
                    fill="none"
                    stroke="#231b1c"
                    strokeWidth="8"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r={radiusMacro}
                    fill="none"
                    stroke="#f87171"
                    strokeWidth="8"
                    strokeDasharray={circMacro}
                    strokeDashoffset={fatsOffset}
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                  />
                </svg>
                <div className="mini-ring-center">
                  <span className="mini-ring-val">{targets.fats.grams}g</span>
                  <span className="mini-ring-label">Fats</span>
                </div>
              </div>
              <span className="macro-sub-stat">
                {targets.fats.percent}% of kcal
              </span>
            </div>
          </div>

          {/* Segmented Macro Bar */}
          <div className="segmented-macro-bar">
            <div
              className="macro-segment seg-protein"
              style={{ width: `${targets.protein.percent}%` }}
              title={`Protein: ${targets.protein.percent}%`}
            />
            <div
              className="macro-segment seg-carbs"
              style={{ width: `${targets.carbs.percent}%` }}
              title={`Carbs: ${targets.carbs.percent}%`}
            />
            <div
              className="macro-segment seg-fats"
              style={{ width: `${targets.fats.percent}%` }}
              title={`Fats: ${targets.fats.percent}%`}
            />
          </div>
        </div>
      </div>

      {/* Row of 4 Metric Cards */}
      <div className="dashboard-stats-row">
        <div className="nutrifit-card stat-tile">
          <div className="stat-tile-label">BMR</div>
          <div className="stat-tile-val">
            <strong>{targets.bmr.toLocaleString()}</strong> <span>kcal</span>
          </div>
        </div>

        <div className="nutrifit-card stat-tile">
          <div className="stat-tile-label">TDEE</div>
          <div className="stat-tile-val">
            <strong>{targets.tdee.toLocaleString()}</strong> <span>kcal</span>
          </div>
        </div>

        <div className="nutrifit-card stat-tile">
          <div className="stat-tile-label">CURRENT WEIGHT</div>
          <div className="stat-tile-val">
            <strong>{targets.weight}</strong> <span>kg</span>
          </div>
        </div>

        <div className="nutrifit-card stat-tile">
          <div className="stat-tile-label">TO TARGET</div>
          <div className="stat-tile-val">
            <strong>{targets.toTargetWeight.split(' ')[0]}</strong> <span>kg</span>
          </div>
        </div>
      </div>

      {/* Bottom Action Banner */}
      <div className="nutrifit-card coach-action-banner">
        <div className="banner-text-side">
          <h3 className="banner-title">Turn numbers into a plan</h3>
          <p className="banner-subtitle">
            Ask your coach for meals and workouts that hit these exact targets.
          </p>
        </div>
        <button
          onClick={() => navigateTo('coach')}
          className="btn-open-coach"
        >
          <span>Open AI Coach</span>
          <ArrowRight size={18} />
        </button>
      </div>

      <style>{`
        .nutrifit-dashboard {
          padding: 40px 48px 60px;
          max-width: 1300px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .dashboard-header {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .dashboard-kicker {
          font-family: var(--font-heading);
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #10b981;
        }

        .dashboard-greeting {
          font-family: var(--font-heading);
          font-size: 2.75rem;
          font-weight: 800;
          letter-spacing: -0.025em;
          color: #ffffff;
        }

        .dashboard-hero-grid {
          display: grid;
          grid-template-columns: 1fr 1.6fr;
          gap: 20px;
        }

        .nutrifit-card {
          background: #111815;
          border: 1px solid #1a251f;
          border-radius: 18px;
          padding: 28px;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .card-kicker-title {
          font-size: 0.76rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #94a3b8;
          margin-bottom: 20px;
        }

        /* Calorie Card */
        .calorie-target-card {
          align-items: center;
          justify-content: space-between;
          text-align: center;
        }

        .calorie-ring-wrap {
          position: relative;
          width: 220px;
          height: 220px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 8px 0;
        }

        .calorie-svg {
          transform: rotate(0deg);
        }

        .calorie-center-info {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .calorie-number {
          font-family: var(--font-heading);
          font-size: 2.75rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1;
          letter-spacing: -0.02em;
        }

        .calorie-unit {
          font-size: 0.92rem;
          color: #94a3b8;
          font-weight: 500;
          margin-top: 6px;
        }

        .calorie-card-footer {
          font-size: 0.95rem;
          color: #94a3b8;
          margin-top: 14px;
        }

        /* Macro Split Card */
        .macro-split-card {
          justify-content: space-between;
        }

        .macro-gauges-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        }

        .macro-gauge-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .mini-ring-wrap {
          position: relative;
          width: 120px;
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mini-ring-center {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .mini-ring-val {
          font-family: var(--font-heading);
          font-size: 1.65rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.1;
        }

        .mini-ring-label {
          font-size: 0.85rem;
          color: #94a3b8;
          font-weight: 500;
        }

        .macro-sub-stat {
          font-size: 0.85rem;
          color: #94a3b8;
          font-weight: 500;
        }

        .segmented-macro-bar {
          height: 12px;
          background: #19241e;
          border-radius: 9999px;
          display: flex;
          overflow: hidden;
          gap: 0;
          margin-top: 8px;
        }

        .macro-segment {
          height: 100%;
          transition: width 0.3s ease;
        }

        .seg-protein {
          background: #10b981;
          border-top-left-radius: 9999px;
          border-bottom-left-radius: 9999px;
        }

        .seg-carbs {
          background: #eab308;
        }

        .seg-fats {
          background: #f87171;
          border-top-right-radius: 9999px;
          border-bottom-right-radius: 9999px;
        }

        /* Stats Row */
        .dashboard-stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .stat-tile {
          padding: 22px 24px;
          gap: 8px;
        }

        .stat-tile-label {
          font-size: 0.74rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #94a3b8;
        }

        .stat-tile-val {
          display: flex;
          align-items: baseline;
          gap: 6px;
        }

        .stat-tile-val strong {
          font-family: var(--font-heading);
          font-size: 1.95rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1;
        }

        .stat-tile-val span {
          font-size: 0.95rem;
          color: #94a3b8;
          font-weight: 500;
        }

        /* Banner */
        .coach-action-banner {
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          padding: 26px 32px;
          background: #111815;
          gap: 24px;
        }

        .banner-text-side {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .banner-title {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 700;
          color: #ffffff;
        }

        .banner-subtitle {
          font-size: 0.95rem;
          color: #94a3b8;
        }

        .btn-open-coach {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #10b981;
          color: #042013;
          font-family: var(--font-heading);
          font-size: 0.95rem;
          font-weight: 700;
          padding: 12px 24px;
          border-radius: 9999px;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .btn-open-coach:hover {
          background: #34d399;
          transform: translateY(-1px);
          box-shadow: 0 4px 18px rgba(16, 185, 129, 0.4);
        }

        @media (max-width: 1100px) {
          .dashboard-hero-grid {
            grid-template-columns: 1fr;
          }
          .dashboard-stats-row {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .nutrifit-dashboard {
            padding: 24px 20px 48px;
          }
          .dashboard-stats-row {
            grid-template-columns: 1fr;
          }
          .coach-action-banner {
            flex-direction: column;
            align-items: flex-start;
          }
          .btn-open-coach {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};
