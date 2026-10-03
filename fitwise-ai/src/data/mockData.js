export const initialProfile = {
  name: "Alex Morgan",
  email: "alex.morgan@fitwise.ai",
  age: 26,
  gender: "Male",
  height: 178, // cm
  weight: 74.5, // kg
  targetWeight: 72.0, // kg
  fitnessGoal: "Muscle Gain & Fat Loss",
  activityLevel: "Moderately Active (3-5 sessions/week)",
  fitnessExperience: "Intermediate (1-3 years)",
  workoutLocation: "Commercial Gym",
  workoutDuration: "45-60 min",
  foodPreference: "High-Protein Balanced",
  dietaryRestrictions: "Low Lactose, Moderate Gluten",
  preferredCuisine: "Mediterranean & Asian",
  waterIntake: "3.5 Liters",
  sleepDuration: "7-8 hours",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
};

export const fitnessGoalsList = [
  "Weight Loss & Toning",
  "Muscle Gain & Hypertrophy",
  "Body Recomposition",
  "Endurance & Stamina",
  "Flexibility & Mobility",
  "Athletic Performance"
];

export const activityLevelsList = [
  "Sedentary (Desk job, little movement)",
  "Lightly Active (1-2 light workouts/wk)",
  "Moderately Active (3-5 workouts/wk)",
  "Very Active (6-7 intense sessions/wk)",
  "Extremely Active (Athletic training/physical job)"
];

export const experienceLevelsList = [
  "Beginner (< 6 months)",
  "Intermediate (1-3 years)",
  "Advanced (3+ years)"
];

export const workoutLocationsList = [
  "Commercial Gym",
  "Home Gym (With Equipment)",
  "Home Bodyweight Only",
  "Outdoor & Calisthenics",
  "Hybrid Mix"
];

export const workoutDurationsList = [
  "15-30 min (Express HIIT)",
  "30-45 min (Focused)",
  "45-60 min (Standard)",
  "60+ min (Comprehensive)"
];

export const foodPreferencesList = [
  "High-Protein Balanced",
  "Vegetarian",
  "Vegan (Plant-Based)",
  "Non-Vegetarian",
  "Pescatarian",
  "Ketogenic / Low-Carb"
];

export const dietaryRestrictionsList = [
  "None",
  "Gluten-Free",
  "Dairy-Free / Lactose-Free",
  "Nut Allergy",
  "Low Sodium",
  "Halal",
  "Kosher"
];

export const cuisinesList = [
  "Mediterranean",
  "Asian & Stir Fry",
  "Indian & Spices",
  "Continental / Western",
  "Mexican & Latin",
  "Middle Eastern"
];

