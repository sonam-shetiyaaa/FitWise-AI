import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AddMealModal } from '../components/AddMealModal';
import {
  Apple,
  Flame,
  Plus,
  Trash2,
  Sparkles,
  Clock,
  PieChart,
  Activity,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export const NutritionPage = () => {
  const { nutrition, removeMealItem, user, navigateTo } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalTargetMeal, setModalTargetMeal] = useState('breakfast');

  // Compute daily totals
  const totalCalories = Object.values(nutrition.meals).reduce((acc, m) => acc + m.totalCalories, 0);
  const totalProtein = Object.values(nutrition.meals).reduce((acc, m) => acc + m.protein, 0);
  const totalCarbs = Object.values(nutrition.meals).reduce((acc, m) => acc + m.carbs, 0);
  const totalFat = Object.values(nutrition.meals).reduce((acc, m) => acc + m.fat, 0);

  const targets = nutrition.dailyTarget;
  const calPercent = Math.min(100, Math.round((totalCalories / targets.calories) * 100));
  const protPercent = Math.min(100, Math.round((totalProtein / targets.protein) * 100));
  const carbsPercent = Math.min(100, Math.round((totalCarbs / targets.carbs) * 100));
  const fatPercent = Math.min(100, Math.round((totalFat / targets.fat) * 100));

  const openAddModal = (mealKey) => {
    setModalTargetMeal(mealKey);
    setIsAddModalOpen(true);
  };

  const mealCards = [
    { key: 'breakfast', label: 'Breakfast', badge: 'Morning Fuel', iconColor: 'amber' },
    { key: 'lunch', label: 'Lunch', badge: 'Midday Power', iconColor: 'cyan' },
    { key: 'dinner', label: 'Dinner', badge: 'Recovery Feast', iconColor: 'purple' },
    { key: 'snacks', label: 'Snacks', badge: 'Metabolic Boost', iconColor: 'emerald' },
  ];

  return (
    <div className="nutrition-page animate-fade-in">
      <div className="container">
        {/* Page Top Header */}
        <div className="nutrition-top-bar">
          <div>
            <div className="pill-badge">
              <Apple size={14} className="text-emerald" />
              <span>Precision Macronutrient Engine</span>
            </div>
            <h1 className="page-heading">Personalized Nutrition & Meal Plans</h1>
            <p className="page-sub">
              Calibrated to <strong>{user.foodPreference}</strong> and your goal of <strong>{user.fitnessGoal}</strong>.
            </p>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              openAddModal('breakfast');
            }}
            className="btn btn-primary btn-add-meal-top"
          >
            <Plus size={18} />
            <span>Log Food or Meal</span>
          </button>
        </div>

        {/* Nutrition Summary Hero Panel */}
        <div className="nutrition-summary-card glass-panel-glow">
          <div className="summary-left-col">
            <span className="badge badge-amber">Daily Nutrition Overview</span>
            <div className="calories-stat-group">
              <div className="cal-big-display">
                <span className="cal-huge">{totalCalories}</span>
                <span className="cal-denom">/ {targets.calories} kcal</span>
              </div>
              <p className="cal-status-text">
                {targets.calories - totalCalories > 0
                  ? `You have ${targets.calories - totalCalories} kcal remaining to reach your maintenance/surplus target.`
                  : `You've achieved your daily caloric baseline!`}
              </p>
            </div>

            {/* Overall Calorie Progress Bar */}
            <div className="cal-fill-track">
              <div
                className="cal-fill-indicator"
                style={{ width: `${calPercent}%` }}
              />
            </div>
            <div className="cal-track-labels">
              <span>0 kcal</span>
              <span className="cal-midpoint">{calPercent}% Target Reached</span>
              <span>{targets.calories} kcal</span>
            </div>
          </div>

          {/* Right Col: 3 Macros Dial / Meters */}
          <div className="summary-right-col">
            <h4 className="macros-breakdown-title">Macronutrient Distribution</h4>

            {/* Protein */}
            <div className="macro-row-meter">
              <div className="macro-row-header">
                <span className="macro-name text-protein">Protein (4 kcal/g)</span>
                <span className="macro-fraction">{totalProtein}g / {targets.protein}g ({protPercent}%)</span>
              </div>
              <div className="macro-track">
                <div className="macro-bar-fill bg-emerald" style={{ width: `${protPercent}%` }} />
              </div>
            </div>

            {/* Carbohydrates */}
            <div className="macro-row-meter">
              <div className="macro-row-header">
                <span className="macro-name text-carbs">Carbohydrates (4 kcal/g)</span>
                <span className="macro-fraction">{totalCarbs}g / {targets.carbs}g ({carbsPercent}%)</span>
              </div>
              <div className="macro-track">
                <div className="macro-bar-fill bg-cyan" style={{ width: `${carbsPercent}%` }} />
              </div>
            </div>

            {/* Healthy Fats */}
            <div className="macro-row-meter">
              <div className="macro-row-header">
                <span className="macro-name text-fat">Healthy Fats (9 kcal/g)</span>
                <span className="macro-fraction">{totalFat}g / {targets.fat}g ({fatPercent}%)</span>
              </div>
              <div className="macro-track">
                <div className="macro-bar-fill bg-amber" style={{ width: `${fatPercent}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* AI Dietitian Coaching Note */}
        <div className="ai-diet-note glass-panel">
          <Sparkles size={20} className="text-cyan" />
          <div className="note-text">
            <strong>AI Dietitian Recommendation:</strong> Your protein intake is currently at {protPercent}% of target. For optimal muscle protein synthesis, aim to distribute at least 35g of protein during your upcoming meal.
          </div>
        </div>

        {/* 4 Main Meal Sections */}
        <div className="meals-section-header">
          <h2 className="section-title">Today's Meal Breakdown</h2>
          <span className="section-sub">Track individual ingredients, macros, and serving portions</span>
        </div>

        <div className="meals-grid">
          {mealCards.map(({ key, label, badge, iconColor }) => {
            const meal = nutrition.meals[key] || { items: [], totalCalories: 0, protein: 0, carbs: 0, fat: 0 };

            return (
              <div key={key} className="meal-card glass-panel">
                <div className="meal-card-top">
                  <div className="meal-title-group">
                    <span className={`badge badge-${iconColor}`}>{badge}</span>
                    <h3 className="meal-heading">{label}</h3>
                    <span className="meal-time"><Clock size={13} /> {meal.time || 'Scheduled'}</span>
                  </div>

                  <div className="meal-cals-badge">
                    <span className="meal-cal-val">{meal.totalCalories}</span>
                    <span className="meal-cal-unit">kcal</span>
                  </div>
                </div>

                {/* Meal Macros mini bar */}
                <div className="meal-macros-mini">
                  <span className="m-chip m-prot">P: {meal.protein}g</span>
                  <span className="m-chip m-carb">C: {meal.carbs}g</span>
                  <span className="m-chip m-fat">F: {meal.fat}g</span>
                </div>

                {/* Meal Items List */}
                <div className="meal-items-list">
                  {meal.items.length === 0 ? (
                    <div className="no-items-state">
                      <AlertCircle size={16} />
                      <span>No items logged yet for {label}.</span>
                    </div>
                  ) : (
                    meal.items.map((item) => (
                      <div key={item.id} className="meal-food-row">
                        <div className="food-info">
                          <span className="food-name">{item.name}</span>
                          <span className="food-amount">{item.amount}</span>
                        </div>
                        <div className="food-right">
                          <span className="food-cals">{item.calories} kcal</span>
                          <button
                            onClick={() => removeMealItem(key, item.id)}
                            className="btn-remove-food"
                            title="Remove food"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Card Action */}
                <div className="meal-card-footer">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      openAddModal(key);
                    }}
                    className="btn btn-secondary btn-sm w-full btn-add-food-card"
                  >
                    <Plus size={15} />
                    <span>Add Food to {label}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Meal Modal */}
      <AddMealModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        defaultMealKey={modalTargetMeal}
      />

      <style>{`
        .nutrition-page {
          padding: 36px 0 60px;
        }
        .nutrition-top-bar {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 28px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .page-heading {
          font-size: 2.2rem;
          margin: 6px 0 4px;
        }
        .page-sub {
          font-size: 0.95rem;
          color: var(--text-muted);
        }
        .page-sub strong {
          color: #ffffff;
        }
        .nutrition-summary-card {
          padding: 36px;
          border-radius: 24px;
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 40px;
          margin-bottom: 24px;
        }
        .summary-left-col {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .calories-stat-group {
          margin-top: 6px;
        }
        .cal-big-display {
          display: flex;
          align-items: baseline;
          gap: 10px;
        }
        .cal-huge {
          font-family: var(--font-heading);
          font-size: 3.5rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1;
        }
        .cal-denom {
          font-size: 1.25rem;
          color: var(--text-dim);
          font-weight: 600;
        }
        .cal-status-text {
          font-size: 0.9rem;
          color: var(--text-muted);
          margin-top: 6px;
          line-height: 1.5;
        }
        .cal-fill-track {
          height: 14px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 999px;
          overflow: hidden;
          margin-top: 10px;
        }
        .cal-fill-indicator {
          height: 100%;
          background: linear-gradient(90deg, #10b981 0%, #06b6d4 100%);
          border-radius: 999px;
          transition: width 0.4s ease;
        }
        .cal-track-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.78rem;
          color: var(--text-dim);
          font-weight: 600;
        }
        .cal-midpoint {
          color: #34d399;
        }
        .summary-right-col {
          display: flex;
          flex-direction: column;
          gap: 16px;
          justify-content: center;
          border-left: 1px solid var(--border-subtle);
          padding-left: 36px;
        }
        .macros-breakdown-title {
          font-size: 1.05rem;
          color: #ffffff;
        }
        .macro-row-meter {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .macro-row-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.82rem;
        }
        .macro-name {
          font-weight: 700;
        }
        .macro-fraction {
          color: var(--text-muted);
          font-weight: 500;
        }
        .macro-track {
          height: 8px;
          background: rgba(255, 255, 255, 0.06);
          border-radius: 999px;
          overflow: hidden;
        }
        .macro-bar-fill {
          height: 100%;
          border-radius: 999px;
          transition: width 0.4s ease;
        }
        .ai-diet-note {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 20px;
          border-radius: 16px;
          margin-bottom: 36px;
          background: rgba(6, 182, 212, 0.08);
          border: 1px solid rgba(6, 182, 212, 0.2);
        }
        .note-text {
          font-size: 0.88rem;
          color: #e2e8f0;
          line-height: 1.5;
        }
        .meals-section-header {
          margin-bottom: 24px;
        }
        .section-title {
          font-size: 1.8rem;
        }
        .section-sub {
          font-size: 0.88rem;
          color: var(--text-muted);
        }
        .meals-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }
        .meal-card {
          padding: 24px;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .meal-card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .meal-title-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .meal-heading {
          font-size: 1.3rem;
        }
        .meal-time {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.78rem;
          color: var(--text-dim);
        }
        .meal-cals-badge {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          background: rgba(255, 255, 255, 0.05);
          padding: 6px 12px;
          border-radius: 10px;
        }
        .meal-cal-val {
          font-family: var(--font-heading);
          font-size: 1.3rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1;
        }
        .meal-cal-unit {
          font-size: 0.65rem;
          color: var(--text-dim);
          text-transform: uppercase;
        }
        .meal-macros-mini {
          display: flex;
          gap: 8px;
        }
        .m-chip {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.04);
        }
        .meal-items-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-height: 110px;
        }
        .no-items-state {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-dim);
          font-size: 0.85rem;
          padding: 20px 0;
          justify-content: center;
        }
        .meal-food-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.03);
        }
        .food-info {
          display: flex;
          flex-direction: column;
        }
        .food-name {
          font-size: 0.88rem;
          font-weight: 600;
          color: #ffffff;
        }
        .food-amount {
          font-size: 0.74rem;
          color: var(--text-dim);
        }
        .food-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .food-cals {
          font-size: 0.82rem;
          font-weight: 600;
          color: #fbbf24;
        }
        .btn-remove-food {
          background: transparent;
          border: none;
          color: var(--text-dim);
          cursor: pointer;
          padding: 4px;
          display: flex;
          border-radius: 4px;
          transition: var(--ease-smooth);
        }
        .btn-remove-food:hover {
          color: #f43f5e;
          background: rgba(244, 63, 94, 0.1);
        }
        .meal-card-footer {
          margin-top: auto;
        }
        .btn-add-food-card {
          justify-content: center;
          font-size: 0.85rem;
        }

        @media (max-width: 960px) {
          .nutrition-summary-card {
            grid-template-columns: 1fr;
            gap: 28px;
          }
          .summary-right-col {
            border-left: none;
            padding-left: 0;
            border-top: 1px solid var(--border-subtle);
            padding-top: 24px;
          }
          .meals-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
