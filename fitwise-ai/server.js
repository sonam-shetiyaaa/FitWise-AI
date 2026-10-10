import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { generateSmartFitnessResponse } from "./src/data/aiEngine.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));

// Serve built frontend files from dist directory
const distPath = path.join(__dirname, "dist");
if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
}

const apiKey = (process.env.GEMINI_API_KEY || "").trim();
console.log("Gemini API key loaded:", !!apiKey);

// Smart fitness fallback engine for when offline or network drops
function getSmartFitnessResponse(message, userContext = {}, image = null) {
    if (image) {
        return `### 📷 Image Received\n\nI received your uploaded image! To analyze meal calories, macros, or gym equipment with live Google Gemini vision, please ensure an active internet connection. Based on your text query: **${message || 'Analysis requested'}**, feel free to ask any specific question about your fitness or nutrition plan!`;
    }

    const q = (message || "").toLowerCase();
    const name = userContext.name || "Alex";
    const goal = userContext.fitnessGoal || "Muscle Gain & Fat Loss";

    if (q.includes("hello") || q.includes("hi") || q.includes("hey")) {
        return `Hello ${name}! I'm your **FitWise AI Coach**. How can I help you optimize your training, nutrition, or recovery toward your **${goal}** goals today?`;
    }

    if (q.includes("tired") || q.includes("fatigue") || q.includes("exhaust") || q.includes("sleepy") || q.includes("no energy") || q.includes("low energy")) {
        return `### 🔋 Rest & Energy Recovery Protocol\n\nHey ${name}, listening to your body is just as important as lifting heavy. Here is how to handle feeling tired today:\n\n1. **Mild Sluggishness (Mental Fatigue)**: If you just need a boost, try a brisk 10-minute walk, 500ml cold water with electrolytes, and light dynamic mobility.\n2. **Physical Exhaustion**: If your joints feel heavy or you got poor sleep, take an **Active Recovery Day** (gentle stretching, light foam rolling) instead of heavy resistance.\n3. **Sleep & Nutrition Check**: Ensure you hit 7–8 hours of quality sleep tonight and have a balanced meal with complex carbs and quality protein.\n\n*Remember: Muscles grow and recover during rest, not during workouts!*`;
    }

    if (q.includes("sore") || q.includes("pain") || q.includes("stiff") || q.includes("ache") || q.includes("hurt")) {
        return `### 🩹 Muscle Soreness & Recovery Guidelines\n\nDelayed Onset Muscle Soreness (DOMS) indicates microscopic muscle fiber tears undergoing repair:\n\n- **Hydration & Electrolytes**: Drink plenty of water to flush out metabolic waste.\n- **Gentle Movement**: Light walking or cycling increases blood flow without adding muscle damage.\n- **Protein Timing**: Keep protein intake consistent (~25-35g per meal) to provide amino acids for repair.\n- *Note: If you feel sharp, localized, or joint pain rather than dull muscular soreness, rest that area and avoid aggravating movements.*`;
    }

    if (q.includes("chest") || q.includes("bench")) {
        return "### 💪 3 Effective Chest Exercises\n\n1. **Incline Dumbbell Press**: 3 sets × 8–10 reps (focus on upper clavicular fibers).\n2. **Flat Barbell Bench Press**: 4 sets × 6–8 reps (core mass builder for pectoralis major).\n3. **Cable Chest Flyes**: 3 sets × 12–15 reps (constant tension with a deep stretch at bottom).";
    }

    if (q.includes("leg") || q.includes("squat") || q.includes("quad") || q.includes("hamstring")) {
        return "### 🦵 Lower Body Hypertrophy Foundations\n\n1. **Barbell Back Squats**: 4 sets × 6–8 reps (depth below parallel, driving through midfoot).\n2. **Romanian Deadlifts**: 3 sets × 8–10 reps (hinge at hips, deep hamstring stretch).\n3. **Bulgarian Split Squats**: 3 sets × 10 reps/leg (unilateral quad & glute stabilizer).";
    }

    if (q.includes("post-workout") || q.includes("after workout") || (q.includes("eat") && q.includes("workout"))) {
        return "### 🥩 Optimal Post-Workout Protocol\n\n1. **Protein**: Aim for 30–40g of fast-absorbing protein (whey isolate, eggs, or chicken breast) within 60–90 minutes to spike muscle protein synthesis.\n2. **Carbohydrates**: Pair with 40–60g of easily digested carbs (jasmine rice, banana, oats) to refill glycogen.\n3. **Rehydration**: Drink 500–750ml of water with a pinch of electrolytes.";
    }

    if (q.includes("diet") || q.includes("nutrition") || q.includes("protein") || q.includes("calories") || q.includes("macro")) {
        return `### 🥗 Nutrition & Macro Strategy for ${goal}\n\n- **Protein Baseline**: Target 1.6g – 2.2g per kg of bodyweight to support lean muscle tissue.\n- **Calorie Balance**: For steady fat loss, maintain a modest 300–500 kcal deficit. For muscle gain, aim for a 200–300 kcal surplus.\n- **Whole Foods**: Focus on nutrient-dense whole grains, fibrous veggies, lean proteins, and unsaturated fats.`;
    }

    if (q.includes("water") || q.includes("hydrat")) {
        return "### 💧 Hydration Advice\n\nDrink 3.0 to 3.5 liters of water daily. For every hour of intense training or cardio, add an extra 500ml with electrolytes for peak muscular contraction.";
    }

    if (q.includes("motivat") || q.includes("lazy") || q.includes("skip")) {
        return `### ⚡ FitWise Mindset Check\n\nMotivation comes and goes; **routine and discipline** build results! Show up for just 10 minutes—if you still want to stop after 10 minutes, you can. 9 times out of 10, getting started is the hardest part. You've got this!`;
    }

    return `### 💡 FitWise AI Coaching Advice\n\nRegarding your question: **"${message}"**:\n\n- **Target Alignment**: Keep your primary goal of **${goal}** at the center of your training.\n- **Quality Over Quantity**: Focus on strict form, controlled tempos, and proper rest periods.\n- **Action Step**: Consistency compounds—log your sets and meals in FitWise to track measurable progress week over week!`;
}