export const initialWorkouts = [
  {
    id: "push-hypertrophy",
    title: "Hypertrophy Push & Core",
    tagline: "Chest, Shoulders & Triceps Focus",
    category: "Push",
    duration: "50 mins",
    difficulty: "Intermediate",
    caloriesBurn: 420,
    completed: false,
    exercises: [
      {
        id: "e1",
        name: "Incline Dumbbell Press",
        muscle: "Upper Chest & Front Delts",
        sets: 4,
        reps: "10-12 reps",
        targetWeight: "26 kg each",
        rest: "75s rest",
        tips: "Keep shoulder blades retracted and drive upward through elbows with control.",
        completedSets: [true, true, true, false]
      },
      {
        id: "e2",
        name: "Standing Overhead Military Press",
        muscle: "Shoulders & Core Stability",
        sets: 3,
        reps: "8-10 reps",
        targetWeight: "45 kg barbell",
        rest: "90s rest",
        tips: "Squeeze glutes and brace your abs to prevent lumbar hyperextension.",
        completedSets: [true, true, false]
      },
      {
        id: "e3",
        name: "Cable Chest Flyes (Mid-Height)",
        muscle: "Mid & Inner Pectorals",
        sets: 3,
        reps: "12-15 reps",
        targetWeight: "14 kg/side",
        rest: "60s rest",
        tips: "Maintain a slight bend in the elbows and focus on the peak contraction at center.",
        completedSets: [false, false, false]
      },
      {
        id: "e4",
        name: "Tricep Overhead Rope Extension",
        muscle: "Triceps Long Head",
        sets: 3,
        reps: "12 reps",
        targetWeight: "22 kg",
        rest: "60s rest",
        tips: "Flaring the rope at the peak creates maximum tricep tension.",
        completedSets: [false, false, false]
      },
      {
        id: "e5",
        name: "Hanging Leg Raises",
        muscle: "Lower Abdominals & Hip Flexors",
        sets: 3,
        reps: "15 reps",
        targetWeight: "Bodyweight",
        rest: "45s rest",
        tips: "Avoid swinging; tilt pelvis up towards ribs at the peak of each rep.",
        completedSets: [false, false, false]
      }
    ]
  },
  {
    id: "pull-posterior",
    title: "Pull & Posterior Chain",
    tagline: "Lats, Rhomboids, Biceps & Hamstrings",
    category: "Pull",
    duration: "55 mins",
    difficulty: "Intermediate",
    caloriesBurn: 460,
    completed: true,
    exercises: [
      {
        id: "e6",
        name: "Barbell Deadlift",
        muscle: "Posterior Chain & Erector Spinae",
        sets: 4,
        reps: "6-8 reps",
        targetWeight: "110 kg",
        rest: "120s rest",
        tips: "Push through heels, keep lats engaged and bar tight against shins.",
        completedSets: [true, true, true, true]
      },
      {
        id: "e7",
        name: "Neutral Grip Lat Pulldown",
        muscle: "Latissimus Dorsi",
        sets: 3,
        reps: "10-12 reps",
        targetWeight: "65 kg",
        rest: "75s rest",
        tips: "Drive elbows straight down to your back pockets.",
        completedSets: [true, true, true]
      },
      {
        id: "e8",
        name: "Chest-Supported Dumbbell Rows",
        muscle: "Upper Back & Rhomboids",
        sets: 3,
        reps: "12 reps",
        targetWeight: "22 kg each",
        rest: "60s rest",
        tips: "Pause for 1 second at full squeeze to optimize scapular retraction.",
        completedSets: [true, true, true]
      },
      {
        id: "e9",
        name: "Incline Incline Dumbbell Bicep Curls",
        muscle: "Biceps Brachii",
        sets: 3,
        reps: "12 reps",
        targetWeight: "14 kg each",
        rest: "60s rest",
        tips: "Get a deep stretch at the bottom without shifting shoulders forward.",
        completedSets: [true, true, true]
      }
    ]
  },
  {
    id: "lower-power",
    title: "Lower Body Quad & Glute Power",
    tagline: "Squats, Lunges & Calf Hypertrophy",
    category: "Legs",
    duration: "50 mins",
    difficulty: "Advanced",
    caloriesBurn: 510,
    completed: false,
    exercises: [
      {
        id: "e10",
        name: "Barbell Back Squats",
        muscle: "Quadriceps & Gluteus Maximus",
        sets: 4,
        reps: "8-10 reps",
        targetWeight: "90 kg",
        rest: "100s rest",
        tips: "Descend below parallel with knees tracking over toes smoothly.",
        completedSets: [false, false, false, false]
      },
      {
        id: "e11",
        name: "Bulgarian Split Squats",
        muscle: "Single-leg Quads & Glute Medius",
        sets: 3,
        reps: "10 reps/side",
        targetWeight: "18 kg dumbbells",
        rest: "75s rest",
        tips: "Lean torso slightly forward to recruit deeper glute fibers.",
        completedSets: [false, false, false]
      },
      {
        id: "e12",
        name: "Romanian Dumbbell Deadlifts",
        muscle: "Hamstrings & Glute-Ham Tie-in",
        sets: 3,
        reps: "12 reps",
        targetWeight: "28 kg dumbbells",
        rest: "60s rest",
        tips: "Hinge hips back while keeping a soft bend in knees.",
        completedSets: [false, false, false]
      }
    ]
  },
  {
    id: "hiit-burn",
    title: "High Intensity Cardio & Core Burn",
    tagline: "Metabolic Conditioning & VO2 Max Booster",
    category: "Cardio",
    duration: "25 mins",
    difficulty: "High",
    caloriesBurn: 320,
    completed: false,
    exercises: [
      {
        id: "e13",
        name: "Assault Bike Intervals",
        muscle: "Cardiovascular Engine",
        sets: 6,
        reps: "30s sprint / 30s easy",
        targetWeight: "All-Out Effort",
        rest: "30s rest",
        tips: "Maintain max RPM during sprint intervals.",
        completedSets: [false, false, false, false, false, false]
      },
      {
        id: "e14",
        name: "Kettlebell Swings",
        muscle: "Posterior Hinge & Core",
        sets: 4,
        reps: "20 reps",
        targetWeight: "24 kg",
        rest: "45s rest",
        tips: "Power generates from hip snap, not front delts.",
        completedSets: [false, false, false, false]
      }
    ]
  }
];

