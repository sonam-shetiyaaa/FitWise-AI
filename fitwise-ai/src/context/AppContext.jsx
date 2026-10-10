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
  name: "Alex",
  email: "athlete@nutrifit.app",
  age: 20,
  gender: "Male",
  height: 173,
  weight: 65,
  targetWeight: 70,
  fitnessGoal: "Muscle Hypertrophy",
  goal: "Muscle Hypertrophy",
  activityLevel: "Moderately Active",
  dietaryPreferences: ["Vegetarian", "Non-Veg"],
  dietaryRestrictions: "None",
  fitnessExperience: "Intermediate",
  workoutLocation: "Commercial Gym",
  workoutDuration: "45-60 min",
  foodPreference: "High-Protein Balanced",
  preferredCuisine: "Balanced",
  waterIntake: "3.5 Liters",
  sleepDuration: "7-8 hours",
  avatarUrl: ""
};

const getInitialPage = () => {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('settings')) return 'settings';
    if (path.includes('plans')) return 'plans';
    if (path.includes('coach')) return 'coach';
    if (path.includes('dashboard')) return 'dashboard';
    if (path === '/' || path === '') return 'dashboard';
  }
  return 'dashboard';
};

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // Navigation State - synced with browser URL
  const [currentPage, setCurrentPage] = useState(getInitialPage);

  // User Profile & Auth - defaults to logged-in Alex (matching screenshots)
  const initialSession = getActiveSession();
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nutrifit_logged_in_v1');
      if (saved !== null) return saved === 'true';
    }
    return true; // Default to true
  });
  const [user, setUser] = useState(initialSession?.profile || defaultGuestProfile);

  // Auth Dialog Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('signin');

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
      showToast("Reset to environment Gemini API key.", "info");
    }
  };

  // Saved Plans state (for Meal & Workout Plans)
  const [savedPlans, setSavedPlans] = useState(() => {
    try {
      const saved = localStorage.getItem('nutrifit_saved_plans_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) { }
    return [];
  });

  const addSavedPlan = (plan) => {
    setSavedPlans((prev) => {
      const exists = prev.some((p) => p.id === plan.id || p.title === plan.title);
      if (exists) return prev;
      const updated = [plan, ...prev];
      try {
        localStorage.setItem('nutrifit_saved_plans_v1', JSON.stringify(updated));
      } catch (e) { }
      return updated;
    });
    showToast("Saved to My Plans!", "success");
  };

  const deleteSavedPlan = (planId) => {
    setSavedPlans((prev) => {
      const updated = prev.filter((p) => p.id !== planId);
      try {
        localStorage.setItem('nutrifit_saved_plans_v1', JSON.stringify(updated));
      } catch (e) { }
      return updated;
    });
    showToast("Plan removed from My Plans.", "info");
  };

  // Default demo workout split plan matching Screenshot 4
  const demoSplitPlanData = {
    id: "plan-split-5day",
    title: "5-Day Muscle Hypertrophy Split",
    type: "Workout",
    schedule: [
      { day: "Day 1", focus: "Upper Body A", details: "Barbell/DB Bench Press, Chest-Supported Rows, Overhead Press, Lat Pulldowns, Bicep/Tricep supersets." },
      { day: "Day 2", focus: "Lower Body A", details: "Barbell Back Squats or Leg Press, Romanian Deadlifts (RDLs), Walking Lunges, Calf Raises, Core work." },
      { day: "Day 3", focus: "Rest & Recovery", details: "Light walking, mobility work, and hitting your 130g protein target." },
      { day: "Day 4", focus: "Upper Body B", details: "Incline DB Press, Seated Cable Rows, Lateral Raises, Cable Flyes, Hammer Curls, Dips." },
      { day: "Day 5", focus: "Lower Body B", details: "Bulgarian Split Squats, Leg Extensions, Seated Leg Curls, Glute Bridges, Calf Raises." },
    ],
    footerPrompt: "What would you like to tackle next? We can map out a high-calorie muscle-building meal plan or dive deeper into your progressive overload strategy!"
  };

  const defaultDemoMessage = {
    id: "m-demo-split",
    sender: "assistant",
    text: "Here is your customized progressive overload training plan:",
    plan: demoSplitPlanData,
    timestamp: "11:29 AM"
  };

  const initialSessions = [
    {
      id: "demo-chat-1",
      title: "5-Day Hypertrophy Split",
      createdAt: Date.now(),
      messages: [defaultDemoMessage]
    }
  ];

  const [chatSessions, setChatSessions] = useState(() => {
    try {
      const saved = localStorage.getItem('nutrifit_chat_sessions_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) { }
    return initialSessions;
  });

  const [currentSessionId, setCurrentSessionId] = useState(() => {
    try {
      const savedId = localStorage.getItem('nutrifit_active_session_id_v3');
      if (savedId) return savedId;
    } catch (e) { }
    return "demo-chat-1";
  });

  useEffect(() => {
    try {
      localStorage.setItem('nutrifit_chat_sessions_v3', JSON.stringify(chatSessions));
    } catch (e) { }
  }, [chatSessions]);

  useEffect(() => {
    try {
      localStorage.setItem('nutrifit_active_session_id_v3', currentSessionId);
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

  const getPageTitleAndPath = (page) => {
    let url = '/dashboard';
    let title = 'Dashboard — NutriFit';
    if (page === 'settings' || page === 'profile-setup') {
      url = '/settings';
      title = 'Profile & Settings — NutriFit';
    } else if (page === 'plans') {
      url = '/plans';
      title = 'My Plans — NutriFit';
    } else if (page === 'coach' || page === 'chatbot') {
      url = '/coach/demo-chat-1';
      title = 'AI Coach — NutriFit';
    } else if (page === 'dashboard') {
      url = '/dashboard';
      title = 'Dashboard — NutriFit';
    } else if (page === 'landing') {
      url = '/';
      title = 'NutriFit — Train smarter, eat with precision.';
    }
    return { url, title };
  };

  // Navigation Helper with URL & Title sync
  const navigateTo = (page) => {
    setCurrentPage(page);
    if (typeof window !== 'undefined') {
      const { url, title } = getPageTitleAndPath(page);
      try {
        window.history.pushState({ page }, '', url);
      } catch (e) {}
      document.title = title;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const { title } = getPageTitleAndPath(currentPage);
      document.title = title;
    }
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('settings')) {
        setCurrentPage('settings');
        document.title = 'Profile & Settings — NutriFit';
      } else if (path.includes('plans')) {
        setCurrentPage('plans');
        document.title = 'My Plans — NutriFit';
      } else if (path.includes('coach')) {
        setCurrentPage('coach');
        document.title = 'AI Coach — NutriFit';
      } else if (path.includes('dashboard')) {
        setCurrentPage('dashboard');
        document.title = 'Dashboard — NutriFit';
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Auth Handlers (with strict password & account validation)
  const login = (email, password, displayName, rememberMe = true) => {
    try {
      localStorage.setItem('nutrifit_logged_in_v1', 'true');
    } catch (e) {}

    // If instant demo button used
    if (
      (email === "athlete@nutrifit.app" || email === "alex.morgan@fitwise.ai" || displayName === "Alex" || displayName === "Alex Morgan") &&
      (!password || password === "demo1234")
    ) {
      const demoUser = {
        name: "Alex",
        email: "athlete@nutrifit.app",
        profile: defaultGuestProfile
      };
      saveActiveSession(demoUser, true);
      setIsLoggedIn(true);
      setUser(defaultGuestProfile);
      showToast("Signed in as Alex (NutriFit Demo)!", "success");
      closeAuthModal();
      navigateTo('dashboard');
      return { success: true, user: demoUser };
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
    try {
      localStorage.setItem('nutrifit_logged_in_v1', 'false');
    } catch (e) {}
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

    const systemInstruction = `You are FitWise AI, an advanced, highly intelligent, and versatile AI coach and assistant—matching the breadth, depth, and conversational fluency of ChatGPT and Google Gemini.

You are equipped with universal knowledge across all topics and disciplines:
- General Knowledge, Science, Physics, Chemistry, Biology, Astronomy, Math, and History.
- Technology, Programming, Computer Science, Web Development, and Digital Tools.
- Human Physiology, Anatomy, Neuroscience, Sleep Medicine, Circadian Biology, and Stress Management.
- Workouts, Strength & Conditioning, Hypertrophy, Biomechanics, Calisthenics, Running, and Injury Rehabilitation.
- Nutrition, Dietetics, Metabolism, Macronutrients, Micronutrients, and Hydration.
- Psychology, Habit Formation, Time Management, Productivity, Focus, Motivation, and Everyday Life.

User Context:
- Name: ${athleteName}
- Primary Goal: ${athleteGoal}
- Dietary Preference: ${user.foodPreference || 'Balanced'}
- Activity Level: ${user.activityLevel || 'Active'}

Core Directives & Behavioral Tuning:
1. UNIVERSAL ANSWERING: Directly and thoroughly answer ANY question the user asks across ANY subject. Never refuse a question or claim that you only answer fitness questions.
2. STRICT TOPIC RELEVANCE (NO FORCED NUTRITION PIVOTS): Answer EXACTLY what the user asks. If the user asks about science, technology, history, coding, exercise form, or life habits, focus 100% on that specific topic. DO NOT force-feed nutrition, macros, protein, or diet advice into answers unless the user specifically asks about food, diet, calories, or nutrition!
3. WHEN ASKED ABOUT NUTRITION/DIET: Provide evidence-based nutritional science, exact numbers (calories, grams of protein/carbs/fat), food suggestions, and meal timing tailored to their preferences.
4. WHEN ASKED ABOUT WORKOUTS/BIOMECHANICS: Provide clear anatomical cues, set/rep ranges, target muscle heads, and progression tips.
5. WHEN ASKED ABOUT SCIENCE OR GENERAL KNOWLEDGE: Give lucid, engaging, accurate explanations with real-world examples and analogies.
6. WHEN ANALYZING IMAGES:
   - Food/meal photos: estimate calories, break down macronutrients, and analyze nutritional balance.
   - Gym machine/exercise photos: identify equipment, target muscles, setup steps, and biomechanical safety cues.
   - General images: describe and analyze the visual content helpfully and accurately.
7. FORMATTING & TONE: Warm, articulate, encouraging, and intellectually rigorous. Use clean Markdown formatting with clear headings, bold key terms, and bullet points for effortless readability.`;

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
        "gemini-flash-latest",
        "gemini-3.5-flash",
        "gemini-3.8-flash"
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
      const timeoutId = setTimeout(() => controller.abort(), 25000);
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

      let attachedPlan = null;
      if (textContent.toLowerCase().includes('workout split') || textContent.toLowerCase().includes('4-day')) {
        attachedPlan = {
          id: `plan-${Date.now()}`,
          title: "4-Day Hypertrophy Split",
          type: "Workout",
          schedule: [
            { day: "Day 1", focus: "Upper Body (Power)", details: "Barbell Bench Press 4x6, Barbell Rows 4x6, Overhead Press 3x8, Pull-ups 3x8, Skull Crushers 3x10." },
            { day: "Day 2", focus: "Lower Body (Quad Focus)", details: "Back Squats 4x6, Romanian Deadlifts 3x8, Walking Lunges 3x10/side, Standing Calf Raises 4x12." },
            { day: "Day 3", focus: "Rest & Active Recovery", details: "Light cardio, core mobility, and hitting your 130g protein target." },
            { day: "Day 4", focus: "Upper Body (Hypertrophy)", details: "Incline DB Press 3x10, Lat Pulldowns 3x10, Lateral Raises 4x12, Cable Flyes 3x12, Incline Curls 3x12." },
            { day: "Day 5", focus: "Lower Body (Posterior Focus)", details: "Deadlifts 3x5, Leg Press 3x10, Hamstring Curls 3x12, Hanging Leg Raises 3x15." },
          ],
          footerPrompt: "What would you like to tackle next? We can map out a high-protein meal plan or customize set/rep progressions!"
        };
      } else if (textContent.toLowerCase().includes('vegetarian lunch') || textContent.toLowerCase().includes('lunch')) {
        attachedPlan = {
          id: `plan-${Date.now()}`,
          title: "High-Protein Vegetarian Lunch Protocol",
          type: "Meal",
          schedule: [
            { day: "Main", focus: "Paneer / Tofu Quinoa Bowl", details: "200g Grilled Paneer/Tofu with 1 cup cooked quinoa, sauteed bell peppers, spinach, and 1 tbsp olive oil (38g protein, 480 kcal)." },
            { day: "Side", focus: "Lentil Dal / Chickpea Salad", details: "1 bowl Sprouted Moong/Chickpea salad with diced cucumber, tomatoes, lemon, chaat masala (14g protein, 210 kcal)." },
            { day: "Hydration", focus: "Buttermilk / Chia Infusion", details: "Glass of spiced chaas with roasted cumin or lemon chia water (4g protein, 60 kcal)." }
          ],
          footerPrompt: "Hits ~56g protein for lunch! Would you like a healthy snack or dinner recommendation?"
        };
      }

      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: "assistant",
        text: smartReply,
        plan: attachedPlan,
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
        savedPlans,
        addSavedPlan,
        deleteSavedPlan,
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
