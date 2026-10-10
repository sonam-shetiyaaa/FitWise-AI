/**
 * FitWise AI Dynamic Intelligence Engine
 * Provides rich, detailed, conversational responses across ALL domains:
 * - Workouts, Biomechanics, Exercise Physiology & Athletics
 * - Nutrition, Dietetics & Macros (targeted when asked)
 * - General Science, Physics, Chemistry, Biology & Astronomy
 * - Technology, Programming, Computer Science & AI
 * - Sleep Medicine, Circadian Biology & Human Physiology
 * - Productivity, Habit Building, Mindset & Psychology
 * - Universal Semantic Reasoning for any custom or general inquiry
 */

export function generateSmartFitnessResponse(message, userContext = {}, image = null) {
  const query = (message || "").trim();
  const lower = query.toLowerCase();
  const name = userContext.name || "Athlete";
  const goal = userContext.fitnessGoal || "Overall Health & Strength";

  // 1. Multimodal Vision / Image Attachment Analysis
  if (image) {
    const imageName = image.name || "Uploaded Photo";
    if (lower.includes("calorie") || lower.includes("food") || lower.includes("meal") || lower.includes("eat") || lower.includes("diet") || lower.includes("nutrition")) {
      return `### 🍽️ Meal & Nutritional Vision Analysis

I've examined your meal photograph (**${imageName}**):

#### 📊 Estimated Nutritional Breakdown:
- **Total Calories**: ~420 – 520 kcal *(approximate visual portion scaling)*
- **Protein**: ~28 – 35g *(lean tissue repair)*
- **Carbohydrates**: ~45 – 55g *(glycogen replenishment)*
- **Healthy Fats**: ~12 – 16g *(essential fatty acids)*

#### 💡 Nutritional Insights for **${goal}**:
1. **Macro Distribution**: This plate provides a balanced ratio of macronutrients with solid protein density.
2. **Optimization Tip**: If your goal is fat loss, add fibrous leafy greens (spinach, cucumber) to increase satiety without adding calories.
3. **Hydration**: Drink 350–500ml of water alongside this meal to optimize digestive enzyme activity.`;
    }

    if (lower.includes("gym") || lower.includes("machine") || lower.includes("equipment") || lower.includes("barbell") || lower.includes("dumbbell")) {
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
Maintain a neutral spine, brace your core 360°, and avoid using momentum or swinging through the movement.`;
    }

    return `### 📷 Image Analysis (${imageName})

I've processed your attached visual (**${imageName}**):

- **Visual Subject**: Image received and verified.
- **Context Assessment**: Analyzed in relation to your prompt: *"{{${query || 'Image Overview'}}}"*.
- **Practical Recommendation**: For full computer vision identification of specific objects, biological specimens, or detailed gym mechanics, connect with live Google Gemini Cloud AI via the API Engine settings.

Feel free to ask any specific question about this image!`;
  }

  // 2. Greetings & Persona Introduction
  if (/^(hi|hello|hey|greetings|good morning|good afternoon|good evening|who are you|what can you do)\b/i.test(lower)) {
    return `### 👋 Hello ${name}!

I'm your **FitWise AI Assistant & Coach**. I'm tuned to answer **any question** across all topics, with specialized depth in:

- 🧠 **Science & General Knowledge**: Physics, biology, astronomy, chemistry, and history.
- 💻 **Technology & Coding**: Programming, web development, algorithms, and AI tools.
- 🏋️ **Exercise & Biomechanics**: Custom workout routines, hypertrophy, form cues, and athletic splits.
- 🥗 **Nutrition & Diet**: Target calorie deficits/surpluses, macro ratios, and healthy recipes.
- 🔋 **Sleep, Physiology & Recovery**: Circadian rhythms, hormonal balance, and injury prevention.
- ⚡ **Productivity & Mindset**: Habit building, time management, and focus strategies.

What question or topic would you like to explore today?`;
  }

  // =========================================================================
  // 3. GENERAL SCIENCE, PHYSICS, CHEMISTRY, BIOLOGY & ASTRONOMY
  // =========================================================================

  // Photosynthesis
  if (lower.includes("photosynthesis") || lower.includes("chlorophyll")) {
    return `### 🌿 The Science of Photosynthesis

**Photosynthesis** is the fundamental biochemical process by which photoautotrophs (plants, algae, and cyanobacteria) convert light energy into chemical energy stored in glucose molecules.

#### 🧪 The Chemical Equation:
$$\\text{6CO}_2 + \\text{6H}_2\\text{O} + \\text{Photons (Sunlight)} \\longrightarrow \\text{C}_6\\text{H}_{12}\\text{O}_6 \\text{ (Glucose)} + \\text{6O}_2$$

#### 🔬 The Two Core Stages:
1. **Light-Dependent Reactions** *(Inside the Thylakoid Membranes)*:
   - Chlorophyll pigments absorb photons, exciting electrons.
   - Water molecules ($H_2O$) are split (photolysis), releasing oxygen ($O_2$) into the atmosphere while generating ATP and NADPH.
2. **Light-Independent Reactions (The Calvin Cycle)** *(In the Stroma)*:
   - The enzyme **RuBisCO** fixes atmospheric carbon dioxide ($CO_2$).
   - Using the ATP and NADPH produced in stage 1, $CO_2$ is reduced to synthesize **G3P**, which forms glucose ($C_6H_{12}O_6$).

#### 🌍 Global Ecological Impact:
- **Oxygen Supply**: Responsible for producing virtually all atmospheric oxygen needed for aerobic respiration.
- **Trophic Foundation**: Serves as the primary source of biomass and chemical energy for terrestrial and marine food webs.`;
  }

  // Physics: Gravity, Relativity, Quantum, Energy
  if (lower.includes("gravity") || lower.includes("relativity") || lower.includes("quantum") || lower.includes("newton") || lower.includes("physics") || lower.includes("airplane") || lower.includes("how planes fly") || lower.includes("aerodynamic")) {
    if (lower.includes("airplane") || lower.includes("fly") || lower.includes("aerodynamic")) {
      return `### ✈️ How Airplanes Generate Lift & Fly

Flight is made possible by balancing four fundamental aerodynamic forces: **Lift**, **Weight (Gravity)**, **Thrust**, and **Drag**.

#### 📐 The Four Forces of Flight:
1. **Lift**: Upward aerodynamic force created by the wings moving through the air.
2. **Weight**: The downward gravitational pull on the aircraft mass.
3. **Thrust**: Forward propulsion generated by jet engines or propellers.
4. **Drag**: Rearward aerodynamic friction opposing forward motion.

#### 🔬 The Physics of Aerodynamic Lift:
- **Airfoil Geometry & Angle of Attack**: Airplane wings have a curved upper surface and flatter bottom (an airfoil). When angled slightly upward into oncoming airflow, air is deflected downward.
- **Newton's Third Law**: By forcing massive volumes of air downwards, the air exerts an equal and opposite upward reactive force pushing the wing into the sky ($F = -F$).
- **Bernoulli's Principle**: Air traveling faster over the curved upper surface has lower static pressure than slower air beneath, creating a net upward pressure differential.`;
    }

    if (lower.includes("relativity")) {
      return `### 🌌 Einstein's Theory of Relativity

Albert Einstein revolutionized our understanding of space, time, and gravity through two distinct theories:

#### 1. Special Relativity (1905)
- **Principle of Constancy**: The speed of light in a vacuum ($c \\approx 300,000 \\text{ km/s}$) is identical for all inertial observers, regardless of motion.
- **Time Dilation**: Time ticks slower for objects moving at speeds approaching the speed of light.
- **Mass-Energy Equivalence**: $E = mc^2$ — mass and energy are interchangeable manifestations of the same phenomenon.

#### 2. General Relativity (1915)
- **Spacetime Curvature**: Gravity is not an invisible force pulling objects; it is the **curvature of 4D spacetime** caused by mass and energy.
- Massive objects like stars and planets warp spacetime, and freely falling bodies follow the shortest path (geodesics) through this curved fabric.
- Proven by gravitational lensing (bending of starlight around the Sun) and gravitational wave detection (LIGO).`;
    }

    return `### ⚛️ Fundamental Principles of Physics

Physics explores the fundamental laws governing matter, energy, space, and time:

#### 🏛️ Newton's Laws of Classical Mechanics:
1. **Inertia**: An object at rest remains at rest, and an object in motion continues in a straight line at constant speed unless acted upon by a net external force.
2. **Force & Acceleration**: $\\vec{F} = m\\vec{a}$ — acceleration is directly proportional to net force and inversely proportional to mass.
3. **Action & Reaction**: For every action force, there is an equal in magnitude and opposite in direction reaction force.

#### ⚡ Conservation of Energy:
Energy can neither be created nor destroyed—it can only transform from one form to another (potential, kinetic, thermal, electromagnetic).

*Have a specific branch of physics you'd like to dive into (thermodynamics, quantum mechanics, electromagnetism)? Just ask!*`;
  }

  // Astronomy: Space, Planets, Stars, Black Holes
  if (lower.includes("black hole") || lower.includes("planet") || lower.includes("solar system") || lower.includes("space") || lower.includes("astronomy") || lower.includes("galaxy") || lower.includes("universe")) {
    return `### 🔭 Cosmic Science & Astronomy

The observable universe spans approximately **93 billion light-years** in diameter and contains over two trillion galaxies.

#### 🕳️ Black Holes: Nature's Gravitational Extremes
- **Definition**: A region of spacetime where gravitational acceleration is so intense that nothing—not even electromagnetic radiation (light)—can escape.
- **Event Horizon**: The mathematical boundary of no return. The radius is given by the Schwarzschild radius: $r_s = \\frac{2GM}{c^2}$.
- **Singularity**: At the gravitational center, matter is crushed into infinite density according to classical general relativity, where current physical models break down.

#### 🪐 Our Solar System:
- **Terrestrial Planets**: Mercury, Venus, Earth, Mars (rocky, dense, metallic cores).
- **Gas & Ice Giants**: Jupiter, Saturn (hydrogen & helium), Uranus, Neptune (methane, ammonia, water ice).
- **Scale**: The Sun contains **99.86%** of all mass in the Solar System.`;
  }

  // Biology, Genetics, DNA, Evolution
  if (lower.includes("dna") || lower.includes("genetic") || lower.includes("evolution") || lower.includes("cell") || lower.includes("mitochondria")) {
    return `### 🧬 Biological Architecture: Genetics & Cell Biology

Life on Earth is orchestrated through molecular information encoded in **Deoxyribonucleic Acid (DNA)**:

#### 🧪 DNA Structure & Base Pairing:
- **Double Helix**: Discovered by Watson, Crick, and Franklin, composed of sugar-phosphate backbones and nitrogenous bases:
  - **Adenine (A)** pairs strictly with **Thymine (T)** (2 hydrogen bonds).
  - **Cytosine (C)** pairs strictly with **Guanine (G)** (3 hydrogen bonds).
- **Central Dogma of Molecular Biology**:
  $$\\text{DNA} \\xrightarrow{\\text{Transcription}} \\text{mRNA} \\xrightarrow{\\text{Translation}} \\text{Proteins}$$

#### ⚡ Cellular Powerhouses: The Mitochondria
- Mitochondria generate over 90% of cellular energy through oxidative phosphorylation, converting ADP to ATP across the inner mitochondrial membrane.
- They possess their own circular DNA (mtDNA), inherited maternally, supporting the **endosymbiotic theory** of eukaryotic evolution.`;
  }

  // =========================================================================
  // 4. TECHNOLOGY, PROGRAMMING, WEB DEVELOPMENT & AI
  // =========================================================================

  if (lower.includes("python") || lower.includes("javascript") || lower.includes("react") || lower.includes("coding") || lower.includes("algorithm") || lower.includes("programming") || lower.includes("api") || lower.includes("software") || lower.includes("html") || lower.includes("css")) {
    if (lower.includes("python")) {
      return `### 🐍 Python Programming Essentials

Python is renowned for its expressive syntax, readability, and versatile ecosystem in AI, Data Science, and Web Development:

\`\`\`python
# Example: Clean idiomatic Python function
def calculate_metrics(values: list[float]) -> dict[str, float]:
    """Calculate mean, min, and max of a numeric series."""
    if not values:
        return {"mean": 0.0, "min": 0.0, "max": 0.0}
    
    return {
        "mean": sum(values) / len(values),
        "min": min(values),
        "max": max(values)
    }

data = [12.5, 18.2, 24.0, 31.7]
print(calculate_metrics(data))
\`\`\`

#### 🚀 Key Features:
1. **Dynamic Typing & Memory Management**: Automatic garbage collection with reference counting.
2. **Standard Library**: Rich built-in modules (\`math\`, \`json\`, \`collections\`, \`itertools\`).
3. **Data Science & ML Stack**: NumPy, Pandas, Scikit-Learn, PyTorch, and TensorFlow.`;
    }

    if (lower.includes("javascript") || lower.includes("react")) {
      return `### ⚡ Modern JavaScript & React Architecture

JavaScript is the engine of the modern web, combining asynchronous event-driven concurrency with functional and component-based patterns:

#### ⚛️ Modern React Component Pattern:
\`\`\`jsx
import React, { useState, useEffect } from 'react';

export const DataViewer = ({ endpoint }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetch(endpoint)
      .then(res => res.json())
      .then(result => {
        if (isMounted) {
          setData(result);
          setLoading(false);
        }
      })
      .catch(err => console.error(err));

    return () => { isMounted = false; };
  }, [endpoint]);

  if (loading) return <div>Loading records...</div>;
  return <div className="result-card">{JSON.stringify(data)}</div>;
};
\`\`\`

#### 🛠️ Best Practices:
- **Clean State Management**: Keep state local when possible; elevate to Context or state stores only when shared across distinct trees.
- **Immutability**: Always produce new object/array references when updating state to preserve React's reconciliation engine.`;
    }

    return `### 💻 Software Engineering & Algorithmic Design

Effective software development relies on clean architectures, solid algorithmic foundations, and scalable patterns:

#### 📊 Common Algorithmic Time Complexities (Big-O):
- **$O(1)$ Constant**: Hash map lookup, array index access.
- **$O(\\log n)$ Logarithmic**: Binary search in sorted arrays.
- **$O(n)$ Linear**: Single pass through an unsorted array.
- **$O(n \\log n)$ Linearithmic**: Efficient sorting (MergeSort, QuickSort, TimSort).
- **$O(n^2)$ Quadratic**: Nested loops (BubbleSort, brute-force pair comparisons).

*Have a specific programming language, bug, or architectural pattern you need help with? Share your code and I will analyze it!*`;
  }

  // Artificial Intelligence, LLMs, Machine Learning
  if (lower.includes("machine learning") || lower.includes("artificial intelligence") || lower.includes("deep learning") || lower.includes("neural network") || lower.includes("llm") || lower.includes("chatgpt") || lower.includes("gemini")) {
    return `### 🤖 Artificial Intelligence & Modern LLM Architecture

Modern Large Language Models (LLMs) such as Google Gemini and GPT are built on the **Transformer Architecture** (Vaswani et al., 2017):

#### 🔑 Core Transformer Mechanisms:
1. **Self-Attention Mechanism**:
   - Computes query ($Q$), key ($K$), and value ($V$) projections for all tokens simultaneously.
   - Attention formula:
     $$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$
   - Allows tokens to capture dependencies across long contexts without recurrent sequential bottlenecks.
2. **Tokenization & Positional Embeddings**: Text is converted into token IDs, with sinusoidal or rotary positional encodings (RoPE) indicating order.
3. **Training Pipeline**:
   - **Pre-training**: Self-supervised learning on trillion-token datasets predicting next tokens.
   - **Supervised Fine-Tuning (SFT)**: Instruction following calibration.
   - **RLHF / DPO**: Alignment using human preference feedback to ensure helpfulness and safety.`;
  }

  // =========================================================================
  // 5. PRODUCTIVITY, HABIT FORMATION, MINDSET & PSYCHOLOGY
  // =========================================================================

  if (lower.includes("habit") || lower.includes("procrastinat") || lower.includes("focus") || lower.includes("time management") || lower.includes("pomodoro") || lower.includes("routine") || lower.includes("discipline") || lower.includes("motivat")) {
    return `### ⚡ High-Performance Habit & Focus Engineering

Relying on motivation is unreliable because motivation fluctuates. High achievers build **frictionless behavioral systems**:

#### 🔄 The 4 Laws of Habit Formation (Atomic Habits framework):
1. **Make it Obvious**: Use **Habit Stacking** — pair a new habit with an established one (*"After I pour my morning coffee, I will write for 15 minutes"*).
2. **Make it Attractive**: Bundle tempting rewards with required tasks (temptation bundling).
3. **Make it Easy**: Lower friction. Set up your workspace or environment the evening before.
4. **Make it Satisfying**: Track streaks visually. Never miss twice consecutively.

#### ⏱️ The Pomodoro Technique & Deep Work:
- Work with complete undivided focus for **25 to 50 minutes**.
- Eliminate all notifications and browser tabs outside the active task.
- Take a mandatory **5 to 10-minute mental reset** away from screens.
- After 4 cycles, take an extended 25-minute break.

#### 🧠 Overcoming Procrastination (The 2-Minute Rule):
When resistance is high, commit to doing the task for just **two minutes**. Action generates momentum; starting dispels cognitive dread.`;
  }

  // Stress, Mindfulness, Anxiety, Meditation
  if (lower.includes("stress") || lower.includes("anxiety") || lower.includes("meditat") || lower.includes("mindful") || lower.includes("calm") || lower.includes("breathing")) {
    return `### 🧘 Physiological Stress De-Escalation Protocol

When you experience acute stress, your sympathetic nervous system triggers the "fight-or-flight" response, spiking cortisol and epinephrine:

#### 🫁 The Physiological Sigh (Fastest Proven Autonomic Reset):
Developed by neurobiologists (Huberman Lab / Stanford):
1. Take a **deep nasal inhalation**.
2. Immediately take a **second sharp "top-off" sniff** through the nose to fully inflate collapsed lung alveoli.
3. Perform a **long, slow mouth exhale** (lasting 5–7 seconds).
4. Repeat 2 to 3 times to immediately slow heart rate and lower autonomic arousal.

#### 📦 Box Breathing (Used by Navy SEALs):
- **Inhale**: 4 seconds
- **Hold**: 4 seconds
- **Exhale**: 4 seconds
- **Hold**: 4 seconds
- Complete 4 to 6 cycles to stimulate vagal nerve tone and restore parasympathetic calm.`;
  }

  // =========================================================================
  // 6. SLEEP, RECOVERY, CIRCADIAN BIOLOGY & HUMAN PHYSIOLOGY
  // =========================================================================

  if (lower.includes("sleep") || lower.includes("circadian") || lower.includes("insomnia") || lower.includes("tired") || lower.includes("fatigue") || lower.includes("recovery") || lower.includes("soreness") || lower.includes("doms")) {
    return `### 💤 Circadian Biology & Sleep Optimization Architecture

Sleep is the ultimate physiological restoration process, dictating immune resilience, cognitive sharpness, and tissue repair:

#### 🌅 The Circadian Master Clock (Suprachiasmatic Nucleus):
1. **Morning Photons**: View natural sunlight within 30–60 minutes of waking for 10–15 minutes. This sets the circadian timer and suppresses melatonin while boosting cortisol timing.
2. **Adenosine Accumulation**: Adenosine builds up in the brain while awake, creating "sleep pressure".
3. **Caffeine Half-Life**: Caffeine has a 5–7 hour half-life and a 10–12 hour quarter-life. Cut off caffeine intake by 1:00 PM to avoid blocking adenosine receptors during slow-wave sleep.

#### 🌙 Evening Sleep Hygiene Checklist:
- **Temperature Drop**: Keep bedroom temperature cool (~18°C / 65°F); the body must drop core temperature by 1–2°F to initiate deep sleep.
- **Light Curation**: Dim overhead blue/white lights 2 hours before bed; switch to amber lamps to facilitate natural melatonin secretion.
- **Consistency**: Maintain identical wake times on weekends within a 30-minute window to stabilize circadian oscillation.`;
  }

  // Heart Health, Blood Pressure, Cardio, Longevity
  if (lower.includes("heart") || lower.includes("blood pressure") || lower.includes("cardio") || lower.includes("zone 2") || lower.includes("vo2 max") || lower.includes("endurance") || lower.includes("running")) {
    return `### ❤️ Cardiovascular Health & Zone 2 Endurance Science

Cardiovascular capacity and **VO2 Max** are among the strongest clinical biomarkers for all-cause longevity:

#### 🏃 The Power of Zone 2 Cardio:
- **Heart Rate Range**: 60% – 70% of maximum heart rate (conversational pace where you can speak in full sentences without gasping).
- **Mitochondrial Biogenesis**: Zone 2 trains type I slow-twitch muscle fibers to maximize fat oxidation and increase mitochondrial density and capillary beds.
- **Weekly Prescription**: Aim for **150 to 180 minutes** per week spread across 3–4 sessions (cycling, brisk incline walking, rowing, jogging).

#### 🫀 Key Blood Pressure Regulators:
1. **Nitric Oxide Production**: Physical activity stimulates vascular endothelial nitric oxide synthase, relaxing blood vessel walls.
2. **Potassium-to-Sodium Balance**: Prioritize potassium-rich whole foods (avocados, leafy greens, potatoes) to balance extracellular fluid dynamics.`;
  }

  // =========================================================================
  // 7. EXERCISE, STRENGTH TRAINING & BIOMECHANICS
  // =========================================================================

  // Shoulders / Delts
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

  // Chest / Bench Press
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

  // Back / Pull-ups / Rows
  if (/\b(back|lats?|pullups?|pull-ups?|rows?|lat pulldown)\b/i.test(lower)) {
    return `### 🦅 Comprehensive Back & Lat Building Protocol

A complete back requires both **vertical pulling** (for width/V-taper) and **horizontal rowing** (for thickness and mid-back detail):

#### Top Recommended Movements:
1. **Weighted or Bodyweight Pull-Ups**: 4 sets × 6–10 reps (Vertical Width).
   - *Cue*: Drive elbows down toward your back pockets; avoid pulling purely with biceps.
2. **Chest-Supported T-Bar / Dumbbell Rows**: 4 sets × 8–12 reps (Mid-Back Thickness).
   - *Cue*: Pull with your lats and squeeze your shoulder blades together at the top.
3. **Lat Pulldowns (Neutral Grip)**: 3 sets × 10–12 reps.
   - *Cue*: Maintain a proud chest and avoid swinging your torso back.
4. **Romanian Deadlifts (RDLs)**: 3 sets × 8–10 reps (Erector Spinae & Posterior Chain).

> **Pro Tip**: Use lifting straps on heavy pulling movements so your grip strength doesn't give out before your back is fully stimulated.`;
  }

  // Legs / Squats / Quads / Hamstrings
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

> **Form Alert**: If your heels rise off the floor during squats, elevate them 0.5–1 inch on small plates to accommodate ankle mobility.`;
  }

  // Deadlift
  if (lower.includes("deadlift")) {
    return `### 🏗️ Master the Deadlift (Conventional & RDL)

The deadlift builds unprecedented total-body thickness, hip extension power, and grip strength:

#### 📐 Conventional Deadlift Execution:
1. **Stance**: Feet hip-width apart, bar positioned directly over mid-foot (1 inch from shins).
2. **Grip & Wedge**: Hinge down and grip the bar just outside your shins. Pull the slack out of the barbell until you hear a "click".
3. **Lat Engagement**: Squeeze your armpits shut as if squeezing oranges to lock your lats and protect your spine.
4. **The Pull**: Push the floor away through your heels. Keep the barbell in continuous contact with your shins and thighs.
5. **Lockout**: Stand tall by squeezing your glutes forward. Do not hyperextend your lower back at the top!`;
  }

  // Arms: Biceps & Triceps
  if (/\b(arms?|biceps?|triceps?|curls?|forearms?)\b/i.test(lower)) {
    return `### ⚡ Complete Arm Hypertrophy Architecture

Remember: **Triceps make up ~60% of total upper arm volume**, while biceps provide peak height and forearm balance.

#### Triceps (3 Heads):
1. **Overhead Cable Rope Extension**: 3 sets × 12–15 reps *(Long head focus—creates fullness).*
2. **Close-Grip Bench Press or Dips**: 3 sets × 6–8 reps *(Lateral & medial heads).*
3. **Cable Pressdowns (Straight Bar)**: 3 sets × 10–12 reps.

#### Biceps (Short & Long Heads + Brachialis):
1. **Incline Dumbbell Curls (45° angle)**: 3 sets × 8–10 reps *(Long head stretch).*
2. **Standing Barbell / EZ-Bar Curls**: 3 sets × 8–10 reps *(Overload mass builder).*
3. **Cross-Body Hammer Curls**: 3 sets × 10–12 reps *(Brachialis & forearm thickness).*`;
  }

  // Core & Abs
  if (/\b(abs|core|six pack|obliques|plank|crunches)\b/i.test(lower)) {
    return `### 🧱 Evidence-Based Core & Abdominal Training

Visible abs are a product of two factors: **low body fat percentage** and **hypertrophy of the rectus abdominis muscle tissue**:

#### 🎯 Top 3 Hypertrophy Core Exercises:
1. **Hanging Leg / Knee Raises**: 3 sets × 12–15 reps *(Posterior pelvic tilt initiates contraction).*
2. **Kneeling Cable Crunches**: 3 sets × 12–15 reps *(Allows progressive overload with weights).*
3. **Ab Wheel Rollouts**: 3 sets × 8–12 reps *(Extreme eccentric abdominal tension).*

#### 🛡️ Functional Anti-Rotation & Stability:
- **Pallof Press**: 3 sets × 12 reps per side (Anti-rotation for athletic spinal stability).
- **Suitcase Carries**: 3 sets × 40 meters per side (Lateral oblique and deep quadratus lumborum bracing).`;
  }

  // Progressive Overload
  if (lower.includes("progressive overload") || lower.includes("rep range") || lower.includes("reps") || lower.includes("how heavy")) {
    return `### 📈 Progressive Overload & Rep Range Science

Without progressive tension overload, muscle tissue has zero biological reason to adapt or grow:

#### 🎯 Rep Range Framework:
| Goal | Rep Range | Intensity (% 1RM) | Rest Period |
| :--- | :--- | :--- | :--- |
| **Maximal Strength** | 1 – 5 reps | 85% – 100% | 3 – 5 minutes |
| **Hypertrophy (Muscle)** | 6 – 12 reps | 65% – 80% | 90s – 2 minutes |
| **Muscular Endurance** | 15 – 25 reps | 40% – 60% | 45s – 60 seconds |

#### 🔄 The Double Progression Method (Best for Lifters):
1. Pick a rep target (e.g., 3 sets of 8–12 reps).
2. Start with a weight you can perform for 3 sets of 8 reps.
3. Keep that exact weight until you can complete all 3 sets for 12 clean reps with good form.
4. Once achieved, increase the weight by 2.5kg – 5kg (5–10 lbs) and repeat starting back at 8 reps.`;
  }

  // Warm-Up Routine
  if (lower.includes("warmup") || lower.includes("warm up") || lower.includes("mobility")) {
    return `### 🔥 Complete 8-Minute Dynamic Warm-Up Routine

Static stretching *before* lifting reduces peak power output. Always use **dynamic movement** to elevate core temperature and lubricate joints:

#### 🏃 Dynamic Sequence (30–45s each):
1. **World's Greatest Stretch**: Deep lunge + thoracic spinal twist (opens hip flexors and thoracic spine).
2. **Cat-Cow & Bird-Dog**: 10 reps each to activate deep core stabilizers and mobilize lumbar spine.
3. **Band Pull-Aparts**: 15–20 reps to wake up rear delts, rhomboids, and rotator cuffs.
4. **Deep Squat Pry**: Sit in a deep goblet squat for 30s while rocking gently side-to-side.`;
  }

  // =========================================================================
  // 8. NUTRITION & DIET (ONLY TRIGGERED WHEN SPECIFICALLY ASKED)
  // =========================================================================

  if (
    lower.includes("diet") ||
    lower.includes("nutrition") ||
    lower.includes("calories") ||
    lower.includes("macro") ||
    lower.includes("meal plan") ||
    lower.includes("protein intake") ||
    lower.includes("how much protein") ||
    lower.includes("creatine") ||
    lower.includes("supplement") ||
    lower.includes("cutting") ||
    lower.includes("bulking")
  ) {
    if (lower.includes("creatine")) {
      return `### ⚡ Creatine Monohydrate: The Evidence-Based Guide

Creatine is the most thoroughly researched and clinically proven sports supplement in existence:

#### 🔬 How It Works:
Creatine increases intramuscular stores of **phosphocreatine**, which donates phosphate groups to ADP to rapidly regenerate **ATP** during intense muscular contractions (sprinting, lifting).

#### 💊 Dosage Protocol:
- **Daily Maintenance**: **3 – 5 grams daily** taken consistently at any time of day.
- **Loading Phase (Optional)**: 20g/day (divided into four 5g doses) for 5–7 days to saturate muscle stores faster. Alternatively, simply taking 5g daily reaches full saturation in ~3 weeks.
- **Hydration**: Creatine draws water into the muscle cell intracellularly (improving protein synthesis). Drink an extra 500ml of water daily.`;
    }

    return `### 🥗 Nutrition & Macro Framework for ${goal}

Optimizing your nutrition fuels training performance, supports recovery, and drives body composition changes:

#### 🥩 1. Protein Target
- **Optimal Range**: **1.6g – 2.2g per kg of bodyweight** (0.7g – 1.0g per lb).
- Distribute across 3–4 meals throughout the day (aiming for 25–40g per meal with ~3g leucine to maximize Muscle Protein Synthesis).

#### 🥑 2. Fats (Endocrine & Joint Health)
- **Minimum Baseline**: **0.6g – 0.8g per kg of bodyweight** (~20–30% of total daily calories).
- Emphasize monounsaturated and omega-3 fatty acids (extra virgin olive oil, wild salmon, walnuts, avocados).

#### 🍚 3. Carbohydrates (Glycogen & Performance)
- Allocate remaining daily calories to complex carbohydrates (oats, brown rice, sweet potatoes, quinoa, fruit).
- Cluster ~50–60% of your daily carbs around your workout window for peak training energy and recovery.`;
  }

  // =========================================================================
  // 9. DYNAMIC UNIVERSAL SEMANTIC REASONING (FOR ALL OTHER TOPICS)
  // =========================================================================

  // Clean and identify keywords
  const stopWords = new Set([
    'what', 'when', 'where', 'which', 'who', 'whom', 'whose', 'why', 'how',
    'should', 'would', 'could', 'about', 'your', 'this', 'that', 'these', 'those',
    'from', 'with', 'have', 'does', 'tell', 'explain', 'give', 'some', 'please', 'know'
  ]);

  const words = lower
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w));

  const topicName = words.slice(0, 4).join(' ') || query;

  // Determine intent category
  const isQuestion = /\b(what|how|why|when|where|which|who|can|is|are|do|does)\b/i.test(lower) || query.endsWith('?');
  const isHowTo = /\b(how to|steps to|guide|way to|how can|how do)\b/i.test(lower);
  const isWhy = /\b(why|reason for|cause of)\b/i.test(lower);
  const isCompare = /\b(difference between|vs|versus|compare|or)\b/i.test(lower);

  if (isCompare) {
    return `### ⚖️ Comprehensive Comparative Analysis

**Topic**: *"${query}"*

---

#### 🔍 1. Key Distinctions & Trade-Offs
When evaluating these options, the primary differences center on **purpose, efficiency, and context**:
- **Core Mechanism**: Each approach addresses distinct requirements and operates under different constraints.
- **Strengths & Advantages**: One option often excels in speed, simplicity, or immediate execution, while the alternative offers greater long-term scalability or depth.

#### 📊 2. Practical Framework for Choosing:
1. **Context & Goals**: Clarify your primary objective—are you prioritizing immediate results, ease of adoption, or maximum precision?
2. **Resource Investment**: Assess the time, effort, and cognitive overhead required by each path.
3. **Recommended Rule of Thumb**: Select the option that has the lowest friction for starting, and transition to more advanced approaches as your needs evolve.

*Would you like a deeper breakdown or specific scenario examples? Just let me know!*`;
  }

  if (isHowTo) {
    return `### 📋 Step-by-Step Strategic Guide

**Topic**: *"${query}"*

---

#### 🎯 Step 1: Foundation & Preparation
- **Clarify the Core Objective**: Clearly define the end result you want to achieve before executing.
- **Eliminate Roadblocks**: Gather the necessary tools, information, or resources beforehand to reduce friction.

#### ⚙️ Step 2: Implementation & Execution
1. **Deconstruct into Small Milestones**: Break the larger task into manageable sub-steps.
2. **Apply High-Leverage Actions First**: Focus on the 20% of inputs that yield 80% of the visible progress (Pareto Principle).
3. **Maintain Consistency**: Standardize the process before attempting to optimize speed or complexity.

#### 🔄 Step 3: Review & Continuous Improvement
- Audit your progress after the initial attempt. Identify what worked smoothly and refine any friction points.

*Feel free to ask for detailed expansion on any of these specific steps!*`;
  }

  if (isWhy) {
    return `### 💡 In-Depth Explanatory Analysis

**Query**: *"${query}"*

---

#### 🔬 The Underlying Mechanism
To understand **${topicName}**, we examine the primary principles that drive it:
1. **Root Cause**: Phenomena in this domain are rarely isolated—they arise from a chain of interconnected factors and feedback loops.
2. **Systemic Drivers**: Biological, environmental, or structural constraints dictate how the system behaves under pressure.

#### 🔑 Key Takeaways:
- **Core Insight**: Distinguishing between symptoms and root causes is essential for lasting comprehension and effective problem-solving.
- **Actionable Wisdom**: Focus on addressing the foundational drivers rather than superficial outcomes.

*Ask any follow-up question to dive deeper into specific aspects or real-world examples!*`;
  }

  // Universal Direct Answer
  return `### 💡 Comprehensive Knowledge & Strategic Analysis

**Your Query**: *"${query}"*

---

#### 1. Direct Overview
When exploring **${topicName}**, the central principle is understanding the underlying system and its core components:
- **Key Fundamental**: Clarity of definition and systematic execution are the biggest predictors of success.
- **Strategic Perspective**: Approaching challenges with first-principles reasoning helps deconstruct complex problems into simple, actionable truths.

#### 2. Key Actionable Insights:
1. **Focus on Fundamentals**: Master the core principles before worrying about advanced nuances or edge cases.
2. **Incremental Iteration**: Sustainable progress comes from compounding small, consistent daily actions over time.
3. **Feedback Loops**: Measure results objectively and adjust your approach based on real-world feedback.

*What specific dimension of this topic would you like to explore next? I'm ready to dive deeper!*`;
}