// Function to call Gemini via Google Generative Language REST API with automatic multi-model failover
async function callGemini(contents, systemInstruction, preferredModel) {
    if (!apiKey) return null;

    // Prioritize models that currently have active quota
    const modelsToTry = [
        preferredModel || "gemini-3.5-flash-lite",
        "gemini-3.5-flash-lite",
        "gemini-3.6-flash",
        "gemini-3.8-flash",
        "gemini-flash-latest",
        "gemini-3.1-flash-lite"
    ];

    // Remove duplicates
    const uniqueModels = [...new Set(modelsToTry)];

    for (const model of uniqueModels) {
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
            const reqBody = {
                system_instruction: {
                    parts: [{ text: systemInstruction }]
                },
                contents: contents
            };

            const restResponse = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(reqBody)
            });

            if (restResponse.ok) {
                const data = await restResponse.json();
                const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) {
                    console.log(`[Gemini Cloud AI] Generated response using model: ${model}`);
                    return text;
                }
            } else {
                const errStatus = restResponse.status;
                console.warn(`[Gemini Cloud AI] Model ${model} returned HTTP ${errStatus}, trying next model in chain...`);
            }
        } catch (err) {
            console.warn(`[Gemini Cloud AI] Network note for ${model}:`, err.message);
        }
    }

    return null;
}

