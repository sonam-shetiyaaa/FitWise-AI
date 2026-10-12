import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Trash2,
  Dumbbell,
  Apple,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  X,
  Calendar,
  Layers,
  ChevronRight,
  MessageSquare,
  ArrowUpRight
} from 'lucide-react';

export const PlansPage = () => {
  const { navigateTo, savedPlans = [], deleteSavedPlan, addSavedPlan, showToast, openPlanInChat } = useApp();
  const [activeFilter, setActiveFilter] = useState('All'); // 'All' | 'Meal' | 'Workout'
  const [selectedPlanModal, setSelectedPlanModal] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  const mealCount = savedPlans.filter((p) => p.type?.toLowerCase() === 'meal').length;
  const workoutCount = savedPlans.filter((p) => p.type?.toLowerCase() === 'workout').length;

  const filteredPlans = savedPlans.filter((plan) => {
    if (activeFilter === 'All') return true;
    return plan.type?.toLowerCase() === activeFilter.toLowerCase();
  });

  const handleLoadDemoPlan = () => {
    const demo = {
      id: `plan-demo-${Date.now()}`,
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
    showToast('Sample workout plan loaded into Saved Plans!', 'success');
  };

  // Pre-process markdown to clean up squashed bullet points and normalize spacing
  const cleanMarkdownText = (raw) => {
    if (!raw) return '';
    return raw
      // Put double newlines before headers
      .replace(/([^\n])\s*(#{1,6}\s)/g, '$1\n\n$2')
      .replace(/([^\n])\s*(---|—{2,})\s*/g, '$1\n\n---\n\n')
      // Break inline squashed bullets: e.g. "rest) * **Seated..." -> "rest)\n* **Seated..."
      .replace(/\s+\*\s+\*\*/g, '\n* **')
      .replace(/\s+-\s+\*\*/g, '\n- **')
      .replace(/\s+•\s+\*\*/g, '\n* **')
      // Clean inline focus cues: e.g. "* *Focus:*...", "* **Focus:**...", "• Focus:..."
      .replace(/\s+\*\s+\*(Focus|Note|Target|Tip|Rest|Cues?):\*/gi, ' • $1:')
      .replace(/\s+\*\s+\*\*(Focus|Note|Target|Tip|Rest|Cues?):\*\*/gi, ' • $1:')
      .replace(/\s+-\s+\*(Focus|Note|Target|Tip|Rest|Cues?):\*/gi, ' • $1:')
      .replace(/\s+-\s+\*\*(Focus|Note|Target|Tip|Rest|Cues?):\*\*/gi, ' • $1:')
      // Separate bullet points starting with * or - followed by text
      .replace(/([^\n])\s*(\*\s+[A-Za-z0-9])/g, '$1\n* $2')
      .replace(/([^\n])\s*(-\s+[A-Za-z0-9])/g, '$1\n- $2')
      .replace(/([^\n])\s*(\d+\.\s+[A-Za-z0-9])/g, '$1\n$2')
      // Clean up multiple asterisks
      .replace(/\*{4,}/g, '**')
      .trim();
  };

  // Convert inline markdown formatting to clean HTML without any raw * or #
  const formatInlineClean = (text) => {
    if (!text) return '';
    return text
      // Bold + Italic ***text***
      .replace(/\*\*\*(.*?)\*\*\*/g, '<strong class="text-emerald-bold"><em>$1</em></strong>')
      // Bold **text**
      .replace(/\*\*(.*?)\*\*/g, (match, p1) => {
        const lower = p1.toLowerCase();
        if (
          lower.includes('protein') ||
          lower.includes('calorie') ||
          lower.includes('carb') ||
          lower.includes('fat') ||
          lower.includes('kcal') ||
          lower.includes('hypertrophy') ||
          lower.includes('split') ||
          lower.includes('sets') ||
          lower.includes('reps') ||
          lower.includes('focus')
        ) {
          return `<strong class="text-emerald-bold">${p1}</strong>`;
        }
        return `<strong>${p1}</strong>`;
      })
      // Italic *text* or _text_
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/_([^_]+)_/g, '<em>$1</em>')
      // Strip any leftover raw asterisks, bullets or hashes
      .replace(/^[\*\-•]\s*/, '')
      .replace(/\s\*\s/g, ' • ')
      .replace(/#{1,6}\s*/g, '')
      .replace(/[*#]/g, '')
      .trim();
  };

  // Clean pure text for preview snippets
  const stripMarkdownSymbols = (text) => {
    if (!text) return '';
    return text
      .replace(/#{1,6}\s*/g, '')
      .replace(/\*{1,4}/g, '')
      .replace(/_{1,2}/g, '')
      .replace(/`{1,3}/g, '')
      .replace(/[*#]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Format bold key terms in schedule details
  const formatPlanDetail = (text) => {
    if (!text) return '';
    return formatInlineClean(text);
  };

  const handleCopyPlan = (plan) => {
    if (!plan) return;
    let text = `${plan.title} (${plan.type})\n${plan.description ? stripMarkdownSymbols(plan.description) : ''}\n\n`;
    if (plan.schedule && plan.schedule.length > 0) {
      plan.schedule.forEach((item) => {
        text += `• ${item.day} - ${item.focus}: ${stripMarkdownSymbols(item.details)}\n`;
      });
    } else if (plan.fullText) {
      text += stripMarkdownSymbols(cleanMarkdownText(plan.fullText));
    }
    navigator.clipboard?.writeText(text);
    setIsCopied(true);
    showToast('Plan copied to clipboard!', 'info');
    setTimeout(() => setIsCopied(false), 2200);
  };

  // Exact markdown renderer matching ChatbotPage - shows the chat response itself
  const renderFormattedMarkdown = (text) => {
    if (!text) return null;
    const cleaned = cleanMarkdownText(text);
    const lines = cleaned.split('\n');
    const elements = [];
    let currentList = [];
    let listKey = 0;

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={`ul-${listKey++}`} className="chat-formatted-ul">
            {currentList.map((item, idx) => (
              <li key={idx} className="chat-formatted-li">
                <span className="li-dot">•</span>
                <span className="chat-formatted-li-text" dangerouslySetInnerHTML={{ __html: formatInlineClean(item) }} />
              </li>
            ))}
          </ul>
        );
        currentList = [];
      }
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      if (!trimmed) {
        flushList();
        elements.push(<div key={`gap-${index}`} className="chat-block-gap" />);
        return;
      }

      if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
        flushList();
        elements.push(<hr key={`hr-${index}`} className="chat-msg-divider" />);
        return;
      }

      if (trimmed.startsWith('#### ')) {
        flushList();
        elements.push(
          <h4 key={`h4-${index}`} className="chat-msg-h4">
            <span dangerouslySetInnerHTML={{ __html: formatInlineClean(trimmed.replace(/^####\s+/, '')) }} />
          </h4>
        );
        return;
      }

      if (trimmed.startsWith('### ')) {
        flushList();
        elements.push(
          <h3 key={`h3-${index}`} className="chat-msg-h3">
            <span dangerouslySetInnerHTML={{ __html: formatInlineClean(trimmed.replace(/^###\s+/, '')) }} />
          </h3>
        );
        return;
      }

      if (trimmed.startsWith('## ')) {
        flushList();
        elements.push(
          <h2 key={`h2-${index}`} className="chat-msg-h2">
            <span dangerouslySetInnerHTML={{ __html: formatInlineClean(trimmed.replace(/^##\s+/, '')) }} />
          </h2>
        );
        return;
      }

      if (trimmed.startsWith('# ')) {
        flushList();
        elements.push(
          <h2 key={`h1-${index}`} className="chat-msg-h2">
            <span dangerouslySetInnerHTML={{ __html: formatInlineClean(trimmed.replace(/^#\s+/, '')) }} />
          </h2>
        );
        return;
      }

      if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
        currentList.push(trimmed.replace(/^[\*\-•]\s*/, ''));
        return;
      }

      const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
      if (numMatch) {
        flushList();
        elements.push(
          <div key={`num-${index}`} className="chat-msg-num-item">
            <span className="num-counter">{numMatch[1]}.</span>
            <span dangerouslySetInnerHTML={{ __html: formatInlineClean(numMatch[2]) }} />
          </div>
        );
        return;
      }

      flushList();
      elements.push(
        <p key={`p-${index}`} className="chat-msg-p">
          <span dangerouslySetInnerHTML={{ __html: formatInlineClean(trimmed) }} />
        </p>
      );
    });

    flushList();
    return elements;
  };

  return (
    <div className="nutrifit-plans-page animate-fade-in">
      <header className="plans-header">
        <div className="plans-header-top">
          <div>
            <h1 className="plans-title">Meal & Workout Plans</h1>
            <p className="plans-sub">
              Your saved custom hypertrophy routines and precision nutritional protocols.
            </p>
          </div>
          <button
            onClick={() => navigateTo('coach')}
            className="btn-ask-coach-top"
            title="Ask AI Coach for a tailored split or diet"
          >
            <Sparkles size={16} />
            <span>Generate New Plan with AI</span>
          </button>
        </div>
      </header>

      {/* Filter Pills */}
      <div className="plans-filter-row">
        {[
          { id: 'All', label: 'All Plans', count: savedPlans.length },
          { id: 'Workout', label: 'Workouts', count: workoutCount },
          { id: 'Meal', label: 'Nutrition & Meals', count: mealCount }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`plans-filter-btn ${activeFilter === tab.id ? 'active' : ''}`}
          >
            <span>{tab.label}</span>
            <span className="plans-filter-count">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      {filteredPlans.length === 0 ? (
        <div className="nutrifit-card empty-plans-card">
          <div className="empty-plans-icon-wrap">
            <Sparkles size={32} className="text-emerald" />
          </div>
          <h3 className="empty-plans-heading">No saved {activeFilter === 'All' ? '' : activeFilter.toLowerCase()} plans yet</h3>
          <p className="empty-plans-text">
            Ask your AI coach for custom workout splits or high-protein meals, then tap "Save to My Plans" to access them anytime.
          </p>
          <div className="empty-plans-actions">
            <button
              onClick={() => navigateTo('coach')}
              className="btn-open-coach-plans"
            >
              <Sparkles size={16} />
              <span>Ask AI Coach</span>
            </button>
            <button
              onClick={handleLoadDemoPlan}
              className="btn-load-demo-plan"
              title="Quickly preview a saved plan"
            >
              <Layers size={16} />
              <span>Load Sample Plan</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="saved-plans-grid">
          {filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className="nutrifit-card plan-item-card is-interactive-card"
              onClick={() => setSelectedPlanModal(plan)}
              role="button"
              tabIndex={0}
              aria-label={`View ${plan.title}`}
            >
              <div className="plan-card-header">
                <div className="plan-badge-title">
                  <span className={`plan-type-badge ${plan.type === 'Workout' ? 'type-workout' : 'type-meal'}`}>
                    {plan.type === 'Workout' ? <Dumbbell size={14} /> : <Apple size={14} />}
                    <span>{plan.type}</span>
                  </span>
                  <div>
                    <h3 className="plan-name">{stripMarkdownSymbols(plan.title)}</h3>
                    {plan.date && (
                      <span className="plan-date-meta">
                        <Calendar size={12} /> {plan.date}
                      </span>
                    )}
                  </div>
                </div>

                <div className="plan-card-header-actions" onClick={(e) => e.stopPropagation()}>
                  {deleteSavedPlan && (
                    <button
                      onClick={() => deleteSavedPlan(plan.id)}
                      className="btn-delete-plan"
                      title="Remove plan"
                      aria-label="Delete plan"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>

              {plan.description && (
                <p className="plan-desc">{stripMarkdownSymbols(plan.description)}</p>
              )}

              {plan.schedule && plan.schedule.length > 0 && (
                <div className="plan-schedule-table-wrap">
                  <table className="plan-table">
                    <tbody>
                      {plan.schedule.slice(0, 4).map((row, idx) => (
                        <tr key={idx} className="plan-tr">
                          <td className="plan-td-day">{row.day}</td>
                          <td className="plan-td-focus">{row.focus}</td>
                          <td
                            className="plan-td-details"
                            dangerouslySetInnerHTML={{ __html: formatPlanDetail(row.details) }}
                          />
                        </tr>
                      ))}
                      {plan.schedule.length > 4 && (
                        <tr className="plan-tr plan-tr-more">
                          <td colSpan="3" className="plan-td-more">
                            +{plan.schedule.length - 4} more scheduled items · Click card to view full routine
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Card Footer Actions */}
              <div className="plan-card-footer" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => openPlanInChat(plan)}
                  className="btn-open-plan-chat"
                  title="Take me to this plan in AI Coach chat"
                >
                  <MessageSquare size={14} />
                  <span>Take me to Chat</span>
                  <ArrowUpRight size={13} />
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPlanModal(plan)}
                  className="btn-view-plan-details"
                  title="View full response"
                >
                  <span>View Details</span>
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Plan Details Modal - Shows the exact chat response */}
      {selectedPlanModal && (
        <div className="plan-modal-backdrop animate-fade-in" onClick={() => setSelectedPlanModal(null)}>
          <div className="plan-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="plan-modal-header">
              <div className="plan-modal-title-group">
                <span className={`plan-type-badge ${selectedPlanModal.type === 'Workout' ? 'type-workout' : 'type-meal'}`}>
                  {selectedPlanModal.type === 'Workout' ? <Dumbbell size={14} /> : <Apple size={14} />}
                  <span>{selectedPlanModal.type}</span>
                </span>
                <h2 className="plan-modal-title">{stripMarkdownSymbols(selectedPlanModal.title)}</h2>
                {selectedPlanModal.date && (
                  <span className="plan-date-meta">Saved {selectedPlanModal.date}</span>
                )}
              </div>

              <div className="plan-modal-header-actions">
                <button
                  type="button"
                  onClick={() => {
                    openPlanInChat(selectedPlanModal);
                    setSelectedPlanModal(null);
                  }}
                  className="btn-modal-header-chat"
                  title="Open this plan in AI Coach chat"
                >
                  <MessageSquare size={14} />
                  <span>Open in Chat</span>
                  <ArrowUpRight size={13} />
                </button>
                <button
                  onClick={() => setSelectedPlanModal(null)}
                  className="plan-modal-close-btn"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="plan-modal-body">
              {/* The exact message from chat itself */}
              <div className="chat-bubble-replica-card">
                <div className="chat-replica-author-bar">
                  <div className="chat-replica-avatar">
                    <Sparkles size={14} className="text-emerald" />
                  </div>
                  <div className="chat-replica-meta">
                    <span className="chat-replica-name">AI Coach Response</span>
                    <span className="chat-replica-badge">Saved Protocol</span>
                  </div>
                </div>

                {selectedPlanModal.fullText ? (
                  <div className="chat-replica-text-content">
                    {renderFormattedMarkdown(selectedPlanModal.fullText)}
                  </div>
                ) : selectedPlanModal.description ? (
                  <div className="chat-replica-text-content">
                    <p className="chat-msg-p">{stripMarkdownSymbols(selectedPlanModal.description)}</p>
                  </div>
                ) : null}

                {/* Structured Schedule Table if present */}
                {selectedPlanModal.schedule && selectedPlanModal.schedule.length > 0 && (
                  <div className="plan-schedule-table-wrap chat-replica-table-wrap">
                    <table className="plan-table">
                      <tbody>
                        {selectedPlanModal.schedule.map((row, idx) => (
                          <tr key={idx} className="plan-tr">
                            <td className="plan-td-day">{row.day}</td>
                            <td className="plan-td-focus">{row.focus}</td>
                            <td
                              className="plan-td-details"
                              dangerouslySetInnerHTML={{ __html: formatPlanDetail(row.details) }}
                            />
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="plan-modal-footer">
              <button
                type="button"
                onClick={() => {
                  openPlanInChat(selectedPlanModal);
                  setSelectedPlanModal(null);
                }}
                className="btn-modal-open-chat-primary"
                title="Take me to this plan in AI Coach Chat"
              >
                <MessageSquare size={16} />
                <span>Take me to this in AI Coach Chat</span>
                <ArrowUpRight size={15} />
              </button>

              <div className="plan-modal-footer-secondary">
                <button
                  type="button"
                  onClick={() => handleCopyPlan(selectedPlanModal)}
                  className="btn-modal-copy"
                >
                  {isCopied ? <Check size={16} className="text-emerald" /> : <Copy size={16} />}
                  <span>{isCopied ? 'Copied' : 'Copy Text'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPlanModal(null)}
                  className="btn-modal-close-action"
                >
                  <span>Close</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .nutrifit-plans-page {
          padding: 40px 48px 80px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .plans-header {
          display: flex;
          flex-direction: column;
        }

        .plans-header-top {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        .plans-title {
          font-family: var(--font-heading);
          font-size: 2.6rem;
          font-weight: 800;
          letter-spacing: -0.025em;
          color: #ffffff;
        }

        .plans-sub {
          font-size: 0.98rem;
          color: #94a3b8;
          margin-top: 4px;
        }

        .btn-ask-coach-top {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.35);
          color: #34d399;
          font-family: var(--font-heading);
          font-size: 0.92rem;
          font-weight: 700;
          padding: 10px 20px;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-ask-coach-top:hover {
          background: #10b981;
          color: #042013;
          box-shadow: 0 4px 18px rgba(16, 185, 129, 0.35);
          transform: translateY(-1px);
        }

        .plans-filter-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 4px;
        }

        .plans-filter-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 20px;
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

        .plans-filter-count {
          background: rgba(0, 0, 0, 0.25);
          padding: 2px 7px;
          border-radius: 9999px;
          font-size: 0.76rem;
        }

        .plans-filter-btn.active .plans-filter-count {
          background: rgba(4, 32, 19, 0.3);
          color: #042013;
        }

        /* Empty state card */
        .empty-plans-card {
          min-height: 300px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          text-align: center;
          padding: 48px 24px;
          border: 1px dashed #203127;
        }

        .empty-plans-icon-wrap {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background: rgba(16, 185, 129, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 4px;
        }

        .empty-plans-heading {
          font-size: 1.35rem;
          color: #ffffff;
          font-weight: 700;
        }

        .empty-plans-text {
          font-size: 1rem;
          color: #94a3b8;
          max-width: 480px;
          line-height: 1.55;
        }

        .empty-plans-actions {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 8px;
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
          display: flex;
          align-items: center;
          gap: 8px;
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
          padding: 26px 28px;
          gap: 16px;
          border-radius: 18px;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .is-interactive-card {
          cursor: pointer;
        }

        .is-interactive-card:hover {
          border-color: rgba(16, 185, 129, 0.35);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.45);
          transform: translateY(-2px);
        }

        .plan-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
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

        .plan-date-meta {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.8rem;
          color: #64748b;
          margin-top: 3px;
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
          background: rgba(239, 68, 68, 0.1);
        }

        .plan-desc {
          font-size: 0.95rem;
          color: #94a3b8;
          line-height: 1.5;
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

        .plan-tr-more {
          background: rgba(16, 185, 129, 0.04);
        }

        .plan-td-more {
          padding: 10px 18px !important;
          color: #10b981;
          font-size: 0.84rem !important;
          font-weight: 600;
          text-align: center;
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

        /* Card footer */
        .plan-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 14px;
          border-top: 1px solid #18241e;
          margin-top: 6px;
          gap: 10px;
          flex-wrap: wrap;
        }

        .btn-open-plan-chat {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.35);
          color: #34d399;
          font-family: var(--font-heading);
          font-size: 0.88rem;
          font-weight: 700;
          padding: 8px 16px;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-open-plan-chat:hover {
          background: #10b981;
          color: #042013;
          box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);
          transform: translateY(-1px);
        }

        .btn-view-plan-details {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: none;
          color: #94a3b8;
          font-family: var(--font-heading);
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          padding: 6px 4px;
          transition: all 0.18s ease;
        }

        .btn-view-plan-details:hover {
          color: #ffffff;
          transform: translateX(2px);
        }

        /* Modal Styles */
        .plan-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.82);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 16px;
        }

        .plan-modal-dialog {
          background: #0b110e;
          border: 1px solid #1f2e25;
          border-radius: 24px;
          max-width: 820px;
          width: 100%;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(16, 185, 129, 0.2);
          overflow: hidden;
        }

        .plan-modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 22px 28px 16px;
          border-bottom: 1px solid #17241c;
          gap: 16px;
        }

        .plan-modal-title-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .plan-modal-title {
          font-family: var(--font-heading);
          font-size: 1.6rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.25;
        }

        .plan-modal-header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .btn-modal-header-chat {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.35);
          color: #34d399;
          font-family: var(--font-heading);
          font-size: 0.82rem;
          font-weight: 700;
          padding: 6px 14px;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.18s ease;
          white-space: nowrap;
        }

        .btn-modal-header-chat:hover {
          background: #10b981;
          color: #042013;
        }

        .plan-modal-close-btn {
          background: rgba(255, 255, 255, 0.08);
          border: none;
          color: #94a3b8;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
          flex-shrink: 0;
        }

        .plan-modal-close-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.16);
        }

        .plan-modal-body {
          padding: 22px 28px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* Replica of Chat Message from ChatbotPage */
        .chat-bubble-replica-card {
          background: #101713;
          border: 1px solid #1b261f;
          border-radius: 18px;
          padding: 22px 24px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .chat-replica-author-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-bottom: 12px;
          border-bottom: 1px solid #16201a;
        }

        .chat-replica-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chat-replica-meta {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .chat-replica-name {
          font-family: var(--font-heading);
          font-size: 0.94rem;
          font-weight: 700;
          color: #ffffff;
        }

        .chat-replica-badge {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 2px 8px;
          border-radius: 9999px;
        }

        .chat-replica-text-content {
          display: flex;
          flex-direction: column;
        }

        .chat-replica-table-wrap {
          margin-top: 14px;
        }

        /* Typography matching ChatbotPage exactly */
        .chat-msg-h2 {
          font-family: var(--font-heading);
          font-size: 1.32rem;
          font-weight: 700;
          color: #ffffff;
          margin: 16px 0 8px;
        }

        .chat-msg-h3 {
          font-family: var(--font-heading);
          font-size: 1.18rem;
          font-weight: 700;
          color: #ffffff;
          margin: 14px 0 6px;
        }

        .chat-msg-h4 {
          font-family: var(--font-heading);
          font-size: 1.02rem;
          font-weight: 700;
          color: #34d399;
          margin: 12px 0 6px;
        }

        .chat-msg-p {
          font-size: 0.96rem;
          color: #cbd5e1;
          line-height: 1.65;
          margin: 4px 0;
        }

        .chat-block-gap {
          height: 10px;
        }

        .chat-msg-divider {
          border: none;
          border-top: 1px solid #1a271f;
          margin: 16px 0;
        }

        .chat-formatted-ul {
          list-style: none;
          padding-left: 0;
          margin: 8px 0;
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .chat-formatted-li {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 0.94rem;
          color: #cbd5e1;
          line-height: 1.55;
        }

        .chat-formatted-li-text {
          flex: 1;
          min-width: 0;
        }

        .li-dot {
          color: #10b981;
          font-weight: 800;
          line-height: 1.4;
        }

        .chat-msg-num-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 0.94rem;
          color: #cbd5e1;
          line-height: 1.55;
          margin: 4px 0;
        }

        .num-counter {
          color: #10b981;
          font-weight: 700;
          min-width: 18px;
        }

        .text-emerald-bold {
          color: #10b981;
          font-weight: 700;
        }

        /* Modal Footer */
        .plan-modal-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 28px;
          border-top: 1px solid #17241c;
          background: #090e0c;
          gap: 12px;
          flex-wrap: wrap;
        }

        .btn-modal-open-chat-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #10b981;
          color: #042013;
          font-family: var(--font-heading);
          font-size: 0.92rem;
          font-weight: 800;
          padding: 10px 22px;
          border-radius: 9999px;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 16px rgba(16, 185, 129, 0.35);
        }

        .btn-modal-open-chat-primary:hover {
          background: #34d399;
          box-shadow: 0 6px 22px rgba(16, 185, 129, 0.45);
          transform: translateY(-1px);
        }

        .plan-modal-footer-secondary {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .btn-modal-copy {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #121a15;
          border: 1px solid #1c2920;
          color: #94a3b8;
          font-family: var(--font-heading);
          font-size: 0.9rem;
          font-weight: 600;
          padding: 10px 18px;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.18s ease;
        }

        .btn-modal-copy:hover {
          color: #ffffff;
          border-color: #2b3d31;
        }

        .btn-modal-close-action {
          display: inline-flex;
          align-items: center;
          background: #1a251f;
          color: #cbd5e1;
          font-family: var(--font-heading);
          font-size: 0.92rem;
          font-weight: 700;
          padding: 10px 22px;
          border-radius: 9999px;
          border: 1px solid #24352a;
          cursor: pointer;
          transition: all 0.18s ease;
        }

        .btn-modal-close-action:hover {
          color: #ffffff;
          background: #202e26;
        }

        @media (max-width: 768px) {
          .nutrifit-plans-page {
            padding: 16px 14px 110px;
            gap: 16px;
          }
          .plans-title {
            font-size: 1.85rem;
          }
          .plans-filter-row {
            overflow-x: auto;
            padding-bottom: 4px;
            -webkit-overflow-scrolling: touch;
          }
          .plan-item-card {
            padding: 18px 16px;
            border-radius: 20px;
          }
          .plan-td-focus, .plan-td-day {
            display: block;
            width: 100%;
            padding-bottom: 4px;
          }
          .plan-modal-dialog {
            border-radius: 20px;
            max-height: 90vh;
          }
          .plan-modal-header, .plan-modal-body, .plan-modal-footer {
            padding: 16px;
          }
          .plan-card-footer {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
};
