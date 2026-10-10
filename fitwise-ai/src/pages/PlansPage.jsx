import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Trash2, Dumbbell, Apple, Sparkles } from 'lucide-react';

export const PlansPage = () => {
  const { navigateTo, savedPlans = [], deleteSavedPlan, addSavedPlan, showToast } = useApp();
  const [activeFilter, setActiveFilter] = useState('All'); // 'All' | 'Meal' | 'Workout'

  const filteredPlans = savedPlans.filter((plan) => {
    if (activeFilter === 'All') return true;
    return plan.type?.toLowerCase() === activeFilter.toLowerCase();
  });

  const handleLoadDemoPlan = () => {
    const demo = {
      id: 'plan-demo-split-1',
      title: '5-Day Hypertrophy Split',
      type: 'Workout',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      description: 'Upper/Lower frequency with optimal rest and progressive overload targets.',
      schedule: [
        { day: 'Day 1', focus: 'Upper Body A', details: 'Barbell/DB Bench Press, Chest-Supported Rows, Overhead Press, Lat Pulldowns, Bicep/Tricep supersets.' },
        { day: 'Day 2', focus: 'Lower Body A', details: 'Barbell Back Squats or Leg Press, Romanian Deadlifts (RDLs), Walking Lunges, Calf Raises, Core work.' },
        { day: 'Day 3', focus: 'Rest & Recovery', details: 'Light walking, mobility work, and hitting your 130g protein target.' },
        { day: 'Day 4', focus: 'Upper Body B', details: 'Incline DB Press, Seated Cable Rows, Lateral Raises, Cable Flyes, Hammer Curls, Dips.' },
        { day: 'Day 5', focus: 'Lower Body B', details: 'Bulgarian Split Squats, Leg Extensions, Seated Leg Curls, Glute Bridges, Calf Raises.' },
      ]
    };
    if (addSavedPlan) addSavedPlan(demo);
    showToast('Demo workout plan loaded into Saved Plans!', 'success');
  };

  return (
    <div className="nutrifit-plans-page animate-fade-in">
      <header className="plans-header">
        <h1 className="plans-title">Meal & Workout Plans</h1>
      </header>

      {/* Filter Pills */}
      <div className="plans-filter-row">
        {['All', 'Meal', 'Workout'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`plans-filter-btn ${activeFilter === tab ? 'active' : ''}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      {filteredPlans.length === 0 ? (
        <div className="nutrifit-card empty-plans-card">
          <p className="empty-plans-text">
            No saved plans yet. Ask your coach and tap "Save to My Plans".
          </p>
          <div className="empty-plans-actions">
            <button
              onClick={() => navigateTo('coach')}
              className="btn-open-coach-plans"
            >
              Open AI Coach
            </button>
            <button
              onClick={handleLoadDemoPlan}
              className="btn-load-demo-plan"
              title="Quickly preview a saved plan"
            >
              <Sparkles size={16} />
              <span>Load Sample Plan</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="saved-plans-grid">
          {filteredPlans.map((plan) => (
            <div key={plan.id} className="nutrifit-card plan-item-card">
              <div className="plan-card-header">
                <div className="plan-badge-title">
                  <span className={`plan-type-badge ${plan.type === 'Workout' ? 'type-workout' : 'type-meal'}`}>
                    {plan.type === 'Workout' ? <Dumbbell size={14} /> : <Apple size={14} />}
                    <span>{plan.type}</span>
                  </span>
                  <h3 className="plan-name">{plan.title}</h3>
                </div>
                {deleteSavedPlan && (
                  <button
                    onClick={() => deleteSavedPlan(plan.id)}
                    className="btn-delete-plan"
                    title="Remove plan"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              {plan.description && (
                <p className="plan-desc">{plan.description}</p>
              )}

              {plan.schedule && plan.schedule.length > 0 && (
                <div className="plan-schedule-table-wrap">
                  <table className="plan-table">
                    <tbody>
                      {plan.schedule.map((row, idx) => (
                        <tr key={idx} className="plan-tr">
                          <td className="plan-td-day">{row.day}</td>
                          <td className="plan-td-focus">{row.focus}</td>
                          <td className="plan-td-details">{row.details}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <style>{`
        .nutrifit-plans-page {
          padding: 40px 48px 80px;
          max-width: 1200px;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .plans-header {
          display: flex;
          flex-direction: column;
        }

        .plans-title {
          font-family: var(--font-heading);
          font-size: 2.6rem;
          font-weight: 800;
          letter-spacing: -0.025em;
          color: #ffffff;
        }

        .plans-filter-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 4px;
        }

        .plans-filter-btn {
          padding: 8px 22px;
          border-radius: 9999px;
          background: #141c18;
          border: 1px solid #1c2721;
          color: #94a3b8;
          font-family: var(--font-heading);
          font-size: 0.92rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s ease;
        }

        .plans-filter-btn:hover {
          color: #ffffff;
          border-color: #27372e;
        }

        .plans-filter-btn.active {
          background: #10b981;
          border-color: #10b981;
          color: #042013;
          font-weight: 700;
          box-shadow: 0 0 14px rgba(16, 185, 129, 0.35);
        }

        /* Empty state card matching Screenshot 3 */
        .empty-plans-card {
          min-height: 280px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
          text-align: center;
          padding: 48px 24px;
        }

        .empty-plans-text {
          font-size: 1.05rem;
          color: #94a3b8;
          max-width: 500px;
        }

        .empty-plans-actions {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .btn-open-coach-plans {
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
          box-shadow: 0 4px 18px rgba(16, 185, 129, 0.35);
        }

        .btn-open-coach-plans:hover {
          background: #34d399;
          transform: translateY(-1px);
        }

        .btn-load-demo-plan {
          background: #141c18;
          border: 1px solid #1c2721;
          color: #94a3b8;
          font-family: var(--font-heading);
          font-size: 0.92rem;
          font-weight: 600;
          padding: 11px 20px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-load-demo-plan:hover {
          color: #ffffff;
          border-color: #27372e;
        }

        /* Saved plans cards */
        .saved-plans-grid {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .plan-item-card {
          padding: 28px;
          gap: 16px;
        }

        .plan-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }

        .plan-badge-title {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .plan-type-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: 9999px;
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .type-workout {
          background: rgba(16, 185, 129, 0.12);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .type-meal {
          background: rgba(234, 179, 8, 0.12);
          color: #facc15;
          border: 1px solid rgba(234, 179, 8, 0.3);
        }

        .plan-name {
          font-family: var(--font-heading);
          font-size: 1.35rem;
          font-weight: 700;
          color: #ffffff;
        }

        .btn-delete-plan {
          background: transparent;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 6px;
          border-radius: 8px;
          transition: color 0.18s ease;
        }

        .btn-delete-plan:hover {
          color: #f87171;
        }

        .plan-desc {
          font-size: 0.95rem;
          color: #94a3b8;
        }

        .plan-schedule-table-wrap {
          border: 1px solid #1a251f;
          border-radius: 12px;
          overflow: hidden;
          background: #0f1512;
        }

        .plan-table {
          width: 100%;
          border-collapse: collapse;
        }

        .plan-tr {
          border-bottom: 1px solid #16201a;
        }

        .plan-tr:last-child {
          border-bottom: none;
        }

        .plan-tr td {
          padding: 14px 18px;
          font-size: 0.92rem;
        }

        .plan-td-day {
          color: #10b981;
          font-weight: 700;
          width: 90px;
          white-space: nowrap;
        }

        .plan-td-focus {
          color: #10b981;
          font-weight: 700;
          width: 160px;
          white-space: nowrap;
        }

        .plan-td-details {
          color: #cbd5e1;
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .nutrifit-plans-page {
            padding: 24px 20px 60px;
          }
          .plan-td-focus, .plan-td-day {
            display: block;
            width: 100%;
            padding-bottom: 4px;
          }
        }
      `}</style>
    </div>
  );
};
