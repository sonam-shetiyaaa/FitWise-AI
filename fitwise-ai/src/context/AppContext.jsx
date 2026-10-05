import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialProfile,
  initialWorkouts,
  initialNutrition,
  initialProgress,
  sampleChatKnowledge
} from '../data/mockData';
import { generateSmartFitnessResponse } from '../data/aiEngine';
import {
  authenticateUser,
  registerUser,
  resetUserPassword,
  updateUserProfileInDB,
  getActiveSession,
  saveActiveSession,
  clearActiveSession
} from '../data/authStore';

const defaultGuestProfile = {
  name: "",
  email: "",
  age: 26,
  gender: "Not specified",
  height: 175,
  weight: 70,
  targetWeight: 68,
  fitnessGoal: "General Fitness & Health",
  activityLevel: "Moderately Active (3-5 sessions/week)",
  fitnessExperience: "Beginner (< 6 months)",
  workoutLocation: "Commercial Gym",
  workoutDuration: "45-60 min",
  foodPreference: "High-Protein Balanced",
  dietaryRestrictions: "None",
  preferredCuisine: "Balanced",
  waterIntake: "3.0 Liters",
  sleepDuration: "7-8 hours",
  avatarUrl: ""
};

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // Navigation State - defaults to 'landing' page
  const [currentPage, setCurrentPage] = useState('landing');

  // User Profile & Auth
  const initialSession = getActiveSession();
  const [isLoggedIn, setIsLoggedIn] = useState(!!initialSession);
  const [user, setUser] = useState(initialSession?.profile || defaultGuestProfile);

  // Auth Dialog Modal State (for "Get Started" and "Sign In")
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('signin'); // 'signin' or 'register'

  const openAuthModal = (tab = 'signin') => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  // Workouts State
  const [workouts, setWorkouts] = useState(initialWorkouts);
  const [activeWorkoutCategory, setActiveWorkoutCategory] = useState('All');

  // Nutrition State
  const [nutrition, setNutrition] = useState(initialNutrition);

  // Progress State
  const [progress, setProgress] = useState(initialProgress);

  // Water Tracker (in Liters)
  const [waterConsumed, setWaterConsumed] = useState(2.75);
  const waterTarget = 3.5;

  // Google Gemini API Key management
  const [geminiApiKey, setGeminiApiKey] = useState(() => {
    return (
      localStorage.getItem('fitwise_gemini_api_key') ||
      import.meta.env.VITE_GEMINI_API_KEY ||
      ""
    );
  });

  const saveGeminiApiKey = (key) => {
    const trimmed = (key || '').trim();
    if (trimmed) {
      localStorage.setItem('fitwise_gemini_api_key', trimmed);
      setGeminiApiKey(trimmed);
      showToast("Gemini API key updated successfully!", "success");
    } else {
      localStorage.removeItem('fitwise_gemini_api_key');
      const fallback = import.meta.env.VITE_GEMINI_API_KEY || "";
      setGeminiApiKey(fallback);
      showToast("Reset to default Gemini API key.", "info");
    }
  };

  // AI Chat Messages & Multi-Session History State (ChatGPT / Gemini style)
  const defaultWelcomeMessage = {
    id: "m-welcome",
    sender: "assistant",
    text: "👋 Hi! I'm your **FitWise AI Coach**. I'm here to help with personalized workouts, macro calculations, exercise form, and recovery.\n\nYou can ask me any question or **upload an image** of your meal or gym equipment for live AI analysis!",
    timestamp: "Just now"
  };

  const initialSessions = [
    {
      id: "session-1",
      title: "Fitness & Nutrition Coach",
      createdAt: Date.now(),
      messages: [defaultWelcomeMessage]
    }
  ];

  const [chatSessions, setChatSessions] = useState(() => {
    try {
      const saved = localStorage.getItem('fitwise_chat_sessions_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) { }
    return initialSessions;
  });

  const [currentSessionId, setCurrentSessionId] = useState(() => {
    try {
      const savedId = localStorage.getItem('fitwise_active_session_id_v2');
      if (savedId) return savedId;
    } catch (e) { }
    return "session-1";
  });

  useEffect(() => {
    try {
      localStorage.setItem('fitwise_chat_sessions_v2', JSON.stringify(chatSessions));
    } catch (e) { }
  }, [chatSessions]);

  useEffect(() => {
    try {
      localStorage.setItem('fitwise_active_session_id_v2', currentSessionId);
    } catch (e) { }
  }, [currentSessionId]);

  const activeSession = chatSessions.find((s) => s.id === currentSessionId) || chatSessions[0] || initialSessions[0];
  const chatMessages = activeSession ? activeSession.messages : [defaultWelcomeMessage];
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Toast Notification State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 3800);
  };

  // Navigation Helper
  const navigateTo = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth Handlers (with strict password & account validation)
  const login = (email, password, displayName, rememberMe = true) => {
    // If instant demo button used
    if (
      (email === "alex.morgan@fitwise.ai" || displayName === "Alex Morgan") &&
      (!password || password === "demo1234")
    ) {
      const authRes = authenticateUser("alex.morgan@fitwise.ai", "demo1234");
      if (authRes.success) {
        saveActiveSession(authRes.user, true);
        setIsLoggedIn(true);
        setUser(authRes.user.profile);
        showToast("Signed in as Alex Morgan (Demo Account)!", "success");
        closeAuthModal();
        navigateTo('dashboard');
        return { success: true, user: authRes.user };
      }
    }

    const authRes = authenticateUser(email, password);
    if (!authRes.success) {
      showToast(authRes.error, "error");
      return authRes;
    }

    saveActiveSession(authRes.user, rememberMe);
    setIsLoggedIn(true);
    setUser(authRes.user.profile);
    showToast(`Welcome back, ${authRes.user.name}! Signed in successfully.`, "success");
    closeAuthModal();
    navigateTo('dashboard');
    return { success: true, user: authRes.user };
  };

  const register = (data) => {
    const regRes = registerUser({
      name: data.name,
      email: data.email,
      password: data.password,
      defaultGuestProfile
    });

    if (!regRes.success) {
      showToast(regRes.error, "error");
      return regRes;
    }

    saveActiveSession(regRes.user, true);
    setIsLoggedIn(true);
    setUser(regRes.user.profile);
    showToast(`Account created for ${regRes.user.name}! Let's personalize your fitness profile.`, "success");
    closeAuthModal();
    navigateTo('profile-setup');
    return { success: true, user: regRes.user };
  };

  const resetPassword = (email, newPassword) => {
    const res = resetUserPassword(email, newPassword);
    if (res.success) {
      showToast(res.message, "success");
    } else {
      showToast(res.error, "error");
    }
    return res;
  };

  const logout = () => {
    clearActiveSession();
    setIsLoggedIn(false);
    setUser(defaultGuestProfile);
    showToast("Logged out successfully.", "info");
    navigateTo('landing');
  };

  // Profile Update Handler
  const updateProfile = (updatedFields) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      if (updated.email) {
        updateUserProfileInDB(updated.email, updated);
        saveActiveSession({ email: updated.email, name: updated.name, profile: updated });
      }
      return updated;
    });
    showToast("Profile settings updated successfully!", "success");
  };

  // Water Tracker Handlers
  const addWater = (amountLiters) => {
    setWaterConsumed((prev) => {
      const updated = Math.min(Number((prev + amountLiters).toFixed(2)), 6.0);
      showToast(`Added ${amountLiters * 1000}ml hydration! (Total: ${updated}L)`, "info");
      return updated;
    });
  };

  const removeWater = (amountLiters) => {
    setWaterConsumed((prev) => {
      const updated = Math.max(Number((prev - amountLiters).toFixed(2)), 0);
      return updated;
    });
  };

  const resetWater = () => {
    setWaterConsumed(0);
    showToast("Water tracker reset for today.", "info");
  };

  // Workout Set Handlers
  const toggleSetComplete = (workoutId, exerciseId, setIndex) => {
    setWorkouts((prevWorkouts) =>
      prevWorkouts.map((workout) => {
        if (workout.id !== workoutId) return workout;
        return {
          ...workout,
          exercises: workout.exercises.map((ex) => {
            if (ex.id !== exerciseId) return ex;
            const newSets = [...ex.completedSets];
            newSets[setIndex] = !newSets[setIndex];
            return { ...ex, completedSets: newSets };
          })
        };
      })
    );
  };

  const toggleWorkoutComplete = (workoutId) => {
    setWorkouts((prevWorkouts) =>
      prevWorkouts.map((w) => {
        if (w.id === workoutId) {
          const newStatus = !w.completed;
          showToast(
            newStatus ? `🎉 Workout "${w.title}" completed!` : `Workout marked as in progress.`,
            newStatus ? "success" : "info"
          );
          return { ...w, completed: newStatus };
        }
        return w;
      })
    );
  };

  // Nutrition Meal Handlers
  const addMealItem = (mealKey, item) => {
    setNutrition((prev) => {
      const targetMeal = prev.meals[mealKey];
      if (!targetMeal) return prev;

      const newItem = {
        id: `item-${Date.now()}`,
        name: item.name,
        amount: item.amount || "1 serving",
        calories: Number(item.calories) || 0,
        protein: Number(item.protein) || 0,
        carbs: Number(item.carbs) || 0,
        fat: Number(item.fat) || 0
      };

      const updatedItems = [...targetMeal.items, newItem];
      const updatedTotalCalories = targetMeal.totalCalories + newItem.calories;
      const updatedProtein = targetMeal.protein + newItem.protein;
      const updatedCarbs = targetMeal.carbs + newItem.carbs;
      const updatedFat = targetMeal.fat + newItem.fat;

      showToast(`Logged "${item.name}" to ${targetMeal.name}!`, "success");

      return {
        ...prev,
        meals: {
          ...prev.meals,
          [mealKey]: {
            ...targetMeal,
            items: updatedItems,
            totalCalories: updatedTotalCalories,
            protein: updatedProtein,
            carbs: updatedCarbs,
            fat: updatedFat
          }
        }
      };
    });
  };

  const removeMealItem = (mealKey, itemId) => {
    setNutrition((prev) => {
      const targetMeal = prev.meals[mealKey];
      if (!targetMeal) return prev;

      const itemToRemove = targetMeal.items.find((i) => i.id === itemId);
      if (!itemToRemove) return prev;

      const filteredItems = targetMeal.items.filter((i) => i.id !== itemId);
      return {
        ...prev,
        meals: {
          ...prev.meals,
          [mealKey]: {
            ...targetMeal,
            items: filteredItems,
            totalCalories: Math.max(0, targetMeal.totalCalories - itemToRemove.calories),
            protein: Math.max(0, targetMeal.protein - itemToRemove.protein),
            carbs: Math.max(0, targetMeal.carbs - itemToRemove.carbs),
            fat: Math.max(0, targetMeal.fat - itemToRemove.fat)
          }
        }
      };
    });
  };

  // AI Chat Handlers
  // AI Chat Handlers
  const createNewChat = () => {
    const newId = `session-${Date.now()}`;
    const newSession = {
      id: newId,
      title: "New Conversation",
      createdAt: Date.now(),
      messages: [
        {
          id: `m-${Date.now()}`,
          sender: "assistant",
          text: `👋 Hi **${user.name}**! Starting a fresh chat session. How can I assist you with your fitness, nutrition, or workout goals today? You can also upload a meal or gym photo!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };
    setChatSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(newId);
    showToast("Started new chat conversation.", "info");
    return newId;
  };

  const selectChatSession = (sessionId) => {
    setCurrentSessionId(sessionId);
  };

  const deleteChatSession = (sessionId) => {
    setChatSessions((prev) => {
      const remaining = prev.filter((s) => s.id !== sessionId);
      if (remaining.length === 0) {
        const fresh = {
          id: `session-${Date.now()}`,
          title: "New Conversation",
          createdAt: Date.now(),
          messages: [defaultWelcomeMessage]
        };
        setCurrentSessionId(fresh.id);
        return [fresh];
      }
      if (currentSessionId === sessionId) {
        setCurrentSessionId(remaining[0].id);
      }
      return remaining;
    });
    showToast("Conversation deleted.", "info");
  };

  const sendChatMessage = async (messageText, imageAttachment = null) => {
    const textContent = (messageText || "").trim();
    if (!textContent && !imageAttachment) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: textContent,
      image: imageAttachment?.dataUrl || null,
      imageName: imageAttachment?.name || null,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Update active session messages and auto-title if it's the first message
    setChatSessions((prev) =>
      prev.map((s) => {
        if (s.id === currentSessionId) {
          const isInitialTitle =
            s.title === "New Conversation" ||
            s.title === "Fitness & Nutrition Coach" ||
            s.title === "Fitness & Nutrition Chat";
          const autoTitle =
            isInitialTitle && (textContent || imageAttachment?.name)
              ? (textContent.slice(0, 32) || (imageAttachment ? "Image Analysis" : "Conversation")) + (textContent.length > 32 ? "..." : "")
              : s.title;

          return {
            ...s,
            title: autoTitle,
            messages: [...s.messages, userMsg]
          };
        }
        return s;
      })
    );
    setIsAiTyping(true);

    // Prepare multi-turn history (last 8 messages)
    const cleanHistory = chatMessages
      .filter((m) => m.id !== 'm-welcome' && !m.id.startsWith('m-reset') && (m.text || m.image))
      .slice(-8)
      .map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text || (m.image ? "[User attached an image]" : "")
      }));

    const athleteName = user.name || "Athlete";
    const athleteGoal = user.fitnessGoal || "Overall Health & Strength";

    const systemInstruction = `You are FitWise AI, an expert, personalized, and articulate AI health, fitness, nutrition, and wellness coach—delivering answers with the quality, intelligence, and depth of ChatGPT and Google Gemini.

Athlete Context:
- Name: ${athleteName}
- Primary Goal: ${athleteGoal}
- Dietary Preference: ${user.foodPreference || 'Balanced'}
- Activity Level: ${user.activityLevel || 'Active'}

Guidelines:
1. Directly and specifically answer EXACTLY what the user asks. Never give generic boilerplate.
2. If asked about workouts, exercises, or anatomy: provide clear biomechanical cues, set/rep ranges, target muscle heads, and progression tips.
3. If asked about diet, nutrition, or macros: provide concrete numbers (calories, grams of protein/carbs/fat), food suggestions, and meal timing.
4. If asked about recovery, soreness, sleep, or mindset: give science-backed practical advice with genuine human warmth.
5. If analyzing an image: break down the foods, estimate calories/macros, or identify the gym equipment with proper form cues.
6. Use clean, beautiful Markdown formatting with clear headings, bullet points, and bold emphasis for effortless reading.`;

    const activeKey = (
      localStorage.getItem('fitwise_gemini_api_key') ||
      geminiApiKey ||
      import.meta.env.VITE_GEMINI_API_KEY ||
      ""
    ).trim();

    // 1. Try Direct Google Gemini REST API from browser (CORS enabled, fastest)
    if (activeKey) {
      const modelsToTry = [
        "gemini-3.5-flash-lite",
        "gemini-3.8-flash",
        "gemini-flash-latest",
        "gemini-3.5-flash"
      ];

      const contents = [];
      cleanHistory.forEach((h) => {
        contents.push({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }]
        });
      });

      const userParts = [{ text: textContent || (imageAttachment ? "Please analyze this fitness or nutrition image in detail." : "") }];
      if (imageAttachment && imageAttachment.base64 && imageAttachment.mimeType) {
        userParts.push({
          inline_data: {
            mime_type: imageAttachment.mimeType,
            data: imageAttachment.base64
          }
        });
      }
      contents.push({ role: 'user', parts: userParts });

      for (const model of modelsToTry) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 12000);
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${activeKey}`;

          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              system_instruction: { parts: [{ text: systemInstruction }] },
              contents
            }),
            signal: controller.signal
          });
          clearTimeout(timeoutId);

          if (response.ok) {
            const data = await response.json();
            const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (replyText) {
              const aiMsg = {
                id: `ai-${Date.now()}`,
                sender: "assistant",
                text: replyText,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              };
              setChatSessions((prev) =>
                prev.map((s) => (s.id === currentSessionId ? { ...s, messages: [...s.messages, aiMsg] } : s))
              );
              setIsAiTyping(false);
              return;
            }
          }
        } catch (e) {
          // If model fails or times out, loop tries next model
        }
      }
    }

    // 2. Try Vercel Serverless / Backend /api/chat
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
      const chatEndpoint = isLocal && window.location.port !== "3001" ? "http://localhost:3001/api/chat" : "/api/chat";

      const headers = { "Content-Type": "application/json" };
      if (activeKey) headers["x-gemini-key"] = activeKey;

      const payload = {
        message: textContent,
        history: cleanHistory,
        userContext: {
          name: athleteName,
          fitnessGoal: athleteGoal,
          foodPreference: user.foodPreference,
          sleepDuration: user.sleepDuration,
          activityLevel: user.activityLevel
        }
      };

      if (imageAttachment && imageAttachment.base64 && imageAttachment.mimeType) {
        payload.image = {
          base64: imageAttachment.base64,
          mimeType: imageAttachment.mimeType
        };
      }

      const response = await fetch(chatEndpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data.reply) {
          const aiMsg = {
            id: `ai-${Date.now()}`,
            sender: "assistant",
            text: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setChatSessions((prev) =>
            prev.map((s) => (s.id === currentSessionId ? { ...s, messages: [...s.messages, aiMsg] } : s))
          );
          setIsAiTyping(false);
          return;
        }
      }
    } catch (e) {
      // Backend not running or blocked; seamlessly proceed to smart engine
    }

    // 3. Fallback: Dynamic Smart Fitness Intelligence Engine
    // Never repeats a boilerplate response; specifically answers the user's prompt
    setTimeout(() => {
      const userContext = {
        name: athleteName,
        fitnessGoal: athleteGoal,
        foodPreference: user.foodPreference,
        sleepDuration: user.sleepDuration,
        activityLevel: user.activityLevel
      };
      const smartReply = generateSmartFitnessResponse(textContent, userContext, imageAttachment);

      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: "assistant",
        text: smartReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatSessions((prev) =>
        prev.map((s) => (s.id === currentSessionId ? { ...s, messages: [...s.messages, aiMsg] } : s))
      );
      setIsAiTyping(false);
    }, 450);
  };

  const clearChat = () => {
    setChatSessions((prev) =>
      prev.map((s) => {
        if (s.id === currentSessionId) {
          return {
            ...s,
            messages: [
              {
                id: `m-reset-${Date.now()}`,
                sender: "assistant",
                text: `Chat history cleared. Hi ${user.name}! What would you like to explore next?`,
                timestamp: "Just now"
              }
            ]
          };
        }
        return s;
      })
    );
    showToast("Chat conversation reset.", "info");
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        navigateTo,
        isLoggedIn,
        login,
        register,
        resetPassword,
        logout,
        user,
        updateProfile,
        workouts,
        activeWorkoutCategory,
        setActiveWorkoutCategory,
        toggleSetComplete,
        toggleWorkoutComplete,
        nutrition,
        addMealItem,
        removeMealItem,
        waterConsumed,
        waterTarget,
        addWater,
        removeWater,
        resetWater,
        progress,
        setProgress,
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
        toast,
        showToast,
        geminiApiKey,
        saveGeminiApiKey,
        authModalOpen,
        openAuthModal,
        closeAuthModal,
        authModalTab,
        setAuthModalTab
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
