import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { sampleChatSuggestions } from '../data/mockData';
import {
  Sparkles,
  Send,
  RotateCcw,
  Bot,
  User,
  Zap,
  Dumbbell,
  Apple,
  HeartPulse,
  Flame,
  Check,
  Copy,
  Plus,
  Trash2,
  ImagePlus,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  MessageSquare,
  PanelLeft,
  PanelLeftClose,
  Maximize2
} from 'lucide-react';

export const ChatbotPage = () => {
  const {
    chatMessages,
    chatSessions,
    currentSessionId,
    activeSession,
    createNewChat,
    selectChatSession,
    deleteChatSession,
    isAiTyping,
    sendChatMessage,
    clearChat,
    user,
    showToast
  } = useApp();

  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [speakingId, setSpeakingId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    typeof window !== 'undefined' ? window.innerWidth > 992 : true
  );
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);

  const chatAreaRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  const scrollToBottom = () => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTo({
        top: chatAreaRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isAiTyping]);

  // Handle Image Selection
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast("Please upload an image file (PNG, JPG, WEBP).", "error");
      return;
    }

    // Check size limit: 12MB
    if (file.size > 12 * 1024 * 1024) {
      showToast("Image is too large. Please select an image under 12MB.", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      const base64Data = dataUrl.split(',')[1];
      setSelectedImage({
        dataUrl,
        base64: base64Data,
        mimeType: file.type,
        name: file.name,
        size: (file.size / 1024).toFixed(0) + ' KB'
      });
      showToast(`Attached image: ${file.name}`, "info");
    };
    reader.readAsDataURL(file);
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputText.trim() && !selectedImage) return;

    sendChatMessage(inputText, selectedImage);
    setInputText('');
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSuggestionClick = (suggestion) => {
    sendChatMessage(suggestion);
  };

  const handleCopyMessage = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Voice Input Speech Recognition
  const toggleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      showToast("Voice recognition is not supported in this browser. Please use Chrome or Edge.", "error");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      setIsListening(false);
      showToast("Voice recording stopped.", "info");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        showToast("🎙️ Listening... Speak your nutrition or fitness question!", "info");
      };

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const currentSpoken = (finalTranscript || interimTranscript).trim();
        if (currentSpoken) {
          setInputText(currentSpoken);
        }
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition notice:", event.error);
        if (event.error === 'not-allowed') {
          showToast("Microphone access denied. Please allow microphone permissions in browser settings.", "error");
        } else if (event.error !== 'no-speech') {
          showToast(`Voice input notice: ${event.error}`, "info");
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
      setIsListening(false);
      showToast("Could not access microphone.", "error");
    }
  };

  // Text-To-Speech (Listen to Coach response)
  const handleToggleSpeak = (id, text) => {
    if (!('speechSynthesis' in window)) {
      showToast("Text-to-speech audio is not supported in this browser.", "error");
      return;
    }

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();

    // Clean markdown characters for smooth speech
    const cleanText = (text || '')
      .replace(/[#*`_~-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  // Cleanup speech upon component unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Helper to render markdown-like formatting (headers, bold, lists)
  const renderFormattedText = (raw) => {
    if (!raw) return null;
    const lines = raw.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return <h4 key={idx} className="chat-h3">{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('#### ')) {
        return <h5 key={idx} className="chat-h4">{line.replace('#### ', '')}</h5>;
      }
      if (line.startsWith('* ') || line.startsWith('- ')) {
        const content = line.substring(2);
        return (
          <li key={idx} className="chat-li">
            <span dangerouslySetInnerHTML={{ __html: formatInline(content) }} />
          </li>
        );
      }
      if (line.match(/^\d+\.\s/)) {
        return (
          <p key={idx} className="chat-numbered-item">
            <span dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
          </p>
        );
      }
      if (!line.trim()) {
        return <div key={idx} className="chat-spacer" />;
      }
      return (
        <p key={idx} className="chat-p">
          <span dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
        </p>
      );
    });
  };

  const formatInline = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  };

  return (
    <div className="chatbot-page animate-fade-in">
      <div className="container chat-container">
        <div className={`chat-layout-wrapper ${isSidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
          {/* Mobile Backdrop */}
          {isSidebarOpen && (
            <div className="sidebar-backdrop" onClick={() => setIsSidebarOpen(false)} />
          )}

          {/* Chat History Sidebar (like ChatGPT / Gemini) */}
          <aside className={`chat-history-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-header">
              <div className="sidebar-title-row">
                <span className="sidebar-brand">
                  <Sparkles size={16} className="text-emerald" />
                  <span>Chat History</span>
                </span>
                <button
                  className="sidebar-close-btn"
                  onClick={() => setIsSidebarOpen(false)}
                  title="Close sidebar"
                >
                  <PanelLeftClose size={18} />
                </button>
              </div>

              {/* "+ New Chat" Button */}
              <button
                className="btn-new-chat"
                onClick={() => {
                  createNewChat();
                  if (typeof window !== 'undefined' && window.innerWidth <= 992) {
                    setIsSidebarOpen(false);
                  }
                }}
                title="Start a new chat conversation"
              >
                <Plus size={18} />
                <span>New Chat</span>
              </button>
            </div>

            {/* Sessions List */}
            <div className="sidebar-sessions-list">
              <div className="sidebar-list-label">Recent Conversations</div>
              {chatSessions && chatSessions.length > 0 ? (
                chatSessions.map((session) => {
                  const isActive = session.id === currentSessionId;
                  return (
                    <div
                      key={session.id}
                      className={`session-item ${isActive ? 'active' : ''}`}
                      onClick={() => {
                        selectChatSession(session.id);
                        if (typeof window !== 'undefined' && window.innerWidth <= 992) {
                          setIsSidebarOpen(false);
                        }
                      }}
                    >
                      <MessageSquare size={15} className="session-icon" />
                      <span className="session-title" title={session.title}>
                        {session.title || "Conversation"}
                      </span>
                      <button
                        className="session-delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteChatSession(session.id);
                        }}
                        title="Delete chat"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="empty-sessions">No conversations yet</div>
              )}
            </div>

            {/* Sidebar Bottom Banner */}
            <div className="sidebar-footer-tip">
              <div className="tip-badge">
                <Sparkles size={13} /> Multimodal AI
              </div>
              <p className="tip-text">Upload meal photos for instant calorie & protein estimates, or gym machines for form guides.</p>
            </div>
          </aside>

          {/* Main Chat Workspace */}
          <main className="chat-main-card glass-panel">
            {/* Top Navigation Header */}
            <div className="chat-header">
              <div className="chat-header-left">
                <button
                  className="btn-toggle-sidebar"
                  onClick={() => setIsSidebarOpen((prev) => !prev)}
                  title={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
                >
                  <PanelLeft size={19} />
                </button>

                <div className="chat-coach-profile">
                  <div className="coach-avatar-wrap">
                    <Sparkles size={20} className="coach-sparkle-icon" />
                    <span className="live-status-dot" />
                  </div>
                  <div>
                    <div className="coach-name-row">
                      <h2 className="coach-name">
                        {activeSession?.title && activeSession.title !== "New Conversation" && activeSession.title !== "Fitness & Nutrition Coach"
                          ? activeSession.title
                          : "FitWise AI Coach"}
                      </h2>
                      <span className="badge badge-emerald">Online & Calibrated</span>
                    </div>
                    <p className="coach-context">
                      Trained on sports biomechanics & nutrition • {user?.name || "Athlete"} ({user?.fitnessGoal || "General Fitness"})
                    </p>
                  </div>
                </div>
              </div>

              <div className="chat-header-actions">
                <button
                  onClick={createNewChat}
                  className="btn btn-secondary btn-sm btn-header-new"
                  title="Start fresh chat"
                >
                  <Plus size={15} />
                  <span>New Chat</span>
                </button>

                <button
                  onClick={clearChat}
                  className="btn btn-secondary btn-sm btn-clear-chat"
                  title="Clear messages in this chat"
                >
                  <RotateCcw size={15} />
                  <span>Clear</span>
                </button>
              </div>
            </div>

            {/* Category Quick Filters */}
            <div className="chat-category-strip">
              {[
                { id: 'All', label: 'All Topics', icon: Zap },
                { id: 'Workouts', label: 'Workouts & Sets', icon: Dumbbell },
                { id: 'Diet', label: 'Nutrition & Macros', icon: Apple },
                { id: 'Recovery', label: 'Sleep & Recovery', icon: HeartPulse }
              ].map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    className={`chat-filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    <Icon size={14} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Messages Stream */}
            <div className="chat-messages-area" ref={chatAreaRef}>
              {chatMessages.map((msg) => {
                const isAssistant = msg.sender === 'assistant';
                return (
                  <div
                    key={msg.id}
                    className={`chat-bubble-row ${isAssistant ? 'bubble-assistant' : 'bubble-user'}`}
                  >
                    <div className="sender-avatar">
                      {isAssistant ? <Bot size={18} /> : <User size={18} />}
                    </div>

                    <div className="bubble-content-wrap">
                      <div className="bubble-box">
                        {/* If user attached an image, render preview */}
                        {msg.image && (
                          <div
                            className="chat-bubble-image-wrap"
                            onClick={() => setLightboxImage(msg.image)}
                            title="Click to view full size"
                          >
                            <img
                              src={msg.image}
                              alt={msg.imageName || "Attached visual"}
                              className="chat-bubble-image"
                            />
                            <div className="image-zoom-overlay">
                              <Maximize2 size={16} />
                              <span>Enlarge</span>
                            </div>
                          </div>
                        )}

                        {isAssistant ? (
                          <div className="formatted-ai-response">
                            {renderFormattedText(msg.text)}
                          </div>
                        ) : (
                          msg.text && <p className="user-message-text">{msg.text}</p>
                        )}
                      </div>

                      <div className="bubble-footer">
                        <span className="msg-timestamp">{msg.timestamp}</span>
                        {isAssistant && (
                          <div className="bubble-actions-group">
                            <button
                              className={`btn-speak-bubble ${speakingId === msg.id ? 'is-speaking' : ''}`}
                              onClick={() => handleToggleSpeak(msg.id, msg.text)}
                              title={speakingId === msg.id ? "Stop audio" : "Listen to answer"}
                            >
                              {speakingId === msg.id ? (
                                <>
                                  <VolumeX size={13} className="text-amber" />
                                  <span className="text-amber">Stop</span>
                                </>
                              ) : (
                                <>
                                  <Volume2 size={13} />
                                  <span>Listen</span>
                                </>
                              )}
                            </button>

                            <button
                              className="btn-copy-bubble"
                              onClick={() => handleCopyMessage(msg.id, msg.text)}
                              title="Copy response"
                            >
                              {copiedId === msg.id ? (
                                <>
                                  <Check size={13} className="text-emerald" />
                                  <span className="text-emerald">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy size={13} />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* AI Typing Indicator */}
              {isAiTyping && (
                <div className="chat-bubble-row bubble-assistant animate-fade-in">
                  <div className="sender-avatar">
                    <Bot size={18} />
                  </div>
                  <div className="typing-indicator-box">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-text">Analyzing with FitWise AI...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Suggested Prompts Strip */}
            <div className="suggested-prompts-bar">
              <span className="suggested-title"><Sparkles size={14} /> Suggested Prompts:</span>
              <div className="prompts-scroll-row">
                {sampleChatSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="chat-prompt-pill"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Attachment Preview Above Input Bar */}
            {selectedImage && (
              <div className="image-attachment-preview-bar animate-fade-in">
                <div className="preview-content">
                  <img src={selectedImage.dataUrl} alt="Preview" className="preview-thumb" />
                  <div className="preview-meta">
                    <span className="preview-name">{selectedImage.name}</span>
                    <span className="preview-size">{selectedImage.size} • Ready for analysis</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-remove-attachment"
                  onClick={removeSelectedImage}
                  title="Remove image"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Live Voice Input Listening Bar */}
            {isListening && (
              <div className="voice-listening-bar animate-fade-in">
                <div className="voice-pulse-indicator">
                  <span className="pulse-circle"></span>
                  <span className="pulse-text">🎙️ Listening to your voice... Speak your question or meal details</span>
                </div>
                <button
                  type="button"
                  className="btn-stop-voice"
                  onClick={toggleVoiceInput}
                >
                  Done Speaking
                </button>
              </div>
            )}

            {/* Chat Input Bar */}
            <form onSubmit={handleSend} className="chat-input-form">
              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handleImageSelect}
                style={{ display: 'none' }}
              />

              {/* Upload Image Button */}
              <button
                type="button"
                className={`btn-upload-image ${selectedImage ? 'has-image' : ''}`}
                onClick={() => fileInputRef.current?.click()}
                title="Attach photo of meal, nutrition label, or gym equipment for AI analysis"
              >
                <ImagePlus size={20} />
              </button>

              {/* Voice Input Microphone Button */}
              <button
                type="button"
                className={`btn-voice-input ${isListening ? 'listening' : ''}`}
                onClick={toggleVoiceInput}
                title={isListening ? "Listening... Click to stop" : "Speak to your AI Coach (Voice Input)"}
              >
                {isListening ? (
                  <MicOff size={20} className="mic-icon-active" />
                ) : (
                  <Mic size={20} />
                )}
              </button>

              <input
                type="text"
                className={`chat-text-input ${isListening ? 'input-listening' : ''}`}
                placeholder={
                  isListening
                    ? "🎙️ Listening to you... (Speak now)"
                    : selectedImage
                    ? "Describe what you want me to analyze about this image (e.g. estimate calories)..."
                    : "Ask your AI Coach, speak via microphone, or attach a photo..."
                }
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />

              <button
                type="submit"
                disabled={(!inputText.trim() && !selectedImage) || isAiTyping}
                className="btn btn-primary btn-chat-send"
              >
                <Send size={18} />
                <span>Send</span>
              </button>
            </form>
          </main>
        </div>
      </div>

      {/* Lightbox Modal for Full Image View */}
      {lightboxImage && (
        <div className="lightbox-overlay" onClick={() => setLightboxImage(null)}>
          <div className="lightbox-modal" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close-btn" onClick={() => setLightboxImage(null)}>
              <X size={20} />
            </button>
            <img src={lightboxImage} alt="Expanded view" className="lightbox-img" />
          </div>
        </div>
      )}

      <style>{`
        .chatbot-page {
          padding: 24px 0 40px;
        }
        .chat-container {
          max-width: 1280px;
        }

        /* Layout Grid */
        .chat-layout-wrapper {
          display: flex;
          gap: 18px;
          height: calc(88vh - 72px);
          min-height: 640px;
          position: relative;
        }

        /* Sidebar Styling (like ChatGPT / Gemini) */
        .chat-history-sidebar {
          width: 280px;
          background: #0b1120;
          border: 1px solid var(--border-subtle);
          border-radius: 24px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: transform 0.25s ease, width 0.25s ease, opacity 0.25s ease;
          flex-shrink: 0;
        }

        .chat-history-sidebar.closed {
          width: 0;
          padding: 0;
          border: none;
          opacity: 0;
          pointer-events: none;
        }

        .sidebar-header {
          padding: 18px 16px 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .sidebar-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          font-size: 0.95rem;
          color: #f1f5f9;
        }

        .sidebar-close-btn {
          background: transparent;
          border: none;
          color: var(--text-dim);
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 4px;
          border-radius: 6px;
          transition: var(--ease-smooth);
        }

        .sidebar-close-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.08);
        }

        .btn-new-chat {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 10px 16px;
          border-radius: 12px;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.35);
          color: #34d399;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: var(--ease-smooth);
        }

        .btn-new-chat:hover {
          background: rgba(16, 185, 129, 0.22);
          border-color: #10b981;
          color: #ffffff;
          box-shadow: 0 0 16px rgba(16, 185, 129, 0.3);
        }

        .sidebar-sessions-list {
          flex: 1;
          overflow-y: auto;
          padding: 12px 10px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .sidebar-list-label {
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-dim);
          padding: 6px 10px 8px;
        }

        .session-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 12px;
          color: var(--text-muted);
          font-size: 0.88rem;
          cursor: pointer;
          transition: var(--ease-smooth);
          position: relative;
          border: 1px solid transparent;
        }

        .session-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #f1f5f9;
        }

        .session-item.active {
          background: rgba(16, 185, 129, 0.15);
          border-color: rgba(16, 185, 129, 0.3);
          color: #ffffff;
          font-weight: 500;
        }

        .session-icon {
          flex-shrink: 0;
          color: var(--text-dim);
        }

        .session-item.active .session-icon {
          color: #34d399;
        }

        .session-title {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .session-delete-btn {
          opacity: 0;
          background: transparent;
          border: none;
          color: var(--text-dim);
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          transition: var(--ease-smooth);
        }

        .session-item:hover .session-delete-btn {
          opacity: 1;
        }

        .session-delete-btn:hover {
          color: #f87171;
          background: rgba(239, 68, 68, 0.15);
        }

        .empty-sessions {
          font-size: 0.82rem;
          color: var(--text-dim);
          text-align: center;
          padding: 24px 10px;
        }

        .sidebar-footer-tip {
          padding: 14px 16px;
          background: rgba(255, 255, 255, 0.02);
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .tip-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.72rem;
          font-weight: 700;
          color: #38bdf8;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .tip-text {
          font-size: 0.76rem;
          color: var(--text-dim);
          line-height: 1.4;
          margin: 0;
        }

        /* Main Chat Card */
        .chat-main-card {
          flex: 1;
          border-radius: 24px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: #0f1629;
          border: 1px solid var(--border-subtle);
        }

        .chat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          border-bottom: 1px solid var(--border-subtle);
          background: rgba(17, 24, 39, 0.75);
        }

        .chat-header-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .btn-toggle-sidebar {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          color: var(--text-muted);
          width: 38px;
          height: 38px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--ease-smooth);
        }

        .btn-toggle-sidebar:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.1);
        }

        .chat-coach-profile {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .coach-avatar-wrap {
          position: relative;
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: linear-gradient(135deg, #10b981, #06b6d4);
          color: #02170e;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
        }

        .live-status-dot {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #10b981;
          border: 2px solid #0f1629;
        }

        .coach-name-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .coach-name {
          font-size: 1.12rem;
          color: #ffffff;
          margin: 0;
          max-width: 380px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .coach-context {
          font-size: 0.76rem;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .chat-header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-header-new {
          font-size: 0.8rem;
          background: rgba(16, 185, 129, 0.1);
          border-color: rgba(16, 185, 129, 0.25);
          color: #34d399;
        }

        .btn-header-new:hover {
          background: rgba(16, 185, 129, 0.2);
          color: #ffffff;
        }

        .btn-clear-chat {
          font-size: 0.8rem;
        }

        /* Filter Chips */
        .chat-category-strip {
          display: flex;
          gap: 8px;
          padding: 8px 20px;
          background: rgba(255, 255, 255, 0.02);
          border-bottom: 1px solid var(--border-subtle);
          overflow-x: auto;
        }

        .chat-filter-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          color: var(--text-muted);
          font-size: 0.76rem;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: var(--ease-smooth);
        }

        .chat-filter-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.08);
        }

        .chat-filter-btn.active {
          background: rgba(16, 185, 129, 0.16);
          border-color: var(--border-glow);
          color: #34d399;
        }

        /* Messages Area */
        .chat-messages-area {
          flex: 1;
          overflow-y: auto;
          padding: 22px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .chat-bubble-row {
          display: flex;
          gap: 12px;
          max-width: 85%;
        }

        .bubble-assistant {
          align-self: flex-start;
        }

        .bubble-user {
          align-self: flex-end;
          flex-direction: row-reverse;
        }

        .sender-avatar {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .bubble-assistant .sender-avatar {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .bubble-user .sender-avatar {
          background: rgba(56, 189, 248, 0.15);
          color: #38bdf8;
          border: 1px solid rgba(56, 189, 248, 0.3);
        }

        .bubble-content-wrap {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .bubble-assistant .bubble-box {
          background: #182238;
          border: 1px solid var(--border-subtle);
          border-radius: 18px 18px 18px 4px;
          padding: 16px 20px;
          color: #e2e8f0;
          font-size: 0.94rem;
          line-height: 1.6;
        }

        .bubble-user .bubble-box {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: #042416;
          font-weight: 500;
          border-radius: 18px 18px 4px 18px;
          padding: 14px 18px;
          font-size: 0.95rem;
          box-shadow: 0 4px 14px rgba(16, 185, 129, 0.25);
        }

        .user-message-text {
          margin: 0;
          color: #032014;
          font-weight: 600;
        }

        /* Bubble Image Attachment */
        .chat-bubble-image-wrap {
          position: relative;
          margin-bottom: 10px;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          max-width: 280px;
          border: 2px solid rgba(255, 255, 255, 0.2);
        }

        .chat-bubble-image {
          width: 100%;
          height: auto;
          max-height: 240px;
          object-fit: cover;
          display: block;
          transition: transform 0.2s ease;
        }

        .chat-bubble-image-wrap:hover .chat-bubble-image {
          transform: scale(1.02);
        }

        .image-zoom-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          color: #ffffff;
          font-size: 0.78rem;
          font-weight: 600;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .chat-bubble-image-wrap:hover .image-zoom-overlay {
          opacity: 1;
        }

        .bubble-footer {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 4px;
        }

        .msg-timestamp {
          font-size: 0.72rem;
          color: var(--text-dim);
        }

        .bubble-actions-group {
          display: inline-flex;
          align-items: center;
          gap: 12px;
        }

        .btn-speak-bubble {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: transparent;
          border: none;
          color: var(--text-dim);
          font-size: 0.72rem;
          cursor: pointer;
          padding: 0;
          transition: color 0.15s ease;
        }

        .btn-speak-bubble:hover {
          color: #38bdf8;
        }

        .btn-speak-bubble.is-speaking {
          color: #fbbf24;
          font-weight: 600;
        }

        .btn-copy-bubble {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: transparent;
          border: none;
          color: var(--text-dim);
          font-size: 0.72rem;
          cursor: pointer;
          padding: 0;
        }

        .btn-copy-bubble:hover {
          color: var(--text-muted);
        }

        .formatted-ai-response {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .chat-h3 {
          font-size: 1.08rem;
          color: #38bdf8;
          margin: 6px 0 2px;
        }

        .chat-h4 {
          font-size: 0.95rem;
          color: #34d399;
          margin: 4px 0 2px;
        }

        .chat-p {
          margin: 0;
        }

        .chat-li {
          margin-left: 20px;
          list-style-type: disc;
        }

        .chat-numbered-item {
          margin: 2px 0;
        }

        .chat-spacer {
          height: 6px;
        }

        .typing-indicator-box {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 12px 18px;
          background: #182238;
          border-radius: 18px;
          border: 1px solid var(--border-subtle);
        }

        .typing-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #34d399;
          animation: pulseGlow 1.2s infinite ease-in-out;
        }

        .typing-dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        .typing-text {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-left: 6px;
        }

        /* Suggested Prompts Strip */
        .suggested-prompts-bar {
          padding: 8px 18px;
          background: rgba(17, 24, 39, 0.85);
          border-top: 1px solid var(--border-subtle);
        }

        .suggested-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #38bdf8;
          margin-bottom: 6px;
        }

        .prompts-scroll-row {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 2px;
        }

        .chat-prompt-pill {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          color: #cbd5e1;
          font-size: 0.78rem;
          padding: 5px 12px;
          border-radius: 999px;
          white-space: nowrap;
          cursor: pointer;
          transition: var(--ease-smooth);
        }

        .chat-prompt-pill:hover {
          background: rgba(16, 185, 129, 0.15);
          border-color: var(--border-glow);
          color: #34d399;
        }

        /* Image Attachment Preview Above Input */
        .image-attachment-preview-bar {
          padding: 10px 20px;
          background: #151e33;
          border-top: 1px solid rgba(16, 185, 129, 0.3);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .preview-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .preview-thumb {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          object-fit: cover;
          border: 1px solid rgba(16, 185, 129, 0.4);
        }

        .preview-meta {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .preview-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: #f1f5f9;
          max-width: 320px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .preview-size {
          font-size: 0.75rem;
          color: #34d399;
        }

        .btn-remove-attachment {
          background: rgba(255, 255, 255, 0.08);
          border: none;
          color: var(--text-dim);
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--ease-smooth);
        }

        .btn-remove-attachment:hover {
          color: #f87171;
          background: rgba(239, 68, 68, 0.2);
        }

        /* Live Voice Input Listening Bar */
        .voice-listening-bar {
          padding: 10px 20px;
          background: rgba(239, 68, 68, 0.12);
          border-top: 1px solid rgba(239, 68, 68, 0.4);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .voice-pulse-indicator {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .pulse-circle {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #ef4444;
          box-shadow: 0 0 10px #ef4444;
          animation: pulseRedDot 1s infinite alternate;
        }

        @keyframes pulseRedDot {
          from {
            transform: scale(0.85);
            opacity: 0.6;
          }
          to {
            transform: scale(1.25);
            opacity: 1;
            box-shadow: 0 0 16px #ef4444;
          }
        }

        .pulse-text {
          font-size: 0.85rem;
          font-weight: 600;
          color: #fca5a5;
        }

        .btn-stop-voice {
          background: rgba(239, 68, 68, 0.25);
          border: 1px solid rgba(239, 68, 68, 0.5);
          color: #ffffff;
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          transition: var(--ease-smooth);
        }

        .btn-stop-voice:hover {
          background: #ef4444;
          color: #ffffff;
        }

        /* Chat Input Form */
        .chat-input-form {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 18px;
          background: #111827;
          border-top: 1px solid var(--border-subtle);
        }

        .btn-upload-image {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          color: var(--text-muted);
          width: 46px;
          height: 46px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--ease-smooth);
          flex-shrink: 0;
        }

        .btn-upload-image:hover {
          color: #34d399;
          border-color: rgba(16, 185, 129, 0.4);
          background: rgba(16, 185, 129, 0.1);
        }

        .btn-upload-image.has-image {
          color: #34d399;
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.18);
        }

        /* Voice Input Button */
        .btn-voice-input {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          color: var(--text-muted);
          width: 46px;
          height: 46px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--ease-smooth);
          flex-shrink: 0;
          position: relative;
        }

        .btn-voice-input:hover {
          color: #38bdf8;
          border-color: rgba(56, 189, 248, 0.4);
          background: rgba(56, 189, 248, 0.1);
        }

        .btn-voice-input.listening {
          background: rgba(239, 68, 68, 0.2);
          border-color: #ef4444;
          color: #ef4444;
          animation: micPulseRing 1.2s infinite;
        }

        .mic-icon-active {
          color: #ef4444;
        }

        @keyframes micPulseRing {
          0% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.6);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
          }
        }

        .chat-text-input {
          flex: 1;
          background: #1b243b;
          border: 1px solid var(--border-subtle);
          color: #ffffff;
          padding: 13px 18px;
          border-radius: 14px;
          font-family: var(--font-sans);
          font-size: 0.94rem;
          outline: none;
          transition: var(--ease-smooth);
        }

        .chat-text-input.input-listening {
          border-color: rgba(239, 68, 68, 0.7);
          background: rgba(239, 68, 68, 0.06);
          box-shadow: 0 0 16px rgba(239, 68, 68, 0.25);
        }

        .chat-text-input:focus {
          border-color: var(--border-glow);
          box-shadow: 0 0 16px rgba(16, 185, 129, 0.2);
        }

        .btn-chat-send {
          height: 46px;
          padding: 0 20px;
          border-radius: 14px;
          flex-shrink: 0;
        }

        .btn-chat-send:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Lightbox Modal */
        .lightbox-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          animation: fadeIn 0.2s ease;
        }

        .lightbox-modal {
          position: relative;
          max-width: 90vw;
          max-height: 90vh;
        }

        .lightbox-img {
          max-width: 90vw;
          max-height: 85vh;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .lightbox-close-btn {
          position: absolute;
          top: -16px;
          right: -16px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #1e293b;
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--ease-smooth);
        }

        .lightbox-close-btn:hover {
          background: #ef4444;
          transform: scale(1.1);
        }

        /* Responsive Breakpoints */
        @media (max-width: 992px) {
          .sidebar-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(4, 7, 18, 0.7);
            backdrop-filter: blur(4px);
            z-index: 45;
          }
          .chat-history-sidebar {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            z-index: 50;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.85);
            width: 300px;
          }
        }

        @media (max-width: 768px) {
          .chat-layout-wrapper {
            height: calc(100vh - 120px);
          }
          .chat-bubble-row {
            max-width: 96%;
          }
          .coach-name {
            max-width: 180px;
          }
        }
      `}</style>
    </div>
  );
};
