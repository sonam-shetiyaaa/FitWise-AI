import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialProfile,
  initialWorkouts,
  initialNutrition,
  initialProgress,
  sampleChatKnowledge
} from '../data/mockData';

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

export const AppProvider = ({ children }) => {
  // Navigation State - defaults to 'login'
  const [currentPage, setCurrentPage] = useState('login');
  
  // User Profile & Auth - unauthenticated by default
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(defaultGuestProfile);

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
    } catch (e) {}
    return initialSessions;
  });

  const [currentSessionId, setCurrentSessionId] = useState(() => {
    try {
      const savedId = localStorage.getItem('fitwise_active_session_id_v2');
      if (savedId) return savedId;
    } catch (e) {}
    return "session-1";
  });

  useEffect(() => {
    try {
      localStorage.setItem('fitwise_chat_sessions_v2', JSON.stringify(chatSessions));
    } catch (e) {}
  }, [chatSessions]);

  useEffect(() => {
    try {
      localStorage.setItem('fitwise_active_session_id_v2', currentSessionId);
    } catch (e) {}
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

  // Auth Handlers (Frontend mock)
  const login = (email, password, displayName) => {
    setIsLoggedIn(true);
    let resolvedName = displayName;
    if (!resolvedName && email) {
      const prefix = email.split('@')[0];
      resolvedName = prefix
        .replace(/[._-]/g, ' ')
        .split(' ')
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    }
    if (!resolvedName) resolvedName = "Athlete";

    if (email === "alex.morgan@fitwise.ai" || resolvedName === "Alex Morgan") {
      setUser({
        ...initialProfile,
        name: "Alex Morgan",
        email: "alex.morgan@fitwise.ai"
      });
    } else {
      setUser((prev) => ({
        ...prev,
        email: email || "athlete@fitwise.ai",
        name: resolvedName
      }));
    }

    showToast(`Welcome back, ${resolvedName}! Signed in successfully.`, "success");
    navigateTo('dashboard');
  };

  const register = (data) => {
    setIsLoggedIn(true);
    const resolvedName = data.name || (data.email ? data.email.split('@')[0] : "Athlete");
    setUser((prev) => ({
      ...prev,
      name: resolvedName,
      email: data.email || "athlete@fitwise.ai"
    }));
    showToast(`Account created for ${resolvedName}! Let's personalize your fitness profile.`, "success");
    navigateTo('profile-setup');
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(defaultGuestProfile);
    showToast("Logged out successfully.", "info");
    navigateTo('login');
  };

  // Profile Update Handler
  const updateProfile = (updatedFields) => {
    setUser((prev) => ({ ...prev, ...updatedFields }));
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

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);

      // Prepare multi-turn history (last 8 messages)
      const cleanHistory = chatMessages
        .filter((m) => m.id !== 'm-welcome' && !m.id.startsWith('m-reset') && (m.text || m.image))
        .slice(-8)
        .map((m) => ({
          role: m.sender === 'user' ? 'user' : 'model',
          text: m.text || (m.image ? "[User attached an image]" : "")
        }));

      const payload = {
        message: textContent,
        history: cleanHistory,
        userContext: {
          name: user.name,
          fitnessGoal: user.fitnessGoal,
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

      const chatEndpoint = window.location.port === "3001" ? "/api/chat" : "http://localhost:3001/api/chat";
      const response = await fetch(chatEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      // Backend not running or offline; fallback to local smart engine seamlessly
    }

    // Local smart fitness response fallback
    setTimeout(() => {
      let matchedReply = null;

      if (imageAttachment) {
        matchedReply = `### 📷 Image Received (${imageAttachment.name})\n\nI've received your image! For full computer vision (macro calculation, portion sizing, gym equipment identification), please ensure the local server is running with Google Gemini. Based on your prompt: **"${textContent || 'Image Analysis'}"**, feel free to ask any specific question!`;
      } else {
        const lower = textContent.toLowerCase();
        for (const entry of sampleChatKnowledge) {
          if (entry.keywords.some((kw) => lower.includes(kw))) {
            matchedReply = entry.reply;
            break;
          }
        }

        if (!matchedReply) {
          if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
            matchedReply = `Hello ${user.name}! How can I help you with your fitness, nutrition, or workouts today?`;
          } else if (lower.includes("tired") || lower.includes("fatigue") || lower.includes("exhaust") || lower.includes("sleepy") || lower.includes("low energy")) {
            matchedReply = `I hear you! When feeling tired, take it easy today. Consider an active recovery walk, gentle stretching, staying hydrated, and getting quality sleep tonight. Rest is crucial for progress!`;
          } else if (lower.includes("sore") || lower.includes("pain") || lower.includes("stiff") || lower.includes("ache")) {
            matchedReply = `Muscle soreness is normal after training. Foam rolling, staying hydrated, and light movement can help with blood flow and repair. If you experience joint or sharp pain, make sure to rest that area!`;
          } else if (lower.includes("water") || lower.includes("hydrat")) {
            matchedReply = `You've consumed **${waterConsumed}L** of your **${waterTarget}L** target today! Hydration is vital for muscle function and energy. Have a glass of water now to stay on pace!`;
          } else {
            matchedReply = `Regarding **"${textContent}"**: Consistency, proper form, adequate protein, and quality rest are the pillars of reaching your goals. Let me know if you would like specific exercises, recipes, or training advice!`;
          }
        }
      }

      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: "assistant",
        text: matchedReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatSessions((prev) =>
        prev.map((s) => (s.id === currentSessionId ? { ...s, messages: [...s.messages, aiMsg] } : s))
      );
      setIsAiTyping(false);
    }, 600);
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
        showToast
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
