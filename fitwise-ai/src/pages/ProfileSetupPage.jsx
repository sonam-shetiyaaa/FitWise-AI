import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  fitnessGoalsList,
  activityLevelsList,
  experienceLevelsList,
  workoutLocationsList,
  workoutDurationsList,
  foodPreferencesList,
  dietaryRestrictionsList,
  cuisinesList
} from '../data/mockData';
import {
  User,
  Activity,
  Apple,
  Dumbbell,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Flame,
  Droplets,
  Moon,
  Scale,
  Ruler,
  Compass
} from 'lucide-react';

export const ProfileSetupPage = () => {
  const { user, updateProfile, navigateTo } = useApp();

  // Controlled form state
  const [formData, setFormData] = useState({
    name: user.name || '',
    age: user.age || 26,
    gender: user.gender || 'Male',
    height: user.height || 178,
    weight: user.weight || 74.5,
    fitnessGoal: user.fitnessGoal || fitnessGoalsList[0],
    activityLevel: user.activityLevel || activityLevelsList[2],
    fitnessExperience: user.fitnessExperience || experienceLevelsList[1],
    workoutLocation: user.workoutLocation || workoutLocationsList[0],
    workoutDuration: user.workoutDuration || workoutDurationsList[2],
    foodPreference: user.foodPreference || foodPreferencesList[0],
    dietaryRestrictions: user.dietaryRestrictions || dietaryRestrictionsList[0],
    preferredCuisine: user.preferredCuisine || cuisinesList[0],
    waterIntake: user.waterIntake || '3.5 Liters',
    sleepDuration: user.sleepDuration || '7-8 hours'
  });

  const [activeStep, setActiveStep] = useState(1);

  // Dynamic calculations
  const heightInMeters = Number(formData.height) / 100;
  const bmi = heightInMeters > 0 ? (Number(formData.weight) / (heightInMeters * heightInMeters)).toFixed(1) : 22.5;

  const getBmiCategory = (val) => {
    if (val < 18.5) return { label: 'Underweight', color: 'cyan' };
    if (val < 25) return { label: 'Optimal Athletic Range', color: 'emerald' };
    if (val < 30) return { label: 'Slight Surplus', color: 'amber' };
    return { label: 'High Range', color: 'orange' };
  };

  // Estimated daily calories based on Harris-Benedict approximation
  const estimatedCalories = Math.round(
    (10 * Number(formData.weight) + 6.25 * Number(formData.height) - 5 * Number(formData.age) + 5) * 1.55
  );

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    navigateTo('dashboard');
  };

  return (
    <div className="profile-page">
      <div className="container">
        {/* Page Header */}
        <div className="profile-header">
          <div className="pill-badge">
            <Sparkles size={14} className="text-emerald" />
            <span>AI Calibration Engine</span>
          </div>
          <h1 className="profile-heading">Personalize Your Fitness & Nutrition Profile</h1>
          <p className="profile-sub">
            FitWise AI adjusts your daily macros, resistance training load, and recovery schedule based on these exact metrics.
          </p>

          {/* Stepper Tabs */}
          <div className="steps-nav">
            <button
              className={`step-nav-btn ${activeStep === 1 ? 'active' : ''}`}
              onClick={() => setActiveStep(1)}
            >
              <span className="step-badge">1</span>
              <span>Biometrics & Body</span>
            </button>
            <button
              className={`step-nav-btn ${activeStep === 2 ? 'active' : ''}`}
              onClick={() => setActiveStep(2)}
            >
              <span className="step-badge">2</span>
              <span>Training & Goals</span>
            </button>
            <button
              className={`step-nav-btn ${activeStep === 3 ? 'active' : ''}`}
              onClick={() => setActiveStep(3)}
            >
              <span className="step-badge">3</span>
              <span>Diet & Lifestyle</span>
            </button>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="profile-layout-grid">
          {/* Main Form */}
          <div className="form-card glass-panel">
            <form onSubmit={handleSubmit}>
              {/* STEP 1: BIOMETRICS & BODY */}
              {activeStep === 1 && (
                <div className="step-content animate-fade-in">
                  <div className="step-header">
                    <User size={22} className="text-emerald" />
                    <div>
                      <h3 className="step-title">Biometrics & Demographics</h3>
                      <p className="step-desc">Fundamental physiological data for calorie and workload modeling.</p>
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        placeholder="e.g. John Doe"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Age (years) *</label>
                      <input
                        type="number"
                        min="14"
                        max="100"
                        required
                        className="form-input"
                        value={formData.age}
                        onChange={(e) => handleChange('age', e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Biological Gender *</label>
                      <select
                        className="form-input"
                        value={formData.gender}
                        onChange={(e) => handleChange('gender', e.target.value)}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Non-Binary">Non-Binary</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Height (cm) *</label>
                      <div className="input-unit-wrap">
                        <input
                          type="number"
                          min="100"
                          max="250"
                          required
                          className="form-input"
                          value={formData.height}
                          onChange={(e) => handleChange('height', e.target.value)}
                        />
                        <span className="input-unit">cm</span>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Current Weight (kg) *</label>
                      <div className="input-unit-wrap">
                        <input
                          type="number"
                          step="0.5"
                          min="30"
                          max="250"
                          required
                          className="form-input"
                          value={formData.weight}
                          onChange={(e) => handleChange('weight', e.target.value)}
                        />
                        <span className="input-unit">kg</span>
                      </div>
                    </div>
                  </div>

                  <div className="step-actions">
                    <button
                      type="button"
                      className="btn btn-primary ml-auto"
                      onClick={() => setActiveStep(2)}
                    >
                      <span>Continue to Training</span>
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: TRAINING & GOALS */}
              {activeStep === 2 && (
                <div className="step-content animate-fade-in">
                  <div className="step-header">
                    <Dumbbell size={22} className="text-emerald" />
                    <div>
                      <h3 className="step-title">Training Preferences & Goals</h3>
                      <p className="step-desc">Configure your resistance routines, session length, and gym environment.</p>
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group span-2">
                      <label className="form-label">Primary Fitness Goal *</label>
                      <select
                        className="form-input"
                        value={formData.fitnessGoal}
                        onChange={(e) => handleChange('fitnessGoal', e.target.value)}
                      >
                        {fitnessGoalsList.map((g, idx) => (
                          <option key={idx} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Current Activity Level *</label>
                      <select
                        className="form-input"
                        value={formData.activityLevel}
                        onChange={(e) => handleChange('activityLevel', e.target.value)}
                      >
                        {activityLevelsList.map((a, idx) => (
                          <option key={idx} value={a}>{a}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Fitness Experience *</label>
                      <select
                        className="form-input"
                        value={formData.fitnessExperience}
                        onChange={(e) => handleChange('fitnessExperience', e.target.value)}
                      >
                        {experienceLevelsList.map((exp, idx) => (
                          <option key={idx} value={exp}>{exp}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Workout Location *</label>
                      <select
                        className="form-input"
                        value={formData.workoutLocation}
                        onChange={(e) => handleChange('workoutLocation', e.target.value)}
                      >
                        {workoutLocationsList.map((loc, idx) => (
                          <option key={idx} value={loc}>{loc}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Preferred Session Duration *</label>
                      <select
                        className="form-input"
                        value={formData.workoutDuration}
                        onChange={(e) => handleChange('workoutDuration', e.target.value)}
                      >
                        {workoutDurationsList.map((dur, idx) => (
                          <option key={idx} value={dur}>{dur}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="step-actions">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setActiveStep(1)}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary ml-auto"
                      onClick={() => setActiveStep(3)}
                    >
                      <span>Continue to Diet & Lifestyle</span>
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: DIET & LIFESTYLE */}
              {activeStep === 3 && (
                <div className="step-content animate-fade-in">
                  <div className="step-header">
                    <Apple size={22} className="text-emerald" />
                    <div>
                      <h3 className="step-title">Dietary Preferences & Recovery</h3>
                      <p className="step-desc">Establish your nutritional boundary lines, cuisines, and sleep targets.</p>
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Food Preference *</label>
                      <select
                        className="form-input"
                        value={formData.foodPreference}
                        onChange={(e) => handleChange('foodPreference', e.target.value)}
                      >
                        {foodPreferencesList.map((f, idx) => (
                          <option key={idx} value={f}>{f}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Dietary Restrictions *</label>
                      <select
                        className="form-input"
                        value={formData.dietaryRestrictions}
                        onChange={(e) => handleChange('dietaryRestrictions', e.target.value)}
                      >
                        {dietaryRestrictionsList.map((r, idx) => (
                          <option key={idx} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Preferred Cuisine Style *</label>
                      <select
                        className="form-input"
                        value={formData.preferredCuisine}
                        onChange={(e) => handleChange('preferredCuisine', e.target.value)}
                      >
                        {cuisinesList.map((c, idx) => (
                          <option key={idx} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Daily Water Intake Target *</label>
                      <select
                        className="form-input"
                        value={formData.waterIntake}
                        onChange={(e) => handleChange('waterIntake', e.target.value)}
                      >
                        <option value="2.0 Liters">2.0 Liters (~8 glasses)</option>
                        <option value="2.5 Liters">2.5 Liters (~10 glasses)</option>
                        <option value="3.0 Liters">3.0 Liters (~12 glasses)</option>
                        <option value="3.5 Liters">3.5 Liters (Recommended for athletes)</option>
                        <option value="4.0 Liters">4.0 Liters (High perspiration)</option>
                      </select>
                    </div>

                    <div className="form-group span-2">
                      <label className="form-label">Target Sleep Duration *</label>
                      <select
                        className="form-input"
                        value={formData.sleepDuration}
                        onChange={(e) => handleChange('sleepDuration', e.target.value)}
                      >
                        <option value="< 6 hours">Under 6 hours (Short sleep)</option>
                        <option value="6-7 hours">6 - 7 hours</option>
                        <option value="7-8 hours">7 - 8 hours (Optimal recovery)</option>
                        <option value="8-9 hours">8 - 9 hours (Athletic peak)</option>
                        <option value="9+ hours">9+ hours</option>
                      </select>
                    </div>
                  </div>

                  <div className="step-actions">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setActiveStep(2)}
                    >
                      Back
                    </button>
                    <button type="submit" className="btn btn-primary btn-lg ml-auto">
                      <CheckCircle2 size={20} />
                      <span>Save Profile & Launch AI Plan</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Real-time Physiological Preview Sidebar */}
          <div className="preview-sidebar">
            <div className="preview-card glass-panel-glow">
              <div className="preview-top">
                <Sparkles size={18} className="text-emerald" />
                <span className="preview-badge">Live AI Model Preview</span>
              </div>

              <h4 className="athlete-name">{formData.name || 'Your Profile'}</h4>
              <span className="athlete-goal-tag">{formData.fitnessGoal}</span>

              {/* Metric 1: BMI */}
              <div className="metric-box">
                <div className="metric-row">
                  <span className="metric-lbl"><Scale size={16} /> Calculated BMI</span>
                  <span className="metric-val">{bmi}</span>
                </div>
                <div className="bmi-badge-pill">
                  <span className={`badge badge-${getBmiCategory(bmi).color}`}>
                    {getBmiCategory(bmi).label}
                  </span>
                </div>
              </div>

              {/* Metric 2: Estimated Daily Calories */}
              <div className="metric-box">
                <div className="metric-row">
                  <span className="metric-lbl"><Flame size={16} /> Target Calories</span>
                  <span className="metric-val text-amber">{estimatedCalories} kcal</span>
                </div>
                <div className="macro-distribution-bar">
                  <div className="macro-bar p-bar" title="Protein 30%" style={{ width: '30%' }} />
                  <div className="macro-bar c-bar" title="Carbs 45%" style={{ width: '45%' }} />
                  <div className="macro-bar f-bar" title="Fat 25%" style={{ width: '25%' }} />
                </div>
                <div className="macro-labels">
                  <span className="m-tag m-prot">Protein ~{Math.round((estimatedCalories * 0.3) / 4)}g</span>
                  <span className="m-tag m-carb">Carbs ~{Math.round((estimatedCalories * 0.45) / 4)}g</span>
                  <span className="m-tag m-fat">Fat ~{Math.round((estimatedCalories * 0.25) / 9)}g</span>
                </div>
              </div>

              {/* Quick Summary list */}
              <div className="preview-summary-list">
                <div className="sum-item">
                  <span className="sum-key"><Droplets size={14} /> Hydration Target:</span>
                  <span className="sum-val">{formData.waterIntake}</span>
                </div>
                <div className="sum-item">
                  <span className="sum-key"><Moon size={14} /> Sleep Window:</span>
                  <span className="sum-val">{formData.sleepDuration}</span>
                </div>
                <div className="sum-item">
                  <span className="sum-key"><Dumbbell size={14} /> Workout Split:</span>
                  <span className="sum-val">{formData.workoutLocation}</span>
                </div>
                <div className="sum-item">
                  <span className="sum-key"><Apple size={14} /> Dietary Focus:</span>
                  <span className="sum-val">{formData.foodPreference.split(' ')[0]}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .profile-page {
          padding: 40px 0 60px;
        }
        .profile-header {
          text-align: center;
          margin-bottom: 36px;
        }
        .pill-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 14px;
          border-radius: 999px;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.3);
          font-size: 0.8rem;
          color: #34d399;
          font-weight: 600;
          margin-bottom: 14px;
        }
        .profile-heading {
          font-size: 2.3rem;
          margin-bottom: 10px;
        }
        .profile-sub {
          font-size: 1rem;
          color: var(--text-muted);
          max-width: 650px;
          margin: 0 auto 28px;
        }
        .steps-nav {
          display: inline-flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          padding: 6px;
          border-radius: 16px;
          gap: 6px;
        }
        .step-nav-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 12px;
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-family: var(--font-heading);
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--ease-smooth);
        }
        .step-nav-btn.active {
          background: #1e293b;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        .step-badge {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
        }
        .step-nav-btn.active .step-badge {
          background: var(--primary);
          color: #02170e;
          font-weight: 700;
        }
        .profile-layout-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 28px;
          align-items: start;
        }
        .form-card {
          padding: 36px 32px;
          border-radius: 24px;
        }
        .step-header {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          margin-bottom: 28px;
          padding-bottom: 18px;
          border-bottom: 1px solid var(--border-subtle);
        }
        .step-title {
          font-size: 1.35rem;
          margin-bottom: 4px;
        }
        .step-desc {
          font-size: 0.88rem;
          color: var(--text-muted);
        }
        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 30px;
        }
        .span-2 {
          grid-column: span 2;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .form-label {
          font-size: 0.86rem;
          font-weight: 600;
          color: #e2e8f0;
        }
        .form-input {
          background: #1b243b;
          border: 1px solid var(--border-subtle);
          color: #ffffff;
          padding: 12px 16px;
          border-radius: 12px;
          font-family: var(--font-sans);
          font-size: 0.95rem;
          outline: none;
          transition: var(--ease-smooth);
        }
        .form-input:focus {
          border-color: var(--border-glow);
          box-shadow: 0 0 16px rgba(16, 185, 129, 0.25);
        }
        .input-unit-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-unit-wrap .form-input {
          width: 100%;
          padding-right: 46px;
        }
        .input-unit {
          position: absolute;
          right: 14px;
          color: var(--text-dim);
          font-size: 0.85rem;
          font-weight: 600;
          pointer-events: none;
        }
        .step-actions {
          display: flex;
          align-items: center;
          padding-top: 16px;
          border-top: 1px solid var(--border-subtle);
        }
        .ml-auto {
          margin-left: auto;
        }

        /* Sidebar Preview */
        .preview-card {
          padding: 24px;
          border-radius: 20px;
          position: sticky;
          top: 96px;
        }
        .preview-top {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 14px;
        }
        .preview-badge {
          font-size: 0.76rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #34d399;
          font-weight: 700;
        }
        .athlete-name {
          font-size: 1.4rem;
          margin-bottom: 4px;
        }
        .athlete-goal-tag {
          font-size: 0.82rem;
          color: #38bdf8;
          font-weight: 600;
          display: block;
          margin-bottom: 18px;
        }
        .metric-box {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          padding: 12px 14px;
          margin-bottom: 14px;
        }
        .metric-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .metric-lbl {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
          color: var(--text-muted);
        }
        .metric-val {
          font-family: var(--font-heading);
          font-size: 1.15rem;
          font-weight: 700;
          color: #ffffff;
        }
        .text-amber {
          color: #fbbf24;
        }
        .macro-distribution-bar {
          display: flex;
          height: 6px;
          border-radius: 999px;
          overflow: hidden;
          margin: 8px 0;
          background: rgba(255, 255, 255, 0.08);
        }
        .p-bar {
          background: #10b981;
        }
        .c-bar {
          background: #38bdf8;
        }
        .f-bar {
          background: #f59e0b;
        }
        .macro-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.7rem;
          color: var(--text-dim);
          font-weight: 600;
        }
        .m-prot {
          color: #34d399;
        }
        .m-carb {
          color: #38bdf8;
        }
        .m-fat {
          color: #fbbf24;
        }
        .preview-summary-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          border-top: 1px solid var(--border-subtle);
          padding-top: 14px;
        }
        .sum-item {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
        }
        .sum-key {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--text-dim);
        }
        .sum-val {
          color: #ffffff;
          font-weight: 600;
        }

        @media (max-width: 960px) {
          .profile-layout-grid {
            grid-template-columns: 1fr;
          }
          .preview-sidebar {
            order: -1;
          }
          .preview-card {
            position: static;
          }
        }
        @media (max-width: 640px) {
          .form-grid-2 {
            grid-template-columns: 1fr;
          }
          .span-2 {
            grid-column: span 1;
          }
          .steps-nav {
            flex-direction: column;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};