export const initialNutrition = {
  dailyTarget: {
    calories: 2450,
    protein: 175, // grams
    carbs: 235,   // grams
    fat: 65,      // grams
    fiber: 32     // grams
  },
  meals: {
    breakfast: {
      id: "breakfast",
      name: "Breakfast",
      time: "8:00 AM",
      totalCalories: 555,
      protein: 38,
      carbs: 64,
      fat: 12,
      items: [
        { id: "b1", name: "Rolled Oats with Cinnamon & Chia", amount: "75g dry", calories: 290, protein: 11, carbs: 48, fat: 5 },
        { id: "b2", name: "Grass-Fed Whey Isolate (Vanilla)", amount: "1 scoop (30g)", calories: 120, protein: 25, carbs: 2, fat: 1 },
        { id: "b3", name: "Organic Blueberries & Sliced Almonds", amount: "60g berries + 15g almonds", calories: 145, protein: 2, carbs: 14, fat: 6 }
      ]
    },
    lunch: {
      id: "lunch",
      name: "Lunch",
      time: "1:00 PM",
      totalCalories: 640,
      protein: 52,
      carbs: 55,
      fat: 18,
      items: [
        { id: "l1", name: "Grilled Lemon Herb Chicken Breast", amount: "180g cooked", calories: 290, protein: 44, carbs: 0, fat: 5 },
        { id: "l2", name: "Tri-Color Quinoa & Steamed Broccoli Bowl", amount: "150g quinoa + 100g broccoli", calories: 240, protein: 8, carbs: 45, fat: 4 },
        { id: "l3", name: "Extra Virgin Olive Oil & Lemon Vinaigrette", amount: "1 tbsp", calories: 110, protein: 0, carbs: 10, fat: 9 }
      ]
    },
    dinner: {
      id: "dinner",
      name: "Dinner",
      time: "7:30 PM",
      totalCalories: 635,
      protein: 46,
      carbs: 48,
      fat: 22,
      items: [
        { id: "d1", name: "Wild Alaskan Salmon Fillet", amount: "190g fillet", calories: 380, protein: 40, carbs: 0, fat: 20 },
        { id: "d2", name: "Roasted Rosemary Sweet Potato Cubes", amount: "180g roasted", calories: 190, protein: 3, carbs: 44, fat: 1 },
        { id: "d3", name: "Garlic Sauteed Asparagus & Mushrooms", amount: "120g mix", calories: 65, protein: 3, carbs: 4, fat: 1 }
      ]
    },
    snacks: {
      id: "snacks",
      name: "Snacks",
      time: "4:30 PM",
      totalCalories: 345,
      protein: 22,
      carbs: 24,
      fat: 14,
      items: [
        { id: "s1", name: "0% Greek Yogurt with Honey Swirl", amount: "170g container", calories: 180, protein: 17, carbs: 16, fat: 1 },
        { id: "s2", name: "Raw Walnuts & Pumpkin Seed Blend", amount: "25g portion", calories: 160, protein: 5, carbs: 7, fat: 13 },
        { id: "s3", name: "Sparkling Water with Fresh Lime", amount: "330 ml", calories: 5, protein: 0, carbs: 1, fat: 0 }
      ]
    }
  }
};