// Status route so visiting http://localhost:3001/api/status shows the dashboard
app.get("/api/status", (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>FitWise AI Backend Status</title>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style>
            body {
              background: #0a0f1d;
              color: #f1f5f9;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              padding: 20px;
            }
            .card {
              background: #111827;
              border: 1px solid rgba(16, 185, 129, 0.35);
              border-radius: 20px;
              padding: 40px;
              max-width: 500px;
              width: 100%;
              text-align: center;
              box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8), 0 0 30px rgba(16, 185, 129, 0.15);
            }
            .status-badge {
              display: inline-flex;
              align-items: center;
              gap: 8px;
              background: rgba(16, 185, 129, 0.15);
              border: 1px solid rgba(16, 185, 129, 0.4);
              color: #34d399;
              padding: 6px 16px;
              border-radius: 999px;
              font-weight: 600;
              font-size: 0.85rem;
              margin-bottom: 20px;
            }
            .dot {
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: #10b981;
              box-shadow: 0 0 10px #10b981;
            }
            h1 {
              font-size: 1.8rem;
              margin: 0 0 10px;
              color: #ffffff;
            }
            p {
              color: #94a3b8;
              font-size: 0.95rem;
              line-height: 1.6;
              margin: 0 0 24px;
            }
            .info-box {
              background: #1e293b;
              border-radius: 12px;
              padding: 16px;
              margin-bottom: 28px;
              text-align: left;
              font-size: 0.85rem;
              color: #cbd5e1;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              padding: 6px 0;
              border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            }
            .info-row:last-child {
              border-bottom: none;
            }
            .btn {
              display: inline-block;
              background: linear-gradient(135deg, #10b981, #06b6d4);
              color: #02170e;
              font-weight: 700;
              padding: 14px 28px;
              border-radius: 12px;
              text-decoration: none;
              font-size: 1rem;
              transition: transform 0.2s, box-shadow 0.2s;
            }
            .btn:hover {
              transform: translateY(-2px);
              box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="status-badge">
              <span class="dot"></span>
              Backend API Active
            </div>
            <h1>FitWise AI Server</h1>
            <p>The backend service is running successfully and serving Gemini AI requests for the FitWise web application.</p>
            <div class="info-box">
              <div class="info-row"><span>Status</span><strong style="color: #34d399">Online & Ready</strong></div>
              <div class="info-row"><span>AI Model</span><strong>${process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite'}</strong></div>
              <div class="info-row"><span>API Endpoint</span><code>/api/chat</code></div>
              <div class="info-row"><span>Port</span><strong>3001</strong></div>
            </div>
            <a href="http://localhost:5173" class="btn">Open Web App (localhost:5173) &rarr;</a>
          </div>
        </body>
      </html>
    `);
});

app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        model: process.env.GEMINI_MODEL || "gemini-3.5-flash-lite",
        geminiKeyConfigured: !!apiKey,
        timestamp: new Date().toISOString()
    });
});

// User Storage & Auth Routes
const usersFilePath = path.join(__dirname, "users.json");

function loadUsers() {
    try {
        if (fs.existsSync(usersFilePath)) {
            const raw = fs.readFileSync(usersFilePath, "utf-8");
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (e) {
        console.error("Error reading users.json:", e);
    }
    const defaultUsers = [
        {
            name: "Alex Morgan",
            email: "alex.morgan@fitwise.ai",
            password: "demo1234",
            profile: {
                name: "Alex Morgan",
                email: "alex.morgan@fitwise.ai",
                fitnessGoal: "Muscle Gain & Fat Loss",
                activityLevel: "Moderately Active (3-5 sessions/week)"
            },
            createdAt: new Date().toISOString()
        }
    ];
    saveUsers(defaultUsers);
    return defaultUsers;
}

function saveUsers(users) {
    try {
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), "utf-8");
    } catch (e) {
        console.error("Error writing users.json:", e);
    }
}

app.post("/api/auth/register", (req, res) => {
    const { name, email, password } = req.body;
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPassword = (password || "").trim();
    const cleanName = (name || "").trim();

    if (!cleanName || !cleanEmail || !cleanPassword) {
        return res.status(400).json({ success: false, error: "Name, email, and password are required." });
    }
    if (cleanPassword.length < 6) {
        return res.status(400).json({ success: false, error: "Password must be at least 6 characters long." });
    }

    const users = loadUsers();
    const exists = users.find(u => (u.email || "").toLowerCase() === cleanEmail);
    if (exists) {
        return res.status(400).json({ success: false, error: `An account with "${cleanEmail}" already exists. Please sign in instead.` });
    }

    const newUser = {
        name: cleanName,
        email: cleanEmail,
        password: cleanPassword,
        profile: {
            name: cleanName,
            email: cleanEmail
        },
        createdAt: new Date().toISOString()
    };
    users.push(newUser);
    saveUsers(users);

    return res.json({ success: true, user: { name: newUser.name, email: newUser.email, profile: newUser.profile } });
});

app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPassword = (password || "").trim();

    if (!cleanEmail || !cleanPassword) {
        return res.status(400).json({ success: false, error: "Email and password are required." });
    }

    const users = loadUsers();
    const user = users.find(u => (u.email || "").toLowerCase() === cleanEmail);

    if (!user) {
        return res.status(404).json({ success: false, error: `No account found with "${cleanEmail}". Please check your email or register.` });
    }

    if (user.password !== cleanPassword) {
        return res.status(401).json({ success: false, error: "Incorrect password. Please enter the password you registered with." });
    }

    return res.json({
        success: true,
        user: {
            name: user.name,
            email: user.email,
            profile: user.profile || { name: user.name, email: user.email }
        }
    });
});

app.post("/api/auth/reset-password", (req, res) => {
    const { email, newPassword } = req.body;
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPassword = (newPassword || "").trim();

    if (!cleanEmail || !cleanPassword || cleanPassword.length < 6) {
        return res.status(400).json({ success: false, error: "Valid email and new password (min 6 chars) are required." });
    }

    const users = loadUsers();
    const index = users.findIndex(u => (u.email || "").toLowerCase() === cleanEmail);
    if (index === -1) {
        return res.status(404).json({ success: false, error: `No account found with "${cleanEmail}".` });
    }

    users[index].password = cleanPassword;
    users[index].updatedAt = new Date().toISOString();
    saveUsers(users);

    return res.json({ success: true, message: "Password updated successfully! You can now sign in." });
});

app.post("/api/chat", async (req, res) => {
    try {
        const { message, image, history = [], userContext = {} } = req.body;

        if (!message && !image) {
            return res.status(400).json({ error: "Message or image is required" });
        }

        const modelName = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";

        // Build clean conversation contents
        const validHistory = Array.isArray(history)
            ? history
                .filter(h => h.text && (h.role === "user" || h.role === "model"))
                .slice(-10)
                .map(h => ({
                    role: h.role === "user" ? "user" : "model",
                    parts: [{ text: h.text }]
                }))
            : [];

        // Build user message parts (text + optional image)
        const userParts = [];
        const userText = (message || "").trim() || (image ? "Please analyze this fitness/nutrition image and provide actionable feedback, macro breakdown, or form guidance." : "");
        userParts.push({ text: userText });

        if (image && image.base64 && image.mimeType) {
            userParts.push({
                inline_data: {
                    mime_type: image.mimeType,
                    data: image.base64
                }
            });
        }

        const contents = [
            ...validHistory,
            {
                role: "user",
                parts: userParts
            }
        ];

        const systemInstruction = `You are FitWise AI, an advanced, highly intelligent, and versatile AI coach and assistant—matching the breadth, depth, and conversational fluency of ChatGPT and Google Gemini.

You are equipped with universal knowledge across all topics and disciplines:
- General Knowledge, Science, Physics, Chemistry, Biology, Astronomy, Math, and History.
- Technology, Programming, Computer Science, Web Development, and Digital Tools.
- Human Physiology, Anatomy, Neuroscience, Sleep Medicine, Circadian Biology, and Stress Management.
- Workouts, Strength & Conditioning, Hypertrophy, Biomechanics, Calisthenics, Running, and Injury Rehabilitation.
- Nutrition, Dietetics, Metabolism, Macronutrients, Micronutrients, and Hydration.
- Psychology, Habit Formation, Time Management, Productivity, Focus, Motivation, and Everyday Life.

Core Directives & Behavioral Tuning:
1. UNIVERSAL SCOPE: Answer ANY question the user asks, regardless of whether it is about fitness, science, coding, history, general curiosity, or daily life. NEVER refuse a question or claim that you only answer fitness questions.
2. STRICT TOPIC RELEVANCE (NO UNWARRANTED NUTRITION PIVOTS): Answer EXACTLY what the user asks. If the user asks about physics, astronomy, history, programming, workout mechanics, or productivity, give an insightful, thorough answer dedicated to THAT topic. DO NOT force-feed nutrition, macros, calories, or diet advice into answers unless the user specifically asks about food, diet, nutrition, or weight management!
3. WHEN ASKED ABOUT NUTRITION/DIET: Provide evidence-based nutritional guidance, calculating macros/calories when helpful, suggesting wholesome recipes, and respecting dietary preferences.
4. WHEN ASKED ABOUT FITNESS/WORKOUTS: Deliver biomechanically precise instructions, set/rep ranges, targeted muscle heads, tempo, and progressive overload principles.
5. WHEN ASKED ABOUT SCIENCE OR GENERAL KNOWLEDGE: Provide crystal-clear explanations with real-world analogies, accurate principles, and engaging depth.
6. WHEN ANALYZING IMAGES:
   - Food/meal photos: Identify ingredients, estimate calories/macros, and comment on nutritional density.
   - Gym machine/exercise photos: Identify equipment/movement, explain proper biomechanics, pin adjustments, and form cues.
   - General images: Describe and analyze the content accurately and helpfully.
7. TONE & FORMATTING: Warm, encouraging, articulate, and intelligent. Use clean markdown formatting (clear headings, bullet points, bold key terms) so every response is delightful and easy to read.`;

        // Call Gemini Cloud API
        const geminiReply = await callGemini(contents, systemInstruction, modelName);
        if (geminiReply) {
            return res.json({
                reply: geminiReply,
                source: "gemini-cloud"
            });
        }

        // Fallback to local response if all cloud requests fail
        const fallbackReply = generateSmartFitnessResponse(message, userContext, image);
        return res.json({
            reply: fallbackReply,
            source: "fitwise-local"
        });

    } catch (error) {
        console.error("Server error:", error);
        res.status(200).json({
            reply: "I'm here to help! Could you please repeat or rephrase your question?",
            source: "fallback"
        });
    }
});

// For all web app routes, serve the built React frontend from dist
app.use((req, res) => {
    if (req.path.startsWith("/api")) {
        return res.status(404).json({ error: "API endpoint not found" });
    }
    const indexPath = path.join(distPath, "index.html");
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.redirect("/api/status");
    }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});