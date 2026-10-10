import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowUp,
  Plus,
  Check,
  ImagePlus,
  X
} from 'lucide-react';

export const ChatbotPage = () => {
  const {
    chatMessages,
    createNewChat,
    isAiTyping,
    sendChatMessage,
    user,
    addSavedPlan,
    showToast
  } = useApp();

  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [savedPlanIds, setSavedPlanIds] = useState(new Set());

  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const suggestedPrompts = [
    "Generate a 4-day workout split",
    "Suggest a high-protein vegetarian lunch",
    "Quick healthy snack under 200 calories",
    "Critique my daily macro split"
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isAiTyping]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputText.trim() && !selectedImage) return;
    sendChatMessage(inputText, selectedImage);
    setInputText('');
    setSelectedImage(null);
  };

  const handleChipClick = (prompt) => {
    sendChatMessage(prompt);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      const base64Data = dataUrl.split(',')[1];
      setSelectedImage({
        dataUrl,
        base64: base64Data,
        mimeType: file.type,
        name: file.name
      });
    };
    reader.readAsDataURL(file);
  };

  // Save structured plan
  const handleSavePlan = (plan) => {
    if (!plan) return;
    addSavedPlan(plan);
    setSavedPlanIds((prev) => new Set([...prev, plan.id]));
  };

  // Save free-form assistant meal or workout advice
  const handleSaveGenericPlan = (msg) => {
    const text = msg.text || '';
    // Extract title from first markdown header
    const headerMatch = text.match(/###\s+\*?\*?([^\n*#]+)\*?\*?/);
    const extractedTitle = headerMatch ? headerMatch[1].trim() : "Custom Nutrition & Fitness Protocol";

    const isMeal =
      text.toLowerCase().includes('meal') ||
      text.toLowerCase().includes('lunch') ||
      text.toLowerCase().includes('diet') ||
      text.toLowerCase().includes('calorie') ||
      text.toLowerCase().includes('protein') ||
      text.toLowerCase().includes('snack');

    const newPlan = {
      id: msg.id,
      title: extractedTitle,
      type: isMeal ? "Meal" : "Workout",
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      description: text.slice(0, 180) + '...'
    };

    addSavedPlan(newPlan);
    setSavedPlanIds((prev) => new Set([...prev, msg.id]));
  };

  // Preprocess squashed markdown strings to restore newlines before markdown blocks
  const cleanMarkdown = (raw) => {
    if (!raw) return '';
    return raw
      .replace(/([^\n])\s*(#{2,4}\s)/g, '$1\n\n$2')
      .replace(/([^\n])\s*(---|—{2,})\s*/g, '$1\n\n---\n\n')
      .replace(/([^\n])\s*(\*\s+[A-Z])/g, '$1\n* $2')
      .replace(/([^\n])\s*(\d+\.\s+[A-Z])/g, '$1\n$2')
      .replace(/\*{4,}/g, '**')
      .trim();
  };

  const formatInline = (text) => {
    if (!text) return '';
    return text
      .replace(/\*\*\*(.*?)\*\*\*/g, '<strong class="text-emerald-bold"><em>$1</em></strong>')
      .replace(/\*\*(.*?)\*\*/g, (match, p1) => {
        const lower = p1.toLowerCase();
        if (
          lower.includes('protein') ||
          lower.includes('calorie') ||
          lower.includes('carb') ||
          lower.includes('fat') ||
          lower.includes('kcal') ||
          lower.includes('hypertrophy') ||
          lower.includes('split')
        ) {
          return `<strong class="text-emerald-bold">${p1}</strong>`;
        }
        return `<strong>${p1}</strong>`;
      })
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  };

  // Render markdown with headers, bullet points, numbered items, and dividers
  const renderFormattedMarkdown = (text) => {
    const cleaned = cleanMarkdown(text);
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
                <span dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
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

      if (trimmed === '---' || trimmed === '***') {
        flushList();
        elements.push(<hr key={`hr-${index}`} className="chat-msg-divider" />);
        return;
      }

      if (trimmed.startsWith('#### ')) {
        flushList();
        elements.push(
          <h4 key={`h4-${index}`} className="chat-msg-h4">
            <span dangerouslySetInnerHTML={{ __html: formatInline(trimmed.replace('#### ', '')) }} />
          </h4>
        );
        return;
      }

      if (trimmed.startsWith('### ')) {
        flushList();
        elements.push(
          <h3 key={`h3-${index}`} className="chat-msg-h3">
            <span dangerouslySetInnerHTML={{ __html: formatInline(trimmed.replace('### ', '')) }} />
          </h3>
        );
        return;
      }

      if (trimmed.startsWith('## ')) {
        flushList();
        elements.push(
          <h2 key={`h2-${index}`} className="chat-msg-h2">
            <span dangerouslySetInnerHTML={{ __html: formatInline(trimmed.replace('## ', '')) }} />
          </h2>
        );
        return;
      }

      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        currentList.push(trimmed.substring(2));
        return;
      }

      const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
      if (numMatch) {
        flushList();
        elements.push(
          <div key={`num-${index}`} className="chat-msg-num-item">
            <span className="num-counter">{numMatch[1]}.</span>
            <span dangerouslySetInnerHTML={{ __html: formatInline(numMatch[2]) }} />
          </div>
        );
        return;
      }

      flushList();
      elements.push(
        <p key={`p-${index}`} className="chat-msg-p">
          <span dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }} />
        </p>
      );
    });

    flushList();
    return elements;
  };

  return (
    <div className="nutrifit-coach-chat animate-fade-in">
      {/* Top Bar with "+ New chat" button matching Screenshot 4 */}
      <div className="chat-top-actions">
        <button
          onClick={createNewChat}
          className="btn-new-chat-pill"
          title="Start fresh conversation"
        >
          <Plus size={16} />
          <span>New chat</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="chat-stream-viewport">
        {chatMessages.map((msg) => {
          const isAssistant = msg.sender === 'assistant';
          const plan = msg.plan;
          const isPlanSaved = (plan && savedPlanIds.has(plan.id)) || savedPlanIds.has(msg.id);

          return (
            <div
              key={msg.id}
              className={`chat-message-row ${isAssistant ? 'msg-assistant' : 'msg-user'}`}
            >
              <div className="chat-message-bubble">
                {/* User image preview */}
                {msg.image && (
                  <div className="user-attached-image-wrap">
                    <img src={msg.image} alt="User upload" className="user-attached-image" />
                  </div>
                )}

                {/* Formatted message text */}
                {msg.text && (
                  <div className="message-content-wrapper">
                    {isAssistant ? (
                      renderFormattedMarkdown(msg.text)
                    ) : (
                      <p className="user-plain-text">{msg.text}</p>
                    )}
                  </div>
                )}

                {/* Structured Plan Table (Screenshot 4) */}
                {plan && plan.schedule && (
                  <div className="chat-plan-card">
                    <div className="chat-table-wrap">
                      <table className="chat-workout-table">
                        <tbody>
                          {plan.schedule.map((row, idx) => (
                            <tr key={idx} className="workout-table-row">
                              <td className="col-day">{row.day}</td>
                              <td className="col-focus">{row.focus}</td>
                              <td
                                className="col-details"
                                dangerouslySetInnerHTML={{
                                  __html: row.details.replace(
                                    /130g protein/g,
                                    '<span class="text-emerald-bold">130g protein</span>'
                                  )
                                }}
                              />
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {plan.footerPrompt && (
                      <p
                        className="plan-footer-query"
                        dangerouslySetInnerHTML={{
                          __html: plan.footerPrompt.replace(
                            /muscle-building meal plan/g,
                            '<span class="text-emerald-bold">muscle-building meal plan</span>'
                          )
                        }}
                      />
                    )}
                  </div>
                )}

                {/* Save to My Plans Button for Assistant responses with actionable plans */}
                {isAssistant && (
                  <div className="plan-actions-row">
                    <button
                      onClick={() => {
                        if (plan) handleSavePlan(plan);
                        else handleSaveGenericPlan(msg);
                      }}
                      className={`btn-save-plan ${isPlanSaved ? 'saved' : ''}`}
                      disabled={isPlanSaved}
                    >
                      {isPlanSaved ? (
                        <>
                          <Check size={15} />
                          <span>Saved to My Plans</span>
                        </>
                      ) : (
                        <>
                          <Plus size={15} />
                          <span>Save to My Plans</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isAiTyping && (
          <div className="chat-message-row msg-assistant animate-fade-in">
            <div className="chat-message-bubble typing-bubble">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Prompts Chips Row (Screenshot 4) */}
      <div className="suggested-prompts-row">
        {suggestedPrompts.map((prompt, idx) => (
          <button
            key={idx}
            className="prompt-chip-btn"
            onClick={() => handleChipClick(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Image attachment badge */}
      {selectedImage && (
        <div className="image-pending-badge">
          <span>Attached: {selectedImage.name}</span>
          <button onClick={() => setSelectedImage(null)} className="btn-cancel-image">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Bottom Chat Input Form (Screenshot 4) */}
      <form onSubmit={handleSend} className="chat-input-row">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleImageSelect}
          style={{ display: 'none' }}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="btn-attach-photo"
          title="Attach meal or gym equipment photo"
        >
          <ImagePlus size={18} />
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask your coach..."
          className="coach-text-input"
        />

        <button
          type="submit"
          disabled={!inputText.trim() && !selectedImage}
          className="btn-submit-arrow"
          title="Send message"
        >
          <ArrowUp size={18} strokeWidth={2.6} />
        </button>
      </form>

      <style>{`
        .nutrifit-coach-chat {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 68px);
          max-width: 1100px;
          margin: 0 auto;
          width: 100%;
          padding: 24px 36px 28px;
          background: #090e0c;
        }

        .chat-top-actions {
          margin-bottom: 16px;
        }

        .btn-new-chat-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #111815;
          border: 1px solid #1a251f;
          color: #94a3b8;
          font-family: var(--font-heading);
          font-size: 0.9rem;
          font-weight: 600;
          padding: 8px 18px;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.18s ease;
        }

        .btn-new-chat-pill:hover {
          color: #ffffff;
          border-color: #2b3b32;
          background: #141c18;
        }

        /* Stream Viewport */
        .chat-stream-viewport {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 24px;
          padding-right: 8px;
          margin-bottom: 16px;
        }

        .chat-stream-viewport::-webkit-scrollbar {
          width: 6px;
        }
        .chat-stream-viewport::-webkit-scrollbar-thumb {
          background: #1a251f;
          border-radius: 9999px;
        }

        .chat-message-row {
          display: flex;
          width: 100%;
        }

        .msg-assistant {
          justify-content: flex-start;
        }

        .msg-user {
          justify-content: flex-end;
        }

        .chat-message-bubble {
          max-width: 900px;
          border-radius: 16px;
        }

        .msg-user .chat-message-bubble {
          background: #141f19;
          border: 1px solid #1e3025;
          padding: 12px 20px;
          color: #ffffff;
          font-size: 0.98rem;
          line-height: 1.5;
        }

        .user-plain-text {
          color: #ffffff;
          font-size: 0.98rem;
          line-height: 1.5;
        }

        .message-content-wrapper {
          display: flex;
          flex-direction: column;
        }

        /* Formatted Markdown in Assistant bubble */
        .chat-msg-h2 {
          font-family: var(--font-heading);
          font-size: 1.35rem;
          font-weight: 700;
          color: #ffffff;
          margin: 16px 0 8px;
        }

        .chat-msg-h3 {
          font-family: var(--font-heading);
          font-size: 1.2rem;
          font-weight: 700;
          color: #ffffff;
          margin: 14px 0 6px;
        }

        .chat-msg-h4 {
          font-family: var(--font-heading);
          font-size: 1.05rem;
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
          border-top: 1px solid #18241e;
          margin: 16px 0;
        }

        .chat-formatted-ul {
          list-style: none;
          padding-left: 0;
          margin: 8px 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .chat-formatted-li {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 0.94rem;
          color: #cbd5e1;
          line-height: 1.55;
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

        /* Structured Workout Plan matching Screenshot 4 */
        .chat-plan-card {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 12px;
        }

        .chat-table-wrap {
          border: 1px solid #18241e;
          border-radius: 14px;
          overflow: hidden;
          background: #111815;
        }

        .chat-workout-table {
          width: 100%;
          border-collapse: collapse;
        }

        .workout-table-row {
          border-bottom: 1px solid #18241e;
        }

        .workout-table-row:last-child {
          border-bottom: none;
        }

        .workout-table-row td {
          padding: 16px 20px;
          font-size: 0.93rem;
          line-height: 1.5;
        }

        .col-day {
          color: #10b981;
          font-weight: 700;
          width: 90px;
          white-space: nowrap;
          vertical-align: top;
        }

        .col-focus {
          color: #10b981;
          font-weight: 700;
          width: 170px;
          white-space: nowrap;
          vertical-align: top;
        }

        .col-details {
          color: #cbd5e1;
          vertical-align: top;
        }

        .plan-footer-query {
          font-size: 0.98rem;
          color: #cbd5e1;
          line-height: 1.6;
          margin-top: 4px;
        }

        .plan-actions-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 14px;
        }

        .btn-save-plan {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #111815;
          border: 1px solid #202e26;
          color: #cbd5e1;
          font-family: var(--font-heading);
          font-size: 0.9rem;
          font-weight: 600;
          padding: 8px 18px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.18s ease;
        }

        .btn-save-plan:hover {
          color: #ffffff;
          border-color: #2d4236;
          background: #15201b;
        }

        .btn-save-plan.saved {
          color: #10b981;
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.08);
          cursor: default;
        }

        /* Suggested Prompts Row */
        .suggested-prompts-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 14px;
        }

        .prompt-chip-btn {
          background: #111815;
          border: 1px solid #1a251f;
          color: #94a3b8;
          font-family: var(--font-heading);
          font-size: 0.88rem;
          font-weight: 500;
          padding: 8px 16px;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.18s ease;
          white-space: nowrap;
        }

        .prompt-chip-btn:hover {
          color: #ffffff;
          border-color: #27372e;
          background: #15201b;
        }

        /* Chat Input Form */
        .chat-input-row {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #111815;
          border: 1px solid #1a251f;
          border-radius: 9999px;
          padding: 8px 10px 8px 18px;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .chat-input-row:focus-within {
          border-color: #10b981;
          box-shadow: 0 0 16px rgba(16, 185, 129, 0.2);
        }

        .btn-attach-photo {
          background: transparent;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 6px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.18s ease;
        }

        .btn-attach-photo:hover {
          color: #10b981;
        }

        .coach-text-input {
          flex: 1;
          background: transparent;
          border: none;
          color: #ffffff;
          font-family: var(--font-heading);
          font-size: 1rem;
          outline: none;
        }

        .coach-text-input::placeholder {
          color: #64748b;
        }

        .btn-submit-arrow {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #10b981;
          color: #042013;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.18s ease;
          flex-shrink: 0;
        }

        .btn-submit-arrow:disabled {
          background: #18241e;
          color: #475569;
          cursor: not-allowed;
        }

        .btn-submit-arrow:not(:disabled):hover {
          background: #34d399;
          transform: scale(1.05);
        }

        .image-pending-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #141f19;
          border: 1px solid #1e3025;
          color: #10b981;
          font-size: 0.82rem;
          padding: 4px 12px;
          border-radius: 8px;
          margin-bottom: 8px;
          width: fit-content;
        }

        .btn-cancel-image {
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          display: flex;
          align-items: center;
        }

        .user-attached-image {
          max-width: 260px;
          border-radius: 10px;
          margin-bottom: 8px;
        }

        .typing-bubble {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 12px 18px;
          background: #111815;
          border: 1px solid #18241e;
        }

        .typing-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
          animation: pulseGlow 1.2s infinite ease-in-out;
        }

        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }

        @media (max-width: 768px) {
          .nutrifit-coach-chat {
            padding: 16px 14px 20px;
          }
          .workout-table-row td {
            padding: 12px 14px;
            font-size: 0.88rem;
          }
          .col-focus, .col-day {
            display: block;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};
