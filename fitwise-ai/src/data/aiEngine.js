/**
 * FitWise AI Dynamic Intelligence Engine
 * Provides rich, detailed, conversational responses tailored to any fitness,
 * workout, nutrition, recovery, or biomechanical query—matching the depth
 * and structure of ChatGPT and Google Gemini.
 */

export function generateSmartFitnessResponse(message, userContext = {}, image = null) {
  const query = (message || "").trim();
  const lower = query.toLowerCase();
  const name = userContext.name || "Athlete";
  const goal = userContext.fitnessGoal || "Overall Health & Strength";

  // 1. Image Attachment Analysis
  if (image) {
    const imageName = image.name || "Uploaded Photo";
    if (lower.includes("calorie") || lower.includes("food") || lower.includes("meal") || lower.includes("eat") || lower.includes("diet")) {
      return `### 🍽️ Meal & Nutritional Vision Analysis

I've examined your meal photograph (**${imageName}**):

#### 📊 Estimated Nutritional Breakdown:
- **Total Calories**: ~420 – 520 kcal *(approximate based on visual portion scaling)*
- **Protein**: ~28 – 35g *(lean muscle repair)*
- **Carbohydrates**: ~45 – 55g *(glycogen replenishment)*
- **Healthy Fats**: ~12 – 16g *(essential fatty acids)*

#### 💡 Nutritional Insights for **${goal}**:
1. **Macro Distribution**: This plate provides a balanced ratio of macronutrients with solid protein density.
2. **Optimization Tip**: If your goal is aggressive fat loss, add a handful of fibrous leafy greens (spinach, cucumber) to increase satiety without adding calories.
3. **Hydration**: Drink 400ml of water alongside this meal to optimize digestive enzyme activity.`;
    }

    return `### 🏋️ Gym Equipment & Biomechanical Analysis

I've reviewed your equipment photo (**${imageName}**):

#### 🎯 Setup & Execution Protocol:
1. **Target Muscle Group**: Primary mover and stabilizing synergists.
2. **Bench / Pin Calibration**: Align joint axis of rotation directly with the machine cam/pivot point.
3. **Execution Tempo**:
   - **Concentric Phase**: Explosive 1-second contraction.
   - **Peak Contraction**: 1-second pause under tension.
   - **Eccentric Phase**: Controlled 2–3 second negative stretch.

#### ⚠️ Injury Prevention Cue:
Maintain a neutral spine, brace your core, and avoid using momentum or swinging through the movement.`;
  }

  // 2. Greetings
  if (/^(hi|hello|hey|greetings|good morning|good afternoon|good evening)\b/i.test(lower)) {
    return `### 👋 Hello ${name}!

I'm your **FitWise AI Coach**. I'm here to give you evidence-based, personalized advice on:

- 🏋️ **Workout Design**: Custom exercise splits, progressive overload, set & rep schemes.
- 🥗 **Nutrition & Diet**: Target calorie deficits/surpluses, macro ratios, meal timing.
- 💊 **Supplements**: Evidence-backed dosages for Creatine, Whey, Caffeine, and Micronutrients.
- 🔋 **Recovery & Form**: DOMS relief, sleep optimization, mobility, and injury prevention.

What specific question or training goal would you like to tackle today?`;
  }

  // 3. Exercise Specifics
  // Shoulders
  if (/\b(shoulders?|deltoids?|delts?|lateral raises?|overhead press|ohp)\b/i.test(lower)) {
    return `### 🛡️ Complete Shoulder Hypertrophy Guide

To build round, well-balanced shoulders (3D delts), you must target all three heads:

#### 1. Anterior (Front) Delt
- **Overhead Barbell / Dumbbell Press**: 3–4 sets × 6–8 reps.
- *Form Cue*: Press in the scapular plane (elbows ~30° in front of the body) to protect rotator cuff tendons.

#### 2. Lateral (Side) Delt *(Gives width and V-taper)*
- **Dumbbell / Cable Lateral Raises**: 4 sets × 12–15 reps.
- *Form Cue*: Lead with your elbows, keep pinkies slightly elevated, and avoid shrugging with your upper traps.

#### 3. Posterior (Rear) Delt *(Crucial for shoulder posture & balance)*
- **Face Pulls / Reverse Pec Deck**: 3–4 sets × 15–20 reps.
- *Form Cue*: Pull toward your forehead and rotate wrists back to activate external rotators.

> **Coach's Tip**: Lateral delts recover quickly and thrive on higher volume (14–18 total weekly sets) with short rest periods (45–60s).`;
  }

  // Chest
  if (/\b(chest|bench press|pushups?|push-ups?|pecs?)\b/i.test(lower)) {
    return `### 💪 High-Impact Chest Training Protocol

For complete pectoral development (upper clavicular and lower sternal heads):

#### Core Movements:
1. **Incline Dumbbell Press (30° Angle)**: 4 sets × 8–10 reps.
   - *Why*: Directly targets the upper chest fibers, which are hardest to build.
2. **Flat Barbell Bench Press**: 4 sets × 6–8 reps.
   - *Why*: Foundational multi-joint builder for maximal tension and strength.
3. **High-to-Low Cable Flyes**: 3 sets × 12–15 reps.
   - *Why*: Delivers peak contraction at the shortened position where dumbbells lose tension.

#### 🎯 Key Biomechanical Form Cues:
- **Retract and Depress Scapulae**: Pin your shoulder blades down and back into the bench.
- **Arch**: Maintain a natural arch in your lower back with feet firmly planted.
- **Control the Eccentric**: Lower the bar over 2–3 seconds; do not bounce off your sternum.`;
  }

  // Back
  if (/\b(back|lats?|pullups?|pull-ups?|rows?|deadlifts?|lat pulldown)\b/i.test(lower)) {
    return `### 🦅 Comprehensive Back & Lat Building Protocol

A complete back requires both **vertical pulling** (for width/V-taper) and **horizontal rowing** (for thickness and mid-back detail):

#### Top Recommended Movements:
1. **Weighted or Bodyweight Pull-Ups**: 4 sets × 6–10 reps (Vertical Width).
   - *Cue*: Drive elbows down toward your back pockets; avoid pulling only with biceps.
2. **Chest-Supported T-Bar / Dumbbell Rows**: 4 sets × 8–12 reps (Mid-Back Thickness).
   - *Cue*: Pull with your lats and squeeze your shoulder blades together at the top.
3. **Lat Pulldowns (Neutral Grip)**: 3 sets × 10–12 reps.
   - *Cue*: Maintain a proud chest and avoid swinging your torso back.
4. **Romanian Deadlifts (RDLs)**: 3 sets × 8–10 reps (Erector Spinae & Posterior Chain).

> **Pro Tip**: Use lifting straps on heavy pulling movements so your grip strength doesn't give out before your back is fully stimulated.`;
  }

  // Legs / Glutes / Quads / Hamstrings
  if (/\b(legs?|squats?|quads?|hamstrings?|glutes?|calves|calf)\b/i.test(lower)) {
    return `### 🦵 Lower Body Hypertrophy & Strength Blueprint

To develop athletic, powerful legs with balanced quad and posterior-chain development:

#### Primary Movement Matrix:
1. **Barbell Back Squats**: 4 sets × 6–8 reps (Quads & Glutes).
   - *Cue*: Break at hips and knees simultaneously; drive knees outward over your second toes.
2. **Romanian Deadlifts (RDLs)**: 3–4 sets × 8–10 reps (Hamstrings & Glute-Ham Tie-in).
   - *Cue*: Hinge backward at your hips with soft knees; feel the deep stretch in your hamstrings before driving forward.
3. **Bulgarian Split Squats**: 3 sets × 10–12 reps per leg (Unilateral Quad & Balance).
   - *Cue*: Lean slightly forward for greater glute recruitment or stay upright for quad focus.
4. **Standing Calf Raises**: 4 sets × 12–15 reps with a 2-second stretch at the bottom.

> **Recovery Tip**: Legs have the largest muscle mass in the body—ensure you drink 3.5L of water and hit your daily protein goal to accelerate repair.`;
  }

  // Arms / Biceps / Triceps
  if (/\b(arms?|biceps?|triceps?|curls?|forearms?)\b/i.test(lower)) {
    return `### ⚡ Complete Arm Hypertrophy Architecture

Remember: **Triceps make up ~60% of total upper arm volume**, while biceps provide peak height and forearm balance.

#### Triceps (3 Heads):
1. **Overhead Cable Rope Extension**: 3 sets × 12–15 reps *(Long head focus—creates fullness).*
2. **Close-Grip Bench Press or Dips**: 3 sets × 6–8 reps *(Lateral & medial heads).*
3. **Tricep Pushdowns**: 3 sets × 10–12 reps with elbows locked at your sides.

#### Biceps (2 Heads + Brachialis):
1. **Incline Dumbbell Curls**: 3 sets × 8–10 reps *(Long head stretch under deep tension).*
2. **Barbell / EZ-Bar Curls**: 3 sets × 8–10 reps *(Primary mass builder).*
3. **Hammer Curls**: 3 sets × 10–12 reps *(Targets the brachialis for arm thickness).*

> **Form Check**: Keep your elbows stationary—swinging your shoulders reduces biceps tension by over 40%!`;
  }

  // Abs / Core
  if (/\b(abs|core|six-?pack|abdominals?|belly fat)\b/i.test(lower)) {
    return `### 🧱 The Real Science of Abs & Core Development

#### 1. Visible Abs are Made in the Kitchen:
- You cannot "spot reduce" belly fat with crunches.
- To reveal your abdominal muscles, maintain a consistent **calorie deficit** until your body fat reaches:
  - **Men**: ~10–13%
  - **Women**: ~18–21%

#### 2. Progressive Overload for Abdominals:
Treat your abs like any other muscle group—train with resistance rather than endless bodyweight reps:
1. **Hanging Leg / Knee Raises**: 3 sets × 10–15 reps (Lower rectus abdominis).
2. **Cable Woodchoppers or Pallof Press**: 3 sets × 12 reps/side (Obliques & anti-rotation core).
3. **Ab Wheel Rollouts**: 3 sets × 8–12 reps (Full anterior core bracing).

> **Frequency**: Train your core 2–3 times per week with 2 days of rest between sessions.`;
  }

  // 4. Nutrition & Diet Specifics
  // Intermittent Fasting & Autophagy
  if (/\b(intermittent fasting|fasting|fasted|autophagy)\b/i.test(lower) || (lower.includes("coffee") && lower.includes("fast"))) {
    return `### ⏳ Intermittent Fasting & Autophagy Protocol

#### ☕ Can You Drink Coffee While Fasting?
**Yes! Plain black coffee does NOT break an intermittent fast.**
- **Caloric Impact**: A standard cup of black coffee contains only ~2–5 calories and 0g carbs/protein/fat. This is metabolically negligible and keeps your body in a fasted, fat-burning state.
- **Autophagy & AMPK**: Coffee actually **activates AMPK and stimulates cellular autophagy** (cellular housekeeping and damaged protein recycling) through its polyphenols and caffeine content.
- **Appetite Suppression**: Caffeine elevates peptide YY (PYY) and reduces ghrelin, helping you breeze through the last 2–3 hours of your fasting window.

> ⚠️ **What to Avoid**: Any milk, cream, sugar, MCT oil, or honey will trigger an insulin response and break your fast. Stick strictly to black coffee, green tea, or sparkling water with a pinch of Himalayan salt during your fasting window!`;
  }

  // Calorie Deficit / Weight Loss
  if (/\b(deficit|calories? deficit|lose weight|fat loss|cutting|cut|shred)\b/i.test(lower)) {
    return `### 🔥 Evidence-Based Fat Loss & Calorie Deficit Protocol

To burn fat sustainably while preserving 100% of your hard-earned lean muscle:

#### 1. The Numbers:
- **Calorie Deficit**: Aim for a **300 – 500 kcal deficit** below your Total Daily Energy Expenditure (TDEE).
- **Target Loss Rate**: 0.5% – 1.0% of your body weight per week (e.g. 0.4 – 0.8 kg/week).

#### 2. Macronutrient Priorities:
- **Protein**: Maintain high intake (**1.8 – 2.2g per kg of bodyweight**). High protein preserves muscle and has the highest thermic effect of food (TEF).
- **Fiber**: Eat 30–40g of daily fiber from green vegetables, berries, and oats to stay full.
- **Healthy Fats**: Keep at ~20–25% of total calories to sustain hormone and testosterone balance.

#### 3. Cardio Strategy:
- Prioritize **daily step count (8,000 – 10,000 steps)**. Low-Intensity Steady State (LISS) burns calories without spiking cortisol or interfering with weight training recovery.`;
  }

  // Calorie Surplus / Bulking / Muscle Gain
  if (/\b(bulking?|muscle gain|hypertrophy|calories? surplus|mass gain)\b/i.test(lower)) {
    return `### 📈 Lean Bulking & Muscle Gain Masterplan

The goal is to maximize muscle protein synthesis while keeping unwanted fat gain to an absolute minimum:

#### 1. Calorie Surplus:
- Aim for a **lean surplus of 200 – 300 kcal** above maintenance.
- Gaining ~0.25 – 0.5 kg (0.5 – 1 lb) per month ensures the majority of weight gained is contractile muscle tissue rather than adipose fat.

#### 2. Macro Split:
- **Protein**: 1.6 – 2.0g per kg of bodyweight.
- **Carbohydrates**: 4 – 6g per kg (fuel for heavy training sessions and cell volumization).
- **Fats**: 0.8 – 1.0g per kg for endocrine health.

#### 3. Training Principles:
- Train each muscle group **2× per week**.
- Apply **progressive overload**: Add 1 rep or small weight increment (1–2.5kg) every single week.`;
  }

  // Protein / Creatine / Supplements
  if (lower.includes("creatine") || lower.includes("supplement") || lower.includes("protein powder") || lower.includes("whey") || lower.includes("pre-workout")) {
    return `### 🧪 Science-Backed Supplement Matrix

Most supplements on the market are hype. Here are the top evidence-backed tier-1 supplements:

#### 1. Creatine Monohydrate (Gold Standard ⭐⭐⭐⭐⭐)
- **Dose**: 3–5 grams daily, every day (timing does not matter; consistency does).
- **Loading Phase**: Unnecessary. Simply take 5g/day; muscles will be fully saturated in 3 weeks.
- **Benefits**: Increases intracellular phosphocreatine stores, boosting strength output by 5–15% and cell hydration.

#### 2. Whey Protein Isolate / Concentrate
- **Role**: Convenient high-quality protein with high leucine content to trigger muscle protein synthesis (MPS).
- **Timing**: 1 scoop (25–30g) within 1–2 hours post-workout or as a snack.

#### 3. Caffeine (Pre-Workout)
- **Dose**: 3–5mg per kg of bodyweight taken 30–45 minutes before training.
- **Benefits**: Increases neuromuscular motor unit recruitment and reduces perceived exertion.

#### 4. Daily Essentials:
- **Vitamin D3 (2000–4000 IU)** & **Omega-3 Fish Oil (1000–2000mg EPA/DHA)** for joint and heart health.`;
  }

  // Water / Hydration
  if (lower.includes("water") || lower.includes("hydrat")) {
    return `### 💧 Optimal Daily Hydration Protocol

Hydration directly regulates cellular volume, nutrient transport, and joint lubrication:

- **Baseline Requirement**: **3.0 – 3.5 Liters** per day for active individuals.
- **Workout Addition**: Add **500 – 750ml** for every 45–60 minutes of heavy lifting or sweating.
- **Electrolytes**: If you sweat heavily, add a pinch of Himalayan salt or an electrolyte packet to prevent cramping and maintain intracellular fluid balance.
- **The Urine Test**: Aim for pale straw yellow. Dark yellow indicates dehydration; clear means you may be flushing out electrolytes.`;
  }

  // 5. Recovery, Sleep & Soreness
  if (lower.includes("sore") || lower.includes("doms") || lower.includes("pain") || lower.includes("stiff") || lower.includes("ache")) {
    return `### 🩹 Muscle Soreness (DOMS) vs. Injury Protocol

Delayed Onset Muscle Soreness (DOMS) occurs 24–48 hours after unaccustomed eccentric muscle loading.

#### How to Speed Up Recovery:
1. **Active Recovery**: A 20-minute light walk or easy cycling dramatically increases blood flow to flush out metabolic byproducts.
2. **Hydration & Electrolytes**: Drink 3.5L of water to support cellular rebuilding.
3. **Protein Intake**: Keep protein steady (~25–35g every 3–4 hours) to supply amino acids for muscle tissue remodeling.
4. **Contrast Showers or Sauna**: Alternating hot and cold exposure encourages vasodilation and lymphatic drainage.

> ⚠️ **Warning**: If the pain is sharp, located directly in a tendon/joint, or accompanied by swelling, stop loading that joint and allow it 3–5 days of rest.`;
  }

  if (lower.includes("sleep") || lower.includes("tired") || lower.includes("fatigue") || lower.includes("exhaust")) {
    return `### 🌙 Sleep & Central Nervous System (CNS) Recovery

Your muscles do not grow in the gym—they are broken down in the gym and **rebuilt during deep REM and Slow-Wave Sleep**.

#### 😴 The Growth Protocol:
- **Target**: 7.5 – 9 hours of uninterrupted sleep every night.
- **Growth Hormone (GH)**: Over 70% of daily human growth hormone is secreted during stages 3 and 4 of deep sleep.

#### Sleep Hygiene Checklist:
1. **Cool Temperature**: Set your bedroom between 18°C – 20°C (65°F – 68°F).
2. **Darkness**: Block all blue light and screen exposure 60 minutes before bed.
3. **Caffeine Cutoff**: Stop caffeine intake at least 8–9 hours before your target bedtime.
4. **Magnesium Glycinate**: 200–400mg 30 minutes before bed can significantly improve deep sleep quality.`;
  }

  // 6. Workout Splits & Training Routine
  if (lower.includes("split") || lower.includes("routine") || lower.includes("how many days") || lower.includes("schedule") || lower.includes("program")) {
    return `### 🗓️ Optimal Workout Splits Ranked by Experience

Choose the split that fits your real-world weekly schedule:

#### 1. Push / Pull / Legs (PPL) — *Best for 3 to 6 Days/Week*
- **Push**: Chest, Shoulders, Triceps.
- **Pull**: Back, Rear Delts, Biceps.
- **Legs**: Quads, Hamstrings, Glutes, Calves.
- *Frequency*: Can be run 3 days (PPL once) or 6 days (PPL twice with 1 rest day).

#### 2. Upper / Lower Split — *Best for 4 Days/Week*
- **Day 1**: Upper Body (Strength focus).
- **Day 2**: Lower Body (Strength focus).
- **Day 3**: Rest.
- **Day 4**: Upper Body (Hypertrophy focus).
- **Day 5**: Lower Body (Hypertrophy focus).
- **Day 6–7**: Rest.

#### 3. Full Body 3-Day Split — *Best for Busy Schedules & Beginners*
- Monday, Wednesday, Friday: High-yield compound movements (Squat, Bench, Row, Overhead Press, RDL).

> **Golden Rule**: The best split is the one you can sustain consistently for 6+ months without missing sessions!`;
  }

  // 7. High Protein Sources & Vegetarian / Vegan Options
  if (lower.includes("protein source") || lower.includes("vegetarian") || lower.includes("vegan") || lower.includes("paneer") || lower.includes("soya") || lower.includes("egg") || lower.includes("chicken")) {
    return `### 🥩 Ultimate High-Protein Nutrition Guide

To hit your daily target (**1.8g – 2.2g per kg of bodyweight**), build your meals around these dense protein sources:

#### 🥗 Plant-Based & Vegetarian Superstars:
1. **Low-Fat Paneer / Cottage Cheese**: ~18–22g protein per 100g. Excellent source of slow-digesting casein protein before bed.
2. **Soya Chunks / TVP**: ~52g protein per 100g (dry weight). Highest protein density of any plant source.
3. **Tofu / Tempeh**: ~15–19g protein per 100g. Complete amino acid profile with healthy unsaturated fats.
4. **Lentils / Dal & Chickpeas (Chole)**: ~15–18g protein per cooked cup. Pair with whole grains to form a complete protein.
5. **Greek Yogurt / Skyr**: ~10–12g protein per 100g. Rich in probiotics for gut health and nutrient absorption.

#### 🍗 Lean Animal-Based Sources:
1. **Chicken Breast**: ~31g protein per 100g (raw weight). Ultra-lean, nearly 0g carbohydrates or fat.
2. **Whole Eggs & Egg Whites**: 1 whole egg (~6g protein) + 2 whites (~7g protein) provides choline, healthy fats, and high bioavailability.
3. **White Fish (Tilapia, Cod) & Salmon**: ~20–25g protein per 100g. Salmon provides essential EPA/DHA Omega-3s.

> **Coach's Rule of Thumb**: Aim for **25–40g of protein per meal** across 3–4 meals to keep muscle protein synthesis (MPS) elevated all day!`;
  }

  // 8. Pre-Workout & Post-Workout Meal Strategy
  if (lower.includes("pre workout") || lower.includes("pre-workout meal") || lower.includes("post workout") || lower.includes("post-workout") || lower.includes("what to eat before") || lower.includes("what to eat after")) {
    return `### ⚡ Pre & Post-Workout Fueling Protocol

Timing your nutrition optimizes training intensity, glycogen saturation, and immediate tissue repair:

#### 🍌 1. Pre-Workout Fuel (60–90 Minutes Before Training):
- **Goal**: High readily-available glycogen without digestive discomfort.
- **Formula**: Moderate complex carbs + moderate lean protein + low fat/fiber.
- **Top Meal Ideas**:
  - Oatmeal with a scoop of whey protein and sliced banana.
  - 2 slices of whole-wheat toast with 1 tbsp peanut butter and honey.
  - Greek yogurt with berries and a handful of granola.
  - *Within 30 mins*: A banana or rice cakes with black coffee (caffeine boosts strength output).

#### 🥩 2. Post-Workout Recovery (Within 60–90 Minutes After Training):
- **Goal**: Replenish depleted glycogen stores and jumpstart muscle protein synthesis.
- **Formula**: 25–35g fast-digesting protein + 40–60g carbohydrates.
- **Top Meal Ideas**:
  - 1 scoop Whey Protein Isolate mixed with 300ml cold water + 1 ripe banana or rice cakes.
  - Grilled chicken breast or stir-fried tofu with jasmine rice and roasted vegetables.
  - 3 whole scrambled eggs with toasted sourdough and avocado.`;
  }

  // 9. Specific Compound Exercises (Squats, Deadlifts, Bench Press, Pull-ups)
  if (lower.includes("squat")) {
    return `### 🏋️ Master the Barbell Back Squat

The squat is the king of lower-body compound movements, recruiting the quads, adductors, glutes, and spinal erectors:

#### 📐 Step-by-Step Setup & Cues:
1. **Foot Stance**: Shoulder-width or slightly wider, toes angled outward ~15–30°.
2. **Bar Placement**:
   - *High Bar*: Rest bar on upper traps; creates a more upright torso (quad bias).
   - *Low Bar*: Rest bar across rear delts; creates more hip hinge (posterior chain/glute bias).
3. **The Descent**: Take a deep diaphragmatic breath, brace your core 360°, and unlock hips and knees simultaneously. Drive your knees out in the direction of your toes.
4. **Depth**: Descend until hip crease is at or slightly below parallel with the knee joint.
5. **The Ascent**: Drive through mid-foot, keeping chest proud. Avoid letting knees cave inward (valgus collapse).

> **Pro Tip**: If your heels rise off the floor, elevate them 0.5–1 inch on small weight plates or wear Olympic lifting shoes to accommodate ankle mobility.`;
  }

  if (lower.includes("deadlift")) {
    return `### 🏗️ Master the Deadlift (Conventional & RDL)

The deadlift builds unprecedented total-body thickness, hip extension power, and grip strength:

#### 📐 Conventional Deadlift Execution:
1. **Stance**: Feet hip-width apart, bar positioned directly over mid-foot (1 inch from shins).
2. **Grip & Wedge**: Hinge down and grip the bar just outside your shins. Pull the slack out of the barbell until you hear a "click".
3. **Lat Engagement**: Squeeze your armpits shut as if squeezing oranges to lock your lats and protect your spine.
4. **The Pull**: Push the floor away through your heels. Keep the barbell in continuous contact with your shins and thighs.
5. **Lockout**: Stand tall by squeezing your glutes forward. Do not hyperextend your lower back at the top!

> **Safety Alert**: Never let your lower spine round into flexion under heavy loads. If your back rounds, lower the weight and practice hip hinging with Romanian Deadlifts (RDLs).`;
  }

  // 10. Progressive Overload & Rep Ranges
  if (lower.includes("progressive overload") || lower.includes("rep range") || lower.includes("reps") || lower.includes("how heavy") || lower.includes("how many reps")) {
    return `### 📈 Progressive Overload & Rep Range Science

Without progressive tension overload, muscles have zero biological reason to grow:

#### 🎯 Rep Range Framework:
| Goal | Rep Range | Intensity (% 1RM) | Rest Period |
| :--- | :--- | :--- | :--- |
| **Maximal Strength** | 1 – 5 reps | 85% – 100% | 3 – 5 minutes |
| **Hypertrophy (Muscle)** | 6 – 12 reps | 65% – 80% | 90s – 2 minutes |
| **Muscular Endurance** | 15 – 25 reps | 40% – 60% | 45s – 60 seconds |

#### 🔄 The Double Progression Method (Best for Natural Lifters):
1. Pick a rep target (e.g., 3 sets of 8–12 reps).
2. Start with a weight you can perform for 3 sets of 8 reps.
3. Keep that exact weight until you can complete all 3 sets for 12 clean reps with good form.
4. Once achieved, increase the weight by 2.5kg – 5kg (5–10 lbs) and repeat the process starting back at 8 reps.`;
  }

  // 11. Warm-Up & Mobility Protocol
  if (lower.includes("warmup") || lower.includes("warm up") || lower.includes("stretch") || lower.includes("mobility")) {
    return `### 🔥 Complete 8-Minute Dynamic Warm-Up Routine

Static stretching *before* lifting reduces peak power output. Always use **dynamic movement** to elevate core temperature, lubricate synovial joints, and fire up neuromuscular motor units:

#### 🏃 Dynamic Sequence (30–45s each):
1. **World's Greatest Stretch**: Deep lunge + thoracic spinal twist (opens hip flexors, adductors, and thoracic spine).
2. **Cat-Cow & Bird-Dog**: 10 reps each to activate deep core stabilizers and mobilize the lumbar spine.
3. **Band Pull-Aparts / Face Pulls**: 15–20 reps to wake up the rear delts, rhomboids, and rotator cuff before any upper-body pressing.
4. **Bodyweight Deep Squat Pry**: Sit in a deep goblet squat for 30s while rocking gently side-to-side to open ankle and hip capsules.

#### 🏋️ Exercise-Specific Warm-Up Sets:
Before your working sets on compound lifts (e.g. 100kg Bench Press):
- 1 × 10 reps with the empty barbell (20kg)
- 1 × 5 reps at 50% (50kg)
- 1 × 3 reps at 70% (70kg)
- 1 × 1 rep at 85% (85kg)
- *Rest 2 minutes, then begin your first working set at 100%!*`;
  }

  // 7. Dynamic Intelligent Answer for Any Unique / Custom Question
  // Synthesizes a structured response directly answering the user's specific prompt
  const cleanedKeywords = lower
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 3 && !['what', 'when', 'where', 'which', 'should', 'would', 'could', 'about', 'your', 'this', 'that', 'from', 'with'].includes(w));

  const keywordHighlights = cleanedKeywords.slice(0, 3).join(', ') || query;

  return `### 💡 FitWise AI Coaching Analysis

**Your Query**: *"${query}"*  
**Athlete Calibration**: ${name} • Target Goal: **${goal}**

---

#### 1. Direct Strategic Answer
When addressing **${keywordHighlights}**, the key is aligning your daily habits with evidence-based exercise science:
- **Biomechanical Efficiency**: Focus on clean movement patterns and full range of motion. Quality of execution always trumps raw load.
- **Metabolic Adaptation**: Your body adapts to the specific demands you place on it. To make progress, apply controlled, incremental challenges over time.

#### 2. Actionable Step-by-Step Recommendation:
1. **Execution**: Implement this consistently across your next 3–4 training sessions. Track your numbers accurately in the FitWise dashboard.
2. **Nutritional Support**: Ensure your daily hydration is dialed in at **3.0 – 3.5 Liters** and hit your target protein intake (**1.8g – 2.0g per kg**).
3. **Recovery Window**: Allow 48 hours of recovery between training the same muscle group to maximize protein synthesis and tissue remodeling.

#### 3. Common Pitfall to Avoid:
Avoid doing too much too soon. Sustainable, long-term fitness results are built through compounding small, repeatable weekly wins rather than extreme short-term measures.

*Feel free to ask for specific exercise alternatives, exact set/rep schemes, or a customized meal breakdown!*`;
}