export const initialProgress = {
  currentWeight: 74.5,
  startingWeight: 78.0,
  targetWeight: 72.0,
  weightHistory: [
    { week: "Wk 1", date: "Aug 15", weight: 78.0 },
    { week: "Wk 2", date: "Aug 22", weight: 77.4 },
    { week: "Wk 3", date: "Aug 29", weight: 76.8 },
    { week: "Wk 4", date: "Sep 05", weight: 76.1 },
    { week: "Wk 5", date: "Sep 12", weight: 75.6 },
    { week: "Wk 6", date: "Sep 19", weight: 75.1 },
    { week: "Wk 7", date: "Sep 26", weight: 74.8 },
    { week: "Wk 8", date: "Today", weight: 74.5 }
  ],
  workoutStreak: 14, // days
  weeklyCompletion: [
    { day: "Mon", status: "completed", title: "Push Hypertrophy", minutes: 52 },
    { day: "Tue", status: "completed", title: "Pull & Lats", minutes: 48 },
    { day: "Wed", status: "completed", title: "Zone 2 Cardio & Core", minutes: 35 },
    { day: "Thu", status: "completed", title: "Legs & Power", minutes: 55 },
    { day: "Fri", status: "completed", title: "Upper Recomp", minutes: 50 },
    { day: "Sat", status: "completed", title: "HIIT Conditioning", minutes: 30 },
    { day: "Sun", status: "rest", title: "Mobility & Rest", minutes: 20 }
  ],
  waterHistory: [
    { day: "Mon", amount: 3.6, target: 3.5 },
    { day: "Tue", amount: 3.4, target: 3.5 },
    { day: "Wed", amount: 3.8, target: 3.5 },
    { day: "Thu", amount: 3.5, target: 3.5 },
    { day: "Fri", amount: 3.7, target: 3.5 },
    { day: "Sat", amount: 3.2, target: 3.5 },
    { day: "Today", amount: 2.75, target: 3.5 }
  ],
  bodyMetrics: {
    bodyFat: { current: 15.8, start: 19.5, target: 13.5, unit: "%" },
    muscleMass: { current: 36.4, start: 34.8, target: 38.0, unit: "kg" },
    waistCircumference: { current: 79, start: 84, target: 76, unit: "cm" },
    restingHeartRate: { current: 54, start: 62, target: 50, unit: "bpm" }
  },
  achievements: [
    { id: 1, title: "14-Day Iron Streak", desc: "Logged 14 consecutive active training days", icon: "Flame", unlocked: true },
    { id: 2, title: "Hydration Champion", desc: "Hit 3.5L water target 6 out of 7 days this week", icon: "Droplets", unlocked: true },
    { id: 3, title: "Century Pulls", desc: "Surpassed 100 total logged pull-ups", icon: "Trophy", unlocked: true },
    { id: 4, title: "Macro Mastermind", desc: "Stayed within 5% of daily protein target for 10 days", icon: "Target", unlocked: true },
    { id: 5, title: "Sub-15% Club", desc: "Reach 14.9% body fat target", icon: "Award", unlocked: false }
  ]
};

export const sampleChatSuggestions = [
  "What is the optimal post-workout meal for muscle protein synthesis?",
  "Can you create a 30-minute high-energy dumbbells-only upper body routine?",
  "How should I adjust my macros if I want to lose 0.5kg this week?",
  "My knees feel slight discomfort during squats. What form cues help?",
  "Give me 3 high-protein snack ideas under 200 calories that require no cooking"
];

