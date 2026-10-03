# FitWise AI – Personalized Fitness & Nutrition Assistant

A modern, high-performance web application frontend designed for athletes and wellness enthusiasts. Built with **React 19**, **Vite**, modern CSS design systems, and rich responsive interactive components.

---

## 🚀 Key Pages & Features Built

1. **Landing Page (`/`)**:
   - FitWise AI brand identity & logo
   - Headline: *"Your Personal AI Fitness & Nutrition Companion"*
   - Primary & secondary CTAs (*"Get Started"* and *"Explore Features"*)
   - 4 Core Feature Cards: **AI Coaching**, **Personalized Workouts**, **Nutrition Guidance**, and **Progress Tracking**
   - Live athlete metrics and a 3-step interactive onboarding roadmap.

2. **Login / Register Page**:
   - Seamless tabbed switcher between **Sign In** and **Register**
   - Full credentials form with password visibility toggle & validation
   - **Instant Demo Sign In (Alex Morgan)** for rapid exploration with sample data.

3. **Profile Setup Page**:
   - All 15 required biometric & lifestyle parameters:
     - **Biometrics**: Name, Age, Gender, Height (cm), Weight (kg)
     - **Training Preferences**: Fitness Goal, Activity Level, Experience Level, Workout Location, Session Duration
     - **Nutrition & Lifestyle**: Food Preference, Dietary Restrictions, Preferred Cuisine, Daily Water Intake, Target Sleep Window
   - Real-time physiological sidebar preview with live **BMI calculator**, status badge, and **daily target calorie & macro estimate**.

4. **Dashboard Page**:
   - Personalized time-based greeting (*"Good afternoon, Alex!"*) with current active streak counter
   - **Today's Workout Preview**: Category, duration, calorie burn, and exercise snippets
   - **Nutrition Summary**: Consumed vs. remaining daily calorie budget, interactive macro progress meters (Protein, Carbs, Fats)
   - **Water Intake Tracker**: Interactive flask visualization, progress percentage, quick-add buttons (`+250ml Glass`, `+500ml Shaker`, `-250ml`)
   - **Progress Summary**: Current weight, delta loss, target weight, body fat %, and SVG sparkline
   - **Quick AI Coach Action**: Prominent hero banner + floating trigger button to query the AI assistant.

5. **AI Chatbot Page**:
   - Modern conversational interface calibrated to the athlete's goals
   - Suggested quick prompts (e.g. *Optimal Post-Workout Meal*, *30-Min Dumbbell Routine*, *0.5kg Fat Loss Strategy*, *Squat Knee Form*)
   - Realistic typing animation indicator and simulated smart AI responses with formatted markdown, lists, and advice
   - Message copy support and chat history reset.

6. **Workout Page**:
   - Today's workout hero with total duration, calorie burn, and target muscle groups
   - Filter by focus: **Push**, **Pull**, **Legs**, **Cardio**, and **All**
   - Detailed exercise cards with sets, reps, target load, rest periods, and AI biomechanical form cues
   - Interactive set checkboxes with live progress calculation
   - **Interactive Rest Timer Modal**: Built-in countdown timer with presets (30s, 45s, 60s, 90s, 120s), progress ring, and controls.

7. **Nutrition Page**:
   - Four meal breakdown sections: **Breakfast**, **Lunch**, **Dinner**, and **Snacks**
   - Meal items with portion size, calories, and individual macro details
   - Dynamic **Daily Nutrition Overview**: Total calories consumed vs. target, macro progress bars
   - **Log Food / Recipe Modal**: Quick-add presets or custom entry to any meal.

8. **Progress Page**:
   - **Weight Progress Chart**: Interactive multi-point SVG area chart with 8-week history and target trendline
   - **Workout Completion**: 7-day weekly schedule heatmap & streak counter
   - **Water Intake History**: 7-day hydration bar chart vs 3.5L target line
   - **Goal Metrics**: Radial & linear progress tracking for Weight, Body Fat %, Muscle Mass, and Streak
   - **Milestone Badges**: Unlocked achievement badges.

---

## 🛠️ How to Run Locally

### Option 1: From the root directory (`d:\college\FitWise-AI`)
```bash
npm run dev
```

### Option 2: From the Vite app directory (`d:\college\FitWise-AI\fitwise-ai`)
```bash
cd fitwise-ai
npm run dev
```

Then open the local URL in your browser:
👉 **http://localhost:5174/** (or `http://localhost:5173/`)

---

## 🎨 Design System
- **Theme**: Obsidian Slate & Cyber Emerald (`#10b981`), Energetic Cyan (`#06b6d4`), Warm Amber (`#f59e0b`)
- **Typography**: `Plus Jakarta Sans` & `Outfit` via Google Fonts
- **Icons**: `lucide-react`
- **Responsiveness**: Fully responsive across desktop, tablet, and mobile with sliding drawer navigation.