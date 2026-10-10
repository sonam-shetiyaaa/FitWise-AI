import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ACTIVITY_LEVELS, GOALS, DIET_OPTIONS } from '../utils/nutritionCalculations';

export const ProfileSetupPage = () => {
  const { user, updateProfile, showToast } = useApp();

  const [gender, setGender] = useState(user?.gender || 'Male');
  const [age, setAge] = useState(user?.age ?? 20);
  const [height, setHeight] = useState(user?.height ?? 173);
  const [weight, setWeight] = useState(user?.weight ?? 65);
  const [targetWeight, setTargetWeight] = useState(user?.targetWeight ?? 70);

  // Activity level
  const [activityLevel, setActivityLevel] = useState(user?.activityLevel || 'Moderately Active');

  // Goal
  const [goal, setGoal] = useState(user?.fitnessGoal || user?.goal || 'Muscle Hypertrophy');

  // Diet & Allergies
  const [dietaryPreferences, setDietaryPreferences] = useState(
    user?.dietaryPreferences || ['Vegetarian', 'Non-Veg']
  );

  const toggleDietOption = (opt) => {
    setDietaryPreferences((prev) => {
      if (prev.includes(opt)) {
        return prev.filter((item) => item !== opt);
      } else {
        return [...prev, opt];
      }
    });
  };

  const handleSave = (e) => {
    e?.preventDefault();
    updateProfile({
      gender,
      age: Number(age),
      height: Number(height),
      weight: Number(weight),
      targetWeight: Number(targetWeight),
      activityLevel,
      goal,
      fitnessGoal: goal,
      dietaryPreferences,
    });
    showToast('Changes saved! Targets updated.', 'success');
  };

  return (
    <div className="nutrifit-settings-page animate-fade-in">
      <header className="settings-header">
        <h1 className="settings-title">Profile & Settings</h1>
        <p className="settings-subtitle">
          Changes instantly recalculate your targets and update your coach.
        </p>
      </header>

      <form onSubmit={handleSave} className="settings-form">
        {/* Card 1: Body Metrics */}
        <section className="nutrifit-card settings-card">
          <h2 className="card-section-title">Body metrics</h2>

          {/* Gender Segmented Switch */}
          <div className="gender-toggle-row">
            <button
              type="button"
              className={`gender-toggle-btn ${gender === 'Male' ? 'active' : ''}`}
              onClick={() => setGender('Male')}
            >
              Male
            </button>
            <button
              type="button"
              className={`gender-toggle-btn ${gender === 'Female' ? 'active' : ''}`}
              onClick={() => setGender('Female')}
            >
              Female
            </button>
          </div>

          {/* 2x2 Numerical Input Grid */}
          <div className="metrics-inputs-grid">
            <div className="input-group">
              <label className="input-label">Age</label>
              <input
                type="number"
                min="10"
                max="120"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="nutrifit-text-input"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Height (cm)</label>
              <input
                type="number"
                min="100"
                max="250"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="nutrifit-text-input"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Current weight (kg)</label>
              <input
                type="number"
                step="0.5"
                min="30"
                max="300"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="nutrifit-text-input"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Target weight (kg)</label>
              <input
                type="number"
                step="0.5"
                min="30"
                max="300"
                value={targetWeight}
                onChange={(e) => setTargetWeight(e.target.value)}
                className="nutrifit-text-input"
              />
            </div>
          </div>
        </section>

        {/* Card 2: Activity & Goal */}
        <section className="nutrifit-card settings-card">
          <h2 className="card-section-title">Activity & goal</h2>

          {/* Activity Level */}
          <div className="options-subgroup">
            <div className="options-kicker">ACTIVITY LEVEL</div>
            <div className="activity-cards-grid">
              {ACTIVITY_LEVELS.map((act) => {
                const isSelected = activityLevel === act.label;
                return (
                  <div
                    key={act.id}
                    className={`selectable-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => setActivityLevel(act.label)}
                  >
                    <span className="card-primary-text">{act.label}</span>
                    <span className="card-secondary-text">{act.displayMul}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Goal */}
          <div className="options-subgroup">
            <div className="options-kicker">GOAL</div>
            <div className="goals-cards-grid">
              {GOALS.map((g) => {
                const isSelected = goal === g.label;
                return (
                  <div
                    key={g.id}
                    className={`selectable-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => setGoal(g.label)}
                  >
                    <span className="card-primary-text">{g.label}</span>
                    <span className="card-secondary-text">{g.displayOffset}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Card 3: Diet & Allergies */}
        <section className="nutrifit-card settings-card">
          <h2 className="card-section-title">Diet & allergies</h2>
          <div className="diet-chips-wrap">
            {DIET_OPTIONS.map((item) => {
              const isSelected = dietaryPreferences.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleDietOption(item)}
                  className={`diet-chip-btn ${isSelected ? 'selected' : ''}`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </section>

        {/* Save Changes Button */}
        <div className="settings-submit-row">
          <button type="submit" className="btn-save-changes">
            Save changes
          </button>
        </div>
      </form>

      <style>{`
        .nutrifit-settings-page {
          padding: 40px 48px 80px;
          max-width: 900px;
          margin: 0 auto;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .settings-header {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .settings-title {
          font-family: var(--font-heading);
          font-size: 2.6rem;
          font-weight: 800;
          letter-spacing: -0.025em;
          color: #ffffff;
        }

        .settings-subtitle {
          font-size: 0.98rem;
          color: #94a3b8;
        }

        .settings-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .settings-card {
          padding: 32px;
          gap: 20px;
        }

        .card-section-title {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 4px;
        }

        /* Gender Toggle */
        .gender-toggle-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .gender-toggle-btn {
          padding: 16px;
          border-radius: 12px;
          background: #111815;
          border: 1px solid #1a251f;
          color: #94a3b8;
          font-family: var(--font-heading);
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .gender-toggle-btn:hover {
          border-color: #2b3b32;
          color: #ffffff;
        }

        .gender-toggle-btn.active {
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.05);
          color: #ffffff;
          box-shadow: 0 0 16px rgba(16, 185, 129, 0.22);
        }

        /* 2x2 Numeric Inputs */
        .metrics-inputs-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .input-label {
          font-size: 0.88rem;
          color: #94a3b8;
          font-weight: 500;
        }

        .nutrifit-text-input {
          background: #111815;
          border: 1px solid #1a251f;
          border-radius: 12px;
          padding: 14px 16px;
          font-family: var(--font-heading);
          font-size: 1.05rem;
          color: #ffffff;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .nutrifit-text-input:focus {
          border-color: #10b981;
          box-shadow: 0 0 14px rgba(16, 185, 129, 0.25);
        }

        /* Activity & Goal */
        .options-subgroup {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .options-kicker {
          font-size: 0.74rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #64748b;
        }

        .activity-cards-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .goals-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .selectable-card {
          background: #111815;
          border: 1px solid #1a251f;
          border-radius: 12px;
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .selectable-card:hover {
          border-color: #2b3b32;
        }

        .selectable-card.selected {
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.05);
          box-shadow: 0 0 16px rgba(16, 185, 129, 0.25);
        }

        .card-primary-text {
          font-family: var(--font-heading);
          font-size: 1.02rem;
          font-weight: 700;
          color: #ffffff;
        }

        .card-secondary-text {
          font-size: 0.85rem;
          color: #94a3b8;
          font-weight: 500;
        }

        /* Diet Chips */
        .diet-chips-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .diet-chip-btn {
          padding: 10px 20px;
          border-radius: 9999px;
          border: 1px solid #1c2721;
          background: #141c18;
          color: #94a3b8;
          font-family: var(--font-heading);
          font-size: 0.92rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s ease;
        }

        .diet-chip-btn:hover {
          color: #ffffff;
          border-color: #2a3d34;
        }

        .diet-chip-btn.selected {
          background: #10b981;
          border-color: #10b981;
          color: #041f12;
          font-weight: 700;
          box-shadow: 0 0 14px rgba(16, 185, 129, 0.35);
        }

        /* Save Button */
        .settings-submit-row {
          padding-top: 10px;
        }

        .btn-save-changes {
          background: #10b981;
          color: #042013;
          font-family: var(--font-heading);
          font-size: 1rem;
          font-weight: 700;
          padding: 14px 28px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 18px rgba(16, 185, 129, 0.35);
        }

        .btn-save-changes:hover {
          background: #34d399;
          transform: translateY(-1px);
          box-shadow: 0 6px 22px rgba(16, 185, 129, 0.5);
        }

        @media (max-width: 768px) {
          .nutrifit-settings-page {
            padding: 24px 20px 60px;
          }
          .activity-cards-grid,
          .goals-cards-grid,
          .metrics-inputs-grid,
          .gender-toggle-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