export const sampleChatKnowledge = [
  {
    keywords: ["post-workout", "protein synthesis", "eat after workout", "post workout meal"],
    reply: `### 🥩 Optimal Post-Workout Nutrition Protocol

To maximize **Muscle Protein Synthesis (MPS)** and replenish glycogen stores effectively:

1. **Target Protein**: Consume **0.4 - 0.5g of protein per kg of bodyweight** within 90 minutes post-training (~30–40g high-quality leucine-rich protein).
2. **Carbohydrate Co-Ingestion**: Pair your protein with **0.8 - 1.0g per kg of fast-to-moderate digesting carbs** (e.g. white rice, banana, oats, or honey) to spike insulin and shuttle amino acids into recovering myocytes.
3. **Hydration & Electrolytes**: Drink at least 500–750ml of water with a pinch of pink Himalayan salt and potassium.

**Recommended Meal Example:**
- 1 scoop Whey Protein Isolate + 1 sliced banana + 1 cup almond milk + 1 tbsp peanut butter blend
- *or* 180g grilled chicken tenderloins with 1.5 cups jasmine rice and steamed zucchini.`
  },
  {
    keywords: ["30-minute", "dumbbells", "upper body", "routine", "quick workout"],
    reply: `### 🔥 30-Minute High-Energy Dumbbell Upper Body Routine

Here is a time-efficient, non-competing superset routine designed for intense metabolic output and hypertrophy:

* **Warm-up (3 mins)**: Arm circles, band pull-aparts, thoracic rotations.

#### Superset A (3 Rounds - 9 mins)
- **A1. Incline Dumbbell Bench Press**: 10-12 reps (controlled 3s eccentric)
- **A2. Two-Point Dumbbell Rows**: 10-12 reps per side
- *Rest 60s between rounds*

#### Superset B (3 Rounds - 9 mins)
- **B1. Standing Dumbbell Lateral Raises**: 12-15 reps (thumbs slightly lower than pinkies)
- **B2. Neutral-Grip Overhead Arnold Press**: 8-10 reps
- *Rest 60s between rounds*

#### Finisher Circuit (2 Rounds - 6 mins)
- **C1. Dumbbell Hammer Curls**: 12 reps
- **C2. Overhead Tricep Dumbbell Extension**: 12 reps
- **C3. Hollow Body Hold**: 30 seconds
- *Cool-down stretch (3 mins)*`
  },
  {
    keywords: ["lose", "deficit", "adjust macros", "weight loss", "0.5kg"],
    reply: `### ⚖️ Macro Strategy for 0.5kg/Week Fat Loss

Losing **0.5 kg of fat per week** requires an average daily caloric deficit of approximately **500 kcal** (3,500 kcal deficit total per week).

Based on your current weight (**74.5 kg**) and moderate activity level:

- **Baseline Maintenance**: ~2,450 kcal/day
- **Target Deficit Intake**: **1,950 kcal/day**

#### Recommended Macro Split:
1. **Protein (Priority 1)**: **165g - 175g** (2.2g/kg) → ~700 kcal
   *Protects lean muscle tissue while in a deficit and maximizes satiety.*
2. **Fats (Hormonal Health)**: **50g - 55g** (0.7g/kg) → ~480 kcal
   *Essential for testosterone, thyroid function, and joint cushioning.*
3. **Carbohydrates (Performance)**: **180g - 190g** → ~750 kcal
   *Concentrate 60% of these around your workout window for maximum gym energy.*`
  },
  {
    keywords: ["squat", "knee", "knees", "form", "discomfort"],
    reply: `### 🦵 Knee-Friendly Squat Form & Mechanics

Knee pain during squats is frequently caused by excessive forward knee shear before hip hinging, ankle mobility limitations, or collapsing arches:

1. **Initiate with Hips & Knees Together**: Avoid purely bending at the knees first. Imagine opening a car door with your glutes while your knees track in line with your 2nd and 3rd toes.
2. **Elevate Your Heels Slightly**: Placing 2.5kg plates or squat wedges under your heels reduces ankle dorsiflexion demands and keeps the torso more upright.
3. **Screw Your Feet Into The Ground**: Actively think of rotating your feet outwards without moving them. This fires the gluteus medius and stabilizes the patellar tendon.
4. **Alternative Variations**: Try **Box Squats** or **Goblet Squats** to master vertical shin angles before loading heavy barbell back squats.`
  },
  {
    keywords: ["snack", "under 200", "no cooking", "quick snack"],
    reply: `### ⚡ 3 Zero-Cook High-Protein Snacks (<200 kcal)

1. **Greek Yogurt Crunch** (185 kcal, 19g Protein)
   - 170g non-fat plain Greek yogurt + 10g crushed almonds + a dash of cinnamon and stevia drops.
2. **Smoked Salmon & Cucumber Boats** (170 kcal, 21g Protein)
   - 80g wild smoked salmon rolled around crisp English cucumber spears with 1 tsp light cream cheese.
3. **Cottage Cheese & Berry Swirl** (160 kcal, 20g Protein)
   - 150g low-fat cottage cheese topped with 40g fresh raspberries and a pinch of chia seeds.`
  }
];
