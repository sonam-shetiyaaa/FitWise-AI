import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../context/AppContext';
import { X, Plus, Utensils, Sparkles, Check } from 'lucide-react';

const presetHealthyFoods = [
  { name: "Egg White Scramble & Avocado", amount: "3 whites + 1/4 avo", calories: 195, protein: 18, carbs: 4, fat: 12 },
  { name: "Whey Protein Shake (Water)", amount: "1 scoop (32g)", calories: 130, protein: 26, carbs: 3, fat: 1.5 },
  { name: "Steamed Jasmine Rice & Veggies", amount: "1 cup cooked", calories: 210, protein: 4, carbs: 45, fat: 0.5 },
  { name: "Grilled Chicken Breast Fillet", amount: "150g portion", calories: 240, protein: 46, carbs: 0, fat: 4 },
  { name: "Almonds & Dried Cranberries", amount: "30g handful", calories: 160, protein: 4, carbs: 16, fat: 10 }
];

export const AddMealModal = ({ isOpen, onClose, defaultMealKey = 'breakfast' }) => {
  const { addMealItem } = useApp();
  const [selectedMeal, setSelectedMeal] = useState(defaultMealKey);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');

  useEffect(() => {
    if (defaultMealKey) {
      setSelectedMeal(defaultMealKey);
    }
  }, [defaultMealKey, isOpen]);

  // Lock background scroll when modal is open and restore on close
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

  const handleSelectPreset = (food) => {
    setName(food.name);
    setAmount(food.amount);
    setCalories(food.calories.toString());
    setProtein(food.protein.toString());
    setCarbs(food.carbs.toString());
    setFat(food.fat.toString());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    addMealItem(selectedMeal, {
      name,
      amount: amount || "1 serving",
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0
    });

    // Reset
    setName('');
    setAmount('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
    onClose();
  };

  return createPortal(
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="meal-modal glass-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-top">
          <div className="modal-title-group">
            <Utensils size={20} className="text-emerald" />
            <h3 className="modal-heading">Log Food or Recipe</h3>
          </div>
          <button type="button" className="btn-close-modal" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Meal Selector Tabs */}
        <div className="meal-tabs">
          {[
            { id: 'breakfast', label: 'Breakfast' },
            { id: 'lunch', label: 'Lunch' },
            { id: 'dinner', label: 'Dinner' },
            { id: 'snacks', label: 'Snacks' }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`meal-tab-btn ${selectedMeal === tab.id ? 'active' : ''}`}
              onClick={() => setSelectedMeal(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Quick Presets */}
        <div className="preset-strip">
          <span className="preset-label"><Sparkles size={14} /> Quick Add:</span>
          <div className="preset-chips">
            {presetHealthyFoods.map((food, idx) => (
              <button
                key={idx}
                type="button"
                className="preset-chip"
                onClick={() => handleSelectPreset(food)}
              >
                {food.name.split(' ')[0]} {food.name.split(' ')[1]} ({food.calories} kcal)
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="meal-form">
          <div className="form-group">
            <label className="form-label">Food / Meal Name *</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Grilled Salmon Bowl"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Portion / Serving</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 150g or 1 cup"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Calories (kcal) *</label>
              <input
                type="number"
                required
                className="form-input"
                placeholder="e.g. 350"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
              />
            </div>
          </div>

          <div className="form-macros-row">
            <div className="form-group macro-group">
              <label className="form-label text-protein">Protein (g)</label>
              <input
                type="number"
                className="form-input"
                placeholder="0"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
              />
            </div>

            <div className="form-group macro-group">
              <label className="form-label text-carbs">Carbs (g)</label>
              <input
                type="number"
                className="form-input"
                placeholder="0"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
              />
            </div>

            <div className="form-group macro-group">
              <label className="form-label text-fat">Fat (g)</label>
              <input
                type="number"
                className="form-input"
                placeholder="0"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Plus size={18} />
              <span>Add to {selectedMeal.charAt(0).toUpperCase() + selectedMeal.slice(1)}</span>
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(4, 7, 18, 0.85);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
          overflow-y: auto;
        }
        .meal-modal {
          width: 100%;
          max-width: 540px;
          background: #111827;
          border: 1px solid var(--border-glow);
          border-radius: 24px;
          padding: 28px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.85), 0 0 30px rgba(16, 185, 129, 0.2);
          animation: modalScaleIn 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
        }
        .modal-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          padding-bottom: 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .modal-title-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .modal-heading {
          font-size: 1.25rem;
          color: #ffffff;
          margin: 0;
        }
        .btn-close-modal {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--border-subtle);
          color: var(--text-muted);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--ease-smooth);
        }
        .btn-close-modal:hover {
          color: #ffffff;
          background: rgba(239, 68, 68, 0.2);
          border-color: rgba(239, 68, 68, 0.4);
        }
        .meal-tabs {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          margin-bottom: 16px;
        }
        .meal-tab-btn {
          padding: 8px 4px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          color: var(--text-muted);
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: var(--ease-smooth);
        }
        .meal-tab-btn.active {
          background: rgba(16, 185, 129, 0.18);
          border-color: var(--border-glow);
          color: #34d399;
        }
        .preset-strip {
          margin-bottom: 20px;
        }
        .preset-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.76rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #38bdf8;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .preset-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .preset-chip {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          color: var(--text-muted);
          font-size: 0.78rem;
          padding: 4px 10px;
          border-radius: 999px;
          cursor: pointer;
          transition: var(--ease-smooth);
        }
        .preset-chip:hover {
          background: rgba(56, 189, 248, 0.15);
          border-color: rgba(56, 189, 248, 0.4);
          color: #ffffff;
        }
        .meal-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .form-macros-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 12px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-label {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-muted);
        }
        .text-protein {
          color: #34d399;
        }
        .text-carbs {
          color: #38bdf8;
        }
        .text-fat {
          color: #f59e0b;
        }
        .form-input {
          background: #1b243b;
          border: 1px solid var(--border-subtle);
          color: #ffffff;
          padding: 10px 14px;
          border-radius: 10px;
          font-family: var(--font-sans);
          font-size: 0.92rem;
          outline: none;
          transition: var(--ease-smooth);
        }
        .form-input:focus {
          border-color: var(--border-glow);
          box-shadow: 0 0 12px rgba(16, 185, 129, 0.2);
        }
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 8px;
        }
      `}</style>
    </div>,
    document.body
  );
};
