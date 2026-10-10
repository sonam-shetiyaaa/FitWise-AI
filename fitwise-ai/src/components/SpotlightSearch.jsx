import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { iosFeedback } from '../utils/iosHaptics';
import {
  Search,
  LayoutGrid,
  MessageSquare,
  ClipboardList,
  Settings,
  Dumbbell,
  Apple,
  Sparkles,
  ArrowRight,
  CornerDownLeft,
  X,
  Clock
} from 'lucide-react';

export const SpotlightSearch = ({ isOpen, onClose }) => {
  const { navigateTo, workouts, sendChatMessage, user } = useApp();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      iosFeedback.playIosClick(1400);
      iosFeedback.triggerHaptic('light');
    }
  }, [isOpen]);

  // Static searchable pages & dynamic items
  const pages = [
    { id: 'dashboard', title: 'Dashboard', category: 'Navigation', icon: LayoutGrid, desc: 'Daily calorie target, macro split & stats' },
    { id: 'coach', title: 'AI Coach Chat', category: 'Navigation', icon: MessageSquare, desc: 'Chat with your personalized AI fitness coach' },
    { id: 'plans', title: 'Meal & Workout Plans', category: 'Navigation', icon: ClipboardList, desc: 'Saved hypertrophy splits & nutrition plans' },
    { id: 'settings', title: 'Profile / Settings', category: 'Navigation', icon: Settings, desc: 'Adjust age, weight, target & dietary preferences' }
  ];

  const quickActions = [
    { id: 'action-split', title: 'Generate 4-Day Workout Split', category: 'AI Coach', icon: Sparkles, action: () => { navigateTo('coach'); sendChatMessage?.('Generate a 4-day workout split for muscle hypertrophy'); } },
    { id: 'action-macro', title: 'Critique My Daily Macro Split', category: 'AI Coach', icon: Sparkles, action: () => { navigateTo('coach'); sendChatMessage?.('Critique my daily macro split'); } },
    { id: 'action-snack', title: 'High-Protein Snack Under 200 Cal', category: 'AI Coach', icon: Sparkles, action: () => { navigateTo('coach'); sendChatMessage?.('Suggest a high-protein vegetarian snack under 200 calories'); } }
  ];

  // Exercises from workout list
  const exerciseItems = [];
  if (workouts) {
    workouts.forEach((w) => {
      w.exercises?.forEach((ex) => {
        if (!exerciseItems.some((e) => e.title === ex.name)) {
          exerciseItems.push({
            id: `ex-${ex.id}`,
            title: ex.name,
            category: `Workout • ${w.title}`,
            icon: Dumbbell,
            desc: `${ex.targetSets || 4} sets · ${ex.targetReps || '8-12 reps'}`,
            action: () => navigateTo('plans')
          });
        }
      });
    });
  }

  const allItems = [...pages, ...quickActions, ...exerciseItems];

  const filteredItems = query.trim() === ''
    ? allItems.slice(0, 6)
    : allItems.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase()) ||
        (item.desc && item.desc.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 8);

  // If query doesn't match predefined item, offer to ask AI Coach
  const hasDirectMatch = filteredItems.length > 0;
  const itemsToRender = query.trim() !== ''
    ? [
        ...filteredItems,
        {
          id: 'custom-ai-query',
          title: `Ask AI Coach: "${query}"`,
          category: 'AI Assistant',
          icon: Sparkles,
          isCustomAsk: true,
          action: () => {
            navigateTo('coach');
            sendChatMessage?.(query);
          }
        }
      ]
    : filteredItems;

  const handleSelect = (item) => {
    iosFeedback.playIosClick(1200);
    iosFeedback.triggerHaptic('medium');
    onClose();
    if (item.action) {
      item.action();
    } else {
      navigateTo(item.id);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      iosFeedback.playIosClick(1600);
      setSelectedIndex((prev) => (prev + 1) % itemsToRender.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      iosFeedback.playIosClick(1600);
      setSelectedIndex((prev) => (prev - 1 + itemsToRender.length) % itemsToRender.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (itemsToRender[selectedIndex]) {
        handleSelect(itemsToRender[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="spotlight-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="spotlight-modal" onClick={(e) => e.stopPropagation()} onKeyDown={handleKeyDown}>
        {/* Apple Spotlight Search Input Row */}
        <div className="spotlight-input-row">
          <Search size={20} className="spotlight-search-icon" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Spotlight Search workouts, macros, plans, or ask coach..."
            className="spotlight-input"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="spotlight-clear-btn"
              aria-label="Clear query"
            >
              <X size={15} />
            </button>
          )}
          <span className="spotlight-esc-pill">esc</span>
        </div>

        {/* Results Stream */}
        <div className="spotlight-results-list">
          {itemsToRender.map((item, idx) => {
            const Icon = item.icon;
            const isSelected = idx === selectedIndex;

            return (
              <div
                key={item.id}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`spotlight-item ${isSelected ? 'selected' : ''}`}
              >
                <div className="spotlight-item-left">
                  <div className={`spotlight-icon-wrap ${item.isCustomAsk ? 'icon-sparkle-glow' : ''}`}>
                    <Icon size={17} />
                  </div>
                  <div className="spotlight-item-text">
                    <span className="spotlight-item-title">{item.title}</span>
                    {item.desc && <span className="spotlight-item-desc">{item.desc}</span>}
                  </div>
                </div>

                <div className="spotlight-item-right">
                  <span className="spotlight-category-tag">{item.category}</span>
                  {isSelected && <CornerDownLeft size={14} className="spotlight-enter-hint" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Apple Spotlight Bottom Command Bar */}
        <div className="spotlight-footer">
          <div className="spotlight-hotkeys">
            <span className="hotkey-pill">↑↓</span>
            <span className="hotkey-label">Navigate</span>
            <span className="hotkey-pill">↵</span>
            <span className="hotkey-label">Select</span>
            <span className="hotkey-pill">esc</span>
            <span className="hotkey-label">Close</span>
          </div>
          <span className="spotlight-brand-badge">Apple Spotlight • NutriFit</span>
        </div>
      </div>

      <style>{`
        .spotlight-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 14vh;
          z-index: 9999;
          animation: spotlightFadeIn 0.2s ease-out;
        }

        @keyframes spotlightFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .spotlight-modal {
          width: 90%;
          max-width: 620px;
          background: rgba(13, 20, 16, 0.94);
          backdrop-filter: blur(32px) saturate(190%);
          -webkit-backdrop-filter: blur(32px) saturate(190%);
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 22px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.08);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          animation: spotlightPop 0.25s cubic-bezier(0.32, 0.72, 0, 1);
        }

        @keyframes spotlightPop {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(-12px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .spotlight-input-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .spotlight-search-icon {
          color: #10b981;
          flex-shrink: 0;
        }

        .spotlight-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #ffffff;
          font-family: var(--font-heading);
          font-size: 1.08rem;
          font-weight: 500;
        }

        .spotlight-input::placeholder {
          color: #64748b;
          font-size: 0.98rem;
        }

        .spotlight-clear-btn {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: #94a3b8;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .spotlight-esc-pill {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.14);
          color: #94a3b8;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          padding: 2px 7px;
          border-radius: 6px;
        }

        .spotlight-results-list {
          max-height: 380px;
          overflow-y: auto;
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .spotlight-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.12s ease;
          border: 1px solid transparent;
        }

        .spotlight-item.selected {
          background: rgba(16, 185, 129, 0.14);
          border-color: rgba(16, 185, 129, 0.3);
        }

        .spotlight-item-left {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .spotlight-icon-wrap {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #10b981;
          flex-shrink: 0;
        }

        .icon-sparkle-glow {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(6, 182, 212, 0.3));
          color: #34d399;
          box-shadow: 0 0 12px rgba(16, 185, 129, 0.3);
        }

        .spotlight-item-text {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .spotlight-item-title {
          font-family: var(--font-heading);
          font-size: 0.94rem;
          font-weight: 600;
          color: #ffffff;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .spotlight-item-desc {
          font-size: 0.78rem;
          color: #94a3b8;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .spotlight-item-right {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .spotlight-category-tag {
          font-size: 0.72rem;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .spotlight-enter-hint {
          color: #10b981;
        }

        .spotlight-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 18px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(0, 0, 0, 0.2);
        }

        .spotlight-hotkeys {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .hotkey-pill {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #94a3b8;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 1px 5px;
          border-radius: 4px;
        }

        .hotkey-label {
          font-size: 0.74rem;
          color: #64748b;
          margin-right: 8px;
        }

        .spotlight-brand-badge {
          font-size: 0.74rem;
          color: #64748b;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};
